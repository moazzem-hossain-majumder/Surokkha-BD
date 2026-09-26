# Memory: Surokkha BD

> Living project memory. **Read this first every session. Update it last every session.**
> Keep entries short and factual. Newest session log entries go at the top of section 8.

## 1. Project snapshot

- **Name:** Surokkha BD (সুরক্ষা), working name, not final
- **What:** Free, English-default, low-bandwidth web app with full Bangla support (one-tap switch) for preparing for, surviving, and recovering from all natural disasters in Bangladesh, with relief and volunteer coordination
- **Purpose:** Portfolio piece and pitch to an NGO. Real usefulness to people in Bangladesh is the goal
- **Owner:** Moazzem Hossain Majumder
- **Repo:** https://github.com/moazzem-hossain-majumder/Surokkha-BD
- **Dev environment:** Windows, VS Code, Node LTS, Git
- **Budget:** $0 (free tiers only)
- **Current phase:** Phase 0, Setup
- **Current task:** Phase 4 (ReliefLink, Volunteer Hub) built and pending your live verification. Also: run through supabase/tests/manual_rls_checklist.md for Phase 3 (still outstanding), rotate the service_role key (it was pasted in chat), then do the combined Phase 1-4 end-to-end test.
- **Last updated:** _(date)_

## 2. Doc map

| File | Purpose |
|---|---|
| `prd.md` | What we build and why. Features and requirements |
| `architecture.md` | Stack, data model, security, offline, integrations |
| `design.md` | Visual system: palette (light/dark, per-hazard), type, components, motion |
| `rules.md` | Rules for code, content, accessibility, security, and AI assistants |
| `phases.md` | Ordered roadmap with checkbox tasks |
| `memory.md` | This file: decisions, state, and open questions |

## 3. Locked decisions

| # | Decision | Date |
|---|---|---|
| D1 | Next.js (App Router, TypeScript) plus Tailwind | |
| D2 | Supabase (Postgres, PostGIS, Auth, Storage, RLS) | |
| D3 | Leaflet plus OpenStreetMap for maps | |
| D4 | `next-intl`, **English default** (no URL prefix), Bangla switchable under `/bn` | Updated after project owner decision |
| D5 | No payment processing. Pledges are in-kind only | |
| D6 | Official alerts are admin-entered with source links (no public BMD/FFWC API) | |
| D7 | SMS is mock/sandbox only in v1 | |
| D8 | Light, dark, and system themes. Per-hazard accent palette | |
| D9 | Safety plan is local-first (works offline) | |
| D10 | Not an official warning system. Disclaimer always visible | |

## 4. Open decisions

- [ ] Final product name and domain
- [ ] Logo direction: shield-and-wave or heron
- [ ] Kids' Zone mascot: heron or river dolphin
- [x] ~~Bangla-first vs English~~ Decided: English default, Bangla switchable at launch
- [ ] Translation ownership for user-generated content (reports, needs, tasks)
- [ ] Which NGO and which pilot region (coast, haor, hill)
- [ ] Who reviews Bangla copy and safety content
- [x] ~~Email provider: Resend or Brevo~~ Decided: Resend (HTTP API called directly with `fetch`, no SDK added, per rules.md's "ask before adding a dependency")
- [ ] Charts: Recharts or Chart.js
- [ ] Hosting: Vercel or Cloudflare Pages

## 5. Open content questions (nothing here may be published unverified)

Use this list for every `TODO(source)` in the code or content.

| Item | Needed source | Status |
|---|---|---|
| Emergency numbers list (999, fire, coast guard, health hotline, district control rooms) | Official government sources | Not started |
| Cyclone warning signals 1 to 10 meanings | BMD / DDM | Not started |
| Flood warning levels and thresholds | FFWC | Not started |
| Historical events data (deaths, affected, damage) | BBS, DDM, EM-DAT, academic sources | Not started |
| Shelter list and capacities | DDM / local partners / OSM | Not started |
| Seasons per hazard | BMD, DDM | Not started |
| Ferry and boat schedules | Local operators / BIWTA | Not started |

## 6. Known constraints and gotchas

- Supabase free projects pause when inactive. Keep-alive cron and wake before demos.
- Open-Meteo free tier is for non-commercial use. Attribute it. Re-check terms if an NGO deployment counts as commercial.
- Overpass API has usage limits. Run imports sparingly.
- USGS has no key but be polite with request frequency.
- Bangla rendering: no letter-spacing, line-height at least 1.6, test on a real low-end Android.
- Free-tier limits and library versions change. Re-check at the start of each phase.
- Windows: use PowerShell or Git Bash consistently. Watch line endings (set `core.autocrlf` appropriately and add `.gitattributes`).

## 7. Conventions cheat-sheet

- Branches: `feat/`, `fix/`, `docs/`, `chore/`. Commits: conventional
- Tokens only, no raw hex in components
- Every string in `messages/en.json` (source) and `messages/bn.json`. English is default
- Every table has RLS
- Every data view shows source and last-updated
- Severity and hazards: icon plus label plus color, never color alone

## 8. Session log

Template (copy for each session):

```
### YYYY-MM-DD, session N
- Worked on: (task IDs)
- Done:
- Decisions made:
- Problems / blockers:
- Next steps:
- Files touched:
```

### Session 4.0 (Phase 4 build)
- Done: `relief_needs`, `pledges`, `volunteers`, `volunteer_tasks`, `task_applications` tables (migration 0006) plus matching RLS (migration 0007), following the same "coordinator write, public read what's meant to be public" pattern as earlier phases; three public views with no donor/volunteer identity in them (`relief_needs_public`, `pledges_activity_public`, `volunteer_tasks_public`) granted directly to `anon`/`authenticated` so aggregate progress and open tasks are visible without exposing who pledged or applied; **ReliefLink**: `/relief` public needs board with progress bars (needed/pledged/delivered), `/relief/[id]` detail page with a pledge form (any signed-in user, no separate "donor" role gate) and a de-identified public activity log, `/admin/relief` for coordinators to post needs and move each pledge through pledged -> in_transit -> delivered (or cancel), mark a need fulfilled/closed; **Volunteer Hub**: `/volunteer` with a self-service profile form (skills, district, availability -- upsert into `volunteers`, no admin role change needed) and an open-task list with an apply flow, `/admin/volunteers` for coordinators to post tasks (title, description, required skills, slots, location, district) and accept/decline applications, auto-marking a task "filled" once accepted applications reach its slot count; added coordinator stats to the existing `/admin` overview (needs fully pledged %, volunteer task fill %) for P4-9 instead of a separate stats page; email notifications (P4-8) via a small Resend HTTP wrapper (`src/lib/email.ts`, no SDK dependency) -- pledge created notifies the need's coordinator, pledge status change notifies the donor, application submitted notifies the task's coordinator, accept/decline notifies the volunteer; every send is wrapped so a failed or unconfigured `RESEND_API_KEY` never blocks the underlying action, only logs server-side; added `getUserEmail()` to `src/lib/supabase/admin.ts` (service-role lookup against `auth.users`, since a normal RLS-scoped session can't read other users' emails); added Relief/Volunteer links to the public header nav and the admin nav; all new strings added to both `en.json` and `bn.json`.
- Bug found and fixed while reviewing existing code (not part of Phase 4's scope, but blocking): `src/lib/env.ts` and `src/lib/supabase/client.ts` only read `NEXT_PUBLIC_SUPABASE_ANON_KEY`, but your actual `.env.local` has `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase's newer key name) with no `NEXT_PUBLIC_SUPABASE_ANON_KEY` at all -- meaning `getSupabaseEnv()` was returning `null` and Supabase calls were likely silently failing in your local dev the whole time. Fixed by accepting either env var name. **You should double check whether this explains any of the "not fully tested" gaps from Phase 3** -- if `/account`, `/admin/*`, sign-up, or the report flow seemed broken or inconsistent locally, this may be why. No RLS or schema change involved, just the client-side env lookup.
- Design decision: pledging does not require a "donor" role and applying to a task does not require role changes beyond the existing `volunteers` table -- any signed-in user can pledge, and any signed-in user with a `volunteers` row can apply. This matches architecture.md's RLS table ("Authenticated donor" / "Owner") without adding role-gating UI that the PRD doesn't ask for.
- Verified in build environment: lint, typecheck, and a production build with real-shaped (fake) Supabase + Resend env vars. All 72 pages build; `/relief`, `/relief/[id]`, `/volunteer`, `/admin/relief`, `/admin/volunteers` all render dynamic (ƒ) as expected.
- **I have no network access to Supabase or Resend from my side.** Nothing that talks to a live database or sends a real email -- posting a need, pledging, moving a pledge through its lifecycle, the volunteer profile upsert, applying to a task, accepting/declining, and every email notification -- has been tested end-to-end. Phase 3's live-verification gap (see Session 3.0) is also still open. You are the first real test of all of it, for both phases together.
- Known gap: the public task list on `/volunteer` has no skill/district filter yet (P4-6 note). With few tasks in a demo this doesn't matter; worth adding if the task list grows.
- Known gap: `relief_needs` and `volunteer_tasks` don't yet have bilingual (`_en`/`_bn`) fields as architecture.md section on translation suggests for coordinator-authored content -- everything coordinators type is stored and shown as-is, in whichever language they used. Fine for a solo/small-team pilot; revisit if this becomes multi-lingual coordinator input.
- Next steps: rotate the Supabase service_role key (still outstanding from Phase 3), run `supabase/tests/manual_rls_checklist.md`, then work through the combined Phase 1-4 test checklist below. Sign up for Resend, verify the `RESEND_API_KEY` env var in both `.env.local` and Vercel, and note that until a sending domain is verified in Resend, mail only sends from `onboarding@resend.dev` to your own Resend account email -- fine for testing, not for a real pilot.
- Files touched: `supabase/migrations/0006_relief_and_volunteers.sql`, `supabase/migrations/0007_relief_and_volunteers_rls.sql`, `src/lib/relief.ts`, `src/lib/volunteers.ts`, `src/lib/email.ts`, `src/lib/env.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/admin.ts`, `src/app/[locale]/relief/**`, `src/app/[locale]/volunteer/**`, `src/app/[locale]/admin/relief/**`, `src/app/[locale]/admin/volunteers/**`, `src/app/[locale]/admin/layout.tsx`, `src/app/[locale]/admin/page.tsx`, `src/components/Header.tsx`, `src/messages/en.json`, `src/messages/bn.json`, `.env.example`

### Session 3.0 (Phase 3 build)
- Done: Supabase auth (email+password and magic link) with SSR session refresh merged into `src/proxy.ts`; auto-profile creation trigger (`handle_new_user`) so every sign-up gets a `profiles` row with role `citizen`; `requireRole()` guard protecting `/account` and every `/admin/*` route; admin dashboard shell with sidebar nav, gated by role (coordinator/admin; `/admin/audit` is admin-only); Alerts CRUD (create + expire, RLS-enforced via the signed-in user's own session, no service role involved); Shelters CRUD (create + activate/deactivate, via an `insert_shelter_point()` RPC so the form can submit plain lat/lng instead of building PostGIS literals); public Community Report form at `/report` with a click-to-place map pin, "use my location", a photo field that's resized and stripped of EXIF/GPS via canvas re-encoding (no extra dependency), a honeypot field, and a minimum-time-to-submit check; `/api/reports` intake route (validates with the same Zod schema as the client, rate-limits by salted IP hash — 3 per hour, uploads the photo to a private Storage bucket, inserts the report as `pending`); Reports moderation queue at `/admin/reports` (verify/reject/resolve, photo shown via a short-lived signed URL generated server-side); verified reports now show as a layer on `/map` (fetched client-side straight from the `reports_public` view via the anon key — RLS allows this with no API route needed) and in the list view; an offline retry queue (`src/lib/offlineQueue.ts`, localStorage-based) with a banner that retries automatically when the browser regains connectivity — a simpler, more broadly-compatible substitute for the Background Sync API, which iOS Safari doesn't support; an audit log (`audit_log` table) populated automatically by security-definer triggers on every alert/shelter/report insert or update, visible to admins at `/admin/audit`; new migrations 0003–0005 (reports, audit log, `reports_public` and `shelters_public` views, the shelter-insert RPC) plus matching RLS policies; a manual RLS verification checklist (`supabase/tests/manual_rls_checklist.md`) in place of an automated suite
- Verified in build environment: lint, typecheck, and a production build with **real-shaped** (but fake) Supabase env vars — this matters because without any Supabase env vars, `/account` and `/admin/*` fail to build at all (they need `cookies()` to be reachable so Next.js can mark them dynamic instead of attempting a static prerender). Confirmed all 64 pages build and that `/account` and every `/admin/*` route correctly render as dynamic (ƒ), not static. Smoke-tested that unauthenticated visitors are redirected from `/account` and `/admin/*` to `/login`, and that `/api/reports` correctly rejects an empty body and a too-fast (bot-like) submission.
- **I have no network access to Supabase from my side, so nothing that actually talks to a live database — sign-up, login, submitting a real report, admin CRUD, the moderation queue, RLS behavior itself — has been tested end-to-end. You are the first real test of all of it.** Work through `supabase/tests/manual_rls_checklist.md` before trusting this phase.
- SECURITY: the Supabase service_role key was pasted in this chat. Rotate it (Supabase → Settings → API → service_role → Reset) once Phase 3 is confirmed working, then update `.env.local` and Vercel's env vars with the new value.
- IMPORTANT for deployment: Vercel needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` set in its own Project Settings → Environment Variables, the same as `.env.local`. Without them, the Vercel build will fail the same way the sandbox build did before I added placeholder values.
- Design decision: admin mutations (alerts, shelters, report moderation) run through the signed-in user's own Supabase session, so Row Level Security is what actually enforces "only coordinators/admins can do this" — not application code. The service-role key is used narrowly, only for the anonymous report-intake route (which needs to check rate limits across all reports, something a normal user's RLS-scoped session can't do) and for generating signed photo URLs for moderators. This matches the security model in architecture.md rather than routing everything through the service role, which would have defeated the point of writing RLS at all.
- Known gap: the public `/map` and `/shelters` pages still read the static JSON seeded in Phase 2, not the live `shelters` table, so a shelter added through `/admin/shelters` won't appear there yet. Wiring the public pages to `shelters_public` (the view already exists) is a good first task for Phase 4.
- Next steps: verify Phase 3 end-to-end using the checklist, rotate the service key, switch the public map/shelter pages to read from Supabase, then start Phase 4 (ReliefLink needs board, Volunteer Hub)

### Session 2.0 (Phase 2 build)
- Done: 64-district dataset (src/content/districts.json, approximate centroid coordinates, flagged for verification against BBS/LGED); curated 18-shelter/hospital seed (src/content/shelters.json, explicitly a demo sample, not exhaustive); geo helper (haversine + nearest-N, src/lib/geo.ts); `/api/quakes` route proxying the USGS feed for a Bangladesh bounding box (30 days, magnitude ≥2.5, 10-minute cache, fails gracefully to an empty list); `/map` page with a Leaflet map (react-leaflet 5, CARTO light/dark tiles matched to the active theme), shelter/earthquake layer toggles, and a map/list view switch; `/shelters` page (Shelter Finder) with "use my location" geolocation, a district fallback, nearest-10 sorting, distance shown, and an OSM directions link; Supabase migrations written (districts, profiles, shelters, alerts, quake_cache, weather_cache, nearest_shelters() PostGIS function, and RLS policies for every table) plus matching seed SQL generated from the JSON content — **written but not yet run against a real project, and the app still reads from static JSON, not the database**
- Verified in build environment: lint, typecheck, production build (44 static/dynamic pages), smoke-tested `/map`, `/shelters`, and `/api/quakes` on both locales
- IMPORTANT: `/api/quakes` could not reach earthquake.usgs.gov in the sandboxed build environment (network allowlist), so it was only verified to fail gracefully there. **You must confirm on your own machine that it returns real earthquake data.**
- IMPORTANT: district coordinates are approximate town/HQ centroids I assembled from general geographic knowledge, not an authoritative dataset. Good enough for map pins and "nearest district" style features at this stage, but re-verify before treating them as precise (P6-4 already covers a broader content review; add this to that pass).
- Shelter data is a small hand-picked sample (18 entries) meant to prove the UI works, not real DDM shelter coverage. P2-10 (OSM import) and a real DDM dataset are still needed before this is trustworthy for actual disaster response.
- Deferred from the original Phase 2 plan to keep this delivery scoped: Open-Meteo weather sync/layer (P2-5), the alerts model's admin UI and Home risk banner wiring (P2-6/P2-7, which need auth from Phase 3 anyway), and the Overpass OSM import (P2-10). Supabase RLS was written but has no automated test suite yet (that's P3-10).
- Workflow note: switched to a clone-based update workflow (keep the folder and `.git`, replace files, commit, push) instead of delete-and-reinit, to preserve commit history on GitHub.
- Next steps: create the real Supabase project, run `supabase/migrations` then `supabase/seed`, wire `.env.local`, then start Phase 3 (auth, roles, community reports, admin dashboard, and switching shelters/alerts over to the database)

### Session 1.0 (Phase 1 build)
- Done: UI primitives (Button, Card, Badge, Segmented, Accordion); hazard content system (14 hazards, bilingual JSON in src/content/hazards, typed via src/lib/hazards.ts); hazard index and detail pages with before/during/after, myths vs facts, cyclone signal table, sources, read-aloud; emergency contacts page (999, 16163, 16263, 333, 109) with one-tap call; My Safety Plan (local-first, printable); header nav; minimal PWA (manifest, icons placeholder, service worker with stale-while-revalidate for hazard/contacts/plan pages)
- Verified in build environment: lint, typecheck, production build (39 static pages incl. all 14 hazards x 2 locales), and smoke-tested all new routes plus manifest/sw/icon requests
- IMPORTANT: hazard guide content (season, thresholds, steps, myths) and the cyclone signal table were drafted by AI using web search (BMD/Daily Star/DDM-adjacent sources) but are NOT yet reviewed by a human or matched line-by-line against BMD/DDM/CPP publications. Treat as draft. Each hazard page shows "This guide is a draft..." until status is changed to reviewed in the JSON. This is P6-4 in phases.md.
- Emergency numbers (999, 16163, 16263, 333, 109) sourced from public references (see contacts.json `source` field per entry) and marked with a "last verified" date of this session. Re-verify before any real launch.
- PWA icons are solid-color placeholders (brand green square), not real artwork. Replace before portfolio/pitch use.
- Note: Next.js 16 uses `src/proxy.ts` instead of `middleware.ts` (already noted in session 0.2)
- Next steps: Phase 2 (Supabase schema + RLS, Leaflet map, USGS/Open-Meteo sync, shelter finder)

### Session 0.2 (Phase 0 scaffold)
- Done: Next.js 16 + Tailwind 4 + next-intl scaffold (English default, Bangla under /bn), design tokens (light/dark, 14 hazard palettes, severity), theme toggle without flash, language switch, dismissible Bangla prompt, Supabase client helpers, /api/health, CI workflow, docs folder
- Verified in build environment: lint, typecheck, production build, routes `/`, `/bn`, `/api/health`
- Note: Next.js 16 uses `src/proxy.ts` instead of `middleware.ts`
- Note: fonts are self-hosted via Fontsource (no Google Fonts request at build)
- Bangla strings were drafted by AI: need a fluent reviewer (Phase 6, P6-4)
- Next steps: run locally, push to GitHub, connect Vercel (P0-8), then Phase 1

### Session 0.1 (language decision)
- Decided: English is the default language, Bangla is switchable at any time (EN | বাং control, remembered choice, dismissible Bangla prompt, no auto-redirect)
- Updated: prd, architecture, design, rules, phases, memory

### Session 0 (planning)
- Worked on: Ideation and documentation
- Done: Chose the concept (all-hazard Bangladesh platform combining hazard guide, map, shelters, safety plan, ReliefLink, Volunteer Hub, CharConnect, Data Explorer, Kids' Zone). Wrote prd, architecture, design, rules, phases, memory
- Decisions made: See section 3
- Next steps: Phase 0 setup (install tools, create accounts, scaffold Next.js)

## 9. Glossary

| Term | Meaning |
|---|---|
| BMD | Bangladesh Meteorological Department |
| FFWC | Flood Forecasting and Warning Centre |
| DDM | Department of Disaster Management |
| BBS | Bangladesh Bureau of Statistics |
| BIWTA | Bangladesh Inland Water Transport Authority |
| Char | River island or sandbar land |
| Haor | Wetland basin in the northeast |
| Upazila | Sub-district administrative unit |
| RLS | Row Level Security (Postgres) |
| PWA | Progressive Web App |
| Lite mode | Text-first, low-bandwidth version of the site |

## 10. Prompt to start each AI session

> Read `docs/memory.md`, `docs/rules.md`, and `docs/phases.md`. Tell me the current phase and task, summarize the relevant part of the other docs in 5 lines or fewer, then propose a short plan for the task. Do not start building until I approve. When finished, update `memory.md`.
