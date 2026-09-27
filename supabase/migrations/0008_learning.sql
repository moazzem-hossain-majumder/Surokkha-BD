-- Surokkha BD: Learning, insight, and remote access (Phase 5)

create table if not exists historical_events (
  id uuid primary key default gen_random_uuid(),
  hazard_slug text not null,
  name_en text not null,
  name_bn text not null,
  year int not null,
  deaths_min int,
  deaths_max int,
  affected bigint,
  damage_usd numeric,
  district_codes text[] not null default '{}',
  summary_en text not null,
  summary_bn text not null,
  source_name text not null,
  source_url text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists historical_events_hazard_idx on historical_events (hazard_slug);
create index if not exists historical_events_year_idx on historical_events (year);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  hazard_slug text not null,
  question_en text not null,
  question_bn text not null,
  options_en text[] not null,
  options_bn text[] not null,
  answer_index smallint not null check (answer_index >= 0),
  explanation_en text not null,
  explanation_bn text not null,
  created_at timestamptz not null default now(),
  check (array_length(options_en, 1) = array_length(options_bn, 1))
);

create index if not exists quiz_questions_hazard_idx on quiz_questions (hazard_slug);

create table if not exists ferry_schedules (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  from_place text not null,
  to_place text not null,
  departs text not null, -- free-text time(s), e.g. "6:00 AM, 2:00 PM"
  days text not null,    -- e.g. "Daily" or "Sat-Thu"
  contact text,
  source_name text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- A lightweight public "request help" board for ferry/boat travel questions
-- (delayed sailing, a route not listed, safety concerns) -- deliberately
-- simple: no anti-spam/rate-limiting infra yet, see memory.md.
create table if not exists ferry_help_requests (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  message text not null,
  contact_optional text,
  requester_id uuid references auth.users (id),
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ferry_help_requests_status_idx on ferry_help_requests (status);

drop trigger if exists ferry_help_requests_updated_at on ferry_help_requests;
create trigger ferry_help_requests_updated_at before update on ferry_help_requests
  for each row execute function set_updated_at();

drop trigger if exists ferry_schedules_updated_at on ferry_schedules;
create trigger ferry_schedules_updated_at before update on ferry_schedules
  for each row execute function set_updated_at();

drop trigger if exists ferry_help_requests_audit on ferry_help_requests;
create trigger ferry_help_requests_audit after insert or update on ferry_help_requests
  for each row execute function log_audit_event();
