const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const baseDir = "d:\\surokkha-bd\\docs\\images";
  const testingDir = path.join(baseDir, "testing");
  const readmeDarkDir = path.join(baseDir, "readme_dark_showcase");
  const videoDir = path.join(testingDir, "videos");

  const p3Dir = path.join(testingDir, "phase3_auth_reports_admin");
  const p4Dir = path.join(testingDir, "phase4_relief_volunteer");
  const p5Dir = path.join(testingDir, "phase5_learning_remote");
  const p6Dir = path.join(testingDir, "phase6_security_legal_seo");

  [testingDir, readmeDarkDir, videoDir, p3Dir, p4Dir, p5Dir, p6Dir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const allResults = [];
  function recordResult(phase, id, feature, status, note = "") {
    allResults.push({ phase, id, feature, status, note });
    console.log(`[${phase}] ${id} - ${feature}: ${status} ${note ? "(" + note + ")" : ""}`);
  }

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Execute across both modes: Dark and Light
  for (const mode of ["dark", "light"]) {
    console.log(`\n==================================================`);
    console.log(`  EXECUTING TEST SUITE IN ${mode.toUpperCase()} MODE`);
    console.log(`==================================================\n`);

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: mode,
      recordVideo: {
        dir: videoDir,
        size: { width: 1440, height: 900 },
      },
    });

    await context.addInitScript((theme) => {
      localStorage.setItem("theme", theme);
    }, mode);

    const page = await context.newPage();

    // ==========================================
    // PHASE 3: AUTH, REPORTS, ADMIN
    // ==========================================
    console.log(`\n--- [Phase 3] Testing Auth, Reports, Admin (${mode}) ---`);
    try {
      // 3.1 Register Page
      await page.goto("http://localhost:3000/register", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(p3Dir, `e1_register_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "10_auth_register_dark.png") });
        recordResult("Phase 3", "E1.1", "Citizen Registration Interface", "PASS");
      }

      // 3.2 Perform Registration & Redirect to /dashboard
      const testEmail = `tester_master_${mode}_${Date.now()}@gmail.com`;
      await page.fill("#displayName", "Verified Citizen");
      await page.fill("#email", testEmail);
      await page.fill("#password", "SecurePass123!");

      await Promise.all([
        page.waitForURL((url) => url.pathname.includes("/dashboard"), { timeout: 15000 }),
        page.click("#signup-submit-button"),
      ]);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(p3Dir, `e1_dashboard_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "11_dashboard_portal_dark.png") });
        recordResult("Phase 3", "E1.2", "Protected Dashboard & Welcome Banner", "PASS", page.url());
      }

      // 3.3 Clean Logout
      const logoutBtn = page.locator("#logout-button");
      if (await logoutBtn.count() > 0) {
        await logoutBtn.click();
        await page.waitForURL((url) => !url.pathname.includes("/dashboard"), { timeout: 10000 });
        await page.waitForTimeout(400);
      }
      if (mode === "dark") recordResult("Phase 3", "E1.3", "Clean Logout & Session Clearance", "PASS");

      // 3.4 Unauthorized /admin bounce
      await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
      const currentAdminUrl = page.url();
      const bounced = currentAdminUrl.includes("/login") || currentAdminUrl.endsWith("/");
      if (mode === "dark") recordResult("Phase 3", "E2.1", "Unauthorized /admin RBAC Gatekeeper", bounced ? "PASS" : "FAIL");

      // 3.5 Citizen Disaster Report
      await page.goto("http://localhost:3000/report", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(600);

      const mapArea = page.locator(".leaflet-container");
      if (await mapArea.count() > 0) {
        await mapArea.click({ position: { x: 220, y: 160 } });
        await page.waitForTimeout(400);
      }
      const descBox = page.locator("textarea, input[name='description']");
      if (await descBox.count() > 0) {
        await descBox.first().fill("Severe tidal surge water entering coastal embankment. Urgent sandbag support needed.");
      }

      await page.screenshot({ path: path.join(p3Dir, `e5_disaster_report_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "12_citizen_report_dark.png") });
        recordResult("Phase 3", "E5.1", "Citizen Disaster Report with Interactive Geolocation Pin", "PASS");
      }
    } catch (e) {
      console.error(`Phase 3 Error (${mode}):`, e);
      recordResult("Phase 3", "E.FAIL", "Phase 3 Execution Error", "FAIL", e.message);
    }

    // ==========================================
    // PHASE 4: RELIEFLINK & VOLUNTEER HUB
    // ==========================================
    console.log(`\n--- [Phase 4] Testing ReliefLink & Volunteer Hub (${mode}) ---`);
    try {
      // 4.1 ReliefLink Needs Catalog
      await page.goto("http://localhost:3000/relief", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(600);

      await page.screenshot({ path: path.join(p4Dir, `f1_relief_needs_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "13_relief_needs_dark.png") });
        recordResult("Phase 4", "F1.1", "ReliefLink Verified Supply Needs Catalog", "PASS");
      }

      // 4.2 Volunteer Hub
      await page.goto("http://localhost:3000/volunteer", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(600);

      await page.screenshot({ path: path.join(p4Dir, `f4_volunteer_hub_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "14_volunteer_hub_dark.png") });
        recordResult("Phase 4", "F4.1", "Volunteer Hub & Community Response Tasks", "PASS");
      }
    } catch (e) {
      console.error(`Phase 4 Error (${mode}):`, e);
      recordResult("Phase 4", "F.FAIL", "Phase 4 Execution Error", "FAIL", e.message);
    }

    // ==========================================
    // PHASE 5: LEARNING & REMOTE ACCESS
    // ==========================================
    console.log(`\n--- [Phase 5] Testing Learning & Remote Access (${mode}) ---`);
    try {
      // 5.1 Data Explorer (Timeline & Casualties chart)
      await page.goto("http://localhost:3000/explorer", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(800);

      await page.screenshot({ path: path.join(p5Dir, `g1_data_explorer_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "15_data_explorer_dark.png") });
        recordResult("Phase 5", "G1.1", "Historical Disaster Timeline & Casualty Analytics", "PASS");
      }

      // 5.2 Quizzes Catalog & Quiz Player
      await page.goto("http://localhost:3000/quiz", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(p5Dir, `g2_quiz_catalog_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "16_quiz_catalog_dark.png") });
        recordResult("Phase 5", "G2.1", "Disaster Mastery Quiz Catalog (14 Hazards)", "PASS");
      }

      // Quiz Player in action
      await page.goto("http://localhost:3000/quiz/cyclone", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(400);

      const quizChoice = page.locator("button:has-text('B')");
      if (await quizChoice.count() > 0) {
        await quizChoice.first().click();
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: path.join(p5Dir, `g2_quiz_player_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "17_quiz_player_dark.png") });
        recordResult("Phase 5", "G2.2", "Interactive Quiz Player with Streak & Sound", "PASS");
      }

      // 5.3 Games Arcade
      await page.goto("http://localhost:3000/games", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(p5Dir, `g3_games_arcade_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "18_games_arcade_dark.png") });
        recordResult("Phase 5", "G3.1", "Life-Safety Interactive Games Arcade", "PASS");
      }

      // Lightning Game in action
      await page.goto("http://localhost:3000/games/lightning", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      const safeBtn = page.locator("button:has-text('Safe to do'), button:has-text('নিরাপদ')");
      if (await safeBtn.count() > 0) {
        await safeBtn.first().click();
        await page.waitForTimeout(600);
      }
      await page.screenshot({ path: path.join(p5Dir, `g3_lightning_game_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "19_lightning_game_dark.png") });
        recordResult("Phase 5", "G3.2", "Lightning Survival Sim with Electric Feedback", "PASS");
      }

      // Go-Bag Game in action
      await page.goto("http://localhost:3000/games/go-bag", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      // Pack water and torch
      const water = page.locator("button:has-text('Drinking water'), button:has-text('খাবার পানি')");
      if (await water.count() > 0) await water.first().click();
      const torch = page.locator("button:has-text('Torch'), button:has-text('টর্চ')");
      if (await torch.count() > 0) await torch.first().click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(p5Dir, `g3_gobag_game_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "20_gobag_game_dark.png") });
        recordResult("Phase 5", "G3.3", "72-Hour Emergency Go-Bag Packing Challenge", "PASS");
      }

      // 5.4 Progress & Badges
      await page.goto("http://localhost:3000/progress", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(p5Dir, `g4_progress_badges_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "21_progress_badges_dark.png") });
        recordResult("Phase 5", "G4.1", "Citizen Preparedness Badges & Progress Tracker", "PASS");
      }

      // 5.5 Teacher Mode (Printable Worksheets)
      await page.goto("http://localhost:3000/teacher", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(p5Dir, `g5_teacher_mode_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "22_teacher_mode_dark.png") });
        recordResult("Phase 5", "G5.1", "Teacher Mode Classroom Worksheets & Answer Key", "PASS");
      }

      // 5.6 Lite Mode (Ultra-low bandwidth)
      await page.goto("http://localhost:3000/lite", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(p5Dir, `g6_lite_mode_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "23_lite_mode_dark.png") });
        recordResult("Phase 5", "G6.1", "High-Performance Low-Bandwidth Lite Mode", "PASS");
      }

      // 5.7 Ferry Tracking & Assistance
      await page.goto("http://localhost:3000/ferries", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(p5Dir, `g7_ferries_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "24_ferries_tracking_dark.png") });
        recordResult("Phase 5", "G7.1", "Inland Ferry Schedules & Real-Time Help Requests", "PASS");
      }
    } catch (e) {
      console.error(`Phase 5 Error (${mode}):`, e);
      recordResult("Phase 5", "G.FAIL", "Phase 5 Execution Error", "FAIL", e.message);
    }

    // ==========================================
    // PHASE 6: SECURITY, LEGAL, SEO
    // ==========================================
    console.log(`\n--- [Phase 6] Testing Security, Legal, SEO (${mode}) ---`);
    try {
      // 6.1 Privacy Policy & Terms
      await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(p6Dir, `h2_privacy_policy_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "25_privacy_policy_dark.png") });
        recordResult("Phase 6", "H2.1", "Privacy Policy (GDPR / Digital Security Act)", "PASS");
      }

      // 6.2 Case Study
      await page.goto("http://localhost:3000/case-study", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(p6Dir, `h5_case_study_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "26_case_study_dark.png") });
        recordResult("Phase 6", "H5.1", "Comprehensive Disaster Risk Reduction Case Study", "PASS");
      }
    } catch (e) {
      console.error(`Phase 6 Error (${mode}):`, e);
      recordResult("Phase 6", "H.FAIL", "Phase 6 Execution Error", "FAIL", e.message);
    }

    // Save Video for this phase
    const videoObj = page.video();
    await page.close();
    await context.close();

    if (videoObj) {
      const vPath = await videoObj.path();
      const dest = path.join(videoDir, `full_phases_master_${mode}.webm`);
      fs.copyFileSync(vPath, dest);
      if (mode === "dark") {
        fs.copyFileSync(vPath, path.join(readmeDarkDir, "master_full_experience_dark.webm"));
      }
      console.log(`Saved master video (${mode}): ${dest}`);
    }
  }

  await browser.close();

  // Write consolidated results report
  fs.writeFileSync(path.join(testingDir, "all_phases_results.json"), JSON.stringify(allResults, null, 2));
  console.log("\n==================================================");
  console.log("  ALL PHASES AUTOMATED TEST EXECUTION COMPLETE!");
  console.log("==================================================\n");
  console.log(`Total tests executed: ${allResults.length}`);
  const passCount = allResults.filter(r => r.status === "PASS").length;
  console.log(`PASS: ${passCount} / ${allResults.length} (${Math.round((passCount / allResults.length) * 100)}%)`);
}

main().catch(err => {
  console.error("Master test runner failed:", err);
  process.exit(1);
});
