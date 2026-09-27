# Phase 6 Human-Only Checklist (P6-1 to P6-4)

These four tasks genuinely need a human and/or physical hardware -- nothing here could be
done or verified from the AI session that built the rest of Phase 6. What follows is not a
substitute for doing them; it's the checklist to actually work through.

## P6-1: Full accessibility audit (axe + NVDA + keyboard)

What the code side already has going for it (done during the build, not a substitute for
this audit): semantic HTML throughout, `aria-label`s on icon-only buttons, a real `<table>`
alternative for every chart (not just visual), `print:hidden` used consistently, focus-
visible states from the existing design system.

To actually audit:
1. Install the [axe DevTools browser extension](https://www.deque.com/axe/devtools/) (free).
   Run it on: home, a hazard guide, `/map`, `/report`, `/admin`, `/explorer`, `/quiz/cyclone`,
   a game, `/teacher/cyclone`. Fix anything it flags as a violation (not just "needs review").
2. Install [NVDA](https://www.nvaccess.org/download/) (free, Windows). Turn off your monitor
   or close your eyes, and try to: sign up, submit a report, take a quiz, make a pledge,
   read a hazard guide, using only NVDA's output. Note anywhere you got lost or the reading
   order was confusing.
3. Unplug your mouse. Try to reach and activate every interactive element on the pages
   above using only Tab/Shift+Tab/Enter/Space/Arrow keys. Check the focus indicator is
   always visible and the tab order is logical.
4. Check color contrast specifically for: hazard severity badges, the alert banner, form
   error text (the "sun" color used for errors/warnings throughout) -- these are the places
   most likely to fail WCAG AA contrast.

## P6-2: Performance pass (Lighthouse 90+ on mobile)

Code-side prep already done: fonts are self-hosted (no external font-loading round trip),
the map (`LeafletMap`) is the heaviest client bundle and should already be code-split since
it's only imported on `/map` and `/shelters`, no analytics/tracking scripts to slow anything
down.

To actually measure:
1. Deploy to Vercel (or run `npm run build && npm run start` locally).
2. Chrome DevTools -> Lighthouse -> Mobile -> run it on the home page, `/map`, and one hazard
   guide page. Note the score and every "Opportunity"/"Diagnostic" it lists.
3. Common culprits if the score is low: the Leaflet map bundle (consider `next/dynamic` with
   `ssr: false` if not already used), any hazard content images that aren't using `next/image`,
   render-blocking fonts (shouldn't apply here since fonts are self-hosted, but verify).

## P6-3: Real low-end Android phone, throttled network

There's no substitute for this one. Borrow the cheapest/oldest Android phone you can find.
1. On a real 3G/slow connection (or Chrome DevTools' "Slow 4G" throttle if testing remotely
   isn't possible), load the home page, `/lite`, and `/map`. Time how long each takes.
2. Try the offline report queue (Phase 3): submit a report with WiFi off, confirm it queues
   and syncs when back online.
3. Check text is legible and buttons are tappable without zooming, especially in Bangla
   (`Anek Bangla` / `Hind Siliguri` at small sizes can render tighter than Latin text).

## P6-4: Content review by humans

Two different reviews, two different people ideally:

1. **Bangla language review** (fluent speaker, not necessarily technical): every `bn` string
   in `src/messages/bn.json`, every hazard guide's Bangla content in
   `src/content/hazards/*.json`, and the Bangla text in `src/content/legal/privacy.ts` /
   `terms.ts` and `supabase/seed/0003_seed_historical_events.sql` -- all of it is first-pass
   AI translation, none of it has been checked by a native speaker. This is the single
   biggest open item before a real pilot with real Bangladeshi users.
2. **Safety-content review** (someone with disaster-response or public-health background):
   every hazard guide's before/during/after guidance, the myths/facts, and the historical
   event data's sourcing (see `docs/memory.md` section 5, Open Content Questions) -- ideally
   checked against BMD/DDM primary sources, not just the secondary sources cited today.

Track both reviews' findings in `docs/memory.md` section 5 as they come in, the same way
every other content question in this project has been tracked.
