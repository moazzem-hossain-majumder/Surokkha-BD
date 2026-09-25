# Design: Surokkha BD

The interface must feel **modern, calm, and trustworthy**: strong enough to sit in a portfolio and to be shown to an NGO board without apology. Emergency products fail when they feel frightening or cheap. This one should feel like **a well-run, caring institution**.

## 1. Design intent

| Question | Answer |
|---|---|
| Who is it for? | Coastal, haor, hill, and city residents; volunteers; donors; coordinators; children and teachers |
| Primary job | Help someone know what to do and where to go, quickly, in English or Bangla, whichever they choose |
| Feeling | Calm, clear, dignified, capable |
| Not | Alarmist, cluttered, generic NGO template, "government portal" |
| Memorable thing (spend boldness here) | **The hazard-adaptive color system**: each disaster page takes on its own atmosphere while the product stays coherent |

### Concept: "Delta Atlas"

Bangladesh is a delta: water, silt, and sky. The interface borrows from **atlas and weather-chart language**: precise, layered, humane. A restrained neutral base with **one distinctive accent per hazard** that tints the page (hero wash, icon, charts, badges) when the user is inside that hazard's context.

## 2. Principles

1. **Calm by default, urgent only when needed.** Emergency red is rare and earned.
2. **English by default, Bangla as an equal.** English is the default, and switching to Bangla must feel native, not translated. Layouts, sizes, and rhythm are tested in both languages, because Bangla runs taller and often longer than English.
3. **Color is never alone.** Every color carries an icon and a label.
4. **Actions before reading.** The top of each screen offers the next step.
5. **Honest data.** Source and freshness are visible design elements.
6. **One bold move per screen.** Everything else stays quiet.
7. **Dignity in imagery.** Illustrations of people are active and capable, never victims.

## 3. Color system

### 3.1 Brand base (neutral and identity)

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#F5F8F7` (Monsoon paper) | `#0A1419` (Deep river) | Page background |
| `--surface` | `#FFFFFF` | `#0F1D24` | Cards, sheets |
| `--surface-2` | `#EAF0EE` | `#152730` | Raised or inset areas |
| `--border` | `#D3DEDA` | `#233842` | Dividers, outlines |
| `--ink` | `#0E1F27` | `#E8F0EE` | Primary text |
| `--ink-2` | `#3E545C` | `#A9BDBF` | Secondary text |
| `--ink-3` | `#6A7E84` | `#7C9296` | Tertiary (large or non-essential text only) |
| `--brand` | `#0B7A65` (Delta green) | `#3FCBA9` | Primary buttons, links, focus |
| `--brand-ink` | `#FFFFFF` | `#04211A` | Text on brand |
| `--brand-soft` | `#D8F0E9` | `#0F3A31` | Tinted brand backgrounds |
| `--sun` | `#E5484D` (Sun red, from the flag) | `#FF6B70` | Emergency actions only |
| `--sun-soft` | `#FDE5E6` | `#3B1518` | Emergency tint |

> Verify all pairs with a contrast checker. Text must meet 4.5:1, large text and UI components 3:1, in both themes.

### 3.2 Hazard palette

Each hazard has an `--h-*` (accent), `--h-*-soft` (tint), and `--h-*-ink` (text on soft). Light values shown, then dark.

| Hazard | Feeling / reasoning | Accent (light) | Accent (dark) | Soft (light) | Soft (dark) |
|---|---|---|---|---|---|
| **Cyclone and storm surge** | Storm indigo, swirling depth | `#4B3FBF` | `#9A90FF` | `#E8E6FB` | `#221E4F` |
| **Riverine flood** | River blue | `#1565C0` | `#5AA9FF` | `#E1EEFB` | `#12294A` |
| **Flash flood** | Fast, bright cyan | `#0088A8` | `#3CD0F0` | `#DDF3F8` | `#0D3440` |
| **Urban waterlogging** | Concrete slate-blue | `#3F5B7A` | `#8FB0D3` | `#E4EAF1` | `#1B2A3A` |
| **Riverbank erosion** | Silt and sienna | `#A4562B` | `#E7936A` | `#F7E7DD` | `#3E2415` |
| **Landslide** | Clay and umber | `#7A4B2A` | `#C99668` | `#EFE3D8` | `#33210F` |
| **Earthquake** | Fault-line crimson | `#B3261E` | `#FF7A70` | `#FBE4E2` | `#421512` |
| **Lightning** | Charged amber | `#B87A00` | `#FFC53D` | `#FFF2CC` | `#3D2F00` |
| **Nor'wester / tornado** | Bruised steel violet | `#6B4E9B` | `#B79BE8` | `#EDE6F6` | `#2B2040` |
| **Drought** | Parched ochre | `#A67C00` | `#E5B93C` | `#F8EFCF` | `#3A2E08` |
| **Heatwave** | Blazing orange | `#D1490F` | `#FF8A50` | `#FDE6DA` | `#43200E` |
| **Cold wave and fog** | Frosted blue-grey | `#4D7C8A` | `#9CC7D4` | `#E3EEF1` | `#1B3138` |
| **Salinity intrusion** | Salt-crust sea green | `#2C8C7E` | `#6EDBC8` | `#DDF1EE` | `#0F3A34` |
| **Tsunami risk** | Deep ocean teal | `#0B5E73` | `#4FB7D2` | `#D9EBF0` | `#0C2E38` |

Rules:
- Similar hues (cyclone, flood, flash flood, urban, tsunami) are always distinguished by **icon plus name**, never color alone.
- Accent colors on text must pass contrast. When they don't (yellows, ochres), use the `-ink` variant for text and keep the accent for fills, borders, and icons.
- Only one hazard accent is active per page. Multi-hazard views (map, explorer) use the accent as a small marker, with a neutral base.

### 3.3 Severity scale (independent of hazard color)

Severity must not clash with hazard colors, so it uses **shape plus label plus intensity**.

| Level | Label (en / bn) | Token | Light | Dark | Icon shape |
|---|---|---|---|---|---|
| 0 | Normal / স্বাভাবিক | `--sev-0` | `#5E7B76` | `#8AA6A0` | Circle |
| 1 | Watch / সতর্ক থাকুন | `--sev-1` | `#B08900` | `#F2C94C` | Triangle outline |
| 2 | Warning / সতর্কতা | `--sev-2` | `#D9730D` | `#FF9F45` | Triangle solid |
| 3 | Danger / বিপদ | `--sev-3` | `#D6342C` | `#FF6B62` | Octagon |
| 4 | Extreme / মহাবিপদ | `--sev-4` | `#8E1B4F` | `#F26BA5` | Octagon plus double border |

Severity badge = shape icon + label + 3 px leading edge. Level 4 also gets a pulse **only if reduced-motion is off**, and the pulse stops after 3 cycles.

### 3.4 Semantic

`--success #1E8E5A / #4FD08C`, `--info #1F6FEB / #6CA8FF`, `--warning` uses `--sev-2`, `--danger` uses `--sev-3`.

### 3.5 Implementation

```css
:root {
  --bg:#F5F8F7; --surface:#FFFFFF; --surface-2:#EAF0EE; --border:#D3DEDA;
  --ink:#0E1F27; --ink-2:#3E545C; --ink-3:#6A7E84;
  --brand:#0B7A65; --brand-ink:#FFFFFF; --brand-soft:#D8F0E9;
  --sun:#E5484D; --sun-soft:#FDE5E6;
  --h-accent: var(--brand); --h-soft: var(--brand-soft); --h-ink: var(--ink);
}
:root[data-theme="dark"] {
  --bg:#0A1419; --surface:#0F1D24; --surface-2:#152730; --border:#233842;
  --ink:#E8F0EE; --ink-2:#A9BDBF; --ink-3:#7C9296;
  --brand:#3FCBA9; --brand-ink:#04211A; --brand-soft:#0F3A31;
  --sun:#FF6B70; --sun-soft:#3B1518;
}
/* Hazard scope: set on the page wrapper */
[data-hazard="cyclone"] { --h-accent:#4B3FBF; --h-soft:#E8E6FB; }
:root[data-theme="dark"] [data-hazard="cyclone"] { --h-accent:#9A90FF; --h-soft:#221E4F; }
/* repeat for each hazard from the table */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* same values as dark block */ }
}
```

Never reference raw hex in components. Use `var(--h-accent)` and friends, or Tailwind theme aliases mapped to the tokens.

## 4. Dark mode

- Options: **Light, Dark, System** (default System). Stored in `localStorage` and applied before first paint (inline script) to avoid flash.
- Dark is not an inverted light theme. It is a **deep river-blue** base (not pure black) with slightly desaturated surfaces and brighter accents.
- Elevation in dark uses lighter surfaces and a subtle 1 px border, not heavy shadows.
- Photos and illustrations dim slightly (`filter: brightness(.92)`), and maps switch to a dark tile style.
- Charts use the dark accent values and lighter gridlines at low contrast.
- Toggle lives in the header with a clear label. It is also in settings. The icon morphs smoothly (sun and moon), and this motion respects reduced-motion.
- Test every screen in both themes before closing a task.

## 5. Typography

Paired for English as the default with Bangla as a full peer. Both scripts must look like one family and stay legible on low-end screens.

| Role | Font | Notes |
|---|---|---|
| **Display / headlines** | English: **Bricolage Grotesque** (or a similar characterful grotesque). Bangla: **Anek Bangla** (variable, supports width and weight) | Choose weights and sizes so the two scripts look visually matched. Headings 600 to 700 |
| **Body / UI** | **Hind Siliguri** (Latin and Bangla in one family) | Keeps mixed-language screens consistent. Highly readable at small sizes |
| **Numbers / data** | Body font with tabular figures. Bangla numerals optional toggle | Charts, counts, capacities |
| **Fallback** | `"Noto Sans Bengali", system-ui, sans-serif` | Always specified |

> Confirm font availability and licenses on Google Fonts, and subset to Bengali plus Latin. Load with `font-display: swap`. Self-host for performance and offline use.


### 5.1 Language switch (design spec)

- **Placement:** header, top right on desktop. On mobile, inside the top bar next to the theme toggle, always one tap away.
- **Form:** a compact segmented control showing `EN | বাং` with the active language highlighted. The Bangla label is always written in Bangla script so a Bangla reader can find it even when the page is in English.
- **Behavior:** switches instantly on the same page, keeps scroll position and form state, and remembers the choice. `lang` on the `<html>` element updates for screen readers.
- **First visit:** English. If the browser prefers Bangla, show a small dismissible banner: "বাংলায় দেখুন" with an "English" undo. Never switch without asking.
- **Layout safety:** every component is checked in both languages. Bangla needs more line-height (at least 1.6) and its text can be longer, so buttons and chips must grow instead of truncating.
- **Missing translation:** show the other language with a small note, never a blank or a raw key.
- **Read-aloud** uses the voice for the active language when available, and tells the user if a Bangla voice is not installed.

### Scale (mobile / desktop)

| Token | Size | Line height | Use |
|---|---|---|---|
| `display` | 40 / 64 px | 1.15 | Hero |
| `h1` | 32 / 44 px | 1.25 | Page title |
| `h2` | 24 / 32 px | 1.35 | Sections |
| `h3` | 20 / 24 px | 1.45 | Cards |
| `body-lg` | 18 px | 1.75 | Safety steps (default for guides) |
| `body` | 16 px | 1.7 | Standard text |
| `small` | 14 px | 1.6 | Meta, captions |

Rules:
- **Bangla line-height at least 1.6**, and never use letter-spacing on Bangla.
- Line length under 70 characters for reading text.
- Sentence case everywhere. No all-caps labels. Avoid decorative eyebrow labels above headings.
- Text-size control (A− / A / A+) in settings. Layout must survive 200% zoom.

## 6. Layout and spacing

- 4 px base grid. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Container max width 1200 px. Reading width 720 px.
- Mobile-first. Breakpoints: 360, 640, 768, 1024, 1280.
- **Mobile:** bottom navigation (Home, Guides, Map, Shelters, More) plus a floating emergency button. Desktop: top nav with a compact search.
- Radii are **purposeful, not uniform**: 6 px inputs, 12 px cards, 20 px sheets and hero panels, full radius for pills and the emergency button.
- Alignment: left-aligned text (better for Bangla and reading). Center only for short hero statements and empty states.

## 7. Iconography and illustration

- One consistent icon set (for example Lucide) plus **custom hazard icons** (14) drawn on a shared 24 px grid, 1.75 px stroke, rounded caps.
- Each hazard icon must be recognizable in monochrome.
- Illustration style: **flat, layered paper-cut landscapes** with soft gradients of the hazard accent (river, sky, silt), used for hero backdrops and empty states. People are shown helping and preparing, with respectful proportions and diverse dress and regions.
- No stock disaster photography of suffering. If photography is used, choose preparedness, community, and recovery moments with consent and credit.

## 8. Key screens and their signature elements

### 8.1 Home
- **Hero:** left-aligned. A calm English headline (Bangla when switched), one line of support, and three primary actions (Find shelter, My safety plan, Emergency numbers). Behind it, a slowly layered delta landscape that subtly shifts to reflect the **current top alert's hazard color**. If no alert, the neutral brand palette.
- **Risk banner:** slim, sits above the header when an active alert exists. Severity shape, hazard, area, source, "updated 12 min ago". Dismissible per alert, never hidden permanently.
- **Hazard grid:** 14 tiles, each with icon, name, season chip, and a hazard-tinted hover/focus state. Filterable by region (coast, haor, hill, city).
- **Live strip:** small counters (active alerts, verified reports today, open relief needs) with sources.

### 8.2 Hazard page
- Page wrapper sets `data-hazard`. Hero uses the hazard tint and icon at large scale.
- Sticky **"Before / During / After"** segmented control, with the current tab mirrored in the URL.
- Steps are large cards with icons, short sentences, and a checkbox to track progress offline.
- Local warning signals (for example cyclone signals) are shown as **visual flags/lights** with plain-language meaning.
- Myth vs fact as flip cards that also work as expandable text.
- Sources and "last reviewed" at the bottom.

### 8.3 Map
- Full-bleed map, floating filter sheet (bottom sheet on mobile).
- Layer chips with hazard icons and color. Markers use shape plus color plus icon.
- Cluster markers for density. Popups are cards with source and freshness.
- A **List view toggle** shows the same data as an accessible list.
- Dark theme uses a muted dark tile layer.

### 8.4 Shelter finder
- "Use my location" primary button plus manual district picker.
- Result cards: name, distance, capacity bar, type, accessibility icons, call and directions buttons.
- Map and list synced. Selecting a card pans the map.

### 8.5 My Safety Plan
- Conversational stepper, one question per screen, large tap targets, progress indicator.
- Output is a clean, printable "family card" with a checklist, contacts, meeting point, and nearest shelter. It has a print stylesheet that works in black and white.

### 8.6 ReliefLink
- Needs board with **stacked progress bars** (delivered, in transit, pledged, remaining), patterned fills in addition to color.
- Each need shows district, deadline, and coordinator. The pledge dialog is short (quantity, handover, contact).
- Activity log is a readable timeline.

### 8.7 Volunteer Hub
- Skill chips, district filter, task cards with slots filled (for example 3 / 5). Apply is one tap for logged-in users.

### 8.8 Data Explorer
- Editorial-quality charts: a **decade timeline** of events, small multiples per hazard, a district heat map. Each chart has a written summary and a data table toggle.
- Source citations under every chart. Downloading CSV is prominent.
- Chart colors use the hazard palette, with direct labels instead of legends where possible.

### 8.9 Kids' Safety Zone
- Warmer, rounder, playful: larger radii (24 px), friendly mascot (a heron or a river dolphin, to be decided), and bigger type. Still uses the same tokens and hazard colors so it feels part of the family.
- Rewards are gentle: badges, streaks, and no timers that cause anxiety.

### 8.10 Lite mode
- Single-column, system-like layout, no hero illustration, minimal icons, big text. Clear toggle between Lite and Full. Shows a small "Lite mode, about 60 KB" note.

### 8.11 Admin dashboard
- Dense but calm. Left sidebar, tables with sticky headers, status pills, and keyboard shortcuts for moderation (approve, reject, next).

## 9. Components (build list)

Buttons (primary, secondary, ghost, emergency), inputs, select, combobox (district), segmented control, tabs, accordion, chips, badges (severity, hazard, status), cards (hazard, shelter, need, task, report), progress bars, stepper, dialogs and bottom sheets, toasts, tooltips, skeleton loaders, empty states, error states, data table, chart wrappers, map popup, timeline, breadcrumb, language and theme switches, emergency floating button, install-app prompt, offline indicator.

Each component documents: states (default, hover, focus, active, disabled, loading, error), sizes, dark mode, and Bangla and English text at 200% zoom.

### Buttons
- Primary: brand fill. Emergency: `--sun` fill, used only for call and urgent actions.
- Height 48 px (56 px for primary emergency actions). Focus ring 3 px with 2 px offset, high contrast in both themes.

## 10. Motion

Motion is sparse and purposeful.

- **One orchestrated moment:** the Home hero landscape layers slide into place once on first load (about 600 ms).
- Interaction feedback: button press, sheet open and close, tab change, and progress bar fill. These are short (120 to 240 ms) and use ease-out.
- Hazard pages: the tint transitions in when navigating from Home (shared color, about 300 ms).
- No scroll-triggered fade-in on every section. No parallax.
- `prefers-reduced-motion`: replace movement with instant or opacity-only changes.
- Never animate critical alerts in a way that flashes (WCAG: no more than 3 flashes per second).

## 11. Accessibility and inclusivity (design-level)

- Contrast 4.5:1 body and 3:1 UI, tested in light and dark.
- Focus states are highly visible and consistent.
- Icon plus text for every status.
- Touch targets 44 px minimum, 56 px for emergency.
- Read-aloud, text-size control, and simple-language mode.
- Works for low-vision, color-blind (test with simulators), and low-literacy users.
- Provide a high-contrast option in settings.
- Support one-handed use: primary actions in the lower half on mobile.

## 12. Voice and microcopy

- Plain, warm, direct. Short sentences. Active voice.
- Buttons say what happens: "Find nearest shelter", "Save my plan", "Send report".
- Errors say what went wrong and what to do: "We couldn't get your location. Choose your district instead."
- Empty states invite action: "No reports near you yet. Report a problem."
- Avoid fear language. Say "Leave now to the shelter at..." rather than dramatic wording.
- Consistency: the same action has the same name across the app (Report, Pledge, Volunteer).

## 13. Brand assets

- **Logo concept:** a stylized shield-and-wave mark, or a heron in flight, drawn on the icon grid, working in one color and on both backgrounds. Wordmark in Latin (default) and Bangla.
- Favicon, PWA icons (192, 512, maskable), and social share images per hazard (bn and en).
- Provide a small brand page (in the repo docs) with logo clear space and usage.

## 14. Pitch-quality checklist

Before showing this to an NGO or adding to the portfolio:

- [ ] Real English and Bangla copy, proofread, with no placeholder text
- [ ] All 14 hazard pages styled with their palette in both themes
- [ ] No layout shifts, no broken states, no console errors
- [ ] Screenshots and a short screen recording on a real phone
- [ ] Empty, loading, and error states polished
- [ ] Sources shown on every data view
- [ ] Lighthouse 90+ and axe with zero critical issues
- [ ] Case study with problem, research, design decisions (palette rationale, Bangla typography), and outcomes

## 15. Anti-patterns to avoid

- The generic "NGO template" (stock photo hero, three identical feature cards, blue gradient)
- One card style repeated for everything
- Red everywhere. Red is reserved for emergency actions and the highest severity
- Color-only status indicators
- Tiny Bangla text, tight line-height, or letter-spaced Bangla
- Decorative animation that competes with safety information
- Dark mode as a simple invert
