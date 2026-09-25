# Surokkha BD (সুরক্ষা)

Free, English-default web app (with full Bangla support) that helps people in Bangladesh prepare for, survive, and recover from natural disasters.

> Not an official warning system. Always follow BMD and DDM alerts.

**Status:** Phase 2 (live map, shelter finder, district/shelter datasets, Supabase schema). See [`docs/phases.md`](docs/phases.md).

## Stack
Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · next-intl · Supabase · Fontsource fonts

## Run locally (Windows, PowerShell)

```powershell
npm install
copy .env.example .env.local     # then fill in Supabase values (optional for Phase 0)
npm run dev                      # http://localhost:3000  (Bangla: /bn)
```

Checks used by CI:

```powershell
npm run lint
npm run typecheck
npm run build
```

## Project layout
```
docs/                 prd, architecture, design, rules, phases, memory
src/app/[locale]/     pages (English at /, Bangla at /bn)
src/components/       UI components
src/i18n/             next-intl routing and request config
src/lib/              helpers (supabase, store, hazards)
src/messages/         en.json (source) and bn.json
src/styles/           tokens.css (design tokens) and globals.css
src/content/hazards/   bilingual hazard content (14 hazards, JSON)
src/content/contacts.json  emergency numbers (bilingual, sourced, dated)
src/proxy.ts           locale routing (Next.js 16 "proxy")
public/sw.js            minimal offline service worker
public/manifest.webmanifest  PWA manifest
supabase/             migrations, seed, functions (later phases)
tests/                unit, e2e, a11y (later phases)
```

## Pages so far
- `/` and `/bn` — home
- `/hazards` and `/hazards/[slug]` — all 14 hazard guides (before / during / after, myths vs facts, cyclone signal table, sources)
- `/contacts` — emergency numbers with one-tap call
- `/plan` — local-first, printable family safety plan
- `/map` — shelters and the last 30 days of earthquakes (USGS), with a map/list toggle
- `/shelters` — Shelter Finder: use your location or pick a district, see the 10 nearest shelters/hospitals with distance and directions

## Supabase (Phase 2 schema, not yet connected to the UI)
`supabase/migrations/` has the full schema (districts, profiles, shelters, alerts, earthquake/weather caches, a `nearest_shelters()` PostGIS function) and Row Level Security for every table. `supabase/seed/` has matching seed SQL generated from `src/content/districts.json` and `src/content/shelters.json`. The map and shelter finder currently read the static JSON directly; a later phase will point them at Supabase instead. To try the schema now:

```powershell
# In the Supabase SQL editor, or via the Supabase CLI:
# 1. Run supabase/migrations/0001_init.sql
# 2. Run supabase/migrations/0002_rls.sql
# 3. Run supabase/seed/0001_seed_districts.sql
# 4. Run supabase/seed/0002_seed_shelters.sql
```

## Content and data review needed before launch
Hazard guide text and the emergency numbers were drafted with AI research and are **not yet verified against official BMD/DDM/FFWC publications** by a human. District coordinates are approximate, and the shelter list (18 entries) is a small hand-picked demo sample, not real DDM coverage. Each hazard page shows a draft notice until its `status` field is set to `"reviewed"` in `src/content/hazards/*.json`. See `docs/memory.md` for details. Do not present this content as authoritative until reviewed.

## Health check
`GET /api/health` returns app status and whether Supabase is reachable. It also works as a keep-alive ping.

## Before you code
Read `docs/memory.md`, `docs/rules.md`, and `docs/phases.md`.
