# Security Review (P6-5)

Done as a static code/schema review from the AI session that built the app -- **not** a
penetration test, not run against the live deployment (no network access to Supabase or
Vercel from that environment), and not a substitute for a real security audit before a
public pilot. Scope: everything in `supabase/migrations/`, every server action and API
route, and the security-relevant headers in `next.config.ts`.

## Findings fixed in migration `0010_security_fixes.sql`

### 1. Privilege escalation via `profiles.role` (High severity, present since Phase 2/3)

`profiles_update_own` allowed a signed-in user to update their own `profiles` row with no
restriction on *which* columns changed. Since `role` lives on that row, any citizen could
run, from the browser console:

```js
supabase.from('profiles').update({ role: 'admin' }).eq('user_id', me)
```

...and grant themselves admin/coordinator access to the whole `/admin` area. **Fixed** with
a `BEFORE UPDATE` trigger (`lock_role_on_self_update`) that resets `role` to its previous
value unless the request is already coming from a coordinator/admin.

**If this project has been deployed and tested already, run this before assuming nobody
found it:**

```sql
select user_id, role from profiles where role <> 'citizen';
```

...and confirm every non-citizen row is someone you promoted yourself via the table editor
or SQL editor.

### 2. Self-verification via `volunteers.verified` (Low severity)

Same shape of bug, lower stakes: a volunteer could set their own `verified` flag via the
same kind of self-update. No page currently reads `verified`, so this had no live UI
impact, but it should be locked down before a coordinator-verification feature is built on
top of it. **Fixed** with the same trigger pattern (`lock_verified_on_self_update`).

### 3. No anti-spam on `ferry_help_requests` (Medium severity)

Every other public-facing insert in the app (community reports) has a honeypot field, a
minimum fill-time check, and a per-IP hourly rate limit. The ferry help-request form,
added in Phase 5, had none of the three -- an open door for a spam script. **Fixed**: added
the same honeypot + timing + per-IP-hash rate limit pattern (`ferry_help_requests.ip_hash`,
new in this migration).

## What was already solid (no changes needed)

- **RLS is enabled on every table** -- checked across all 9 migrations, no gaps.
- **Community reports** (`/api/reports`) already had honeypot, timing, and per-IP rate
  limiting from Phase 3 -- this was the pattern the ferry-request fix above was copied from.
- **Self-update policies that already correctly restrict status transitions**: `pledges`
  (a donor can only move their own pledge to `pledged` or `cancelled`, never
  `in_transit`/`delivered`) and `task_applications` (a volunteer can only set their own
  application to `withdrawn`). These got it right the first time -- included here as a
  reference for what the fixed `profiles`/`volunteers` policies are now consistent with.
- **Storage**: report photos have no public read policy; access is only via short-lived
  signed URLs generated server-side for coordinators/admins.
- **Service-role key usage** is confined to specific, narrow server-side operations
  (photo upload, email-address lookup for notifications, the keepalive ping) -- never
  exposed to the client.

## Headers / CSP

Added a `Content-Security-Policy` and `X-Frame-Options: DENY` in `next.config.ts`, on top
of the `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` headers that
were already there.

**Known limitation, on purpose**: the CSP's `script-src` and `style-src` include
`'unsafe-inline'`. The gold-standard fix is a per-request nonce threaded through
`src/proxy.ts` (which also runs the i18n routing and Supabase auth-session refresh) and
into `ThemeScript`'s inline `<script>` and every inline `style={{...}}` in the codebase.
That's a real improvement worth making, but it touches the one file every request goes
through, and there was no way to test a mistake there live from this session. A CSP that's
slightly looser than ideal is a better trade than one that might silently break routing or
login. Next step, when you can test it: generate a nonce in `proxy.ts`, forward it via a
request header, read it with `headers()` in Server Components, and drop `'unsafe-inline'`
from `script-src`.

## Rate limiting summary (all public write paths)

| Endpoint | Honeypot | Timing check | Per-IP rate limit |
|---|---|---|---|
| `/api/reports` (community reports) | Yes | Yes (3s) | Yes (3/hour) |
| Ferry help requests | Yes (added this pass) | Yes (2s, added this pass) | Yes (5/hour, added this pass) |
| Pledges, volunteer applications | No -- requires sign-in | No | No |

Pledges and applications require an authenticated Supabase account, which is itself a
meaningful deterrent (email confirmation, not anonymous) -- not adding IP-based limiting to
those was a judgment call for scope, not an oversight. Revisit if abuse actually shows up.

## What this review could NOT check (needs a human, or a live environment)

- Whether Supabase Auth settings (email confirmation required, password policy, rate
  limits on login/signup) are configured the way you expect in the dashboard -- these are
  project settings, not schema, and this review has no way to see them.
- Whether the CSP above actually works as intended in a real browser (see limitation
  above) -- test it in the Network/Console tab after deploying, watching for any blocked
  resource.
- Whether Vercel's own security headers / environment variable scoping are set correctly
  (e.g., that `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are server-only env vars,
  never exposed with a `NEXT_PUBLIC_` prefix -- worth a manual double-check).
- Any timing/side-channel or dependency-vulnerability analysis (`npm audit` is worth
  running yourself periodically; it wasn't run as part of this pass).
- Real penetration testing. This was a code review, not an attack simulation.
