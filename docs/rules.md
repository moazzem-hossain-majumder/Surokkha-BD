# Rules: Surokkha BD

These rules apply to every contributor, human or AI (for example Claude Code). Read this file, `memory.md`, and the relevant doc before starting any task.

## 1. Working agreement for AI assistants

1. **Read first.** Read `memory.md`, then `phases.md` to find the current task, then the relevant section of `prd.md`, `architecture.md`, or `design.md`.
2. **One task at a time.** Work only on the current phase. Do not start later phases.
3. **Small, reviewable steps.** Prefer changes a human can review in a few minutes.
4. **Ask before big decisions.** Ask before adding a dependency, changing the schema in a breaking way, or changing the design tokens.
5. **Never invent facts.** Do not make up death tolls, dates, phone numbers, shelter data, or safety advice. Use a `TODO(source)` marker and list it in `memory.md` under Open content questions.
6. **Update memory.** At the end of each session, update `memory.md` (what was done, decisions, next steps).
7. **Explain errors plainly.** When something fails, state the cause and the fix.
8. **Never commit secrets.** Do not print, log, or commit keys.

## 2. Non-negotiable product rules

- This is **not** an official warning system. The disclaimer must appear on Home, Alerts, and Map.
- Every alert, statistic, and dataset shows **source and last-updated time**.
- Unverified user content is **never** shown as fact. It is labeled or hidden.
- **No payment handling.** No card, bKash, Nagad, or bank flows.
- **Safety content changes need a source** and a human review note.
- Emergency numbers must have a `last_verified` date.
- Do not show precise personal locations of reporters or victims publicly.

## 3. Code rules

### General
- TypeScript strict mode. No `any` unless commented with a reason.
- Server Components by default. Use `"use client"` only when needed.
- Validate all external input with Zod, on both client and server.
- Prefer small pure functions. Put geo, severity, and plan logic in `lib/` with unit tests.
- No dead code, no commented-out blocks, no `console.log` in committed code.
- Use ES modules. Avoid default exports except for Next.js pages and layouts.

### Naming and files
- Components: `PascalCase.tsx`. Hooks: `useThing.ts`. Utilities: `camelCase.ts`.
- One component per file. Co-locate tests: `Thing.test.tsx`.
- Route folders are lowercase kebab-case.
- DB tables and columns: `snake_case`. TypeScript types: `PascalCase`.

### Styling
- Use design tokens from `design.md` and `styles/tokens.css`. **Never hardcode hex values in components.**
- Every color usage must work in **light and dark** themes.
- No inline styles except for dynamic values (for example, progress width).
- Do not put letter-spacing on Bangla text.
- Check every layout in both English and Bangla. Bangla text can be longer and taller, so components must not truncate or overflow.

### Data and Supabase
- Every table has RLS enabled. A table without policies is a bug.
- Schema changes go through migration files, never edited in the dashboard only.
- The service role key is used only in server code and Edge Functions.
- Use parameterized queries or the Supabase client. Never build SQL from strings with user input.
- Cached external data always stores `fetched_at` and `source`.

### Error handling
- User-facing errors say what happened and what to do next, in the active language.
- Network failures degrade gracefully (cached data plus a "showing saved data" notice).
- Never show raw error messages or stack traces to users.

## 4. Accessibility rules (WCAG 2.2 AA minimum)

- Text contrast 4.5:1 (3:1 for large text and UI components), in both themes.
- **Never use color alone** to convey severity or hazard type. Pair with an icon and a text label.
- Full keyboard operation with a visible focus ring.
- Touch targets at least 44x44 px, with a larger 56 px for primary emergency actions.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- All images have alt text (in the active language). Decorative images use empty alt.
- Form fields have visible labels and clear error text.
- Map has a text/list alternative for every map view.
- Test with a screen reader (NVDA on Windows) before each phase closes.

## 5. Internationalization rules

- No hardcoded user-visible strings. Everything goes through `next-intl`.
- English (`en`) is the default and source language. Every string must also have a Bangla (`bn`) version. A missing `bn` string is a build warning, and a release blocker.
- English is the default locale. Never redirect users to Bangla automatically. Offer it with a dismissible prompt.
- Bangla copy is written by a fluent speaker or reviewed by one. Do not rely on machine translation for safety content.
- Use simple, everyday Bangla. Avoid heavy Sanskritized or bureaucratic wording in safety steps.
- Format numbers and dates with `Intl`, timezone `Asia/Dhaka`.

## 6. Performance rules

- Respect budgets in `architecture.md` section 10.
- Dynamic-import Leaflet, charts, and PDF tools.
- Images: AVIF/WebP, explicit width/height, lazy loading.
- No large animation libraries unless justified. Prefer CSS.
- Check the bundle size after adding any dependency.

## 7. Security and privacy rules

- Rate limit all anonymous write endpoints.
- Strip EXIF metadata from uploaded photos.
- Sanitize all user text before rendering. No `dangerouslySetInnerHTML` with user content.
- Set security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Minimum personal data. Contact info is visible only to coordinators.
- Provide account and data deletion.

## 8. Git rules

- Branches: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
- Conventional commits: `feat: add shelter finder list view`.
- One logical change per commit. Pull requests reference the task ID from `phases.md`.
- `main` must always build and pass lint, typecheck, and tests.
- Never commit `.env*` files. Keep `.env.example` up to date.

## 9. Definition of done (for any task)

- [ ] Works in English (default) and Bangla, with the language switch keeping state
- [ ] Works in light and dark theme
- [ ] Responsive from 320 px to desktop
- [ ] Keyboard and screen reader checked
- [ ] Loading, empty, and error states designed
- [ ] Lint, typecheck, and tests pass
- [ ] RLS verified (if touching data)
- [ ] Source and last-updated shown (if showing data)
- [ ] `memory.md` updated

## 10. Things to avoid

- Generic template UI. Follow `design.md`.
- Adding features not in `prd.md` without approval.
- Fear-based or sensational language. Tone is calm, clear, and useful.
- Stock imagery that shows suffering. Use respectful, dignified visuals.
- Claims like "saves lives" or "official" that we cannot back up.
