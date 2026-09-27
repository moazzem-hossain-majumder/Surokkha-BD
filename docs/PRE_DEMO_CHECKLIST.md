# Pre-Demo Checklist

Run through this the day before (not the morning of) any live demo or NGO pitch meeting.

## The night before
- [ ] Open the live URL yourself, in an incognito window, on both desktop and your phone.
- [ ] Check the Supabase dashboard: project is **not** paused. If it shows "paused," restore
      it now, not five minutes before the meeting -- restores can take a minute or two.
- [ ] Check `GET /api/health` on the live URL returns `{"ok": true, "supabase": "reachable"}`.
- [ ] Check your Resend dashboard: you haven't hit the free-tier daily send limit, and the
      account email you'll use to demo notifications actually is the Resend account owner's
      email (sandbox mode only delivers to that address -- see the Phase 4 memory.md notes).
- [ ] Seed at least one fresh example of each of: an open relief need with one pledge, an
      open volunteer task with one application, one pending community report -- so the demo
      doesn't start from an empty state.
- [ ] Confirm you (or a demo account) can log in as both a citizen and a coordinator/admin.
- [ ] Skim `docs/memory.md`'s Open Content Questions table (section 5) so you can answer
      confidently, not defensively, if someone asks "is this data verified?"

## Right before
- [ ] Reload the live URL once more, on the actual device/browser you'll present from.
- [ ] Turn off any browser extensions that might inject visible UI (ad blockers sometimes
      break the map tiles).
- [ ] Have a backup: a short screen recording or a few screenshots, in case the live network
      at the venue is bad. A live demo of a disaster-prep app failing live is not a great look.
- [ ] Know which known gaps you'll proactively mention vs. only answer if asked (see
      "Known gaps to be ready to discuss" below) -- decide this on purpose, don't wing it.

## Known gaps to be ready to discuss

Be upfront about these if asked -- they read as "we know exactly where we are," not as
weaknesses, and every one of them has a documented owner/next-step in `docs/memory.md`:

- Historical event and ferry-schedule data is sourced from public secondary sources
  (Wikipedia, ReliefWeb, GFDRR, Banglapedia), not primary BMD/DDM/BBS figures yet.
- Bangla content has not been reviewed by a native speaker.
- The app has not been tested on a real low-end Android phone or run through Lighthouse.
- No accessibility audit with a real screen reader (NVDA) has been done yet.
- This is a solo-built portfolio/pilot project with a $0 infrastructure budget -- explain
  what that buys (Supabase + Vercel free tiers) and what it costs (the pause/cold-start
  behavior this checklist exists to manage).

## After the demo
- [ ] Note anything that broke or looked off, however small, in `docs/memory.md`'s session
      log -- future-you (or future-AI-session) needs it, not just today's memory of it.
