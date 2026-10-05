# Surokkha BD (সুরক্ষা) — National Disaster Resilience Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres_%2B_PostGIS-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![E2E Test Suite](https://img.shields.io/badge/E2E_Tests-100%25_PASS-success?style=for-the-badge)](docs/images/testing/all_phases_results.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **Free, bilingual (English & বাংলা) disaster preparedness, real-time crisis response, and community recovery platform tailored for Bangladesh.** Built with a $0 infrastructure budget on free tiers, fully offline-resilient, and featuring life-saving GIS navigation, crowd-sourced incident reporting, relief coordination, and gamified public education.

> ⚠️ **Notice:** Surokkha BD is a public resilience platform and does not replace official bulletins. Always follow warnings from the **Bangladesh Meteorological Department (BMD)**, **Department of Disaster Management (DDM)**, and **Flood Forecasting and Warning Centre (FFWC)**.

---

## 🎬 Master System Walkthrough (Dark Mode)

Experience the complete end-to-end platform in high resolution. Click below to view the master walkthrough video:

[![Surokkha-BD Master Tour](docs/images/readme_dark_showcase/01_home_header_dark.png)](docs/images/readme_dark_showcase/master_full_experience_dark.webm)

> 📹 **Master Session Video:** [Watch the Full Unclipped Dark Mode Walkthrough (`master_full_experience_dark.webm`)](docs/images/readme_dark_showcase/master_full_experience_dark.webm)  
> *Demonstrates all 6 operational phases: Knowledge Core, GIS Map & Shelters, Citizen Auth & Incident Reporting, ReliefLink & Volunteers, Interactive Learning Arcade, and Low-Bandwidth Mode.*

---

## 🧭 How Surokkha BD Works: The Citizen Journey

Disasters in Bangladesh follow distinct phases—from seasonal preparedness and early warning, to active crisis survival, through community-led relief. Surokkha BD is architected around this exact lifecycle:

```
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│   1. BEFORE DISASTER      │  ──► │    2. DURING CRISIS       │  ──► │    3. AFTER DISASTER      │
│  • 14 Hazard Guides       │      │  • Multi-Layer GIS Maps   │      │  • ReliefLink Need Board  │
│  • 5-Step Safety Planner  │      │  • GPS Shelter Finder     │      │  • Volunteer Task Hub     │
│  • Lifesaving Simulations │      │  • Citizen SOS Pinning    │      │  • Casualty Analytics     │
│  • Emergency Directory    │      │  • Low-Bandwidth Lite Mode│      │  • Community Recovery     │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

---

## 📸 Step-by-Step Visual Tour (Dark Mode Showcase)

### Step 1: Preparedness & Knowledge Core
*Equipping citizens with vetted survival protocols before catastrophe strikes.*

| Top Navigation & Emergency Speed-Dial | 14-Hazard Vulnerability Catalog |
| :---: | :---: |
| ![Header](docs/images/readme_dark_showcase/01_home_header_dark.png) | ![Hazards Catalog](docs/images/readme_dark_showcase/02_hazards_catalog_dark.png) |
| **How it works:** Instant access to 24/7 hotline buttons (999, 1090, 16263), quick search, instant language switcher (EN/BN), and theme toggle. | **How it works:** Grid covering all 14 Bangladeshi hazards—from Bay of Bengal Cyclones and Haor Flash Floods to Kalbaishakhi storms and Nor'westers. |

| Interactive Hazard Survival Guide | One-Tap Emergency Contact Directory |
| :---: | :---: |
| ![Hazard Guide](docs/images/readme_dark_showcase/03_cyclone_guide_dark.png) | ![Emergency Contacts](docs/images/readme_dark_showcase/04_emergency_contacts_dark.png) |
| **How it works:** Structured, multi-stage guidance detailing **Before, During, and After** actions, warning signal decoders, and audio-visual tips. | **How it works:** Sourced, verified emergency telephone numbers for fire services, coastal guards, red crescent, and medical support. |

---

### Step 2: Real-Time GIS Mapping & Shelter Navigation
*Location intelligence when seconds count.*

| Road Network & Critical Points | High-Resolution Satellite Reconnaissance |
| :---: | :---: |
| ![Road Network](docs/images/readme_dark_showcase/06_map_roads_dark.png) | ![Satellite Reconnaissance](docs/images/readme_dark_showcase/07_map_satellite_dark.png) |
| **How it works:** Interactive Leaflet GIS mapping displaying active weather alerts, verified emergency shelters, and historical USGS seismic hotspots. | **How it works:** Satellite imagery layer allows users to inspect coastal embankments, river swelling, and inundated roads. |

| Topographic Elevation Layer | GPS Geo-Shelter Proximity Finder |
| :---: | :---: |
| ![Topographic Terrain](docs/images/readme_dark_showcase/08_map_terrain_dark.png) | ![Shelter Finder](docs/images/readme_dark_showcase/09_shelter_finder_dark.png) |
| **How it works:** Topographic contour analysis reveals low-lying inundation zones versus high ground in flood-prone districts. | **How it works:** Uses browser geolocation and Haversine algorithms to instantly list the nearest cyclone and flood shelters with distance, capacity, and status. |

---

### Step 3: Incident Reporting & Citizen Dashboard
*Empowering affected citizens on the ground to feed ground truth into the response pipeline.*

| Secure Citizen Registration & Auth | Personalized Citizen Dashboard |
| :---: | :---: |
| ![Citizen Register](docs/images/readme_dark_showcase/10_auth_register_dark.png) | ![Dashboard Portal](docs/images/readme_dark_showcase/11_dashboard_portal_dark.png) |
| **How it works:** Password and magic link authentication with role-based access control (Citizen, Volunteer, Coordinator, Admin). | **How it works:** Overview of submitted incident reports, volunteer badge achievements, and localized emergency alerts. |

| Crowdsourced Incident Submission with Map Pinning | Offline 5-Step Family Safety Plan Builder |
| :---: | :---: |
| ![Citizen Report](docs/images/readme_dark_showcase/12_citizen_report_dark.png) | ![Safety Plan](docs/images/readme_dark_showcase/05_safety_plan_dark.png) |
| **How it works:** Click-to-pin geolocation map, photo upload, and severity selection. Submissions queue locally if offline and sync upon reconnecting. | **How it works:** Guides households through establishing meeting spots, emergency contacts, medical contingencies, and safe routes. Saves to `localStorage`. |

---

### Step 4: Community Relief & Volunteer Logistics
*Direct peer-to-peer and NGO resource matching without bureaucratic delays.*

| ReliefLink Verified Supply Needs | Volunteer Response Task Hub |
| :---: | :---: |
| ![ReliefLink](docs/images/readme_dark_showcase/13_relief_needs_dark.png) | ![Volunteer Hub](docs/images/readme_dark_showcase/14_volunteer_hub_dark.png) |
| **How it works:** Real-time catalog of urgent survival supplies (dry food, oral saline, water purification tablets) requested by verified coordinators. | **How it works:** Connects skilled local volunteers (first aid, rescue boat operators, logistics) to field tasks across all 64 districts. |

---

### Step 5: Gamified Education & Interactive Simulations
*Engaging youth and schools with interactive life-safety micro-games and quizzes.*

| Interactive Games Arcade | Lightning Survival Simulator |
| :---: | :---: |
| ![Games Arcade](docs/images/readme_dark_showcase/18_games_arcade_dark.png) | ![Lightning Game](docs/images/readme_dark_showcase/19_lightning_game_dark.png) |
| **How it works:** Central hub featuring safety mini-games designed to teach emergency instincts under simulated pressure. | **How it works:** Realistic storm environment testing instant reaction (30-30 rule, crouching position, avoiding tall trees) with dynamic electrical effects. |

| 72-Hour Emergency Go-Bag Challenge | 14-Hazard Quiz Catalog |
| :---: | :---: |
| ![Go-Bag Challenge](docs/images/readme_dark_showcase/20_gobag_game_dark.png) | ![Quiz Catalog](docs/images/readme_dark_showcase/16_quiz_catalog_dark.png) |
| **How it works:** Interactive drag-and-drop inventory simulation teaching citizens what essentials to pack within tight weight limits. | **How it works:** Modular quizzes covering each natural hazard, tracking mastery levels, scores, and streak milestones. |

| Dynamic Quiz Player with Confetti & Sounds | Citizen Preparedness Badges & Progress |
| :---: | :---: |
| ![Quiz Player](docs/images/readme_dark_showcase/17_quiz_player_dark.png) | ![Badges Tracker](docs/images/readme_dark_showcase/21_progress_badges_dark.png) |
| **How it works:** Multi-choice questions with instant sound effects, streak multipliers, detailed explanations, and celebration confetti. | **How it works:** Earnable digital badges (Cyclone Ready, First Aider, Storm Spotter) encouraging sustained engagement. |

---

### Step 6: Remote Access, Inland Waterways & Governance
*Resilience for remote delta islands and low-connectivity environments.*

| High-Performance Low-Bandwidth Lite Mode | Inland River Ferry Tracking & SOS Beacon |
| :---: | :---: |
| ![Lite Mode](docs/images/readme_dark_showcase/23_lite_mode_dark.png) | ![Ferries Tracking](docs/images/readme_dark_showcase/24_ferries_tracking_dark.png) |
| **How it works:** Strips all heavy images, scripts, and maps into pure lightweight semantic HTML for 2G networks and low-end mobile devices. | **How it works:** Schedules, river route monitoring, and direct emergency signal dispatch for major passenger launches across the Padma and Meghna rivers. |

| Teacher Mode Classroom Worksheets | DRR National Resilience Case Study |
| :---: | :---: |
| ![Teacher Mode](docs/images/readme_dark_showcase/22_teacher_mode_dark.png) | ![Case Study](docs/images/readme_dark_showcase/26_case_study_dark.png) |
| **How it works:** Generates printable PDF worksheets and teacher answer keys for rural school disaster drills. | **How it works:** In-depth technical and policy analysis covering platform architecture, data models, and humanitarian impact. |

---

## 🏗️ Technical Architecture

```mermaid
flowchart TD
    subgraph Client["Citizen & Responder Device (Desktop / Mobile)"]
        UI["Next.js 16 App Router UI\n(English & বাংলা via next-intl)"]
        SW["Service Worker (sw.js)\n(Offline Shell & Incident Queue)"]
        LS["Browser Storage\n(Safety Plans, Game XP, Theme)"]
    end

    subgraph Edge["Vercel Edge Network ($0 Free Tier)"]
        RSC["React Server Components & Server Actions"]
        API["Route Handlers\n(/api/reports, /api/health, /api/quakes)"]
        Proxy["proxy.ts\n(Bilingual Routing & Session Verification)"]
    end

    subgraph Data["Supabase Backend ($0 Free Tier)"]
        DB[("PostgreSQL 16 + PostGIS\nStrict RLS on Every Table")]
        Auth["Supabase Auth\n(Session JWTs & Role RBAC)"]
        Storage["Object Storage\n(Damage Assessment Photos)"]
    end

    External["External Services\n(USGS Earthquakes API, Resend Email)"]

    UI --> Proxy --> RSC
    UI --> API
    SW -. Offline Sync Queue .-> API
    RSC --> DB
    RSC --> Auth
    API --> DB
    API --> External
    RSC --> Storage
    RSC --> External
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Core Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React 19) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict typing across client, server, and seed schemas) |
| **Styling & Design** | [Tailwind CSS 4](https://tailwindcss.com/) + Custom Glassmorphism Theme System (Light & Dark) |
| **Localization** | [next-intl](https://next-intl-docs.vercel.app/) (100% bilingual English & Bengali across all 20+ routes) |
| **Database & GIS** | [Supabase](https://supabase.com/) (PostgreSQL 16 with **PostGIS** geospatial extensions) |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) with OpenStreetMap, Satellite, and Topographic layers |
| **Authentication** | Supabase Auth with Role-Based Access Control (`citizen`, `volunteer`, `coordinator`, `admin`) |
| **Testing** | [Playwright](https://playwright.dev/) End-to-End Test Suite |
| **Offline Support** | Progressive Web App (PWA) with Service Worker offline report queueing |

---

## 🧪 Comprehensive Automated Test Suite (Phases 1-6)

Surokkha BD features an automated End-to-End test suite validating all user journeys across both light and dark themes:

```powershell
# Run the master automated test runner across all phases
node tests/e2e/test_all_phases_master.js
```

### Automated Results Breakdown:
- **Phase 1 (Knowledge Core):** 9/9 PASS (Navigation, 14 Hazard Guides, Language toggle, Emergency contacts, Safety plan)
- **Phase 2 (Maps & Shelters):** 5/5 PASS (Multi-layer GIS map, Haversine geo-shelter distance sorter)
- **Phase 3 (Auth, Reports, Admin):** 5/5 PASS (Citizen registration, Dashboard greeting, Sign out, Admin RBAC gatekeeper, Pinned report)
- **Phase 4 (ReliefLink & Volunteers):** 2/2 PASS (Relief needs catalog, Volunteer task board)
- **Phase 5 (Learning & Remote Access):** 8/8 PASS (Data Explorer, Quiz catalog, Quiz player, Games arcade, Lightning sim, Go-Bag challenge, Badges, Teacher worksheets, Lite mode, Ferries)
- **Phase 6 (Security & Legal):** 2/2 PASS (Privacy policy GDPR/DSA, DRR case study)
- **Overall Score:** **31 / 31 (100% PASS)**

Detailed test recordings and screenshots are saved in:
- `docs/images/testing/videos/`
- `docs/images/testing/all_phases_results.json`

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **Git**

### 2. Clone and Install
```powershell
git clone https://github.com/moazzem-hossain-majumder/Surokkha-BD.git
cd Surokkha-BD
npm install
```

### 3. Environment Variables
Create a `.env.local` file by copying the example:
```powershell
copy .env.example .env.local
```
Configure your Supabase and optional Resend keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-key
```

### 4. Database Migrations (Supabase)
Apply migrations in chronological order from `supabase/migrations/`:
```sql
-- 0001_initial_schema.sql through 0010_fix_role_escalation.sql
```
Then populate the test data with `supabase/seed/`.

### 5. Launch Development Server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** for English or **[http://localhost:3000/bn](http://localhost:3000/bn)** for বাংলা.

---

## 📂 Project Directory Structure

```
surokkha-bd/
├── docs/                       # Architectural specs, security reviews, and test guides
│   ├── images/
│   │   ├── readme_dark_showcase/ # Curated unclipped Dark Mode media for README
│   │   ├── hazard_guides/      # Individual light/dark hazard guide captures
│   │   └── testing/            # Phase-by-phase screenshots and WebM video recordings
├── public/
│   ├── images/hazards/         # 14 authentic, verified hazard photographs
│   ├── manifest.webmanifest    # PWA configuration
│   └── sw.js                   # Service worker for offline shell & report caching
├── src/
│   ├── app/
│   │   ├── [locale]/           # Bilingual App Router routes (en / bn)
│   │   │   ├── (auth)/         # Register, Login, Signup
│   │   │   ├── admin/          # Role-protected emergency administration portal
│   │   │   ├── contacts/       # Emergency numbers directory
│   │   │   ├── dashboard/      # Citizen portal
│   │   │   ├── explorer/       # Disaster timeline and casualty analytics
│   │   │   ├── ferries/        # Inland river ferry schedule and assistance
│   │   │   ├── games/          # Interactive life-safety games (Lightning, Go-Bag)
│   │   │   ├── hazards/        # 14 hazard guide deep-dives
│   │   │   ├── lite/           # Ultra-low bandwidth text-only mode
│   │   │   ├── map/            # GIS interactive disaster and shelter map
│   │   │   ├── quiz/           # Disaster mastery quizzes
│   │   │   ├── relief/         # ReliefLink need board and pledges
│   │   │   ├── report/         # Geolocation-enabled citizen disaster reporting
│   │   │   ├── safety-plan/    # 5-step emergency family plan builder
│   │   │   ├── shelters/       # Proximity-sorted shelter finder
│   │   │   ├── teacher/        # Classroom worksheets generator
│   │   │   └── volunteer/      # Community volunteer tasks board
│   ├── components/             # Reusable UI components, header, maps, confetti
│   ├── content/hazards/        # Bilingual hazard JSON content
│   └── styles/globals.css      # Core design tokens and theme engine
├── supabase/
│   ├── migrations/             # 10 production SQL migrations with RLS security
│   └── seed/                   # Geo-spatial seed data (districts, shelters, historical events)
└── tests/e2e/                  # Playwright automated test suites
```

---

## 🔒 Security & Privacy

- **Row Level Security (RLS):** Every PostgreSQL table enforces strict RLS policies ensuring citizens can only modify their own submissions.
- **Privilege Separation:** Roles (`citizen`, `volunteer`, `coordinator`, `admin`) are cryptographically validated server-side.
- **Offline Integrity:** Queued reports use client-side validation and sanitization before ingestion.
- **Compliance:** Includes privacy policy drafted under the **Digital Security Act 2018** and international GDPR principles. See [docs/SECURITY_REVIEW.md](docs/SECURITY_REVIEW.md).

---

## 📄 License & Attribution

Released under the **MIT License**. Surokkha BD is committed to open-source humanitarian technology for disaster risk reduction and community resilience in Bangladesh.
