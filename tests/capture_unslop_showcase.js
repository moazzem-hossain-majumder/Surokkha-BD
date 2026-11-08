const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  console.log("Launching browser at:", executablePath);

  const outDir = path.join("docs", "images", "readme_dark_showcase");
  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity\\brain\\661f03de-1ce3-4349-b33a-3f46538ce2ba";

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,900"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });

  await context.addInitScript(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  });

  const page = await context.newPage();

  async function visitAndSnap(urlPath, filename, options = {}) {
    console.log(`📸 Capturing ${filename} from ${urlPath}...`);
    try {
      await page.goto(`http://localhost:3000${urlPath}`, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      });
      await page.waitForTimeout(options.wait || 800);

      if (options.scroll) {
        await page.evaluate((y) => window.scrollBy({ top: y, behavior: "instant" }), options.scroll);
        await page.waitForTimeout(400);
      }

      if (options.action) {
        await options.action(page);
        await page.waitForTimeout(500);
      }

      const dest = path.join(outDir, filename);
      await page.screenshot({ path: dest });

      // Mirror to artifact directory for easy UI embedding
      const artDest = path.join(artifactDir, filename);
      fs.copyFileSync(dest, artDest);
    } catch (e) {
      console.warn(`Failed capturing ${filename}:`, e.message);
    }
  }

  // 1. Homepage & Hero Telemetry Console
  await visitAndSnap("/en", "01_home_header_dark.png");
  await visitAndSnap("/en", "dark_01_homepage.png", { scroll: 250 });

  // 2. Hazards Directory
  await visitAndSnap("/en/hazards", "02_hazards_catalog_dark.png");
  await visitAndSnap("/en/hazards", "dark_02_hazards.png");

  // 3. Cyclone Guide
  await visitAndSnap("/en/hazards/cyclone", "03_cyclone_guide_dark.png");
  await visitAndSnap("/en/hazards/cyclone", "dark_03_cyclone_guide.png");

  // 4. Contacts
  await visitAndSnap("/en/contacts", "04_emergency_contacts_dark.png");
  await visitAndSnap("/en/contacts", "dark_14_contacts.png");

  // 5. Safety Plan
  await visitAndSnap("/en/plan", "05_safety_plan_dark.png");

  // 6. GIS Disaster Map - Roads & OpenStreetMap
  await visitAndSnap("/en/map", "06_map_roads_dark.png", {
    wait: 1500,
    action: async (p) => {
      const map = p.locator(".leaflet-container");
      if (await map.count() > 0) {
        const marker = p.locator(".leaflet-marker-icon");
        if (await marker.count() > 0) {
          await marker.first().click({ force: true });
        }
      }
    }
  });
  await visitAndSnap("/en/map", "dark_04_gis_map.png", { wait: 1200 });

  // 7. Map Satellite Layer
  await visitAndSnap("/en/map", "07_map_satellite_dark.png", {
    wait: 1000,
    action: async (p) => {
      const satBtn = p.locator("button:has-text('Satellite')");
      if (await satBtn.count() > 0) await satBtn.first().click();
    }
  });

  // 8. Map Terrain Layer
  await visitAndSnap("/en/map", "08_map_terrain_dark.png", {
    wait: 1000,
    action: async (p) => {
      const terrainBtn = p.locator("button:has-text('Terrain')");
      if (await terrainBtn.count() > 0) await terrainBtn.first().click();
    }
  });

  // 9. Shelter Finder
  await visitAndSnap("/en/shelters", "09_shelter_finder_dark.png", {
    wait: 800,
    action: async (p) => {
      const input = p.locator("input[type='search'], input[type='text']");
      if (await input.count() > 0) await input.first().fill("Cox's Bazar");
    }
  });
  await visitAndSnap("/en/shelters", "dark_05_shelters.png");

  // 10. Auth Register
  await visitAndSnap("/en/register", "10_auth_register_dark.png");

  // 11. Dashboard Portal
  await visitAndSnap("/en/dashboard", "11_dashboard_portal_dark.png");

  // 12. Citizen Incident Report
  await visitAndSnap("/en/report", "12_citizen_report_dark.png", {
    wait: 1000,
    action: async (p) => {
      const textarea = p.locator("textarea");
      if (await textarea.count() > 0) {
        await textarea.fill("Coastal embankment wash-out near Kutubdia Channel. Urgent need for flood barriers.");
      }
      const mapEl = p.locator(".leaflet-container");
      if (await mapEl.count() > 0) {
        const box = await mapEl.boundingBox();
        if (box) {
          await p.mouse.click(box.x + box.width * 0.55, box.y + box.height * 0.55);
          await p.waitForTimeout(600);
        }
      }
    }
  });
  await visitAndSnap("/en/report", "dark_06_report.png");

  // 13. Relief Needs Board
  await visitAndSnap("/en/relief", "13_relief_needs_dark.png");
  await visitAndSnap("/en/relief", "dark_07_relief.png");

  // 14. Volunteer Hub
  await visitAndSnap("/en/volunteer", "14_volunteer_hub_dark.png");
  await visitAndSnap("/en/volunteer", "dark_08_volunteer.png");

  // 15. Disaster Data Explorer
  await visitAndSnap("/en/explorer", "15_data_explorer_dark.png");
  await visitAndSnap("/en/explorer", "dark_09_explorer.png");

  // 16. Quiz Catalog
  await visitAndSnap("/en/quiz", "16_quiz_catalog_dark.png");
  await visitAndSnap("/en/quiz", "dark_10_quiz.png");

  // 17. Quiz Player with answered feedback
  await visitAndSnap("/en/quiz/cyclone", "17_quiz_player_dark.png", {
    wait: 800,
    action: async (p) => {
      const opt = p.locator("button:has-text('B'), button[class*='border']").first();
      if (await opt.count() > 0) await opt.click();
    }
  });

  // 18. Games Arcade Hub
  await visitAndSnap("/en/games", "18_games_arcade_dark.png");

  // 19. Lightning Survival Simulation
  await visitAndSnap("/en/games/lightning", "19_lightning_game_dark.png", {
    wait: 800,
    action: async (p) => {
      const safeBtn = p.locator("button:has-text('[SAFE]')");
      if (await safeBtn.count() > 0) await safeBtn.click();
    }
  });
  await visitAndSnap("/en/games/lightning", "dark_11_lightning_game.png");

  // 20. Go-Bag Challenge
  await visitAndSnap("/en/games/go-bag", "20_gobag_game_dark.png", {
    wait: 800,
    action: async (p) => {
      const itemBtns = p.locator("button:has-text('[ADDED]'), button:has-text('Drinking water'), button:has-text('Essential medicines')");
      if (await itemBtns.count() > 0) {
        await itemBtns.first().click();
      }
    }
  });
  await visitAndSnap("/en/games/go-bag", "dark_12_gobag_game.png");

  // 21. Progress & Badges
  await visitAndSnap("/en/progress", "21_progress_badges_dark.png");

  // 22. Teacher Mode
  await visitAndSnap("/en/teacher", "22_teacher_mode_dark.png");

  // 23. Lite Low-Bandwidth Mode
  await visitAndSnap("/en/lite", "23_lite_mode_dark.png");

  // 24. Ferries Tracking
  await visitAndSnap("/en/ferries", "24_ferries_tracking_dark.png");
  await visitAndSnap("/en/ferries", "dark_13_ferries.png");

  // 25. Privacy Policy
  await visitAndSnap("/en/privacy", "25_privacy_policy_dark.png");

  // 26. Case Study
  await visitAndSnap("/en/case-study", "26_case_study_dark.png");

  await browser.close();
  console.log("\n🎉 Finished capturing all 26 screens!");
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});

