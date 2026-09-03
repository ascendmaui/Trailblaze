-- Staged Clerk rollout. Existing Supabase Auth policies remain in place until
-- Clerk-issued sessions have been verified in production.
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles add column if not exists clerk_user_id text unique;
alter table public.career_applications add column if not exists applicant_clerk_user_id text unique;
alter table public.career_applications add column if not exists applicant_profile_id uuid references public.profiles(id) on delete set null;

create index if not exists profiles_clerk_user_id_idx on public.profiles(clerk_user_id);
create index if not exists applications_applicant_clerk_user_idx on public.career_applications(applicant_clerk_user_id);

create table if not exists public.clerk_identity_allowlist (
  email text primary key,
  full_name text not null,
  initial_role public.app_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.clerk_identity_allowlist (email, full_name, initial_role)
values
  ('johnmatveyev@gmail.com', 'John Matveyev', 'platform_admin'),
  ('hkirk@trailblazeconstruction.com', 'Heather Brooks Kirk', 'owner')
on conflict (email) do update
set full_name = excluded.full_name, initial_role = excluded.initial_role, active = true, updated_at = now();

create table if not exists public.role_permissions (
  role public.app_role primary key,
  description text not null,
  permissions jsonb not null default '[]'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(permissions) = 'array')
);

insert into public.role_permissions (role, description, permissions)
values
  ('platform_admin', 'Platform developer and webmaster. Full access to configuration, identities, and company operations.', '["system.configure","roles.manage","company.manage","jobs.manage","hiring.manage","payouts.manage","team.manage","reports.view"]'::jsonb),
  ('owner', 'Company owner. Runs company operations and can configure every non-developer role.', '["roles.manage","company.manage","jobs.manage","hiring.manage","payouts.manage","team.manage","reports.view"]'::jsonb),
  ('manager', 'Operations manager. Manages jobs, team coordination, and hiring reviews assigned by the owner.', '["jobs.manage","hiring.manage","team.view","reports.view"]'::jsonb),
  ('employee', 'Field or office team member. Sees assigned jobs, updates, schedule, and time tools.', '["jobs.assigned","time.manage","updates.create"]'::jsonb),
  ('applicant', 'Candidate. Can review their own application status and complete assigned next steps.', '["application.self"]'::jsonb)
on conflict (role) do nothing;

create table if not exists public.job_role_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null,
  access_role public.app_role not null default 'employee' check (access_role in ('manager', 'employee')),
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.job_role_templates (title, description, access_role)
values
  ('Field Carpenter', 'Build, repair, and finish work on Trailblaze jobsites with a focus on safety and craftsmanship.', 'employee'),
  ('Project Manager', 'Coordinate project scopes, schedules, clients, vendors, and field progress from planning through closeout.', 'manager'),
  ('Field Assistant', 'Support jobsite preparation, materials, cleanup, documentation, and crew coordination.', 'employee'),
  ('Office Coordinator', 'Coordinate scheduling, client updates, purchasing records, and operational documentation.', 'employee')
on conflict (title) do nothing;

create table if not exists public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (key, value)
values
  ('company', '{"name":"Trailblaze Construction","support_email":"hkirk@trailblazeconstruction.com"}'::jsonb),
  ('authentication', '{"provider":"clerk","require_mfa_for_admins":true}'::jsonb),
  ('interviewer', '{"provider":"xAI","enabled":true}'::jsonb)
on conflict (key) do nothing;

create or replace function private.current_profile_id()
returns uuid language sql stable security definer set search_path = public
as $$
  select id from public.profiles
  where active and (clerk_user_id = (select auth.jwt() ->> 'sub') or id::text = (select auth.jwt() ->> 'sub'))
  limit 1;
$$;

create or replace function private.is_platform_admin()
returns boolean language sql stable security definer set search_path = public, private
as $$ select exists (select 1 from public.profiles where id = private.current_profile_id() and role = 'platform_admin' and active); $$;

create or replace function private.is_owner()
returns boolean language sql stable security definer set search_path = public, private
as $$ select exists (select 1 from public.profiles where id = private.current_profile_id() and role in ('platform_admin', 'owner') and active); $$;

create or replace function private.is_owner_or_manager()
returns boolean language sql stable security definer set search_path = public, private
as $$ select exists (select 1 from public.profiles where id = private.current_profile_id() and role in ('platform_admin', 'owner', 'manager') and active); $$;

create or replace function private.is_job_member(target_job_id uuid)
returns boolean language sql stable security definer set search_path = public, private
as $$ select private.is_owner_or_manager() or exists (select 1 from public.job_assignments where job_id = target_job_id and user_id = private.current_profile_id()); $$;

create or replace function public.sync_clerk_profile(p_application_id uuid default null, p_interview_token uuid default null)
returns public.profiles
language plpgsql security definer set search_path = public, private
as $$
declare
  token_subject text := auth.jwt() ->> 'sub';
  token_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  allowlist public.clerk_identity_allowlist%rowtype;
  application public.career_applications%rowtype;
  profile_row public.profiles%rowtype;
  assigned_role public.app_role;
  assigned_name text;
begin
  if token_subject is null or token_subject = '' or token_email = '' then
    raise exception 'A verified Clerk session with an email claim is required.' using errcode = '28000';
  end if;
  select * into profile_row from public.profiles where clerk_user_id = token_subject;
  if profile_row.id is not null then return profile_row; end if;
  select * into allowlist from public.clerk_identity_allowlist where email = token_email and active;
  if allowlist.email is not null then
    assigned_role := allowlist.initial_role; assigned_name := allowlist.full_name;
  elsif p_application_id is not null and p_interview_token is not null then
    select * into application from public.career_applications
    where id = p_application_id and interview_token = p_interview_token
      and lower(email) = token_email and applicant_clerk_user_id is null;
    if application.id is null then raise exception 'This application cannot be linked to the signed-in account.' using errcode = '42501'; end if;
    assigned_role := 'applicant'; assigned_name := application.full_name;
  else
    raise exception 'This account has not been provisioned for Trailblaze.' using errcode = '42501';
  end if;
  insert into public.profiles (id, clerk_user_id, full_name, email, role)
  values (gen_random_uuid(), token_subject, assigned_name, token_email, assigned_role)
  returning * into profile_row;
  if application.id is not null then
    update public.career_applications set applicant_clerk_user_id = token_subject, applicant_profile_id = profile_row.id,
      applicant_account_created_at = coalesce(applicant_account_created_at, now())
    where id = application.id;
  end if;
  return profile_row;
end;
$$;

create or replace function public.hire_applicant(p_application_id uuid, p_role public.app_role)
returns public.profiles
language plpgsql security definer set search_path = public, private
as $$
declare application public.career_applications%rowtype; profile_row public.profiles%rowtype;
begin
  if not private.is_owner() then raise exception 'Only an owner can complete onboarding.' using errcode = '42501'; end if;
  if p_role not in ('manager', 'employee') then raise exception 'A hire can only be assigned a manager or employee role.' using errcode = '22023'; end if;
  select * into application from public.career_applications where id = p_application_id for update;
  if application.id is null or application.applicant_profile_id is null then raise exception 'The applicant needs to create an account before onboarding.' using errcode = '22023'; end if;
  update public.profiles set role = p_role, updated_at = now() where id = application.applicant_profile_id returning * into profile_row;
  update public.career_applications set status = 'hired', updated_at = now() where id = application.id;
  return profile_row;
end;
$$;

revoke all on function private.current_profile_id() from public, anon;
revoke all on function private.is_platform_admin() from public, anon;
revoke all on function private.is_owner() from public, anon;
revoke all on function private.is_owner_or_manager() from public, anon;
revoke all on function private.is_job_member(uuid) from public, anon;
grant execute on function private.current_profile_id() to authenticated;
grant execute on function private.is_platform_admin() to authenticated;
grant execute on function private.is_owner() to authenticated;
grant execute on function private.is_owner_or_manager() to authenticated;
grant execute on function private.is_job_member(uuid) to authenticated;
revoke all on function public.sync_clerk_profile(uuid, uuid) from public, anon;
grant execute on function public.sync_clerk_profile(uuid, uuid) to authenticated;
revoke all on function public.hire_applicant(uuid, public.app_role) from public, anon;
grant execute on function public.hire_applicant(uuid, public.app_role) to authenticated;

alter table public.clerk_identity_allowlist enable row level security;
alter table public.role_permissions enable row level security;
alter table public.job_role_templates enable row level security;
alter table public.platform_settings enable row level security;

create policy clerk_allowlist_platform_admin_manage on public.clerk_identity_allowlist for all to authenticated using (private.is_platform_admin()) with check (private.is_platform_admin());
create policy role_permissions_owner_read on public.role_permissions for select to authenticated using (private.is_owner());
create policy role_permissions_platform_admin_manage on public.role_permissions for all to authenticated using (private.is_platform_admin()) with check (private.is_platform_admin());
create policy role_permissions_owner_manage on public.role_permissions for update to authenticated using (private.is_owner() and role <> 'platform_admin') with check (private.is_owner() and role <> 'platform_admin');
create policy role_templates_public_read on public.job_role_templates for select to anon, authenticated using (active or private.is_owner());
create policy role_templates_owner_manage on public.job_role_templates for all to authenticated using (private.is_owner()) with check (private.is_owner());
create policy platform_settings_platform_admin_manage on public.platform_settings for all to authenticated using (private.is_platform_admin()) with check (private.is_platform_admin());
create policy applications_clerk_applicant_read on public.career_applications for select to authenticated using (applicant_clerk_user_id = (select auth.jwt() ->> 'sub') or applicant_profile_id = private.current_profile_id());
create policy assessments_clerk_applicant_read on public.interview_assessments for select to authenticated using (exists (select 1 from public.career_applications where career_applications.id = interview_assessments.application_id and (career_applications.applicant_clerk_user_id = (select auth.jwt() ->> 'sub') or career_applications.applicant_profile_id = private.current_profile_id())));

grant select, insert, update, delete on public.clerk_identity_allowlist to authenticated;
grant select, update on public.role_permissions to authenticated;
grant select, insert, update, delete on public.job_role_templates to anon, authenticated;
grant select, insert, update, delete on public.platform_settings to authenticated;
