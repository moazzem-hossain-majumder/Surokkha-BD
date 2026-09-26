-- Surokkha BD: ReliefLink and Volunteer Hub schema (Phase 4)

-- ---------------------------------------------------------------------------
-- ReliefLink
-- ---------------------------------------------------------------------------
create table if not exists relief_needs (
  id uuid primary key default gen_random_uuid(),
  district_code text not null references districts (code),
  item text not null,
  unit text not null,
  qty_needed numeric not null check (qty_needed > 0),
  note text,
  deadline timestamptz,
  status text not null default 'open' check (status in ('open', 'fulfilled', 'closed')),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists relief_needs_district_idx on relief_needs (district_code);
create index if not exists relief_needs_status_idx on relief_needs (status);

create table if not exists pledges (
  id uuid primary key default gen_random_uuid(),
  need_id uuid not null references relief_needs (id) on delete cascade,
  donor_id uuid not null references auth.users (id),
  qty numeric not null check (qty > 0),
  handover_method text not null check (handover_method in ('drop_off', 'pickup', 'courier', 'other')),
  note text,
  status text not null default 'pledged' check (status in ('pledged', 'in_transit', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pledges_need_idx on pledges (need_id);
create index if not exists pledges_donor_idx on pledges (donor_id);

-- Public transparency view: needed / pledged / delivered per need, no donor identities.
create or replace view relief_needs_public as
select
  n.id, n.district_code, n.item, n.unit, n.qty_needed, n.note, n.deadline, n.status, n.created_at,
  coalesce(sum(p.qty) filter (where p.status in ('pledged', 'in_transit', 'delivered')), 0) as qty_pledged,
  coalesce(sum(p.qty) filter (where p.status = 'delivered'), 0) as qty_delivered
from relief_needs n
left join pledges p on p.need_id = n.id
group by n.id;

-- Public activity log for a need's transparency view (F8.4): what happened and
-- when, with no donor identity attached.
create or replace view pledges_activity_public as
select id, need_id, qty, handover_method, status, created_at, updated_at
from pledges;

-- ---------------------------------------------------------------------------
-- Volunteer Hub
-- ---------------------------------------------------------------------------
create table if not exists volunteers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  skills text[] not null default '{}',
  district_code text references districts (code),
  availability text not null default 'weekends' check (availability in ('weekdays', 'weekends', 'anytime', 'on_call')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists volunteer_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  required_skills text[] not null default '{}',
  slots int not null check (slots > 0),
  location text not null,
  district_code text not null references districts (code),
  status text not null default 'open' check (status in ('open', 'filled', 'closed')),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists volunteer_tasks_district_idx on volunteer_tasks (district_code);
create index if not exists volunteer_tasks_status_idx on volunteer_tasks (status);

create table if not exists task_applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references volunteer_tasks (id) on delete cascade,
  volunteer_id uuid not null references volunteers (user_id) on delete cascade,
  status text not null default 'applied' check (status in ('applied', 'accepted', 'declined', 'withdrawn')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_id, volunteer_id)
);

create index if not exists task_applications_task_idx on task_applications (task_id);
create index if not exists task_applications_volunteer_idx on task_applications (volunteer_id);

-- Public view of open tasks with a live accepted-slots count (no applicant identities).
create or replace view volunteer_tasks_public as
select
  t.id, t.title, t.description, t.required_skills, t.slots, t.location, t.district_code, t.status, t.created_at,
  coalesce(count(a.id) filter (where a.status = 'accepted'), 0) as slots_filled
from volunteer_tasks t
left join task_applications a on a.task_id = t.id
group by t.id;

drop trigger if exists relief_needs_audit on relief_needs;
create trigger relief_needs_audit after insert or update on relief_needs
  for each row execute function log_audit_event();

drop trigger if exists pledges_audit on pledges;
create trigger pledges_audit after insert or update on pledges
  for each row execute function log_audit_event();

drop trigger if exists volunteer_tasks_audit on volunteer_tasks;
create trigger volunteer_tasks_audit after insert or update on volunteer_tasks
  for each row execute function log_audit_event();

drop trigger if exists task_applications_audit on task_applications;
create trigger task_applications_audit after insert or update on task_applications
  for each row execute function log_audit_event();

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists relief_needs_updated_at on relief_needs;
create trigger relief_needs_updated_at before update on relief_needs
  for each row execute function set_updated_at();

drop trigger if exists pledges_updated_at on pledges;
create trigger pledges_updated_at before update on pledges
  for each row execute function set_updated_at();

drop trigger if exists volunteers_updated_at on volunteers;
create trigger volunteers_updated_at before update on volunteers
  for each row execute function set_updated_at();

drop trigger if exists volunteer_tasks_updated_at on volunteer_tasks;
create trigger volunteer_tasks_updated_at before update on volunteer_tasks
  for each row execute function set_updated_at();

drop trigger if exists task_applications_updated_at on task_applications;
create trigger task_applications_updated_at before update on task_applications
  for each row execute function set_updated_at();
