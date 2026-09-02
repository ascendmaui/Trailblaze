create extension if not exists pgcrypto;

create type public.app_role as enum ('owner', 'manager', 'employee');
create type public.job_status as enum ('draft', 'scheduled', 'in_progress', 'awaiting_verification', 'completed', 'cancelled');
create type public.application_status as enum ('submitted', 'interview_ready', 'interview_complete', 'reviewing', 'interview_requested', 'offer_sent', 'hired', 'declined');
create type public.payout_status as enum ('held', 'eligible', 'paid', 'void');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null unique,
  phone text,
  role public.app_role not null default 'employee',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  phone text,
  role public.app_role not null default 'employee',
  created_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default ('TB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  title text not null,
  client_name text,
  address text not null,
  due_at timestamptz,
  status public.job_status not null default 'draft',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'medium', 'high', 'urgent')),
  notes text,
  payout_amount numeric(12,2) not null default 0 check (payout_amount >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_assignments (
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (job_id, user_id)
);

create table public.job_updates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'note' check (kind in ('note', 'status', 'photo', 'completion')),
  body text not null,
  status public.job_status,
  created_at timestamptz not null default now()
);

create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  clocked_in_at timestamptz not null default now(),
  clocked_out_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  check (clocked_out_at is null or clocked_out_at > clocked_in_at)
);

create table public.career_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  role_applied_for text not null,
  years_experience integer not null default 0 check (years_experience >= 0 and years_experience <= 80),
  availability text,
  experience text not null,
  motivation text not null,
  status public.application_status not null default 'submitted',
  interview_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.career_applications(id) on delete cascade,
  question_index smallint not null check (question_index between 1 and 10),
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  unique (application_id, question_index)
);

create table public.interview_assessments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.career_applications(id) on delete cascade,
  score smallint not null check (score between 0 and 100),
  verdict text not null,
  summary text not null,
  strengths jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  model text not null,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete cascade,
  category text not null check (category in ('job', 'hiring', 'payout', 'team', 'system')),
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  employee_id uuid references public.profiles(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  status public.payout_status not null default 'held',
  note text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  project_type text,
  message text not null,
  created_at timestamptz not null default now()
);

create index jobs_status_due_idx on public.jobs (status, due_at);
create index job_assignments_user_idx on public.job_assignments (user_id);
create index time_entries_user_clocked_idx on public.time_entries (user_id, clocked_in_at desc);
create index applications_status_created_idx on public.career_applications (status, created_at desc);
create index notifications_recipient_created_idx on public.notifications (recipient_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invitation public.invitations%rowtype;
  assigned_role public.app_role := 'employee';
  assigned_name text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
begin
  select * into invitation
  from public.invitations
  where lower(email) = lower(new.email) and accepted_at is null and expires_at > now();

  if invitation.id is not null then
    assigned_role := invitation.role;
    assigned_name := invitation.full_name;
    update public.invitations set accepted_at = now() where id = invitation.id;
  elsif lower(new.email) = 'hkirk@trailblazeconstruction.com' then
    assigned_role := 'owner';
    assigned_name := coalesce(nullif(assigned_name, ''), 'Heather B. Kirk');
  else
    raise exception 'An active Trailblaze invitation is required to create an account.';
  end if;

  insert into public.profiles (id, full_name, email, phone, role)
  values (new.id, assigned_name, lower(new.email), coalesce(new.raw_user_meta_data ->> 'phone', ''), assigned_role);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger jobs_updated_at before update on public.jobs for each row execute procedure public.set_updated_at();
create trigger applications_updated_at before update on public.career_applications for each row execute procedure public.set_updated_at();
create trigger payouts_updated_at before update on public.payouts for each row execute procedure public.set_updated_at();

create or replace function public.is_owner_or_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('owner', 'manager') and active
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'owner' and active
  );
$$;

create or replace function public.is_job_member(target_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_owner_or_manager() or exists (
    select 1 from public.job_assignments
    where job_id = target_job_id and user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_owner_or_manager() from public;
revoke all on function public.is_owner() from public;
revoke all on function public.is_job_member(uuid) from public;
grant execute on function public.is_owner_or_manager() to authenticated;
grant execute on function public.is_owner() to authenticated;
grant execute on function public.is_job_member(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.jobs enable row level security;
alter table public.job_assignments enable row level security;
alter table public.job_updates enable row level security;
alter table public.time_entries enable row level security;
alter table public.career_applications enable row level security;
alter table public.interview_answers enable row level security;
alter table public.interview_assessments enable row level security;
alter table public.notifications enable row level security;
alter table public.payouts enable row level security;
alter table public.contact_requests enable row level security;

create policy "profiles_self_or_owner_read" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_owner());
create policy "profiles_owner_update" on public.profiles for update to authenticated using (public.is_owner()) with check (public.is_owner());

create policy "invitations_owner_manage" on public.invitations for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "jobs_team_read" on public.jobs for select to authenticated using (public.is_job_member(id));
create policy "jobs_managers_manage" on public.jobs for all to authenticated using (public.is_owner_or_manager()) with check (public.is_owner_or_manager());
create policy "assignments_team_read" on public.job_assignments for select to authenticated using (public.is_owner_or_manager() or user_id = (select auth.uid()));
create policy "assignments_managers_manage" on public.job_assignments for all to authenticated using (public.is_owner_or_manager()) with check (public.is_owner_or_manager());
create policy "updates_team_read" on public.job_updates for select to authenticated using (public.is_job_member(job_id));
create policy "updates_job_members_create" on public.job_updates for insert to authenticated with check (author_id = (select auth.uid()) and public.is_job_member(job_id));
create policy "time_own_or_manager_read" on public.time_entries for select to authenticated using (user_id = (select auth.uid()) or public.is_owner_or_manager());
create policy "time_own_create" on public.time_entries for insert to authenticated with check (user_id = (select auth.uid()));
create policy "time_own_update" on public.time_entries for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "applications_owner_read" on public.career_applications for select to authenticated using (public.is_owner_or_manager());
create policy "applications_owner_update" on public.career_applications for update to authenticated using (public.is_owner_or_manager()) with check (public.is_owner_or_manager());
create policy "answers_owner_read" on public.interview_answers for select to authenticated using (public.is_owner_or_manager());
create policy "assessments_owner_read" on public.interview_assessments for select to authenticated using (public.is_owner_or_manager());
create policy "notifications_recipient_or_owner_read" on public.notifications for select to authenticated using (recipient_id = (select auth.uid()) or public.is_owner_or_manager());
create policy "notifications_recipient_update" on public.notifications for update to authenticated using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));
create policy "payouts_owner_or_employee_read" on public.payouts for select to authenticated using (public.is_owner_or_manager() or employee_id = (select auth.uid()));
create policy "payouts_managers_manage" on public.payouts for all to authenticated using (public.is_owner_or_manager()) with check (public.is_owner_or_manager());
create policy "contacts_owner_read" on public.contact_requests for select to authenticated using (public.is_owner_or_manager());

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.invitations to authenticated;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, insert, update, delete on public.job_assignments to authenticated;
grant select, insert on public.job_updates to authenticated;
grant select, insert, update on public.time_entries to authenticated;
grant select, update on public.career_applications to authenticated;
grant select on public.interview_answers, public.interview_assessments, public.notifications, public.payouts, public.contact_requests to authenticated;
grant update on public.notifications to authenticated;
grant select, insert, update, delete on public.payouts to authenticated;
