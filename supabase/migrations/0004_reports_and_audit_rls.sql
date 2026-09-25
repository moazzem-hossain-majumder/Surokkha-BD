-- Surokkha BD: RLS for reports, audit_log, and report-photos storage (Phase 3)

alter table reports enable row level security;
alter table audit_log enable row level security;

-- Reports:
-- - Anyone can read verified reports (via the reports_public view; the base
--   table policy below also allows it so the view works for anon requests).
-- - A signed-in reporter can see their own reports at any status.
-- - Coordinators/admins can see and moderate everything.
-- - Inserts are allowed for anonymous (reporter_id null) and signed-in users,
--   always starting at status = 'pending'. The app's /api/reports route does
--   the real validation, rate limiting, and photo handling server-side; this
--   policy is defense in depth in case of a direct client insert.
create policy "reports_read_verified" on reports for select using (status = 'verified');
create policy "reports_read_own" on reports for select using (reporter_id = auth.uid());
create policy "reports_read_moderator" on reports for select using (is_coordinator_or_admin());

create policy "reports_insert" on reports for insert with check (
  status = 'pending'
  and (reporter_id = auth.uid() or reporter_id is null)
);

create policy "reports_moderate" on reports for update using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- Audit log: admins only. Rows are written by security-definer triggers, so no
-- insert policy is needed for normal users.
create policy "audit_log_admin_read" on audit_log for select using (
  exists (select 1 from profiles where user_id = auth.uid() and role = 'admin')
);

-- ---------------------------------------------------------------------------
-- Storage: report-photos bucket
-- Uploads happen only through /api/reports using the service role key (which
-- bypasses RLS by design), so no insert policy is granted here. Reads happen
-- only through short-lived signed URLs generated server-side for coordinators
-- and admins, so no public select policy is granted either.
-- ---------------------------------------------------------------------------
create policy "report_photos_no_public_access" on storage.objects for select using (
  bucket_id = 'report-photos' and is_coordinator_or_admin()
);
