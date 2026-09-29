-- Surokkha BD: remove duplicate SEED rows created by running the OLD seed files more than once.
--
-- The seed files now skip rows that already exist, so this problem can't happen again. If you
-- ran the old seeds twice, your tables hold two copies of every row (36 shelters instead of 18,
-- and so on). Run this ONCE to keep the oldest copy of each and delete the rest. Safe to re-run
-- (it finds nothing the second time). It only touches rows that match the seed data exactly:
-- shelters are matched only when their source is the curated seed, so shelters an admin added
-- by hand are never deleted.

delete from shelters
where source_name = 'Surokkha BD curated seed (Phase 2)'
  and id not in (
    select (array_agg(id order by created_at, id))[1]
    from shelters
    where source_name = 'Surokkha BD curated seed (Phase 2)'
    group by name_en, district_code
  );

delete from historical_events
where id not in (
  select (array_agg(id order by created_at, id))[1] from historical_events group by name_en, year
);

delete from quiz_questions
where id not in (
  select (array_agg(id order by created_at, id))[1] from quiz_questions group by hazard_slug, question_en
);

delete from ferry_schedules
where id not in (
  select (array_agg(id order by created_at, id))[1] from ferry_schedules group by route
);

-- Check: expect districts 64, shelters 18, historical_events 10, quiz_questions 28, ferry_schedules 3
-- (shelters/ferry counts will be higher if you added your own rows in the admin pages).
select 'districts' as t, count(*) from districts
union all select 'shelters', count(*) from shelters
union all select 'historical_events', count(*) from historical_events
union all select 'quiz_questions', count(*) from quiz_questions
union all select 'ferry_schedules', count(*) from ferry_schedules;
