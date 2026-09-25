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
- **Current task:** Phase 2 (map, shelters, districts) mostly complete. Next: connect a real Supabase project and run the migrations, then move to Phase 3 (auth, community reports, admin)
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
- [ ] Email provider: Resend or Brevo
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
