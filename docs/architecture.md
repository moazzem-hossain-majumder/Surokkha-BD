# Architecture: Surokkha BD

## 1. Principles

1. **Static first.** Anything that does not change often (guides, quizzes, contacts) is static content that is cached and works offline.
2. **Data with provenance.** Every alert, statistic, and shelter stores a source and a timestamp.
3. **Security in the database.** Row Level Security (RLS) is the real access control, not the UI.
4. **Progressive enhancement.** Lite mode works without heavy JS or maps.
5. **$0 by design.** Every dependency has a free tier that fits a portfolio and pilot.

## 2. System overview

```
                      ┌────────────────────────────────────────┐
                      │        Browser / Installed PWA         │
                      │  Next.js (App Router) + Tailwind       │
                      │  next-intl (en / bn)    ·  Service Worker│
                      └──────┬───────────────────────┬─────────┘
                             │                       │
          static / cached    │                       │  dynamic (auth, reports,
      (guides, quizzes,      │                       │   needs, tasks, alerts)
       contacts, plan)       ▼                       ▼
                    ┌──────────────────┐   ┌──────────────────────────┐
                    │  Vercel CDN      │   │  Supabase                │
                    │  (static + ISR)  │   │  Postgres + PostGIS      │
                    └──────────────────┘   │  Auth · Storage · RLS    │
                                           │  Edge Functions          │
                                           └───────────▲──────────────┘
                                                       │ writes cached data
                             ┌─────────────────────────┴─────────────┐
                             │ Scheduled jobs (Vercel Cron /         │
                             │ Supabase pg_cron + Edge Functions)    │
                             │  · USGS earthquakes                   │
                             │  · Open-Meteo rainfall/weather        │
                             │  · Overpass (OSM shelters, weekly)    │
                             │  · Keep-alive ping                    │
                             └───────────────────────────────────────┘
```

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript | SSR/ISR, routing, PWA-friendly, strong portfolio signal |
| Styling | Tailwind CSS plus CSS variables for tokens | Fast, themeable (light/dark, hazard palettes) |
| i18n | `next-intl` | English default (no prefix: `/hazards/...`), Bangla under `/bn/...` (`localePrefix: 'as-needed'`) |
| Maps | Leaflet plus OpenStreetMap tiles | Free, light |
| Charts | Recharts (or Chart.js) | Simple, accessible with care |
| DB / Auth / Storage | Supabase (Postgres, PostGIS, RLS) | Free tier, geo queries built in |
| Validation | Zod | Shared client/server schemas |
| Forms | React Hook Form | Small, reliable |
| PWA | Serwist (or `next-pwa` successor), Workbox strategies | Offline caching |
| Hosting | Vercel (or Cloudflare Pages) | Free tier |
| Email | Resend or Brevo free tier | Transactional |
| Testing | Vitest, Playwright, axe-core | Unit, e2e, accessibility |
| CI | GitHub Actions | Lint, typecheck, test, build |

> Check current free-tier limits and library versions when starting. They change.

## 4. Folder structure

```
surokkha-bd/
├─ docs/                     # prd.md, architecture.md, rules.md, phases.md, design.md, memory.md
├─ public/
│  ├─ icons/  fonts/  manifest.webmanifest
├─ src/
│  ├─ app/
│  │  └─ [locale]/
│  │     ├─ (public)/
│  │     │  ├─ page.tsx                    # Home
│  │     │  ├─ hazards/[slug]/page.tsx
│  │     │  ├─ map/page.tsx
│  │     │  ├─ shelters/page.tsx
│  │     │  ├─ plan/page.tsx
│  │     │  ├─ contacts/page.tsx
│  │     │  ├─ reports/page.tsx
│  │     │  ├─ relief/page.tsx
│  │     │  ├─ volunteer/page.tsx
│  │     │  ├─ explorer/page.tsx
│  │     │  ├─ kids/page.tsx
│  │     │  └─ lite/page.tsx
│  │     ├─ (auth)/login, signup
│  │     └─ (admin)/admin/...               # protected
│  ├─ components/  ui/  hazard/  map/  charts/  forms/
│  ├─ content/
│  │  ├─ hazards/*.bn.mdx  *.en.mdx         # guide content
│  │  ├─ quizzes/*.json
│  │  └─ contacts.json
│  ├─ lib/
│  │  ├─ supabase/ (client.ts, server.ts, middleware.ts)
│  │  ├─ geo/  (distance, nearest, bounds)
│  │  ├─ tokens/ (hazard colors, severity)
│  │  └─ validation/ (zod schemas)
│  ├─ messages/  bn.json  en.json
│  └─ styles/  tokens.css  globals.css
├─ supabase/
│  ├─ migrations/*.sql
│  ├─ seed/*.sql
│  └─ functions/ (usgs-sync, weather-sync, keepalive)
├─ tests/  unit/  e2e/  a11y/
└─ .github/workflows/ci.yml
```

## 5. Data model

Core entities (all tables have `id uuid pk`, `created_at`, `updated_at`).

```
hazards            (slug, name_bn, name_en, category, season_note, color_token, icon)
districts          (code, name_bn, name_en, division, geom)
upazilas           (district_id, name_bn, name_en, geom)
profiles           (user_id fk auth.users, display_name, role, district_id, phone_optional)
alerts             (hazard_id, title_bn, title_en, body_bn, body_en, severity, area_geom / district_ids,
                    source_name, source_url, issued_at, expires_at, created_by, status)
shelters           (name_bn, name_en, type, location geography(Point), district_id, upazila_id,
                    capacity, contact, accessibility, source, verified_at, active)
reports            (type, description, location geography(Point), district_id, photo_path,
                    reporter_id nullable, contact_optional, status, verified_by, verified_at, ip_hash)
relief_needs       (district_id, item, unit, qty_needed, deadline, status, created_by)
pledges            (need_id, donor_id, qty, handover_method, note, status)  -- pledged/in_transit/delivered/cancelled
volunteers         (user_id, skills text[], district_id, availability, verified)
volunteer_tasks    (title, description, required_skills text[], slots, location, district_id, status, created_by)
task_applications  (task_id, volunteer_id, status, note)
historical_events  (hazard_id, name, year, deaths_min, deaths_max, affected, damage_usd, districts[], source_name, source_url, note)
weather_cache      (district_id, temp, rain_mm, wind, fetched_at, source)
quake_cache        (usgs_id, mag, place, location, time, fetched_at)
quiz_questions     (hazard_id, question_bn/en, options jsonb, answer, explanation_bn/en)
ferry_schedules    (route, from_place, to_place, departs, days, contact, updated_at, source)
audit_log          (actor_id, action, entity, entity_id, diff jsonb, at)
```

Indexes: GiST on all geography columns, btree on `district_id`, `status`, `expires_at`.

### Example: nearest shelters (PostGIS)

```sql
create or replace function nearest_shelters(lat float, lng float, radius_m int default 10000, lim int default 10)
returns table (id uuid, name_bn text, name_en text, distance_m float)
language sql stable as $$
  select s.id, s.name_bn, s.name_en,
         st_distance(s.location, st_setsrid(st_makepoint(lng, lat), 4326)::geography) as distance_m
  from shelters s
  where s.active
    and st_dwithin(s.location, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_m)
  order by distance_m
  limit lim;
$$;
```

## 6. Security model

### Auth
- Supabase Auth: email/password and magic link. Phone OTP is a later option (SMS cost).
- Role stored in `profiles.role`: `citizen`, `volunteer`, `donor`, `coordinator`, `admin`.
- Role changes are admin-only, never client-writable.

### RLS policy summary

| Table | Public read | Write |
|---|---|---|
| hazards, districts, historical_events, quiz_questions | Yes | Admin |
| alerts | Active, non-expired | Coordinator (own districts), Admin |
| shelters | Active | Coordinator, Admin |
| reports | `status = 'verified'` only | Anyone via rate-limited function. Coordinator moderates |
| relief_needs | Yes | Coordinator, Admin |
| pledges | Aggregates public. Row visible to donor and coordinators | Authenticated donor |
| volunteers | Own row and coordinators (no public) | Owner |
| volunteer_tasks | Open tasks | Coordinator |
| task_applications | Owner and coordinators | Owner |
| audit_log | Admin only | System |

### Abuse controls
- Anonymous reports go through an Edge Function that hashes IP (salted), rate-limits per hash, validates with Zod, checks image type and size, and strips EXIF (including GPS) unless the user placed the pin.
- Honeypot field plus time-to-submit check. Add a lightweight proof-of-work or free CAPTCHA if abused.
- Storage bucket: private upload, public read only after verification.

### Privacy
- Store minimum personal data. Optional contact fields are visible to coordinators only.
- No precise home location saved by default. The "nearest shelter" lookup happens on the device or without storing coordinates.
- Privacy policy and data deletion route for accounts.

## 7. Data integrations

| Source | Method | Frequency | Notes |
|---|---|---|---|
| USGS Earthquake API | Edge Function to `quake_cache` | Every 10 to 15 min | Bounding box around Bangladesh and neighbors |
| Open-Meteo | Edge Function to `weather_cache` per district centroid | Hourly | Non-commercial free tier. Attribute |
| Overpass (OSM) | Script, manual or weekly | Weekly | Shelters, hospitals. Merge with curated data, respect rate limits |
| BMD / FFWC | Admin entry with source link | On demand | No public API. Do not scrape without checking terms |
| NASA (optional) | Later | n/a | Needs a free key |

All jobs: retry with backoff, record `fetched_at`, never overwrite good data with an empty response, and surface staleness in the UI.

## 8. Offline and low-bandwidth strategy

| Content | Strategy |
|---|---|
| App shell, fonts, icons | Precache |
| Hazard guides, contacts, quizzes | Precache on first visit (or on "Save for offline" tap) |
| Safety plan | Local-first (IndexedDB), sync when logged in |
| Alerts, needs, shelters | Stale-while-revalidate with "last updated" label |
| Map tiles | Runtime cache with a cap. No bulk offline tiles in v1 |
| Reports submitted offline | Queue in IndexedDB, Background Sync where supported |
| Images | Responsive sizes, AVIF/WebP, lazy load. Lite mode drops them |

Lite mode budget: HTML plus critical CSS under about 100 KB, no map JS unless requested.

## 9. Internationalization

- Default locale is **English** (`en`), served without a prefix. Bangla (`bn`) is served under `/bn/...`.
- Language switch is in the header on every page and keeps the user on the same page. The choice is saved in a cookie and `localStorage`.
- If `Accept-Language` prefers Bangla, show a dismissible prompt to switch. Never redirect automatically.
- Every page has `hreflang` alternates for `en` and `bn`.
- User-generated content (reports, needs, tasks) is stored in the language it was written. Coordinator-authored content (alerts, needs, tasks) has optional `_bn` and `_en` fields. If a translation is missing, show the other language with a small "Shown in English" or "বাংলায় দেখানো হচ্ছে" note.
- All strings in `messages/*.json`. Content in per-locale MDX.
- Bangla digits option (০-৯) via `Intl.NumberFormat('bn-BD')`.
- Dates via `Intl.DateTimeFormat`, using Bangladesh time (`Asia/Dhaka`).
- Never apply letter-spacing to Bangla text. Line-height at least 1.6.
- Switching language must not lose state (form input, map position, safety plan progress).

## 10. Performance budgets

| Metric | Target |
|---|---|
| LCP (mobile, 4G) | Under 2.5 s |
| JS on a content page | Under 150 KB gzipped |
| Lite page total | Under 100 KB |
| CLS | Under 0.1 |
| Lighthouse | 90+ in all categories |

Tactics: server components by default, dynamic import for map and charts, font subsetting (Bengali plus Latin), and image optimization.

## 11. Testing strategy

- **Unit** (Vitest): geo helpers, safety-plan generator, severity logic, Zod schemas.
- **E2E** (Playwright): report flow, pledge flow, language switch, offline mode.
- **A11y** (axe-core plus manual): keyboard, screen reader, contrast in both themes.
- **RLS tests**: SQL tests that confirm each role can and cannot do what the table above says.
- **Manual**: real low-end Android, throttled network, Bangla rendering.

## 12. Environments and deployment

- `main` deploys to production on Vercel. Pull requests get preview URLs.
- Supabase: one project for dev and one for prod (free tier allows a small number of projects, so check limits).
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only, never exposed), `RESEND_API_KEY`, `IP_HASH_SALT`, `CRON_SECRET`.
- Migrations live in `supabase/migrations`, applied via the Supabase CLI.
- Keep-alive cron pings the database so the free project does not pause.

## 13. SMS design (mock in v1)

```ts
interface SmsProvider {
  send(to: string, message: string): Promise<{ id: string; status: 'queued' | 'sent' | 'failed' }>;
}
// v1: MockSmsProvider logs to console and a table (sms_outbox).
// Later: swap in a Bangladeshi gateway or Twilio without changing callers.
```

## 14. Key decisions log

| # | Decision | Reason |
|---|---|---|
| D1 | Next.js plus Supabase | One free stack, strong portfolio value |
| D2 | PostGIS for geo | Nearest-shelter and area alerts done properly |
| D3 | No payments | Avoids cost, compliance, and fraud risk |
| D4 | Admin-entered official alerts | No official public API |
| D5 | Local-first safety plan | Works offline and protects privacy |
| D6 | English default locale, Bangla switchable | Broader reach for portfolio and NGO pitch, while keeping Bangla fully supported for local users |
