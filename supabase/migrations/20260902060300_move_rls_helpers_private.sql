create schema if not exists private;
revoke all on schema private from public;

alter function public.is_owner_or_manager() set schema private;
alter function public.is_owner() set schema private;
alter function public.is_job_member(uuid) set schema private;

revoke all on function private.is_owner_or_manager() from public, anon;
revoke all on function private.is_owner() from public, anon;
revoke all on function private.is_job_member(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_owner_or_manager() to authenticated;
grant execute on function private.is_owner() to authenticated;
grant execute on function private.is_job_member(uuid) to authenticated;
