# Manual RLS verification checklist (Phase 3)

An automated RLS test suite (pgTAP or a scripted Vitest/supabase-js suite)
was not built for this phase; testing RLS properly needs several real user
accounts with different roles, which only exists once you have a live
project with real sign-ups. Use this checklist instead, and consider
building an automated suite once you have test accounts for each role
(tracked as a follow-up to P3-10 in `docs/phases.md`).

## Setup

1. In Supabase Auth, create four test users: `citizen@test.com`,
   `volunteer@test.com`, `coordinator@test.com`, `admin@test.com`.
2. In the `profiles` table, manually set each one's `role` column to match
   (citizen/volunteer/coordinator/admin). New sign-ups default to `citizen`;
   there is deliberately no UI to grant yourself a higher role.

## Checks to run (log in as each user in a private/incognito window)

### Anonymous visitor (not logged in)
- [ ] Can view `/hazards`, `/contacts`, `/plan`, `/map`, `/shelters`
- [ ] Can submit `/report` (goes to `pending`)
- [ ] Cannot open `/account` or `/admin` (redirected to `/login`)
- [ ] On `/map`, only reports with `status = 'verified'` appear

### Citizen (signed in, default role)
- [ ] Can view `/account`, sees role "Citizen"
- [ ] Cannot open `/admin` (redirected to `/`)
- [ ] Submitting `/report` while signed in still works

### Coordinator
- [ ] Can open `/admin`, `/admin/alerts`, `/admin/shelters`, `/admin/reports`
- [ ] Cannot open `/admin/audit` (redirected to `/admin`; admin-only)
- [ ] Can create an alert; it appears on the public alerts list within its
      expiry window
- [ ] Can add a shelter; it appears in `/admin/shelters` and (once the public
      pages are switched to read from Supabase) on `/map` and `/shelters`
- [ ] Can verify/reject/resolve a pending report from `/admin/reports`
- [ ] A verified report appears on `/map` for an anonymous visitor

### Admin
- [ ] Everything a coordinator can do, plus:
- [ ] Can open `/admin/audit` and see recent alert/shelter/report activity

### Direct API checks (optional, using the Supabase SQL editor or a REST client)
- [ ] `select * from reports where status = 'pending'` using the **anon**
      key returns zero rows (only verified reports are public)
- [ ] Attempting to `update shelters` using the **anon** key (no session)
      fails
- [ ] Attempting to `insert into alerts` as a **citizen** session fails
- [ ] `select * from audit_log` using a **coordinator** session returns zero
      rows (admin-only)

If any of these behave differently than described, that's a real RLS bug —
check the policy in `supabase/migrations/0002_rls.sql` or
`0004_reports_and_audit_rls.sql` before shipping further phases.
