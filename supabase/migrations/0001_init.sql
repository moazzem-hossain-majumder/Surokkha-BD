-- Surokkha BD: initial schema (Phase 2)
-- Run this in the Supabase SQL editor, or via `supabase db push`, on a project
-- that has the PostGIS extension available (Supabase enables it by default).
--
-- This migration is NOT yet wired into the app. The Phase 2 UI (map, shelter
-- finder) reads from static JSON in src/content/. Once you have a real
-- Supabase project, run this migration, load supabase/seed/0001_seed.sql,
-- and a later phase will switch the app to read from these tables instead.

create extension if not exists postgis;
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Districts
-- ---------------------------------------------------------------------------
create table if not exists districts (
  code text primary key,
  name_en text not null,
  name_bn text not null,
  division_en text not null,
  division_bn text not null,
  location geography(Point, 4326) not null
);

comment on table districts is 'The 64 districts of Bangladesh. Seeded once, rarely changes.';

-- ---------------------------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'citizen' check (role in ('citizen', 'volunteer', 'donor', 'coordinator', 'admin')),
  district_code text references districts (code),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Shelters
-- ---------------------------------------------------------------------------
create table if not exists shelters (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_bn text not null,
  type text not null check (type in ('cyclone', 'flood', 'hospital', 'other')),
  district_code text references districts (code),
  location geography(Point, 4326) not null,
  capacity int,
  contact text,
  accessible boolean not null default false,
  source_name text not null,
  source_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shelters_location_idx on shelters using gist (location);

-- Nearest-shelter lookup used by the shelter finder once connected.
create or replace function nearest_shelters(lat float, lng float, radius_m int default 20000, lim int default 10)
returns table (
  id uuid,
  name_en text,
  name_bn text,
  type text,
  capacity int,
  contact text,
  accessible boolean,
  distance_m float
)
language sql stable as $$
  select s.id, s.name_en, s.name_bn, s.type, s.capacity, s.contact, s.accessible,
         st_distance(s.location, st_setsrid(st_makepoint(lng, lat), 4326)::geography) as distance_m
  from shelters s
  where s.active
    and st_dwithin(s.location, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_m)
  order by distance_m
  limit lim;
$$;

-- ---------------------------------------------------------------------------
-- Alerts (admin/coordinator entered; no official public API exists, see
-- architecture.md D4)
-- ---------------------------------------------------------------------------
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  hazard_slug text not null,
  title_en text not null,
  title_bn text not null,
  body_en text,
  body_bn text,
  severity smallint not null check (severity between 0 and 4),
  district_codes text[] not null default '{}',
  source_name text not null,
  source_url text,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists alerts_expires_idx on alerts (expires_at);

-- ---------------------------------------------------------------------------
-- Cached external data (earthquakes, weather). Populated by scheduled jobs
-- in a later phase; the Phase 2 UI fetches USGS/Open-Meteo directly instead.
-- ---------------------------------------------------------------------------
create table if not exists quake_cache (
  usgs_id text primary key,
  magnitude numeric not null,
  place text not null,
  location geography(Point, 4326) not null,
  occurred_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  source text not null default 'USGS'
);

create table if not exists weather_cache (
  district_code text references districts (code),
  temp_c numeric,
  rain_mm numeric,
  wind_kph numeric,
  fetched_at timestamptz not null default now(),
  source text not null default 'Open-Meteo',
  primary key (district_code, fetched_at)
);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shelters_set_updated_at on shelters;
create trigger shelters_set_updated_at
  before update on shelters
  for each row execute function set_updated_at();
