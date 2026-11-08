const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

async function smoothScroll(page, distance = 800, step = 100, delay = 80) {
  let scrolled = 0;
  while (scrolled < distance) {
    await page.evaluate((s) => window.scrollBy({ top: s, behavior: "smooth" }), step);
    scrolled += step;
    await page.waitForTimeout(delay);
  }
}

async function smoothScrollTop(page, step = 150, delay = 60) {
  const currentY = await page.evaluate(() => window.scrollY);
  let y = currentY;
  while (y > 0) {
    y = Math.max(0, y - step);
    await page.evaluate((targetY) => window.scrollTo({ top: targetY, behavior: "smooth" }), y);
    await page.waitForTimeout(delay);
  }
}

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  console.log("Using browser at:", executablePath);

  const baseDir = "d:\\surokkha-bd\\docs\\images";
  const showcaseDir = path.join(baseDir, "readme_dark_showcase");
  const tempVideoDir = path.join(showcaseDir, "temp_video");
  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\c5d85ce1-4da6-469d-a72c-622e7e7000bf";

  [showcaseDir, tempVideoDir, artifactDir].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1440,900",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 1440, height: 900 },
    },
  });

  // Always force dark theme in local storage & attributes
  await context.addInitScript(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  });

  const page = await context.newPage();

  async function setDarkAndSettle(page, waitMs = 1000) {
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    });
    await page.waitForTimeout(waitMs);
  }

  console.log("\n🎬 >>> STARTING FULL DARK MODE RECORDING WORKFLOW <<<\n");

  // ----------------------------------------------------
  // 1. HOMEPAGE TOUR (http://localhost:3000)
  // ----------------------------------------------------
  console.log("📍 [1/14] Recording Homepage in Dark Mode...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1200);

  // Smooth scroll through hero and quick cards
  await page.waitForTimeout(800);
  await smoothScroll(page, 700, 100, 80);
  await page.waitForTimeout(1000);
  await smoothScroll(page, 800, 120, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_01_homepage.png") });
  await smoothScrollTop(page, 180, 50);
  await page.waitForTimeout(800);

  // ----------------------------------------------------
  // 2. HAZARDS DIRECTORY (/hazards)
  // ----------------------------------------------------
  console.log("📍 [2/14] Recording Hazards Directory...");
  await page.goto("http://localhost:3000/hazards", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  await smoothScroll(page, 600, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_02_hazards.png") });

  // ----------------------------------------------------
  // 3. CYCLONE SURVIVAL GUIDE (/hazards/cyclone)
  // ----------------------------------------------------
  console.log("📍 [3/14] Recording Cyclone Survival Guide...");
  await page.goto("http://localhost:3000/hazards/cyclone", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  await smoothScroll(page, 500, 80, 80);
  await page.waitForTimeout(800);
  await smoothScroll(page, 600, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_03_cyclone_guide.png") });

  // ----------------------------------------------------
  // 4. INTERACTIVE GIS DISASTER MAP (/map)
  // ----------------------------------------------------
  console.log("📍 [4/14] Recording Interactive GIS Disaster Map...");
  await page.goto("http://localhost:3000/map", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 2000);

  // Pan and zoom map
  const mapElement = page.locator(".leaflet-container");
  if (await mapElement.count() > 0) {
    const box = await mapElement.boundingBox();
    if (box) {
      // Zoom in
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(1000);

      // Drag/Pan slightly to coast
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 120, box.y + box.height / 2 - 90, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(1200);

      // Click near center to pop up any marker
      const marker = page.locator(".leaflet-marker-icon");
      if (await marker.count() > 0) {
        await marker.first().click({ force: true });
        await page.waitForTimeout(1000);
      }
    }
  }
  await page.screenshot({ path: path.join(showcaseDir, "dark_04_gis_map.png") });

  // ----------------------------------------------------
  // 5. CYCLONE SHELTERS FINDER (/shelters)
  // ----------------------------------------------------
  console.log("📍 [5/14] Recording Cyclone Shelters Directory...");
  await page.goto("http://localhost:3000/shelters", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);

  const searchInput = page.locator("input[type='search'], input[placeholder*='Search'], input[type='text']");
  if (await searchInput.count() > 0) {
    await searchInput.first().fill("Cox's Bazar");
    await page.waitForTimeout(800);
  }
  await smoothScroll(page, 500, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_05_shelters.png") });

  // ----------------------------------------------------
  // 6. CITIZEN DISASTER REPORT (/report)
  // ----------------------------------------------------
  console.log("📍 [6/14] Recording Citizen Disaster Incident Report...");
  await page.goto("http://localhost:3000/report", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);

  const reportMap = page.locator(".leaflet-container");
  if (await reportMap.count() > 0) {
    await reportMap.click({ position: { x: 250, y: 180 } });
    await page.waitForTimeout(600);
  }
  const textInput = page.locator("textarea, input[name='description']");
  if (await textInput.count() > 0) {
    await textInput.first().fill("High tidal surge breaching coastal embankment near Kutubdia. Emergency sandbags and evacuation requested.");
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: path.join(showcaseDir, "dark_06_report.png") });

  // ----------------------------------------------------
  // 7. RELIEFLINK DIRECTORY (/relief)
  // ----------------------------------------------------
  console.log("📍 [7/14] Recording ReliefLink Verified Supply Demands...");
  await page.goto("http://localhost:3000/relief", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  await smoothScroll(page, 600, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_07_relief.png") });

  // ----------------------------------------------------
  // 8. VOLUNTEER HUB (/volunteer)
  // ----------------------------------------------------
  console.log("📍 [8/14] Recording Volunteer Hub...");
  await page.goto("http://localhost:3000/volunteer", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  await smoothScroll(page, 600, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_08_volunteer.png") });

  // ----------------------------------------------------
  // 9. HISTORICAL DISASTER DATA EXPLORER (/explorer)
  // ----------------------------------------------------
  console.log("📍 [9/14] Recording Disaster Data Explorer...");
  await page.goto("http://localhost:3000/explorer", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1200);
  await smoothScroll(page, 700, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_09_explorer.png") });

  // ----------------------------------------------------
  // 10. DISASTER PREPAREDNESS QUIZ (/quiz & /quiz/cyclone)
  // ----------------------------------------------------
  console.log("📍 [10/14] Recording Interactive Disaster Quiz...");
  await page.goto("http://localhost:3000/quiz", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 800);
  await page.goto("http://localhost:3000/quiz/cyclone", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);

  // Click an option to show feedback
  const quizOption = page.locator("button:has-text('B'), button[class*='border']").first();
  if (await quizOption.count() > 0) {
    await quizOption.click();
    await page.waitForTimeout(1200);
  }
  await page.screenshot({ path: path.join(showcaseDir, "dark_10_quiz.png") });

  // ----------------------------------------------------
  // 11. LIFE SAFETY GAMES ARCADE (/games/lightning & /games/go-bag)
  // ----------------------------------------------------
  console.log("📍 [11/14] Recording Life-Safety Interactive Games...");
  await page.goto("http://localhost:3000/games", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 800);

  // Lightning Game
  await page.goto("http://localhost:3000/games/lightning", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  const actionBtn = page.locator("button:has-text('Safe'), button:has-text('নিরাপদ')").first();
  if (await actionBtn.count() > 0) {
    await actionBtn.click();
    await page.waitForTimeout(1200);
  }
  await page.screenshot({ path: path.join(showcaseDir, "dark_11_lightning_game.png") });

  // Go-Bag Challenge
  await page.goto("http://localhost:3000/games/go-bag", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  const items = page.locator("button:has-text('Water'), button:has-text('Torch'), button:has-text('First Aid'), button:has-text('পানি'), button:has-text('টর্চ')");
  const count = await items.count();
  for (let i = 0; i < Math.min(count, 3); i++) {
    await items.nth(i).click();
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(showcaseDir, "dark_12_gobag_game.png") });

  // ----------------------------------------------------
  // 12. INLAND FERRIES & RIVER TRANSIT (/ferries)
  // ----------------------------------------------------
  console.log("📍 [12/14] Recording Ferries Tracking...");
  await page.goto("http://localhost:3000/ferries", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  await smoothScroll(page, 500, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_13_ferries.png") });

  // ----------------------------------------------------
  // 13. EMERGENCY HOTLINES & CONTACTS (/contacts)
  // ----------------------------------------------------
  console.log("📍 [13/14] Recording Emergency Hotlines Directory...");
  await page.goto("http://localhost:3000/contacts", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1000);
  await smoothScroll(page, 500, 100, 80);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(showcaseDir, "dark_14_contacts.png") });

  // ----------------------------------------------------
  // 14. RETURN HOME & FINALIZE LOOP (http://localhost:3000)
  // ----------------------------------------------------
  console.log("📍 [14/14] Returning to Homepage to conclude recording...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await setDarkAndSettle(page, 1500);

  // Close page and context to flush video
  const videoObj = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (videoObj) {
    const recordedPath = await videoObj.path();
    console.log("\n🎥 Raw recorded video saved to:", recordedPath);

    const targetWebm = path.join(showcaseDir, "surokkha_dark_mode_workflow.webm");
    const artifactWebm = path.join(artifactDir, "surokkha_dark_mode_workflow.webm");

    fs.copyFileSync(recordedPath, targetWebm);
    fs.copyFileSync(recordedPath, artifactWebm);
    console.log("✅ Copied WebM to:", targetWebm);
    console.log("✅ Copied WebM to Artifacts:", artifactWebm);

    // Convert to universal MP4 (H.264) using ffmpeg
    const targetMp4 = path.join(showcaseDir, "surokkha_dark_mode_workflow.mp4");
    const artifactMp4 = path.join(artifactDir, "surokkha_dark_mode_workflow.mp4");
    try {
      console.log("🔄 Transcoding WebM to MP4 (H.264 + AAC)...");
      execSync(`ffmpeg -y -i "${targetWebm}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p "${targetMp4}"`, { stdio: "inherit" });
      fs.copyFileSync(targetMp4, artifactMp4);
      console.log("✅ Created MP4:", targetMp4);
      console.log("✅ Created Artifact MP4:", artifactMp4);
    } catch (err) {
      console.warn("⚠️ MP4 transcode failed:", err.message);
    }

    // Convert preview snippet to animated WebP / GIF
    const previewWebp = path.join(showcaseDir, "surokkha_dark_mode_workflow.webp");
    const artifactWebp = path.join(artifactDir, "surokkha_dark_mode_workflow.webp");
    try {
      console.log("🔄 Generating preview animated WebP...");
      execSync(`ffmpeg -y -i "${targetWebm}" -t 15 -vf "fps=10,scale=960:-1:flags=lanczos" -vcodec libwebp -lossless 0 -compression_level 4 -q:v 70 -loop 0 "${previewWebp}"`, { stdio: "inherit" });
      fs.copyFileSync(previewWebp, artifactWebp);
      console.log("✅ Created animated WebP:", previewWebp);
    } catch (err) {
      console.warn("⚠️ WebP generation failed:", err.message);
    }
  }

  // Also copy all screenshots to artifactDir for instant preview in artifacts
  const files = fs.readdirSync(showcaseDir);
  files.filter(f => f.endsWith(".png")).forEach(f => {
    fs.copyFileSync(path.join(showcaseDir, f), path.join(artifactDir, f));
  });

  console.log("\n🎉 ALL DARK MODE RECORDING & SCREENSHOT ASSETS READY!");
}

main().catch((err) => {
  console.error("❌ Recording script failed:", err);
  process.exit(1);
});
