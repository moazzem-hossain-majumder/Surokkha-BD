-- Surokkha BD: Row Level Security (Phase 2)
-- Every table gets RLS enabled per rules.md ("a table without policies is a bug").

alter table districts enable row level security;
alter table profiles enable row level security;
alter table shelters enable row level security;
alter table alerts enable row level security;
alter table quake_cache enable row level security;
alter table weather_cache enable row level security;

-- Helper: is the current user a coordinator or admin?
create or replace function is_coordinator_or_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and role in ('coordinator', 'admin')
  );
$$;

-- Districts: public read, nobody writes via the API (seeded by migration only).
create policy "districts_public_read" on districts for select using (true);

-- Profiles: a user reads and updates their own row; coordinators/admins can read all.
create policy "profiles_read_own" on profiles for select using (
  user_id = auth.uid() or is_coordinator_or_admin()
);
create policy "profiles_update_own" on profiles for update using (user_id = auth.uid());
create policy "profiles_insert_own" on profiles for insert with check (user_id = auth.uid());

-- Shelters: public reads active shelters; only coordinators/admins write.
create policy "shelters_public_read" on shelters for select using (active);
create policy "shelters_coordinator_write" on shelters for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- Alerts: public reads non-expired alerts; only coordinators/admins write.
create policy "alerts_public_read" on alerts for select using (expires_at > now());
create policy "alerts_coordinator_write" on alerts for all using (is_coordinator_or_admin())
  with check (is_coordinator_or_admin());

-- Caches: public read (used to render the map); only the service role writes
-- (scheduled jobs use the service role key, which bypasses RLS by design).
create policy "quake_cache_public_read" on quake_cache for select using (true);
create policy "weather_cache_public_read" on weather_cache for select using (true);
