-- Surokkha BD: community reports, audit log, auto-profile creation (Phase 3)

-- ---------------------------------------------------------------------------
-- Community reports
-- ---------------------------------------------------------------------------
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('flooding', 'erosion', 'landslide', 'blocked_road', 'damaged_embankment', 'other')),
  description text not null,
  location geography(Point, 4326) not null,
  district_code text references districts (code),
  photo_path text,
  reporter_id uuid references auth.users (id),
  contact_optional text,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected', 'resolved')),
  verified_by uuid references auth.users (id),
  verified_at timestamptz,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists reports_location_idx on reports using gist (location);
create index if not exists reports_status_idx on reports (status);
create index if not exists reports_ip_hash_created_idx on reports (ip_hash, created_at);

-- Public-facing view: only what a visitor should ever see about a verified report.
-- Excludes contact_optional, ip_hash, and reporter_id.
create or replace view reports_public as
select
  id, type, description,
  st_y(location::geometry) as lat,
  st_x(location::geometry) as lng,
  district_code, photo_path, created_at
from reports
where status = 'verified';

-- ---------------------------------------------------------------------------
-- Public view of shelters (flattens the geography column to plain lat/lng so
-- the app can query it with a normal select, no PostGIS functions needed client-side)
-- ---------------------------------------------------------------------------
create or replace view shelters_public as
select
  id, name_en, name_bn, type, district_code,
  st_y(location::geometry) as lat,
  st_x(location::geometry) as lng,
  capacity, contact, accessible
from shelters
where active;

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id),
  action text not null,
  entity text not null,
  entity_id uuid,
  diff jsonb,
  at timestamptz not null default now()
);

create index if not exists audit_log_at_idx on audit_log (at desc);

create or replace function log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), 'insert', tg_table_name, new.id, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), 'update', tg_table_name, new.id, jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new)));
    return new;
  end if;
  return null;
end;
$$;

drop trigger if exists alerts_audit on alerts;
create trigger alerts_audit after insert or update on alerts
  for each row execute function log_audit_event();

drop trigger if exists shelters_audit on shelters;
create trigger shelters_audit after insert or update on shelters
  for each row execute function log_audit_event();

drop trigger if exists reports_audit on reports;
create trigger reports_audit after insert or update on reports
  for each row execute function log_audit_event();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever someone signs up
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (user_id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)), 'citizen')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Private storage bucket for report photos (served only via short-lived
-- signed URLs created server-side; see src/lib/supabase/admin.ts)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', false)
on conflict (id) do nothing;
