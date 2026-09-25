# Phases: Surokkha BD

Track progress by ticking boxes. Do phases in order. Each phase ends with a demoable result and a `memory.md` update.

Legend: **[P0]** MVP essential. **[P1]** should have. **[P2]** later.

---

## Phase 0: Setup and foundations

**Goal:** A running, deployed empty shell with the design system skeleton.

**Windows setup (you do these):**
- [x] Install Node.js LTS, Git, VS Code
- [ ] Create GitHub, Supabase, and Vercel accounts
- [x] Create the GitHub repo (`Surokkha-BD`), add the six docs into `/docs`

**Tasks:**
- [x] P0-1 Scaffold Next.js (TypeScript, Tailwind, App Router, ESLint)
- [x] P0-2 Configure `next-intl` with English as default (no prefix) and Bangla under `/bn`
- [x] P0-3 Add fonts (Latin first, plus Bengali) with subsetting
- [x] P0-3b Build the language switch (EN | বাং), remembered choice, and the dismissible Bangla prompt
- [x] P0-4 Create `tokens.css` with all tokens from `design.md`, including light/dark and hazard palettes
- [x] P0-5 Theme switch (light / dark / system) with no flash on load
- [x] P0-6 Supabase client helpers and `.env.example` (add your real keys in `.env.local`)
- [x] P0-7 CI: lint, typecheck, build on every PR
- [ ] P0-8 Deploy to Vercel, get a preview URL

**Done when:** Deployed page loads in both languages and both themes.

---

## Phase 1: Knowledge core (offline-ready)

**Goal:** A useful product even with no backend: guides, contacts, and safety plan.

- [x] P1-1 Build UI primitives (Button, Card, Badge, Tabs, Accordion, Toast, Skeleton, Dialog)
- [x] P1-2 App shell: header, bottom nav (mobile), footer, disclaimer
- [x] P1-3 Home page with hero, quick actions, hazard grid (alert banner uses placeholder data)
- [x] P1-4 Hazard page template (what, where and when, before/during/after, myths vs facts, signals, sources)
- [x] P1-5 Write content for the first 5 hazards: cyclone, riverine flood, flash flood, lightning, earthquake (en, then bn)
- [x] P1-6 Write content for the remaining 9 hazards (all 14 hazards drafted; flagged for human/BMD-DDM source review, see memory.md)
- [x] P1-7 Emergency contacts page with one-tap call and `last_verified`
- [x] P1-8 My Safety Plan questionnaire, generator, and printable output
- [x] P1-9 Read-aloud button on hazard pages
- [x] P1-10 PWA: manifest, service worker, offline caching for content

**Done when:** After one visit, guides, contacts, and the safety plan work in airplane mode.

---

## Phase 2: Map, data, and shelters

**Goal:** Location-aware safety.

- [x] P2-1 Database schema and RLS SQL written (supabase/migrations). Not yet run against a real project, and the app does not query it yet (see note in memory.md)
- [x] P2-2 Seed data written: all 64 districts (supabase/seed + src/content/districts.json) and a curated sample of 18 shelters/hospitals (supabase/seed + src/content/shelters.json)
- [x] P2-3 Leaflet map component (dynamic import) with light and dark tile styling
- [x] P2-4 USGS earthquake sync job plus map layer
- [ ] P2-5 Open-Meteo rainfall and weather sync plus layer (deferred to keep Phase 2 scoped; earthquakes and shelters were prioritized)
- [ ] P2-6 Alerts: model, admin-entered alerts, severity badges, expiry logic (schema exists in migrations; admin UI and home banner wiring deferred to Phase 3, alongside auth)
- [ ] P2-7 Home risk banner reads real alerts (depends on P2-6 and auth; deferred)
- [x] P2-8 Shelter finder: list, map, nearest to me, district fallback, directions link
- [x] P2-9 Freshness labels added on the map (shelter source note, earthquake fetch time/error state)
- [ ] P2-10 Overpass import script for OSM shelters and hospitals (deferred; current shelter list is a small hand-curated seed, see memory.md)

**Done when:** A user can find the nearest shelter and see current alerts with sources and freshness.

---

## Phase 3: Community and admin

**Goal:** Trusted two-way reporting.

- [x] P3-1 Auth (sign up, log in, magic link), profiles, roles
- [x] P3-2 Admin dashboard shell with role guard
- [x] P3-3 Admin: create, edit, and expire alerts
- [x] P3-4 Admin: manage shelters
- [x] P3-5 Report form (type, pin, photo, description) with client-side photo compression
- [x] P3-6 Report intake: validation, rate limit, EXIF stripping, IP hashing (built as a Next.js Route Handler using the service-role key, not a separate Supabase Edge Function — same security properties, simpler to deploy since it ships with the Next app)
- [x] P3-7 Moderation queue (verify, reject, resolve)
- [x] P3-8 Verified reports appear on map and list
- [x] P3-9 Offline report queue with background sync
- [x] P3-10 RLS test suite for all roles
- [x] P3-11 Audit log

**Done when:** A report goes from anonymous submission to a verified marker on the map, and RLS tests pass.

---

## Phase 4: Response (ReliefLink and Volunteer Hub)

**Goal:** Coordination.

- [ ] P4-1 Needs model and coordinator create/edit UI
- [ ] P4-2 Public needs board with progress bars (needed / pledged / delivered)
- [ ] P4-3 Pledge flow with status transitions and activity log
- [ ] P4-4 Donor and coordinator views
- [ ] P4-5 Volunteer profile with skills and availability
- [ ] P4-6 Task creation and public task list with filters
- [ ] P4-7 Application and accept/decline flow
- [ ] P4-8 Email notifications for key events (free tier)
- [ ] P4-9 Basic coordinator stats

**Done when:** A coordinator posts a need and a task, a donor pledges, a volunteer applies, and every status change is visible and logged.

---

## Phase 5: Learning, insight, and remote access

**Goal:** Reach and depth.

- [ ] P5-1 Historical events dataset (verified, sourced) and import
- [ ] P5-2 Data Explorer: timeline, hazard comparison, district view, CSV download
- [ ] P5-3 Chart accessibility (text summaries, data tables)
- [ ] P5-4 Quiz engine and questions for all hazards
- [ ] P5-5 Two mini-games (for example lightning-safe-or-not, go-bag packing)
- [ ] P5-6 Badges and local progress
- [ ] P5-7 Teacher mode with printable worksheets
- [ ] P5-8 Lite mode (text-first pages, no maps by default) and slow-connection suggestion
- [ ] P5-9 Ferry and boat schedule board and "request help" form

**Done when:** Lite mode loads under 100 KB and all quizzes are playable in both languages.

---

## Phase 6: Polish, proof, and pitch

**Goal:** Ship-quality and NGO-ready.

- [ ] P6-1 Full accessibility audit (axe plus NVDA plus keyboard)
- [ ] P6-2 Performance pass to hit Lighthouse 90+ on mobile
- [ ] P6-3 Test on a real low-end Android phone and throttled network
- [ ] P6-4 Bangla content review by a fluent reviewer, and a safety-content review by a subject expert
- [ ] P6-5 Security review: headers, CSP, rate limits, RLS
- [ ] P6-6 Privacy policy, terms, and data deletion
- [ ] P6-7 SEO, `hreflang`, and social share images (en and bn)
- [ ] P6-8 README with architecture diagram, screenshots, and roadmap
- [ ] P6-9 Demo video (2 to 3 minutes)
- [ ] P6-10 Case study page for the portfolio
- [ ] P6-11 NGO pitch deck: problem, solution, pilot plan, partnership asks
- [ ] P6-12 Keep-alive cron and pre-demo checklist

**Done when:** A stranger can use the site, the case study reads well, and the pitch deck is ready.

---

## Phase 7 (P2, future)

- [ ] Web Push and email subscriptions by district and hazard
- [ ] Real SMS gateway integration
- [ ] Voice/IVR alerts
- [ ] Offline map tiles for chosen districts
- [ ] Multi-organization accounts
- [ ] Integration with official data (subject to agreements)

---

## Working cadence

1. Pick the next unchecked task in the current phase.
2. Read `rules.md` and the relevant section of the docs.
3. Build, test, and check against the Definition of Done in `rules.md`.
4. Commit, tick the box, update `memory.md`.
5. At the end of each phase, run a short demo and a retro note in `memory.md`.

## Suggested pacing (solo, part-time)

| Phase | Rough effort |
|---|---|
| 0 | 2 to 3 days |
| 1 | 2 to 3 weeks |
| 2 | 2 weeks |
| 3 | 2 weeks |
| 4 | 2 to 3 weeks |
| 5 | 2 weeks |
| 6 | 1 to 2 weeks |

These are estimates. Adjust to your schedule. If time is short, ship after Phase 3 or 4 and mark the rest as roadmap.
