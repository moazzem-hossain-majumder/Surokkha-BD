-- Surokkha BD: RLS for ReliefLink and Volunteer Hub (Phase 4)

alter table relief_needs enable row level security;
alter table pledges enable row level security;
alter table volunteers enable row level security;
alter table volunteer_tasks enable row level security;
alter table task_applications enable row level security;

-- relief_needs: public reads everything (status included, so a closed/fulfilled
-- need still shows its final progress); only coordinators/admins write.
drop policy if exists "relief_needs_public_read" on relief_needs;
create policy "relief_needs_public_read" on relief_needs for select using (true);
drop policy if exists "relief_needs_coordinator_write" on relief_needs;
create policy "relief_needs_coordinator_write" on relief_needs for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- pledges: a donor sees their own pledges; coordinators/admins see all (they need
-- this to manage handover and mark delivery). Aggregates only are public, via
-- relief_needs_public, which does not select from this table directly for RLS
-- purposes -- it runs as the querying role, so the view is granted to anon/authenticated
-- explicitly below rather than relying on row visibility.
drop policy if exists "pledges_read_own" on pledges;
create policy "pledges_read_own" on pledges for select using (donor_id = auth.uid());
drop policy if exists "pledges_read_moderator" on pledges;
create policy "pledges_read_moderator" on pledges for select using (is_coordinator_or_admin());
drop policy if exists "pledges_insert_own" on pledges;
create policy "pledges_insert_own" on pledges for insert with check (donor_id = auth.uid() and status = 'pledged');
drop policy if exists "pledges_update_own_cancel" on pledges;
create policy "pledges_update_own_cancel" on pledges for update using (donor_id = auth.uid())
  with check (donor_id = auth.uid() and status in ('pledged', 'cancelled'));
drop policy if exists "pledges_moderate" on pledges;
create policy "pledges_moderate" on pledges for update using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- Views aggregate across all rows regardless of the caller's row-level access,
-- so grant them directly and keep them free of anything identifying (no donor_id,
-- no volunteer_id) -- the underlying base tables stay protected by the policies above.
grant select on relief_needs_public to anon, authenticated;
grant select on volunteer_tasks_public to anon, authenticated;
grant select on pledges_activity_public to anon, authenticated;

-- volunteers: a user manages their own volunteer profile; coordinators/admins
-- can read all profiles (needed to review applicants) but never the public.
drop policy if exists "volunteers_read_own" on volunteers;
create policy "volunteers_read_own" on volunteers for select using (user_id = auth.uid());
drop policy if exists "volunteers_read_moderator" on volunteers;
create policy "volunteers_read_moderator" on volunteers for select using (is_coordinator_or_admin());
drop policy if exists "volunteers_upsert_own" on volunteers;
create policy "volunteers_upsert_own" on volunteers for insert with check (user_id = auth.uid());
drop policy if exists "volunteers_update_own" on volunteers;
create policy "volunteers_update_own" on volunteers for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- volunteer_tasks: public reads open tasks; only coordinators/admins write.
drop policy if exists "volunteer_tasks_public_read" on volunteer_tasks;
create policy "volunteer_tasks_public_read" on volunteer_tasks for select using (status = 'open');
drop policy if exists "volunteer_tasks_read_moderator" on volunteer_tasks;
create policy "volunteer_tasks_read_moderator" on volunteer_tasks for select using (is_coordinator_or_admin());
drop policy if exists "volunteer_tasks_coordinator_write" on volunteer_tasks;
create policy "volunteer_tasks_coordinator_write" on volunteer_tasks for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- task_applications: a volunteer sees and manages their own applications;
-- coordinators/admins see and decide on all of them.
drop policy if exists "task_applications_read_own" on task_applications;
create policy "task_applications_read_own" on task_applications for select using (volunteer_id = auth.uid());
drop policy if exists "task_applications_read_moderator" on task_applications;
create policy "task_applications_read_moderator" on task_applications for select using (is_coordinator_or_admin());
drop policy if exists "task_applications_insert_own" on task_applications;
create policy "task_applications_insert_own" on task_applications for insert with check (
  volunteer_id = auth.uid() and status = 'applied'
);
drop policy if exists "task_applications_withdraw_own" on task_applications;
create policy "task_applications_withdraw_own" on task_applications for update using (volunteer_id = auth.uid())
  with check (volunteer_id = auth.uid() and status = 'withdrawn');
drop policy if exists "task_applications_moderate" on task_applications;
create policy "task_applications_moderate" on task_applications for update using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());
