revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_owner_or_manager() from public, anon;
revoke execute on function public.is_owner() from public, anon;
revoke execute on function public.is_job_member(uuid) from public, anon;
grant execute on function public.is_owner_or_manager() to authenticated;
grant execute on function public.is_owner() to authenticated;
grant execute on function public.is_job_member(uuid) to authenticated;

create index invitations_created_by_idx on public.invitations (created_by);
create index jobs_created_by_idx on public.jobs (created_by);
create index job_updates_job_author_idx on public.job_updates (job_id, author_id);
create index payouts_job_idx on public.payouts (job_id);
create index payouts_employee_idx on public.payouts (employee_id);
create index time_entries_job_idx on public.time_entries (job_id);
