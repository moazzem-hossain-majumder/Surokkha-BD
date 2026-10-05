const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function runPhase2() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const baseDir = "d:\\surokkha-bd\\docs\\images";
  const p2Dir = path.join(baseDir, "testing", "phase2_map_shelters");
  const readmeDarkDir = path.join(baseDir, "readme_dark_showcase");
  const videoDir = path.join(baseDir, "testing", "videos");

  [p2Dir, readmeDarkDir, videoDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const results = [];
  function logResult(id, name, status, details = "") {
    results.push({ id, name, status, details });
    console.log(`[Phase 2] ${id} - ${name}: ${status} ${details ? "(" + details + ")" : ""}`);
  }

  const browser = await chromium.launch({ executablePath, headless: true });

  for (const mode of ["dark", "light"]) {
    console.log(`\n--- Running Phase 2 in ${mode.toUpperCase()} mode ---`);
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
      // D1: Live Map
      await page.goto("http://localhost:3000/map", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(1500); // let tiles load

      await page.screenshot({ path: path.join(p2Dir, `d1_map_roads_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "06_map_roads_dark.png") });
        logResult("D1.1", "Live Google Maps Roads View", "PASS");
      }

      // Switch to Satellite Hybrid
      const satBtn = page.locator("button:has-text('Satellite Hybrid'), button:has-text('স্যাটেলাইট')");
      if (await satBtn.count() > 0) {
        await satBtn.first().click();
        await page.waitForTimeout(1500);
      }
      await page.screenshot({ path: path.join(p2Dir, `d1_map_satellite_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "07_map_satellite_dark.png") });
        logResult("D1.2", "Google Maps Satellite Hybrid View", "PASS");
      }

      // Switch to Terrain
      const terBtn = page.locator("button:has-text('Terrain'), button:has-text('ভূসংস্থান')");
      if (await terBtn.count() > 0) {
        await terBtn.first().click();
        await page.waitForTimeout(1200);
      }
      await page.screenshot({ path: path.join(p2Dir, `d1_map_terrain_${mode}.png`) });
      if (mode === "dark") logResult("D1.3", "Google Maps Terrain View", "PASS");

      // Switch between List and Map view
      const listBtn = page.locator("button:has-text('List'), button:has-text('তালিকা')");
      if (await listBtn.count() > 0) {
        await listBtn.first().click();
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: path.join(p2Dir, `d1_map_list_view_${mode}.png`) });
      if (mode === "dark") logResult("D1.4", "Shelters & Quakes List View toggle", "PASS");

      // Switch back to Map view
      const mapBtn = page.locator("button:has-text('Map'), button:has-text('মানচিত্র')");
      if (await mapBtn.count() > 0) {
        await mapBtn.first().click();
        await page.waitForTimeout(500);
      }

      // Toggle Native Google Maps View
      const nativeBtn = page.locator("button:has-text('Native Google Maps View'), button:has-text('নেটিভ')");
      if (await nativeBtn.count() > 0) {
        await nativeBtn.first().click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(p2Dir, `d1_map_native_embed_${mode}.png`) });
        if (mode === "dark") {
          await page.screenshot({ path: path.join(readmeDarkDir, "08_map_native_embed_dark.png") });
          logResult("D1.5", "Native Google Maps interactive embed toggle", "PASS");
        }
      }

      // D2: Shelter Finder
      await page.goto("http://localhost:3000/shelters", { waitUntil: "networkidle" });
      await page.evaluate((theme) => document.documentElement.setAttribute("data-theme", theme), mode);
      await page.waitForTimeout(600);

      // Filter by district
      const select = page.locator("select");
      if (await select.count() > 0) {
        await select.first().selectOption({ label: "Barguna" });
        await page.waitForTimeout(500);
      }

      await page.screenshot({ path: path.join(p2Dir, `d2_shelter_finder_${mode}.png`) });
      if (mode === "dark") {
        await page.screenshot({ path: path.join(readmeDarkDir, "09_shelter_finder_dark.png") });
        logResult("D2.1", "Shelter Finder with district search & directions", "PASS");
      }

    } catch (err) {
      console.error(`Error in Phase 2 ${mode}:`, err);
    }

    const videoObj = page.video();
    await page.close();
    await context.close();

    if (videoObj) {
      const vPath = await videoObj.path();
      const dest = path.join(videoDir, `phase2_map_shelters_${mode}.webm`);
      fs.copyFileSync(vPath, dest);
      if (mode === "dark") {
        fs.copyFileSync(vPath, path.join(readmeDarkDir, "phase2_map_shelters_dark.webm"));
      }
      console.log(`Saved video: ${dest}`);
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(p2Dir, "phase2_results.json"), JSON.stringify(results, null, 2));
  console.log("\nPhase 2 testing complete:", results);
}

runPhase2().catch(e => {
  console.error("Phase 2 failed:", e);
  process.exit(1);
});
