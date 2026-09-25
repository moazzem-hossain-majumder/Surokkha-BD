# Surokkha BD (সুরক্ষা)

Free, English-default web app (with full Bangla support) that helps people in Bangladesh prepare for, survive, and recover from natural disasters.

> Not an official warning system. Always follow BMD and DDM alerts.

**Status:** Phase 3 (auth, roles, admin dashboard, community reports). See [`docs/phases.md`](docs/phases.md). **Needs a real Supabase project to run** — see the Supabase section below.

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
- `/map` — shelters, the last 30 days of earthquakes (USGS), and verified community reports, with a map/list toggle
- `/shelters` — Shelter Finder: use your location or pick a district, see the 10 nearest shelters/hospitals with distance and directions
- `/report` — submit a community report (flooding, erosion, blocked road, etc.) with a map pin and an optional photo
- `/login`, `/signup`, `/account` — email/password or magic-link sign-in
- `/admin` — dashboard for coordinators and admins: alerts, shelters, report moderation, and (admin-only) an audit log

## Supabase — required from Phase 3 onward
This phase needs a real Supabase project. In the SQL editor, run every file in `supabase/migrations/` in order (0001 → 0005), then both files in `supabase/seed/`. Then fill in `.env.local` (copy `.env.example`) with your project's URL, anon key, and service role key.

**Deploying to Vercel:** add the same three variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in Vercel's Project Settings → Environment Variables. Without them, the build fails, because `/account` and `/admin/*` need Supabase reachable to build as dynamic routes.

**Test accounts:** sign up normally through `/signup` to get a `citizen` account. To test coordinator/admin features, sign up, then manually change that user's `role` in the `profiles` table via the Supabase Table Editor — there is deliberately no way to grant yourself a higher role through the app itself.

**Known gap:** `/map` and `/shelters` still read the static JSON from Phase 2, not the live `shelters` table. A shelter you add in `/admin/shelters` won't show up there yet; that's next.

See [`supabase/tests/manual_rls_checklist.md`](supabase/tests/manual_rls_checklist.md) for a step-by-step way to confirm each role can and can't do what it should.

## Content and data review needed before launch
Hazard guide text and the emergency numbers were drafted with AI research and are **not yet verified against official BMD/DDM/FFWC publications** by a human. District coordinates are approximate, and the shelter list (18 entries) is a small hand-picked demo sample, not real DDM coverage. Each hazard page shows a draft notice until its `status` field is set to `"reviewed"` in `src/content/hazards/*.json`. See `docs/memory.md` for details. Do not present this content as authoritative until reviewed.

## Health check
`GET /api/health` returns app status and whether Supabase is reachable. It also works as a keep-alive ping.

## Before you code
Read `docs/memory.md`, `docs/rules.md`, and `docs/phases.md`.
