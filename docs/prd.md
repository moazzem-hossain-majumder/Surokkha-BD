# PRD: Surokkha BD (সুরক্ষা)

> Working name. Change freely. Status: Draft v1.

## 1. Summary

Surokkha BD is a free, English-default, low-bandwidth web app with full Bangla support (one-tap language switch) that helps people in Bangladesh **prepare for, survive, and recover from every natural disaster**. It also gives communities, volunteers, donors, and coordinators one shared place to work together.

**Tagline:** Be ready, stay safe (প্রস্তুত থাকুন, নিরাপদ থাকুন)

**Language approach:** English is the default language. Every page, alert, guide, quiz, and form can be switched to Bangla at any time with a visible language switch. The choice is remembered. If a visitor's browser prefers Bangla, the site offers a dismissible "বাংলায় দেখুন" prompt instead of switching automatically.

## 2. Problem

- Bangladesh faces many hazards: cyclones, floods, flash floods, urban waterlogging, riverbank erosion, landslides, earthquakes, lightning, nor'westers, drought, heatwaves, cold waves, salinity intrusion, and tsunami risk.
- Safety information is scattered across many sites, often in English or heavy official language.
- People in char, haor, hill, and coastal areas have weak internet and low digital literacy.
- Relief coordination is fragmented. Donors cannot see real needs, and volunteers cannot find where they are needed.

## 3. Goals

| # | Goal | Measure (portfolio/pilot) |
|---|------|---------------------------|
| G1 | Make safety guidance easy to understand for all 14 hazards, in English by default and fully in Bangla on request | 100% hazards have before/during/after guides |
| G2 | Work on weak connections | Core guides usable offline; lite pages under 100 KB |
| G3 | Help people find safe places fast | Nearest shelter in 3 taps or fewer |
| G4 | Make relief needs and pledges transparent | Every need shows needed / pledged / delivered |
| G5 | Let volunteers be matched by skill and district | Task apply flow completes in under 2 minutes |
| G6 | Look and feel credible enough to pitch to an NGO | Lighthouse: Performance, Accessibility, Best Practices at 90+ |

## 4. Non-goals (v1)

- Not an official warning system. It always points to BMD, FFWC, and DDM for official alerts.
- No payment processing or money handling. Pledges are for in-kind items and contact/handover only.
- No real SMS sending (mock/sandbox only, architecture documented).
- No native mobile apps (PWA only).
- No AI-generated safety advice. All guidance is written and reviewed by humans.

## 5. Users and personas

| Persona | Context | Key needs |
|---|---|---|
| **Rahima**, coastal homemaker (Barguna) | Basic phone, unstable data | Cyclone signals explained, shelter nearby, family plan |
| **Sabbir**, haor farmer (Sunamganj) | Lightning and flash flood risk | Simple icons, voice/read-aloud, offline guide |
| **Tania**, university volunteer (Dhaka) | Wants to help during floods | Find tasks by skill and district |
| **Mr. Karim**, NGO coordinator | Manages relief across upazilas | Post needs, verify reports, track pledges |
| **Nusrat**, donor abroad | Wants trustworthy giving | See real needs and delivery status |
| **Ms. Farida**, primary school teacher | Teaches safety | Games, quizzes, printable worksheets |

## 6. Roles and permissions

| Role | Can do |
|---|---|
| Visitor | Read guides, map, shelters, needs. Submit rate-limited anonymous reports |
| Citizen (account) | Save safety plan, submit reports with photos, track own reports |
| Volunteer | Everything a citizen can, plus register skills, apply to tasks |
| Donor | Everything a citizen can, plus pledge to needs |
| Coordinator | Post alerts, needs, tasks, verify reports, manage shelters for assigned districts |
| Admin | All coordinator rights for all districts, manage roles, content, data |

## 7. Features and requirements

Priority: **P0** must have for MVP, **P1** should have, **P2** later.

### F1. Home and risk banner (P0)
- F1.1 Current risk banner from admin-posted alerts, showing hazard, area, severity, source, and last-updated time.
- F1.2 Quick actions: Find shelter, Emergency numbers, Report a problem, My safety plan.
- F1.3 Language toggle (বাংলা / English) and theme toggle (light / dark / system).

### F2. Hazard Guide (P0)
- F2.1 One page for each of the 14 hazards (see section 8).
- F2.2 Each page has: what it is, where and when, before / during / after steps, myths vs facts, local warning signals, sources.
- F2.3 Short sentences, icons, optional read-aloud (Web Speech API where available).
- F2.4 Available offline once visited.

### F3. Live alerts and map (P0)
- F3.1 Leaflet map with toggleable layers: earthquakes (USGS), rainfall/weather (Open-Meteo), admin alerts, verified community reports, shelters.
- F3.2 Filter by hazard, severity, and district.
- F3.3 Every layer shows source and freshness. Stale data (older than its threshold) is labeled.

### F4. Shelter and safe-place finder (P0)
- F4.1 List and map view of shelters, hospitals, and relief points.
- F4.2 "Nearest to me" using device location, with manual district fallback.
- F4.3 Capacity, contact, type (cyclone / flood / general), accessibility notes, directions link.
- F4.4 Data from curated seed plus OpenStreetMap plus admin additions.

### F5. My Safety Plan (P0)
- F5.1 Short questionnaire: district, main hazards, family size, elderly, children, disabilities, livestock, pets.
- F5.2 Generates a personalized checklist, go-bag list, meeting points, and contacts.
- F5.3 Saves in the browser, or to the account when logged in.
- F5.4 Printable PDF (print stylesheet or client-side PDF).

### F6. Emergency contacts (P0)
- F6.1 National numbers (999 and others verified before launch), Fire Service, Coast Guard, health hotline, district control rooms.
- F6.2 One-tap call on mobile. Works offline.

### F7. Community reports (P1)
- F7.1 Report type: flooding, erosion, landslide, blocked road, damaged embankment, other.
- F7.2 Photo (compressed client-side), map pin, description, optional contact.
- F7.3 Anonymous allowed, with rate limits and CAPTCHA-free abuse controls (see architecture).
- F7.4 Admin verification. Only verified reports show publicly. Statuses: Pending, Verified, Rejected, Resolved.

### F8. ReliefLink (P1)
- F8.1 Coordinators post needs per district: item, unit, quantity needed, deadline.
- F8.2 Donors pledge quantity and pick a handover method.
- F8.3 Status flow: Needed, Pledged, In transit, Delivered. Progress bars show needed / pledged / delivered.
- F8.4 Public transparency view with an activity log.
- F8.5 No payments.

### F9. Volunteer Hub (P1)
- F9.1 Profile with skills (medical, first aid, boat operation, logistics, driving, counselling, communications), district, availability.
- F9.2 Coordinators create tasks with required skills, count, and location.
- F9.3 Volunteers apply. Coordinators accept or decline. Status tracking.

### F10. CharConnect / Lite mode (P1)
- F10.1 Text-first "Lite" version: no maps by default, no large images, minimal JS.
- F10.2 Boat and ferry schedule board maintained by admins.
- F10.3 Local notices and a "request help" form.
- F10.4 Auto-suggest Lite mode on slow connections (Network Information API where supported).

### F11. Data Explorer (P1)
- F11.1 Charts and maps of historical events: deaths, affected people, damage, by hazard and decade.
- F11.2 Compare hazards or districts. Download data as CSV.
- F11.3 Every record cites its source. Uncertain figures are shown as ranges or flagged.

### F12. Kids' Safety Zone (P1)
- F12.1 Per-hazard quiz and 1-2 mini-games.
- F12.2 Badges and progress stored locally.
- F12.3 Teacher mode with printable worksheets.

### F13. Admin dashboard (P0 for alerts and shelters, P1 for the rest)
- F13.1 Create, edit, and expire alerts.
- F13.2 Manage shelters, needs, tasks, reports, users.
- F13.3 Basic stats and an audit log of admin actions.

### F14. Notifications (P2)
- F14.1 Web Push and email for subscribed districts and hazards.
- F14.2 SMS as mock/sandbox with documented gateway interface.

## 8. Hazards in scope

Cyclones and storm surges, riverine floods, flash floods, urban flooding and waterlogging, riverbank erosion, landslides, earthquakes, lightning, nor'westers and tornadoes, drought, heatwaves, cold waves and dense fog, salinity intrusion, tsunami risk.

> Seasons, locations, and statistics must be verified against official sources (BMD, FFWC, DDM, BBS, USGS, and academic sources) before publishing. Each fact stores its source.

## 9. Content accuracy and safety policy

- All safety steps are reviewed against official DDM/BMD/Red Crescent guidance.
- A visible disclaimer says this is not an official warning source.
- Every alert shows source, issued time, and expiry.
- Unverified user content is always labeled as unverified.
- Emergency numbers are verified before each release and carry a "last verified" date.

## 10. Success metrics

Portfolio phase:
- Lighthouse 90+ in all four categories on mobile.
- All 14 hazards published in both languages.
- Works offline for guides, contacts, and safety plan.
- Demo video and case study complete.

Pilot phase (with an NGO):
- Time to find nearest shelter under 15 seconds.
- Share of reports verified within 24 hours.
- Number of needs fully fulfilled through pledges.
- Volunteer task fill rate.

## 11. Constraints

- **$0 budget.** Free tiers only (Vercel, Supabase, Open-Meteo, USGS, OSM).
- Solo developer on Windows.
- Must remain usable on low-end Android phones and 2G/3G.

## 12. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| No official BMD/FFWC API | No live official alerts | Admin-entered alerts with source links. Clear labeling |
| Spam or fake reports | Loss of trust | Rate limits, moderation queue, verified-only public view |
| Wrong safety information | Harm | Human review, sources, disclaimer |
| Sparse shelter data on OSM | Weak finder | Curated seed dataset, admin editing |
| Supabase free project pauses | Demo fails | Keep-alive cron, wake before demos |
| Bangla text rendering issues | Poor UX | Test fonts on real devices, avoid letter-spacing on Bangla |
| Scope creep | Never ships | Strict phases in `phases.md` |

## 13. Open questions

1. Final product name and domain?
2. ~~Bangla and English at launch, or Bangla first?~~ **Decided:** English default, Bangla switchable at launch. Open point: how much of the user-generated content (reports, needs, tasks) is translated, and by whom?
3. Which NGO pilot region (coastal, haor, hill)?
4. Who reviews safety content (advisor, NGO partner)?
5. Data license terms for any shelter dataset from partners?

## 14. Out of scope but on the roadmap

Real SMS gateway integration, IVR/voice alerts, offline maps tiles, government dashboard integration, multi-organization accounts, native apps.
