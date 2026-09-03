alter table public.contact_requests add column if not exists source text not null default 'contact_form';
alter table public.contact_requests add column if not exists status text not null default 'new' check (status in ('new', 'contacted', 'appointment_requested', 'scheduled', 'closed'));
alter table public.contact_requests add column if not exists appointment_window text;
alter table public.contact_requests add column if not exists call_route text;
alter table public.contact_requests add column if not exists transcript jsonb not null default '[]'::jsonb;

create table if not exists public.workflow_settings (
  key text primary key,
  label text not null,
  description text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.workflow_settings (key, label, description, enabled, config)
values
  ('job_posting_alerts', 'Post-job alerts', 'Notify owners, managers, and assigned team members when a job is posted.', true, '{"owners":true,"managers":true,"assigned_team":true}'::jsonb),
  ('employee_onboarding', 'Employee onboarding', 'Create the standard onboarding checklist for every new team member.', true, '{"steps":["Offer accepted","Account created","W-9 / tax details","Direct deposit","Safety orientation","Role permissions assigned","First job assigned"]}'::jsonb),
  ('career_ai_interviewer', 'AI interviewer', 'Use the xAI voice interviewer for applicants and send scorecards to the owner dashboard.', true, '{"provider":"xAI","human_review_required":true}'::jsonb),
  ('lead_ai_agent', 'Trailblaze AI lead agent', 'Guarded customer-service lead intake for quotes, appointments, and call routing.', true, '{"voice":"positive female","guardrails":["customer_inquiries_only","no_internal_data","no_private_records","no_system_details"]}'::jsonb)
on conflict (key) do nothing;

create table if not exists public.onboarding_checklists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  application_id uuid references public.career_applications(id) on delete set null,
  invitation_id uuid references public.invitations(id) on delete set null,
  role public.app_role not null default 'employee' check (role in ('manager', 'employee')),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'complete')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.onboarding_checklists(id) on delete cascade,
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists onboarding_profile_idx on public.onboarding_checklists(profile_id);
create index if not exists onboarding_invitation_idx on public.onboarding_checklists(invitation_id);
create index if not exists workflow_settings_updated_idx on public.workflow_settings(updated_at desc);

create trigger workflow_settings_updated_at before update on public.workflow_settings for each row execute procedure public.set_updated_at();
create trigger onboarding_checklists_updated_at before update on public.onboarding_checklists for each row execute procedure public.set_updated_at();

create or replace function public.sync_clerk_profile(p_application_id uuid default null, p_interview_token uuid default null)
returns public.profiles
language plpgsql security definer set search_path = public, private
as $$
declare
  token_subject text := auth.jwt() ->> 'sub';
  token_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  allowlist public.clerk_identity_allowlist%rowtype;
  invitation public.invitations%rowtype;
  application public.career_applications%rowtype;
  profile_row public.profiles%rowtype;
  assigned_role public.app_role;
  assigned_name text;
  assigned_phone text := '';
begin
  if token_subject is null or token_subject = '' or token_email = '' then
    raise exception 'A verified Clerk session with an email claim is required.' using errcode = '28000';
  end if;

  select * into profile_row from public.profiles where clerk_user_id = token_subject;
  if profile_row.id is not null then return profile_row; end if;

  select * into allowlist from public.clerk_identity_allowlist where email = token_email and active;
  if allowlist.email is not null then
    assigned_role := allowlist.initial_role;
    assigned_name := allowlist.full_name;
  else
    select * into invitation from public.invitations
    where lower(email) = token_email and accepted_at is null and expires_at > now();

    if invitation.id is not null then
      assigned_role := invitation.role;
      assigned_name := invitation.full_name;
      assigned_phone := coalesce(invitation.phone, '');
      update public.invitations set accepted_at = now() where id = invitation.id;
    elsif p_application_id is not null and p_interview_token is not null then
      select * into application from public.career_applications
      where id = p_application_id and interview_token = p_interview_token
        and lower(email) = token_email and applicant_clerk_user_id is null;
      if application.id is null then raise exception 'This application cannot be linked to the signed-in account.' using errcode = '42501'; end if;
      assigned_role := 'applicant';
      assigned_name := application.full_name;
      assigned_phone := application.phone;
    else
      raise exception 'This account has not been provisioned for Trailblaze.' using errcode = '42501';
    end if;
  end if;

  insert into public.profiles (id, clerk_user_id, full_name, email, phone, role)
  values (gen_random_uuid(), token_subject, assigned_name, token_email, assigned_phone, assigned_role)
  returning * into profile_row;

  if application.id is not null then
    update public.career_applications set applicant_clerk_user_id = token_subject, applicant_profile_id = profile_row.id,
      applicant_account_created_at = coalesce(applicant_account_created_at, now())
    where id = application.id;
  end if;

  if invitation.id is not null then
    update public.onboarding_checklists
      set profile_id = profile_row.id, status = 'in_progress', updated_at = now()
      where invitation_id = invitation.id and profile_id is null;
  end if;

  return profile_row;
end;
$$;

create or replace function public.create_team_invitation(p_email text, p_full_name text, p_phone text, p_role public.app_role)
returns public.invitations
language plpgsql security definer set search_path = public, private
as $$
declare
  actor uuid := private.current_profile_id();
  invitation_row public.invitations%rowtype;
  checklist_id uuid;
  owner_row record;
begin
  if not private.is_owner() then raise exception 'Only an owner can invite team members.' using errcode = '42501'; end if;
  if p_role not in ('manager', 'employee') then raise exception 'Team invitations can only create manager or employee accounts.' using errcode = '22023'; end if;

  insert into public.invitations (email, full_name, phone, role, created_by)
  values (lower(trim(p_email)), trim(p_full_name), nullif(trim(coalesce(p_phone, '')), ''), p_role, actor)
  on conflict (email) do update
    set full_name = excluded.full_name, phone = excluded.phone, role = excluded.role, created_by = actor,
        accepted_at = null, expires_at = now() + interval '14 days', created_at = now()
  returning * into invitation_row;

  insert into public.onboarding_checklists (invitation_id, role, status, created_by)
  values (invitation_row.id, p_role, 'not_started', actor)
  returning id into checklist_id;

  insert into public.onboarding_tasks (checklist_id, title, description, sort_order)
  values
    (checklist_id, 'Offer accepted', 'Confirm the role, pay expectations, start date, and reporting manager.', 1),
    (checklist_id, 'Account created', 'Team member signs in with Clerk and activates Trailblaze portal access.', 2),
    (checklist_id, 'Tax and payroll details', 'Collect W-9/I-9 details and payment paperwork outside the demo portal.', 3),
    (checklist_id, 'Direct deposit setup', 'Confirm banking details through the approved payout workflow.', 4),
    (checklist_id, 'Safety orientation', 'Review jobsite safety, PPE, communication expectations, and incident reporting.', 5),
    (checklist_id, 'Role permissions assigned', 'Heather or an owner confirms dashboard permissions for this role.', 6),
    (checklist_id, 'First job assigned', 'Assign the first job, due date, and required field update checklist.', 7);

  for owner_row in select id from public.profiles where active and role in ('platform_admin', 'owner', 'manager') loop
    insert into public.notifications (recipient_id, category, title, body)
    values (owner_row.id, 'team', 'Team onboarding started', invitation_row.full_name || ' was invited as ' || initcap(invitation_row.role::text) || '.');
  end loop;

  return invitation_row;
end;
$$;

create or replace function public.post_job_with_workflow(
  p_title text,
  p_address text,
  p_client_name text default null,
  p_due_at timestamptz default null,
  p_status public.job_status default 'scheduled',
  p_priority text default 'normal',
  p_notes text default null,
  p_payout_amount numeric default 0,
  p_assignee_ids uuid[] default '{}'
)
returns public.jobs
language plpgsql security definer set search_path = public, private
as $$
declare
  actor uuid := private.current_profile_id();
  job_row public.jobs%rowtype;
  assignee uuid;
  recipient record;
begin
  if not private.is_owner_or_manager() then raise exception 'Only owners or managers can post jobs.' using errcode = '42501'; end if;
  if p_status = 'draft' then raise exception 'Use a scheduled or active status to post a job.' using errcode = '22023'; end if;

  insert into public.jobs (title, address, client_name, due_at, status, priority, notes, payout_amount, created_by)
  values (trim(p_title), trim(p_address), nullif(trim(coalesce(p_client_name, '')), ''), p_due_at, p_status, p_priority, nullif(trim(coalesce(p_notes, '')), ''), greatest(coalesce(p_payout_amount, 0), 0), actor)
  returning * into job_row;

  foreach assignee in array coalesce(p_assignee_ids, '{}') loop
    insert into public.job_assignments (job_id, user_id)
    select job_row.id, assignee
    where exists (select 1 from public.profiles where id = assignee and active and role in ('manager', 'employee'))
    on conflict do nothing;
  end loop;

  insert into public.job_updates (job_id, author_id, kind, body, status)
  values (job_row.id, actor, 'status', 'Job posted through the owner workflow.', p_status);

  if coalesce(p_payout_amount, 0) > 0 then
    insert into public.payouts (job_id, amount, status, note)
    values (job_row.id, greatest(p_payout_amount, 0), 'held', 'Created automatically when the job was posted.');
  end if;

  for recipient in
    select distinct p.id
    from public.profiles p
    where p.active and (
      p.role in ('platform_admin', 'owner', 'manager')
      or p.id = any(coalesce(p_assignee_ids, '{}'))
    )
  loop
    insert into public.notifications (recipient_id, category, title, body)
    values (recipient.id, 'job', 'New job posted', job_row.title || ' at ' || job_row.address || ' is now ' || replace(job_row.status::text, '_', ' ') || '.');
  end loop;

  return job_row;
end;
$$;

create or replace function public.hire_applicant(p_application_id uuid, p_role public.app_role)
returns public.profiles
language plpgsql security definer set search_path = public, private
as $$
declare
  actor uuid := private.current_profile_id();
  application public.career_applications%rowtype;
  profile_row public.profiles%rowtype;
  checklist_id uuid;
begin
  if not private.is_owner() then raise exception 'Only an owner can complete onboarding.' using errcode = '42501'; end if;
  if p_role not in ('manager', 'employee') then raise exception 'A hire can only be assigned a manager or employee role.' using errcode = '22023'; end if;
  select * into application from public.career_applications where id = p_application_id for update;
  if application.id is null or application.applicant_profile_id is null then raise exception 'The applicant needs to create an account before onboarding.' using errcode = '22023'; end if;

  update public.profiles set role = p_role, updated_at = now() where id = application.applicant_profile_id returning * into profile_row;
  update public.career_applications set status = 'hired', updated_at = now() where id = application.id;

  insert into public.onboarding_checklists (profile_id, application_id, role, status, created_by)
  values (profile_row.id, application.id, p_role, 'in_progress', actor)
  returning id into checklist_id;

  insert into public.onboarding_tasks (checklist_id, title, description, sort_order)
  values
    (checklist_id, 'Offer accepted', 'Confirm role, start date, compensation, and reporting expectations.', 1),
    (checklist_id, 'Account created', 'Confirm the new hire can access the employee dashboard.', 2),
    (checklist_id, 'Tax and payroll details', 'Collect required employment and payout documentation.', 3),
    (checklist_id, 'Direct deposit setup', 'Confirm payout preference and banking workflow.', 4),
    (checklist_id, 'Safety orientation', 'Complete jobsite safety, PPE, and incident reporting overview.', 5),
    (checklist_id, 'Role permissions assigned', 'Owner confirms permission set for the team member role.', 6),
    (checklist_id, 'First job assigned', 'Assign an initial job and field update checklist.', 7);

  insert into public.notifications (recipient_id, category, title, body)
  values (profile_row.id, 'team', 'Welcome to Trailblaze', 'Your onboarding checklist is ready in the employee dashboard.');

  return profile_row;
end;
$$;

create or replace function public.complete_onboarding_task(p_task_id uuid)
returns public.onboarding_tasks
language plpgsql security definer set search_path = public, private
as $$
declare
  actor uuid := private.current_profile_id();
  task_row public.onboarding_tasks%rowtype;
begin
  if actor is null then raise exception 'Authentication required.' using errcode = '28000'; end if;
  update public.onboarding_tasks
  set completed_at = coalesce(completed_at, now()), completed_by = actor
  where id = p_task_id and (
    private.is_owner_or_manager()
    or exists (
      select 1 from public.onboarding_checklists
      where onboarding_checklists.id = onboarding_tasks.checklist_id
      and onboarding_checklists.profile_id = actor
    )
  )
  returning * into task_row;
  if task_row.id is null then raise exception 'Onboarding task not found or unavailable.' using errcode = '42501'; end if;
  return task_row;
end;
$$;

create or replace function public.submit_ai_lead(
  p_full_name text,
  p_phone text,
  p_email text,
  p_project_type text,
  p_message text,
  p_appointment_window text,
  p_call_route text,
  p_transcript jsonb
)
returns public.contact_requests
language plpgsql security definer set search_path = public, private
as $$
declare
  lead public.contact_requests%rowtype;
  recipient record;
begin
  insert into public.contact_requests (full_name, phone, email, project_type, message, source, status, appointment_window, call_route, transcript)
  values (
    trim(p_full_name),
    trim(p_phone),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_project_type, '')), ''),
    trim(p_message),
    'trailblaze_ai',
    case when nullif(trim(coalesce(p_appointment_window, '')), '') is null then 'new' else 'appointment_requested' end,
    nullif(trim(coalesce(p_appointment_window, '')), ''),
    nullif(trim(coalesce(p_call_route, '')), ''),
    coalesce(p_transcript, '[]'::jsonb)
  )
  returning * into lead;

  for recipient in select id from public.profiles where active and role in ('platform_admin', 'owner', 'manager') loop
    insert into public.notifications (recipient_id, category, title, body)
    values (recipient.id, 'system', 'Trailblaze AI lead', lead.full_name || ' requested help with ' || coalesce(lead.project_type, 'a project') || coalesce(' · ' || lead.appointment_window, '') || '. Route: ' || coalesce(lead.call_route, 'owner review'));
  end loop;

  return lead;
end;
$$;

revoke all on function public.create_team_invitation(text, text, text, public.app_role) from public, anon;
revoke all on function public.post_job_with_workflow(text, text, text, timestamptz, public.job_status, text, text, numeric, uuid[]) from public, anon;
revoke all on function public.complete_onboarding_task(uuid) from public, anon;
revoke all on function public.submit_ai_lead(text, text, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.create_team_invitation(text, text, text, public.app_role) to authenticated;
grant execute on function public.post_job_with_workflow(text, text, text, timestamptz, public.job_status, text, text, numeric, uuid[]) to authenticated;
grant execute on function public.complete_onboarding_task(uuid) to authenticated;
grant execute on function public.submit_ai_lead(text, text, text, text, text, text, text, jsonb) to anon, authenticated;

alter table public.workflow_settings enable row level security;
alter table public.onboarding_checklists enable row level security;
alter table public.onboarding_tasks enable row level security;

drop policy if exists profiles_clerk_self_or_owner_read on public.profiles;
create policy profiles_clerk_self_or_owner_read on public.profiles for select to authenticated using (id = private.current_profile_id() or private.is_owner());
drop policy if exists profiles_clerk_owner_update on public.profiles;
create policy profiles_clerk_owner_update on public.profiles for update to authenticated using (private.is_owner()) with check (private.is_owner());
drop policy if exists notifications_clerk_recipient_or_owner_read on public.notifications;
create policy notifications_clerk_recipient_or_owner_read on public.notifications for select to authenticated using (recipient_id = private.current_profile_id() or private.is_owner_or_manager());
drop policy if exists notifications_clerk_recipient_update on public.notifications;
create policy notifications_clerk_recipient_update on public.notifications for update to authenticated using (recipient_id = private.current_profile_id()) with check (recipient_id = private.current_profile_id());
drop policy if exists workflow_settings_owner_manage on public.workflow_settings;
create policy workflow_settings_owner_manage on public.workflow_settings for all to authenticated using (private.is_owner()) with check (private.is_owner());
drop policy if exists onboarding_owner_read on public.onboarding_checklists;
create policy onboarding_owner_read on public.onboarding_checklists for select to authenticated using (private.is_owner_or_manager() or profile_id = private.current_profile_id());
drop policy if exists onboarding_owner_manage on public.onboarding_checklists;
create policy onboarding_owner_manage on public.onboarding_checklists for all to authenticated using (private.is_owner()) with check (private.is_owner());
drop policy if exists onboarding_tasks_read on public.onboarding_tasks;
create policy onboarding_tasks_read on public.onboarding_tasks for select to authenticated using (exists (select 1 from public.onboarding_checklists where onboarding_checklists.id = onboarding_tasks.checklist_id and (private.is_owner_or_manager() or onboarding_checklists.profile_id = private.current_profile_id())));
drop policy if exists onboarding_tasks_owner_manage on public.onboarding_tasks;
create policy onboarding_tasks_owner_manage on public.onboarding_tasks for all to authenticated using (private.is_owner()) with check (private.is_owner());
drop policy if exists contacts_clerk_owner_read on public.contact_requests;
create policy contacts_clerk_owner_read on public.contact_requests for select to authenticated using (private.is_owner_or_manager());

grant select, insert, update, delete on public.workflow_settings to authenticated;
grant select, insert, update, delete on public.onboarding_checklists to authenticated;
grant select, insert, update, delete on public.onboarding_tasks to authenticated;
