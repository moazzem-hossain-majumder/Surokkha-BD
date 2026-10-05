const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3";
  const videoDir = path.join(artifactDir, "scratch", "videos");
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  console.log("Tour Step 1: Home Page & Interactive Hazard Showcase");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to hazards showcase
  await page.locator("#hazards").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Click flood, earthquake, lightning
  const floodBtn = page.locator("button[data-hazard='riverine-flood']");
  if (await floodBtn.count() > 0) {
    await floodBtn.click();
    await page.waitForTimeout(900);
  }
  const eqBtn = page.locator("button[data-hazard='earthquake']");
  if (await eqBtn.count() > 0) {
    await eqBtn.click();
    await page.waitForTimeout(900);
  }
  const lightBtn = page.locator("button[data-hazard='lightning']");
  if (await lightBtn.count() > 0) {
    await lightBtn.click();
    await page.waitForTimeout(900);
  }

  console.log("Tour Step 2: Google Maps with Live Satellite & Overlays");
  await page.goto("http://localhost:3000/map", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Switch to Satellite Hybrid
  const satBtn = page.locator("button:has-text('Satellite Hybrid')");
  if (await satBtn.count() > 0) {
    await satBtn.click();
    await page.waitForTimeout(1500);
  }

  // Switch to Terrain
  const terBtn = page.locator("button:has-text('Terrain')");
  if (await terBtn.count() > 0) {
    await terBtn.click();
    await page.waitForTimeout(1200);
  }

  console.log("Tour Step 3: Interactive Safety Games Arcade");
  await page.goto("http://localhost:3000/games", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Enter Lightning Game
  await page.goto("http://localhost:3000/games/lightning", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // Make choices in lightning game
  for (let step = 0; step < 3; step++) {
    const safeChoice = page.locator("button:has-text('Safe to do')");
    if (await safeChoice.count() > 0) {
      await safeChoice.first().click();
      await page.waitForTimeout(700);
      const nextBtn = page.locator("button:has-text('Next')");
      if (await nextBtn.count() > 0) {
        await nextBtn.first().click();
        await page.waitForTimeout(500);
      }
    }
  }

  console.log("Tour Step 4: 72-Hour Go-Bag Game Packing Challenge");
  await page.goto("http://localhost:3000/games/go-bag", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // Pack items
  const itemsToPack = ["Drinking water", "Torch", "Essential medicines", "phone", "first aid", "whistle", "cash", "clothes"];
  for (const itemText of itemsToPack) {
    const it = page.locator(`button:has-text('${itemText}')`);
    if (await it.count() > 0) {
      await it.first().click();
      await page.waitForTimeout(300);
    }
  }

  // Click Pack Now
  const packBtn = page.locator("button:has-text('Pack Go-Bag')");
  if (await packBtn.count() > 0) {
    await packBtn.click();
    await page.waitForTimeout(1800); // let confetti and fanfare play
  }

  console.log("Tour Step 5: Masterclass Quiz Player");
  await page.goto("http://localhost:3000/quiz/cyclone", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const quizOption = page.locator("button:has-text('B')");
  if (await quizOption.count() > 0) {
    await quizOption.first().click();
    await page.waitForTimeout(1000);
  }

  // Close context to write out video
  const videoObj = page.video();
  await page.close();
  await context.close();
  await browser.close();

  if (videoObj) {
    const videoPath = await videoObj.path();
    const finalDest = path.join(artifactDir, "masterclass_experience_tour.webm");
    fs.copyFileSync(videoPath, finalDest);
    console.log("Video tour saved to:", finalDest);
  }
}

main().catch((err) => {
  console.error("Tour recording failed:", err);
  process.exit(1);
});
