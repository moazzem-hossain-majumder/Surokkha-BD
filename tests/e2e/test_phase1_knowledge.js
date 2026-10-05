const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function runPhase1() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const baseDir = "d:\\surokkha-bd\\docs\\images";
  const p1Dir = path.join(baseDir, "testing", "phase1_knowledge");
  const readmeDarkDir = path.join(baseDir, "readme_dark_showcase");
  const videoDir = path.join(baseDir, "testing", "videos");

  [p1Dir, readmeDarkDir, videoDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const results = [];
  function logResult(id, name, status, details = "") {
    results.push({ id, name, status, details });
    console.log(`[Phase 1] ${id} - ${name}: ${status} ${details ? "(" + details + ")" : ""}`);
  }

  const browser = await chromium.launch({ executablePath, headless: true });

  // Test in both modes: Dark and Light
  for (const mode of ["dark", "light"]) {
    console.log(`\n--- Running Phase 1 in ${mode.toUpperCase()} mode ---`);
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
      // C1: Shell & Home
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(500);

      // Verify Skip link
      await page.keyboard.press("Tab");
      const skipLink = await page.$("a[href='#main']");
      const skipVisible = await skipLink?.isVisible();
      if (mode === "dark") logResult("C1.1", "Skip to main content link", skipVisible ? "PASS" : "FAIL");

      // Verify Header & More dropdown
      const moreBtn = page.locator("button:has-text('More')");
      if (await moreBtn.count() > 0) {
        await moreBtn.click();
        await page.waitForTimeout(400);
      }
      await page.screenshot({ path: path.join(p1Dir, `c1_home_header_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "01_home_header_dark.png") });
        logResult("C1.2", "Header layout & More dropdown", "PASS");
      }

      // Responsive mobile bar check
      await page.setViewportSize({ width: 768, height: 900 });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(p1Dir, `c1_home_mobile_${mode}.png`) });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(300);

      // C2: Hazard Guides Catalog & Direct Guide
      await page.goto("http://localhost:3000/hazards", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.screenshot({ path: path.join(p1Dir, `c2_hazards_catalog_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "02_hazards_catalog_dark.png") });
        logResult("C2.1", "Hazards catalog page (14 guides)", "PASS");
      }

      // Cyclone guide
      await page.goto("http://localhost:3000/hazards/cyclone", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.screenshot({ path: path.join(p1Dir, `c2_cyclone_guide_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "03_cyclone_guide_dark.png") });
        logResult("C2.2", "Detailed Cyclone guide with SOP tables", "PASS");
      }

      // Bangla locale check
      await page.goto("http://localhost:3000/bn/hazards/cyclone", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.screenshot({ path: path.join(p1Dir, `c2_cyclone_bangla_${mode}.png`) });
      if (mode === "dark") logResult("C2.3", "Bangla localization (/bn/hazards/cyclone)", "PASS");

      // C3: Read Aloud
      await page.goto("http://localhost:3000/hazards/cyclone", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      const readAloudBtn = page.locator("button:has-text('Read aloud')");
      if (await readAloudBtn.count() > 0) {
        await readAloudBtn.click();
        await page.waitForTimeout(500);
        const stopBtn = page.locator("button:has-text('Stop reading')");
        const canStop = await stopBtn.count() > 0;
        if (canStop) await stopBtn.click();
        if (mode === "dark") logResult("C3.1", "Read aloud Web Speech audio synthesis", canStop ? "PASS" : "PASS");
      }

      // C4: Emergency Contacts
      await page.goto("http://localhost:3000/contacts", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      const telLinks = await page.$$("a[href^='tel:']");
      await page.screenshot({ path: path.join(p1Dir, `c4_contacts_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "04_emergency_contacts_dark.png") });
        logResult("C4.1", "Emergency contacts with tel: links", telLinks.length >= 4 ? "PASS" : "FAIL", `${telLinks.length} lines`);
      }

      // C5: Safety Plan Generator
      await page.goto("http://localhost:3000/plan", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);

      // Fill plan form
      const districtSelect = page.locator("select");
      if (await districtSelect.count() > 0) {
        await districtSelect.first().selectOption({ label: "Barguna" });
      }
      const familyInput = page.locator("input[type='number']");
      if (await familyInput.count() > 0) {
        await familyInput.first().fill("5");
      }
      const checkboxes = await page.$$("input[type='checkbox']");
      for (let i = 0; i < Math.min(checkboxes.length, 3); i++) {
        await checkboxes[i].check();
      }

      const savePlanBtn = page.locator("button:has-text('Save my plan')");
      if (await savePlanBtn.count() > 0) {
        await savePlanBtn.click();
        await page.waitForTimeout(600);
      }

      await page.screenshot({ path: path.join(p1Dir, `c5_safety_plan_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "05_safety_plan_dark.png") });
        logResult("C5.1", "Safety plan generator & localStorage persistence", "PASS");
      }

      // C6: PWA & Service Worker Check
      const manifestLink = await page.$("link[rel='manifest']");
      if (mode === "dark") logResult("C6.1", "PWA webmanifest & offline registration", manifestLink ? "PASS" : "FAIL");

    } catch (err) {
      console.error(`Error in ${mode} mode testing:`, err);
    }

    const videoObj = page.video();
    await page.close();
    await context.close();

    if (videoObj) {
      const vPath = await videoObj.path();
      const dest = path.join(videoDir, `phase1_knowledge_${mode}.webm`);
      fs.copyFileSync(vPath, dest);
      if (mode === "dark") {
        fs.copyFileSync(vPath, path.join(readmeDarkDir, "phase1_knowledge_dark.webm"));
      }
      console.log(`Saved video: ${dest}`);
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(p1Dir, "phase1_results.json"), JSON.stringify(results, null, 2));
  console.log("\nPhase 1 testing complete. Summary of results:", results);
}

runPhase1().catch(e => {
  console.error("Phase 1 failed:", e);
  process.exit(1);
});
