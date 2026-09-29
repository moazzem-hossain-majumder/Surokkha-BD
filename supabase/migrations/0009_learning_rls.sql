-- Surokkha BD: RLS for historical events, quizzes, ferry board (Phase 5)

alter table historical_events enable row level security;
alter table quiz_questions enable row level security;
alter table ferry_schedules enable row level security;
alter table ferry_help_requests enable row level security;

-- Reference/content tables: public reads, only coordinators/admins write --
-- same pattern as alerts, shelters, and relief_needs.
drop policy if exists "historical_events_public_read" on historical_events;
create policy "historical_events_public_read" on historical_events for select using (true);
drop policy if exists "historical_events_coordinator_write" on historical_events;
create policy "historical_events_coordinator_write" on historical_events for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

drop policy if exists "quiz_questions_public_read" on quiz_questions;
create policy "quiz_questions_public_read" on quiz_questions for select using (true);
drop policy if exists "quiz_questions_coordinator_write" on quiz_questions;
create policy "quiz_questions_coordinator_write" on quiz_questions for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

drop policy if exists "ferry_schedules_public_read" on ferry_schedules;
create policy "ferry_schedules_public_read" on ferry_schedules for select using (true);
drop policy if exists "ferry_schedules_coordinator_write" on ferry_schedules;
create policy "ferry_schedules_coordinator_write" on ferry_schedules for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- ferry_help_requests: anyone (including anonymous) can post a request;
-- the requester can read their own; coordinators/admins can read and answer all.
drop policy if exists "ferry_help_requests_insert_anyone" on ferry_help_requests;
create policy "ferry_help_requests_insert_anyone" on ferry_help_requests for insert with check (status = 'open');
drop policy if exists "ferry_help_requests_read_own" on ferry_help_requests;
create policy "ferry_help_requests_read_own" on ferry_help_requests for select using (
  requester_id is not null and requester_id = auth.uid()
);
drop policy if exists "ferry_help_requests_read_moderator" on ferry_help_requests;
create policy "ferry_help_requests_read_moderator" on ferry_help_requests for select using (is_coordinator_or_admin());
drop policy if exists "ferry_help_requests_moderate" on ferry_help_requests;
create policy "ferry_help_requests_moderate" on ferry_help_requests for update using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());
