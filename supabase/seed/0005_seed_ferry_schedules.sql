-- Surokkha BD: seed data for ferry_schedules (Phase 5)
--
-- IMPORTANT: exact launch/ferry departure times in Bangladesh change by
-- season, water level, and operator, and vary further around holidays
-- (Eid schedules, for example, run extra "special services" on top of the
-- normal timetable). We could not find a single authoritative, current,
-- machine-readable BIWTA timetable to seed here without risking stranding
-- a real traveler on invented departure times -- see docs/rules.md
-- ("never invent facts... phone numbers"). So these three rows only
-- record that the ROUTE exists and its typical pattern, explicitly marked
-- unverified, and the coordinator-facing admin page is meant to be the
-- real source of truth: a coordinator on the ground should confirm and
-- correct these (or add local routes) before this is used for anything
-- beyond a demo. TODO(source): replace with a confirmed BIWTA schedule
-- and a real source_url before a pilot launch.

insert into ferry_schedules (route, from_place, to_place, departs, days, contact, source_name)
values
  (
    'Dhaka (Sadarghat) - Barisal launch',
    'Sadarghat, Dhaka', 'Barisal River Port',
    'Typically evening departure (commonly cited around 8-9 PM) -- UNVERIFIED, confirm at the terminal or with BIWTA before travel',
    'Daily (subject to change; extra services added around Eid)',
    'BIWTA / terminal enquiry desk',
    'General public knowledge of BIWTA Sadarghat routes -- not independently verified, see note in this seed file'
  ),
  (
    'Dhaka (Sadarghat) - Bhola (Ilisha) launch',
    'Sadarghat, Dhaka', 'Ilisha Ghat, Bhola',
    'Typically one or more evening departures -- UNVERIFIED, confirm at the terminal or with BIWTA before travel',
    'Daily (subject to change; extra services added around Eid)',
    'BIWTA / terminal enquiry desk',
    'General public knowledge of BIWTA Sadarghat routes -- not independently verified, see note in this seed file'
  ),
  (
    'Paturia - Daulatdia ferry crossing',
    'Paturia Ghat, Manikganj', 'Daulatdia Ghat, Rajbari',
    'Frequent crossings through the day, roughly every 20-40 minutes depending on demand and river condition -- UNVERIFIED exact frequency',
    'Daily, both directions',
    'BIWTC / terminal enquiry desk',
    'General public knowledge of this long-standing national-highway ferry crossing -- not independently verified, see note in this seed file'
  );
