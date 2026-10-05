# Surokkha BD: Full Test Guide, Phases 1 to 6

Matches the latest build: header **More** menu, new read-aloud message, re-runnable SQL, dev-mode CSP fix. Every button and label name was checked against the app's own text files. Steps I could not run myself are marked **⚠ unrun**. Those are the steps where I'm least sure, so watch them closely.

**How to report results:** every step has an ID like `C4.2`. If a step doesn't match its **Expect** line, note the ID, what you saw instead, and a screenshot or the exact red text.

## Contents
- Part 0. Setup, tools, accounts
- Phase 1. Knowledge core
- Phase 2. Map, data, shelters
- Phase 3. Auth, reports, admin
- Phase 4. ReliefLink and Volunteer Hub
- Phase 5. Learning and remote access
- Phase 6. Security, legal, SEO, keep-alive
- Final pass and results tracker

---

## Part 0. Setup: windows, tools, accounts

### 0.1 The four windows you'll use
| Name | How to open | Used for |
|---|---|---|
| **Terminal** | PowerShell in `D:\surokkha-bd` | runs `npm run dev`, shows email errors |
| **Window 1** | normal Chrome | the **Citizen** |
| **Window 2** | Chrome Incognito (`Ctrl+Shift+N`) | the **Admin** |
| **Window 3** | Edge InPrivate (`Ctrl+Shift+N` in Edge) | a **logged-out visitor** |
| **Supabase** | https://supabase.com/dashboard, open project `uvdbdzoqutwhpvgjjiao` | database work |

In Supabase, the **left sidebar** has **Table Editor** (view rows), **SQL Editor** (run SQL), **Authentication** (users), **Storage** (files), and a **gear icon, Project Settings** (keys).

**DevTools** = press `F12`. Its tabs are **Console**, **Network**, **Application**, **Lighthouse**.

### 0.2 Install the zip
Use your normal workflow: back up `.env.local`, clear the folder except `.git`, expand the zip, copy it in, restore `.env.local`.

### 0.3 Put the SQL into Supabase (where to paste)
1. Supabase, left sidebar, **SQL Editor**, button **+ New query**. A big empty text box opens.
2. In VS Code open a SQL file (paths below), press `Ctrl+A` then `Ctrl+C` to copy everything.
3. Click into the Supabase text box, press `Ctrl+V`.
4. Click the green **Run** button (bottom right of the box) or press `Ctrl+Enter`.
5. Below the box you should see **Success. No rows returned**. A red error means stop and send it to me.

Do this for each file, **in this order**. Files are in `D:\surokkha-bd\supabase\`:

`migrations\0001_init.sql`, `0002_rls.sql`, `0003_reports_and_audit.sql`, `0004_reports_and_audit_rls.sql`, `0005_insert_shelter_point.sql`, `0006_relief_and_volunteers.sql`, `0007_relief_and_volunteers_rls.sql`, `0008_learning.sql`, `0009_learning_rls.sql`, `0010_security_fixes.sql`, then `seed\0001_seed_districts.sql`, `0002_seed_shelters.sql`, `0003_seed_historical_events.sql`, `0004_seed_quiz_questions.sql`, `0005_seed_ferry_schedules.sql`.

If you already ran some of these before, just run them all again. They are now safe to repeat.

**0.3a Prove the re-run fix (the error you hit before).** Open `0002_rls.sql` again, paste, Run a second time. **Expect:** Success, and no "policy ... already exists" error. Do the same for `0007_relief_and_volunteers_rls.sql`.

**0.3b If you ran the old seeds twice** and have duplicate rows: paste `supabase\maintenance\dedupe_seed_rows.sql` and Run. **Expect:** a small table at the bottom showing districts 64, shelters 18, historical_events 10, quiz_questions 28, ferry_schedules 3.

### 0.4 Check the database is right
New query, paste, Run:
```sql
select 'districts' as t, count(*) from districts
union all select 'shelters', count(*) from shelters
union all select 'historical_events', count(*) from historical_events
union all select 'quiz_questions', count(*) from quiz_questions
union all select 'ferry_schedules', count(*) from ferry_schedules;
```
**Expect:** 64, 18, 10, 28, 3.

New query, paste, Run:
```sql
select conrelid::regclass as tbl, conname, confdeltype
from pg_constraint
where confrelid = 'auth.users'::regclass and contype = 'f' order by 1;
```
**Expect:** `confdeltype` is `c` for `profiles` and `volunteers`. It is `n` for `alerts`, `reports` (2 rows), `audit_log`, `relief_needs`, `pledges`, `volunteer_tasks`, `ferry_help_requests`. An `a` anywhere means account deletion will fail later.

New query, paste, Run:
```sql
select tgname from pg_trigger where tgname in ('profiles_lock_role','volunteers_lock_verified');
```
**Expect:** 2 rows.

### 0.5 Supabase login settings
1. Left sidebar, **Authentication**, **URL Configuration**. Set **Site URL** to `http://localhost:3000`. Under **Redirect URLs** add `http://localhost:3000/**`. Click **Save**.
2. **Authentication**, **Sign In / Providers**, **Email**. The **Confirm email** switch: OFF is fastest for testing (sign-up logs you straight in). ON is realistic but Supabase's built-in mailer only sends a few emails per hour. Menu names shift between Supabase versions. If you can't find it, note what you see.

### 0.6 Fill `.env.local`
Open `D:\surokkha-bd\.env.local` in VS Code:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://uvdbdzoqutwhpvgjjiao.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=<your NEW rotated key>
RESEND_API_KEY=re_...
IP_HASH_SALT=<64 hex characters>
```
- URL and publishable key: Supabase, **gear icon**, **API Keys**.
- **Rotate the service key now** on that same page (regenerate the secret key, paste the new one). The old one was pasted in a chat.
- Salt: PowerShell, `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`, paste the output.
- Resend key: resend.com, **API Keys**, **Create API Key**.
- `CRON_SECRET`: leave it out, nothing uses it.
- Save the file.

**Resend limit to remember:** until you verify a domain, Resend only delivers to the email you signed up to Resend with. Use that exact address for the **Admin** account. Emails addressed to other accounts will not arrive, and the Terminal will print `sendEmail failed 403`. The action itself still succeeds.

### 0.7 Start and check
1. Terminal: `npm install`, then `npm run dev`. Wait for **Ready**.
2. Open **http://localhost:3000/api/health**. **Expect:** `{"ok":true,"app":"surokkha-bd","supabase":"reachable",...}`. `not-configured` or `unreachable` means `.env.local` is wrong. Stop and fix that first.
3. Open **http://localhost:3000/hazards** in Window 1. **Expect:** no red "1 Issue" badge in the bottom-left corner. That was the `eval()` error, now fixed. If it's still there, note the text.

### 0.8 Create the accounts (worked example)
Use Gmail "plus" addresses so one inbox serves all: `yourname+citizen@gmail.com` delivers to `yourname@gmail.com`.

| Name | Email | Window |
|---|---|---|
| Test Admin | `yourname@gmail.com` (the Resend email) | 2 |
| Test Coordinator | `yourname+coord@gmail.com` | 2 (swap in later) |
| Test Citizen | `yourname+citizen@gmail.com` | 1 |
| Test Fresh | `yourname+fresh@gmail.com` | 3 |

**Sign up the Citizen, step by step (Window 1):**
1. Address bar, `http://localhost:3000/signup`, Enter.
2. You see the title **Create an account**, and two tabs: **Password** (selected) and **Email link**.
3. Type **Name** `Test Citizen`, **Email** `yourname+citizen@gmail.com`, **Password** `Test12345!` (the hint under it says "At least 8 characters.").
4. Click **Create account**.
5. If **Confirm email** is OFF you are signed in and sent on. If ON, you see a "check your email" message. Open Gmail, find "Confirm your signup", right-click its link, **Copy link address**, paste into Window 1's address bar, Enter.
6. Go to `/account`. **Expect:** title **My account**, your name and email, **Role** = **Citizen**.
7. Supabase, **Table Editor**, **profiles**. **Expect:** a row for you with `role` = `citizen`.
8. No email arriving? Check Spam, wait a few minutes, or in Supabase go **Authentication**, **Users**, **Add user**, **Create new user**, fill email and password, tick **Auto Confirm User**.

Repeat for Admin, Coordinator and Fresh in their windows.

**Two sign-up error checks (Window 3, `/signup`):**
- Use an existing email. **Expect:** "That email is already registered. Try logging in instead."
- Password of 5 characters. **Expect:** a warning about at least 8 characters.

### 0.9 Promote Admin and Coordinator (where to paste: Supabase SQL Editor)
1. Supabase, **SQL Editor**, **+ New query**.
2. Paste this, change the email to your real one, Run. **Expect:** Success, 1 row affected.
```sql
update profiles
set role = 'admin'
where user_id = (select id from auth.users where email = 'yourname@gmail.com');
```
3. New query, paste, Run:
```sql
update profiles
set role = 'coordinator'
where user_id = (select id from auth.users where email = 'yourname+coord@gmail.com');
```
4. New query, paste, Run:
```sql
select u.email, p.role from profiles p join auth.users u on u.id = p.user_id order by u.email;
```
**Expect:** four rows: `admin`, `coordinator`, `citizen`, `citizen`.
5. Window 2, `/login`, tab **Password**, Admin email and password, **Log in**. Go to `/account`. **Expect:** Role **Admin** and a button **Go to admin dashboard**. Click it. **Expect:** page title **Admin dashboard** with an **Overview** tab.

### 0.10 Prove the security fix works (⚠ unrun on real Supabase)
I ran this logic on a local PostgreSQL copy and it passed, but not on your Supabase.
1. SQL Editor, run `select id from auth.users where email = 'yourname+citizen@gmail.com';` and copy the id value.
2. New query, paste this with the id replacing `PASTE-CITIZEN-ID-HERE`, then Run:
```sql
do $$
declare
  v_id uuid := 'PASTE-CITIZEN-ID-HERE';
  v_role text;
begin
  perform set_config('request.jwt.claims', json_build_object('sub', v_id, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  update profiles set role = 'admin' where user_id = v_id;
  select role into v_role from profiles where user_id = v_id;
  raise exception 'TEST RESULT -> role is: %', v_role;
end $$;
```
3. **A red error is intended.** It rolls everything back so nothing changes. **Pass:** the message says `TEST RESULT -> role is: citizen`. **Fail:** it says `admin`. Report this at once.
4. Repeat with the Coordinator's id. **Expect:** `coordinator`.

---

## Phase 1. Knowledge core

**Where:** Window 1 (Citizen) or Window 3 (visitor). Any window works.

### C1. App shell and home
1. Open `http://localhost:3000`. **Expect:** a sticky header with the Surokkha BD mark, **EN / বাং** language switch, a theme control, and a footer starting "Surokkha BD is not an official warning source...".
2. **Skip link:** click the page background, press `Tab` once. **Expect:** a "Skip to main content" link appears. Press `Enter`: focus jumps past the header.
3. **Header layout.** Drag the browser window wide (1280px or more). **Expect:** one row, no wrapping: **Hazards, Map, Shelters, Report, Relief, Volunteer, Emergency, My plan**, then **More**, then Log in / language / theme. "Surokkha BD" and "My plan" each stay on **one line**.
4. Click **More**. **Expect:** a dropdown: **Explorer, Quiz, Games, Ferries**. Click **Quiz**. **Expect:** you go to `/quiz` and the dropdown closes. ⚠ unrun visually.
5. Narrow the window below 1280px. **Expect:** the inline nav disappears and a scrollable strip of pills (all links including Explorer, Quiz, Games, Ferries) appears under the header. Swipe or drag it sideways.
6. Theme control (three round buttons): click **Dark theme**, then **Light theme**, then **Match my device**. **Expect:** page colors switch each time.
7. Home content: title **Be ready. Stay safe.**, buttons **Explore hazards**, **See severity levels**, **Emergency numbers**. Click **Explore hazards**. **Expect:** `/hazards`.
8. Any alert banner on home is sample data. Your admin alerts do not appear there (known gap).

### C2. Hazard guides
1. On `/hazards`, click any card's **View full guide**. (The intro text on this page says guides "arrive in the next phase". That sentence is stale, ignore it.)
2. Visit each of these directly and confirm **no error page**: `/hazards/cyclone`, `riverine-flood`, `flash-flood`, `lightning`, `earthquake`, `cold-wave-fog`, `drought`, `heatwave`, `landslide`, `nor-wester`, `riverbank-erosion`, `salinity`, `tsunami`, `urban-waterlogging`.
3. On `/hazards/cyclone`. **Expect** these sections: **Season**, **Where**, **Before**, **During**, **After**, **Warning signals** (a table with a **Signal** column), **Myth vs fact**, **Sources**, and the notice "This guide is a draft and is being reviewed against official sources."
4. Click the **EN / বাং** switch, then **বাং**. **Expect:** the same page in Bangla at `/bn/hazards/cyclone`. Click **EN** to return.

### C3. Read aloud (changed in this build)
1. On `/hazards/cyclone` (English), click **Read aloud**. **Expect:** speech starts and the button reads **Stop reading**. Click it: speech stops.
2. Click **বাং** to switch to Bangla, then click the read-aloud button.
   - **Chrome on Windows:** **Expect** the message "এই ডিভাইসে এই ভাষার কোনো ভয়েস নেই...". No sound. That is correct, because Chrome has no Bangla voice there.
   - **Microsoft Edge:** ⚠ unrun. I expect Bangla speech, because Edge exposes Microsoft's online Bangla voices. Note whether it speaks or says "no voice".
   - **Android phone with Bangla voice data:** ⚠ unrun, expect speech.
3. While it's reading in English, click **বাং**. **Expect:** speech stops and the button resets to the Bangla label.

### C4. Emergency contacts
1. Header, **Emergency** (or **Emergency numbers** on home). **Expect:** page **Emergency contacts**, each number with **Last verified** and a call link.
2. Hover a number. **Expect:** the bottom-left status bar shows a `tel:` link.

### C5. Safety plan
1. Header, **My plan**. Fill **District** `Barguna`, **Number of people in your family** `5`. Tick **Elderly members** and **Livestock**. Tick a couple of hazards under "Which hazards concern you most?".
2. Click **Save my plan**. **Expect:** "Saved on this device", a **Family safety card**, and a **Go-bag checklist** including "Extra time and help planned for elderly members" and "A safe place identified for livestock".
3. Click **Print this plan** (or `Ctrl+P`). **Expect:** the print preview shows the card without the header, footer or form. Close the preview.
4. Reload. **Expect:** your plan is still there.

### C6. Offline and installable app (production build only)
1. Terminal: `Ctrl+C`, then `npm run build`, then `npm run start`. Open `http://localhost:3000`.
2. Visit `/`, `/hazards/cyclone`, `/contacts`, `/plan` once each.
3. `F12`, **Application**, **Service Workers**. **Expect:** `/sw.js` activated and running. **Manifest** shows "Surokkha BD".
4. `F12`, **Network** tab, the "No throttling" dropdown, **Offline**.
5. Reload each of the four pages. **Expect:** all four still load.
6. Set the dropdown back to **No throttling**. In the Terminal `Ctrl+C`, run `npm run dev` again for the rest.

---

## Phase 2. Map, data, shelters

### D1. Map
1. Open `/map`. **Expect:** title **Live map**, a Bangladesh map with OpenStreetMap tiles, layer checkboxes **Shelters**, **Earthquakes (30 days)**, **Community reports**.
2. Header theme, **Dark theme**. **Expect:** the map darkens. Switch back.
3. Tick **Earthquakes (30 days)**. **Expect:** circles and a line "Earthquakes: USGS, updated ...". If USGS is unreachable you get "Could not load earthquake data right now." That is a valid state.
4. Open `http://localhost:3000/api/quakes`. **Expect:** JSON.
5. Under **View**, click **List**, then **Map** again. **Expect:** the list and map views switch.

### D2. Shelter finder
1. Open `/shelters`, title **Find a shelter**.
2. Click **Use my location** and choose **Allow**. **Expect:** "Showing shelters near your location", each result with **Capacity**, **Accessible** (where relevant) and **Directions**. Click **Directions**: Google Maps opens.
3. Block location: click the icon left of the address bar, Site settings, Location, Block, reload. Click **Use my location**. **Expect:** "We couldn't get your location. Choose your district instead." Under **Choose a district** pick `Barguna`. **Expect:** shelters near Barguna. Reset the permission afterward.
4. **Expect** the note "This is a curated sample of shelters for this preview...".

**Known gap to remember:** `/map` and `/shelters` read a static file, not your database table. Admin shelter edits won't appear here.

---

## Phase 3. Auth, reports, admin

### E1. Login methods
1. Window 3, `/login`, tab **Password**, Fresh account email with a **wrong** password, **Log in**. **Expect:** "That email and password don't match."
2. Same page, tab **Email link**, enter the Fresh email, **Send me a login link**. **Expect:** "Check your email...". Open Gmail, copy the link, paste it into Window 3's address bar. **Expect:** you're signed in. `/account`, **Sign out**.
3. Log the Citizen (Window 1) and Admin (Window 2) back in with passwords.

### E2. Who can enter `/admin`
1. Window 3 (logged out), `/admin`. **Expect:** sent to `/login`.
2. Window 1 (Citizen), `/admin`. **Expect:** sent to the home page.
3. Window 2 (Admin), `/admin`. **Expect:** it loads.
4. In Window 2 sign the Admin out, log in as the **Coordinator**. `/admin` loads. `/admin/audit` **bounces back** to `/admin`. Then swap the Admin back in.

### E3. Alerts (Window 2, `/admin`, **Alerts** tab)
1. Under **New alert** fill: **Hazard** cyclone, **Severity**, **Title (English)** `Test cyclone alert`, **Title (Bangla)** `পরীক্ষা সতর্কতা`, **Details (English)** and **(Bangla)** anything, **District codes** `BAR,PAT`, **Source** `Test`, **Expires at** a time tomorrow. Click **Publish alert**.
2. **Expect:** it appears under **Current and recent alerts** marked **Active**. Click **Expire now**. **Expect:** **Expired**.
3. Supabase **Table Editor**, **alerts**: the row exists.
4. **Known gap:** this alert appears on no public page.

### E4. Shelters admin (**Shelters** tab)
1. Under **Add a shelter** fill both **Name** fields, **Type**, **District**, **Latitude** `22.15`, **Longitude** `90.12`, **Capacity**, **Contact**, **Source**. Click **Add shelter**. **Expect:** it joins the list.
2. Click **Deactivate**. Go to the **Overview** tab. **Expect:** **Active shelters** drops by 1. Back on **Shelters**, click **Activate**. **Expect:** it rises again.
3. Known gap: the public `/shelters` and `/map` won't change.

### E5. Report a problem (Window 3, logged out, `/report`)
1. Title **Report a problem**. Pick a type under **What are you reporting?**, type **What's happening?**.
2. Click **Send report** with no pin. **Expect:** "Tap the map to mark the location before sending."
3. Click on the map to drop a pin (or **Use my location**).
4. **Add a photo (optional):** choose any JPG. **Your phone or email (optional):** `test@test.com`.
5. **Wait at least 3 seconds after the page loaded**, then **Send report**. **Expect:** "Thank you. Your report has been sent for review."
6. Repeat once from Window 1 as the Citizen.

### E6. Behind the scenes
1. **Table Editor**, **reports**. **Expect:** 2 rows, `status` `pending`, `ip_hash` a long hex string (not a real IP), a photo path filled in.
2. **Storage**, bucket **report-photos**. **Expect:** the photo files.
3. Send reports quickly one after another. After about 3 in an hour **Expect** a "too many" error. Submitting within 3 seconds of loading the page is also refused.

### E7. Moderation (Window 2, **Reports** tab)
1. Under **Pending reports** each report shows its details, a **Contact** line and buttons **Verify**, **Reject**, **Resolve**.
2. Click **Verify** on one, **Reject** on the other.
3. Window 3, `/map`, tick **Community reports**. **Expect:** exactly **one** marker (the verified one). The rejected one must not appear.

### E8. Offline queue (Window 1)
1. `/report`. `F12`, **Network**, **Offline**.
2. Fill it with a pin, click **Send report**. **Expect:** "You're offline. Your report is saved on this device and will be sent automatically once you're back online."
3. Reload. **Expect:** a banner "1 report is waiting to send...".
4. Set throttling back to **No throttling**. **Expect:** "Sending your queued report...", then the banner clears.
5. **Table Editor**, **reports**: the new row is there.

### E9. Permission checks
1. Follow the "Checks to run" list in `supabase/tests/manual_rls_checklist.md`. Skip lines about a public alerts list or shelters on the map (the two known gaps).
2. Direct API check, Window 3: open any localhost:3000 page, `F12`, **Console**, type `allow pasting`, Enter. Paste (put your publishable key in place of `YOUR-KEY`):
```js
fetch('https://uvdbdzoqutwhpvgjjiao.supabase.co/rest/v1/reports?select=id,status&status=eq.pending',{headers:{apikey:'YOUR-KEY'}}).then(r=>r.json()).then(console.log)
```
**Expect:** `[]` (pending reports are private).

### E10. Audit log (Window 2, **Audit log** tab)
**Expect** entries for the alert create and expire, the shelter add and toggle, and the report verify and reject.

---

## Phase 4. ReliefLink and Volunteer Hub

### F1. Post a need (Window 2, `/admin`, **Relief**)
1. Under **Post a need**: **District** `Barguna`, **Item** `Rice`, **Unit** `bags`, **Quantity needed** `50`. Click **Post need**.
2. **Expect:** it appears under **Current needs** with "0 of 50 bags pledged".
3. Window 3, `/relief`. **Expect:** a card "Rice · 50 bags", Barguna, "0 of 50 bags pledged".

### F2. Pledge
1. Window 3, open the Rice card. **Expect:** "Sign in to pledge toward this need."
2. Window 1 (Citizen), open the same card. Under **Make a pledge**: **Quantity you can provide** `20`, **Handover method** `I'll drop it off`, click **Submit pledge**. **Expect:** "Thank you — your pledge was recorded. The coordinator has been notified."
3. Reload. **Expect:** "20 of 50 bags pledged", a 40% bar, and an **Activity log** line like "20 bags — Pledged · date" with **no name** attached.
4. Admin's Gmail inbox: **Expect** "Surokkha BD: new pledge for "Rice"". (Only the Resend account address receives mail.)

### F3. Coordinator handling (Window 2, **Relief**)
1. The pledge row shows "20 bags · Drop-off · Pledged" with **Mark in transit** and **Cancel**.
2. Click **Mark in transit**. **Expect:** status changes. Terminal shows `sendEmail failed 403` (expected: the donor's address isn't the Resend owner).
3. Click **Mark delivered**. **Expect:** the need's **Delivered** figure becomes 20.
4. Click **Mark fulfilled** on the need. **Expect:** it disappears from `/relief`. Its direct link still opens and says **Fulfilled**, with **no** pledge form.

### F4. Volunteer profile (Window 1, `/volunteer`)
1. Under **Become a volunteer**: tick 2 **Skills**, pick **District** and **Availability**, click **Save profile**.
2. **Expect:** the heading becomes **Your volunteer profile** and the button **Update profile**.
3. Change a skill, click **Update profile**. **Table Editor**, **volunteers**: still exactly **one** row for the Citizen.

### F5. Tasks (Window 2, **Volunteers** tab)
1. Under **Post a task**: **Task title** `Distribute food`, **Description** (10+ characters), tick a skill the Citizen has, **Volunteers needed** `1`, **District**, **Location**. Click **Post task**.
2. Window 3, `/volunteer`. **Expect:** the task under **Open tasks**. (No skill/district filters exist yet.)

### F6. Apply and decide
1. Window 3 (logged out): **Expect** "Sign in to apply." Fresh account without a profile: "Set up your volunteer profile above before applying."
2. Window 1: type a note, click **Apply**. **Expect:** "Application sent. The coordinator has been notified." Reload: "Applied — awaiting review". You can't apply twice.
3. Admin Gmail: "new application" email arrives.
4. Window 2, **Volunteers**: the application shows with **Accept** and **Decline**. Click **Accept**. **Expect:** "1 of 1 accepted", task **Filled**, and it disappears from the public list.
5. Post a second task, apply as the Citizen, click **Decline**. **Expect:** "Declined". Terminal shows a 403 (expected).
6. Post a third task and click **Close task**. **Expect:** it disappears from `/volunteer`. The Citizen also can't apply to closed or filled tasks (bug fixed in this build).

### F7. Emails at a glance
| Event | Goes to | Arrives? |
|---|---|---|
| New pledge | Admin | Yes |
| New application | Admin | Yes |
| Pledge status change | Citizen | No, 403 in Terminal |
| Accept/decline | Citizen | No, 403 in Terminal |

### F8. Stats
Window 2, **Overview**. **Expect:** five cards. **Needs fully pledged** and **Volunteer task fill rate** are non-zero.

---

## Phase 5. Learning and remote access

### G1. Data Explorer (`/explorer`, header **More**, **Explorer**)
1. **Expect** 10 events on the **Timeline** and a bar chart under **Estimated deaths by hazard type**.
2. **Filter by district**, `Sylhet`: **Expect** 4 events. `Barguna`: **Expect** 2. **All districts**: 10.
3. Click **Download CSV**, open it in Excel: a header row plus one row per event shown.
4. Every event shows a **Source** and a **link**. The 1918 earthquake shows a note about disputed casualty numbers.
5. Under the chart click **View as table**. **Expect:** a table with the same numbers.

### G2. Quizzes (`/quiz`)
1. Click **Start quiz →** on **Lightning**. **Expect:** "Question 1 of 2". Click an answer: it highlights and shows an explanation. **Next**, then **See results**: "You scored X out of 2".
2. Do at least 3 hazards, one of them in Bangla at `/bn/quiz`.

### G3. Games (`/games`)
1. **Lightning: Safe or Not?** 8 scenarios: click **Safe** or **Not safe**, then **Next**, finally **See results**.
2. **Pack a Go-Bag:** tap up to 10 items (an 11th won't select), click **Pack the bag**. **Expect:** "You packed X of 12 essential items", a "You missed" list, and **Play again**.

### G4. Progress (footer link **My progress and badges**, or `/progress`)
**Expect:** "X of 14 hazard quizzes completed" and badge cards. **First quiz completed** shows **Earned**. Reload: still earned. Window 3 shows it not earned (progress is per browser).

### G5. Teacher mode (footer link **Teacher mode...**)
1. `/teacher`, **Open worksheet →** on **Cyclone**. **Expect:** a checklist and 2 quiz questions.
2. Tick **Show answer key**, click **Print**. **Expect:** the preview has no header or footer, and the answer key starts on its own page.

### G6. Lite mode (footer link **Lite mode...**, or `/lite`)
1. **Expect:** plain text and links, no map or images.
2. Measure: `F12`, **Network**, tick **Disable cache**, throttle **Slow 3G**, reload. Read the bottom bar "X kB transferred". Write the number down. The goal is under 100 KB. ⚠ unrun.

### G7. Ferries (header **More**, **Ferries**)
1. **Expect** 3 routes marked "UNVERIFIED, confirm before travel".
2. Window 3: **Route** `Dhaka to Bhola`, **Your question** `Is the evening launch running?`, click **Send request** (wait 2+ seconds after load). **Expect:** "Sent. A coordinator will follow up...".
3. Send 6 in a row (reload each time). From about the 6th, **Expect:** "Too many requests from this connection recently, please try again later."
4. Window 2, **Ferries** tab: type a reply in **Type a reply...**, click **Send reply** on one; click **Close without reply** on another. (Replies are stored but no public page shows them yet.)
5. **Add a route**: fill it, click **Add route**, check it on `/ferries`, then **Delete** it.

---

## Phase 6. Security, legal, SEO, keep-alive

### H1. Security headers and CSP (production mode)
1. Terminal: `npm run build`, `npm run start`.
2. Open a second PowerShell: `curl.exe -I http://localhost:3000`. **Expect** lines `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`. In the CSP line **expect no** `unsafe-eval`.
3. Open `/`, `/map`, `/report`, `/hazards/cyclone` with `F12`, **Console**. Any red "Refused to load..." or "violates Content Security Policy" means the policy blocks something. Note the text. (Errors from browser extensions are not from the app.)
4. Stop the server, run `npm run dev` again.

### H2. Privacy and terms
Footer, **Privacy policy** and **Terms of use**, in English and Bangla. **Expect:** a "Last updated" date. The privacy page states it's a draft not reviewed by a lawyer.

### H3. Account deletion (do this **last**; it destroys the Citizen)
1. First, in Supabase SQL Editor, run and note the result:
```sql
select 'reports' as t, count(*) filter (where reporter_id is not null) as with_owner from reports
union all select 'pledges', count(*) filter (where donor_id is not null) from pledges
union all select 'applications', count(*) from task_applications;
```
2. Window 1, `/account`. Click **Delete my account**. A box appears: type `DELETE` into "Type DELETE to confirm", click **Permanently delete my account**. **Expect:** you're sent home, signed out.
3. `/login` as the Citizen. **Expect:** "That email and password don't match."
4. Re-run the SQL from step 1. **Expect:** `with_owner` counts for reports and pledges **drop**, and `applications` drops.
5. Run `select id, donor_id from pledges;`. **Expect:** the pledge **still exists** with an empty `donor_id`.
6. **Authentication**, **Users**: the Citizen is gone. **Table Editor**, **profiles**: their row is gone.
7. A red error at step 2 means a foreign key blocked it. Note the text.

### H4. SEO and sharing
1. `/robots.txt`: rules and a sitemap line. `/sitemap.xml`: pages each listing English and Bangla versions.
2. `/opengraph-image`: a dark branded image with "Surokkha BD". `/bn/opengraph-image`: Bangla text (⚠ unrun for font rendering).
3. On `/`, `Ctrl+U`, `Ctrl+F`, search `og:image`. **Expect** a tag pointing at the image.

### H5. Case study
`/case-study` and `/bn/case-study` (footer link **Case study**). Read both and note anything that sounds wrong.

### H6. Keep-alive (after you deploy to Vercel)
1. Vercel project, **Settings**, **Cron Jobs**: one job `/api/health`.
2. Open `https://<your-site>/api/health`: `"supabase":"reachable"`.
3. GitHub repo, **Settings**, **Secrets and variables**, **Actions**, **Variables** tab, **New repository variable**: name `SITE_URL`, value your Vercel URL. Then the **Actions** tab, **Keep Supabase awake**, **Run workflow**. **Expect** a green check.
4. Vercel, **Settings**, **Environment Variables**: add the same variables as `.env.local`, including `IP_HASH_SALT`.

### H7. The four human-only checks
Follow `docs/PHASE6_HUMAN_CHECKLIST.md` for the accessibility audit (axe + NVDA), a Lighthouse run (target 90+ on mobile), a real low-end Android phone, and Bangla and safety content review. For the phone: `ipconfig` shows your PC's IPv4 address, and with `npm run start` running you can open `http://<that address>:3000` on the same WiFi (allow the Windows Firewall prompt).

---

## Final pass

1. Admin `/admin`, **Overview** shows five sensible stat cards.
2. Switch to **বাং** and repeat one flow from each phase in Bangla.
3. Keep the **Console** open through everything. Note any red errors.
4. Fill in the tracker below and send it to me.

**Known gaps you can skip testing:** public shelters read a static file, admin alerts show nowhere public, no task filters, `/hazards` intro text is stale.

### Results tracker
Copy this table and mark each section Pass / Fail / Skipped, with the step ID and what you saw for any fail.

| Section | Result | Failing step ID and what you saw |
|---|---|---|
| 0. Setup and accounts | | |
| C. Phase 1 knowledge core | | |
| D. Phase 2 map and shelters | | |
| E. Phase 3 auth, reports, admin | | |
| F. Phase 4 relief and volunteers | | |
| G. Phase 5 learning and remote access | | |
| H. Phase 6 security, legal, SEO | | |
| Final pass (Bangla, console errors) | | |
