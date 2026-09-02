create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invitation public.invitations%rowtype;
  application public.career_applications%rowtype;
  assigned_role public.app_role := 'employee';
  assigned_name text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  application_ref uuid := nullif(new.raw_user_meta_data ->> 'application_id', '')::uuid;
  interview_ref uuid := nullif(new.raw_user_meta_data ->> 'interview_token', '')::uuid;
begin
  if application_ref is not null and interview_ref is not null then
    select * into application
    from public.career_applications
    where id = application_ref
      and interview_token = interview_ref
      and lower(email) = lower(new.email)
      and applicant_user_id is null;

    if application.id is not null then
      assigned_role := 'applicant';
      assigned_name := coalesce(nullif(assigned_name, ''), application.full_name);
      update public.career_applications
      set applicant_user_id = new.id,
          applicant_account_created_at = now()
      where id = application.id;
    end if;
  end if;

  if application.id is null then
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
      raise exception 'An active Trailblaze invitation or application is required to create an account.';
    end if;
  end if;

  insert into public.profiles (id, full_name, email, phone, role)
  values (new.id, assigned_name, lower(new.email), coalesce(new.raw_user_meta_data ->> 'phone', ''), assigned_role);
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
