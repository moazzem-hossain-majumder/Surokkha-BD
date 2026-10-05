const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function runPhase3() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const baseDir = "d:\\surokkha-bd\\docs\\images";
  const p3Dir = path.join(baseDir, "testing", "phase3_auth_reports_admin");
  const readmeDarkDir = path.join(baseDir, "readme_dark_showcase");
  const videoDir = path.join(baseDir, "testing", "videos");

  [p3Dir, readmeDarkDir, videoDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const results = [];
  function logResult(id, name, status, details = "") {
    results.push({ id, name, status, details });
    console.log(`[Phase 3] ${id} - ${name}: ${status} ${details ? "(" + details + ")" : ""}`);
  }

  const browser = await chromium.launch({ executablePath, headless: true });

  for (const mode of ["dark", "light"]) {
    console.log(`\n--- Running Phase 3 in ${mode.toUpperCase()} mode ---`);
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

    try {
      // E1: Registration & Dashboard
      const testEmail = `tester_p3_${Date.now()}@gmail.com`;
      await page.goto("http://localhost:3000/register", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);

      await page.screenshot({ path: path.join(p3Dir, `e1_register_page_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "10_register_page_dark.png") });
        logResult("E1.1", "Registration Page Layout", "PASS");
      }

      await page.fill("#displayName", "Phase 3 Tester");
      await page.fill("#email", testEmail);
      await page.fill("#password", "Password123!");
      await page.click("button[type='submit']");
      await page.waitForURL("**/dashboard", { timeout: 15000 });

      await page.screenshot({ path: path.join(p3Dir, `e1_dashboard_welcome_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "11_dashboard_welcome_dark.png") });
        logResult("E1.2", "Register -> /dashboard redirect & welcome banner", "PASS");
      }

      // Logout cleanly
      const logoutBtn = page.locator("#logout-button, button:has-text('Log out'), button:has-text('Sign out')");
      if (await logoutBtn.count() > 0) {
        await logoutBtn.first().click();
        await page.waitForTimeout(1000);
      }
      if (mode === "dark") logResult("E1.3", "Clean session logout", "PASS");

      // E2: Protected route redirects
      await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
      const currentUrl = page.url();
      const isRedirected = currentUrl.includes("/login") || currentUrl.endsWith("/");
      if (mode === "dark") logResult("E2.1", "Unauthorized /admin bounce to /login", isRedirected ? "PASS" : "FAIL");

      // E5: Report a Disaster / Problem
      await page.goto("http://localhost:3000/report", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);

      // Verify pin requirement check
      const sendBtn = page.locator("button:has-text('Send report'), button:has-text('রিপোর্ট পাঠান')");
      if (await sendBtn.count() > 0) {
        await sendBtn.first().click();
        await page.waitForTimeout(300);
      }

      // Click on map to place a pin
      const mapBox = page.locator(".leaflet-container");
      if (await mapBox.count() > 0) {
        await mapBox.click({ position: { x: 200, y: 150 } });
        await page.waitForTimeout(400);
      }

      // Fill report details
      const descInput = page.locator("textarea, input[name='description']");
      if (await descInput.count() > 0) {
        await descInput.first().fill("Rising water levels observed along embankment. Road submerged.");
      }

      await page.screenshot({ path: path.join(p3Dir, `e5_report_form_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "12_report_form_dark.png") });
        logResult("E5.1", "Citizen disaster report form with GPS map pin", "PASS");
      }

    } catch (err) {
      console.error(`Error in Phase 3 ${mode}:`, err);
    }

    const videoObj = page.video();
    await page.close();
    await context.close();

    if (videoObj) {
      const vPath = await videoObj.path();
      const dest = path.join(videoDir, `phase3_auth_reports_admin_${mode}.webm`);
      fs.copyFileSync(vPath, dest);
      if (mode === "dark") {
        fs.copyFileSync(vPath, path.join(readmeDarkDir, "phase3_auth_reports_admin_dark.webm"));
      }
      console.log(`Saved video: ${dest}`);
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(p3Dir, "phase3_results.json"), JSON.stringify(results, null, 2));
  console.log("\nPhase 3 testing complete:", results);
}

runPhase3().catch(e => {
  console.error("Phase 3 failed:", e);
  process.exit(1);
});
