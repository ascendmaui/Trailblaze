revoke all on function public.submit_ai_lead(text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;

create index if not exists career_applications_applicant_profile_idx on public.career_applications(applicant_profile_id);
create index if not exists job_role_templates_created_by_idx on public.job_role_templates(created_by);
create index if not exists job_role_templates_updated_by_idx on public.job_role_templates(updated_by);
create index if not exists job_updates_author_idx on public.job_updates(author_id);
create index if not exists onboarding_checklists_application_idx on public.onboarding_checklists(application_id);
create index if not exists onboarding_checklists_created_by_idx on public.onboarding_checklists(created_by);
create index if not exists onboarding_tasks_checklist_idx on public.onboarding_tasks(checklist_id);
create index if not exists onboarding_tasks_completed_by_idx on public.onboarding_tasks(completed_by);
create index if not exists platform_settings_updated_by_idx on public.platform_settings(updated_by);
create index if not exists role_permissions_updated_by_idx on public.role_permissions(updated_by);
create index if not exists workflow_settings_updated_by_idx on public.workflow_settings(updated_by);
