-- Surokkha BD: security fixes found in the Phase 6 security review (P6-5)
--
-- BUG (present since Phase 2/3): `profiles_update_own` on the `profiles`
-- table lets a signed-in user update their own row with no restriction on
-- WHICH columns change. Since `role` lives on that same row, any signed-in
-- citizen could call:
--     supabase.from('profiles').update({ role: 'admin' }).eq('user_id', me)
-- from the browser console and grant themselves admin/coordinator access.
-- RLS `with check` can restrict row-level predicates but not "this column
-- may not change on a self-update", so the fix is a trigger.
--
-- Same category of bug, lower severity: `volunteers_update_own` lets a
-- volunteer set their own `verified` flag, even though that column exists
-- so a coordinator can mark someone as vetted. No page currently reads or
-- displays `verified`, so this has no live UI impact yet, but it should be
-- locked down before it does.
--
-- IMPORTANT: if this project has already been deployed/tested live, run
--   select user_id, role from profiles where role <> 'citizen';
-- and confirm every non-citizen row is one you actually promoted yourself,
-- before assuming nobody found this.

create or replace function lock_role_on_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_coordinator_or_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_lock_role on profiles;
create trigger profiles_lock_role before update on profiles
  for each row execute function lock_role_on_self_update();

create or replace function lock_verified_on_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_coordinator_or_admin() then
    new.verified := old.verified;
  end if;
  return new;
end;
$$;

drop trigger if exists volunteers_lock_verified on volunteers;
create trigger volunteers_lock_verified before update on volunteers
  for each row execute function lock_verified_on_self_update();

-- ferry_help_requests had no rate-limiting at all (see P6-5 review notes in
-- memory.md) -- every other public insert in the app hashes the submitter's
-- IP for a lightweight per-IP cap (see reports.ip_hash from Phase 3). Add
-- the same column here so the server action can do the same.
alter table ferry_help_requests add column if not exists ip_hash text;
create index if not exists ferry_help_requests_ip_hash_idx on ferry_help_requests (ip_hash, created_at);

-- ---------------------------------------------------------------------------
-- P6-6: make account deletion actually possible.
--
-- `profiles.user_id` and `volunteers.user_id` already cascade on delete, but
-- every other table that references auth.users(id) (alerts, reports,
-- audit_log, relief_needs, pledges, volunteer_tasks, ferry_help_requests) had
-- no ON DELETE behavior at all -- meaning a real Postgres default of NO
-- ACTION. Concretely: a coordinator who ever posted an alert, or a donor who
-- ever made a pledge, could NOT delete their own auth.users row -- Supabase
-- would reject it with a foreign-key violation, and there would be no way to
-- honor a deletion request for that person at all.
--
-- The fix is ON DELETE SET NULL: deleting the account detaches it from its
-- past contributions (the alert, report, pledge, etc. stays -- which matters
-- for the public record and for audit accountability -- but is no longer
-- attributed to anyone). Three of these columns were NOT NULL and have to be
-- relaxed for SET NULL to be legal.
alter table relief_needs alter column created_by drop not null;
alter table pledges alter column donor_id drop not null;
alter table volunteer_tasks alter column created_by drop not null;

alter table alerts drop constraint if exists alerts_created_by_fkey,
  add constraint alerts_created_by_fkey foreign key (created_by) references auth.users (id) on delete set null;
alter table reports drop constraint if exists reports_reporter_id_fkey,
  add constraint reports_reporter_id_fkey foreign key (reporter_id) references auth.users (id) on delete set null;
alter table reports drop constraint if exists reports_verified_by_fkey,
  add constraint reports_verified_by_fkey foreign key (verified_by) references auth.users (id) on delete set null;
alter table audit_log drop constraint if exists audit_log_actor_id_fkey,
  add constraint audit_log_actor_id_fkey foreign key (actor_id) references auth.users (id) on delete set null;
alter table relief_needs drop constraint if exists relief_needs_created_by_fkey,
  add constraint relief_needs_created_by_fkey foreign key (created_by) references auth.users (id) on delete set null;
alter table pledges drop constraint if exists pledges_donor_id_fkey,
  add constraint pledges_donor_id_fkey foreign key (donor_id) references auth.users (id) on delete set null;
alter table volunteer_tasks drop constraint if exists volunteer_tasks_created_by_fkey,
  add constraint volunteer_tasks_created_by_fkey foreign key (created_by) references auth.users (id) on delete set null;
alter table ferry_help_requests drop constraint if exists ferry_help_requests_requester_id_fkey,
  add constraint ferry_help_requests_requester_id_fkey foreign key (requester_id) references auth.users (id) on delete set null;
