const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 850 },
  });

  const page = await context.newPage();
  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3";

  console.log("1. Capturing Home Page...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, "masterclass_home.png") });

  console.log("2. Capturing Google Maps Page...");
  await page.goto("http://localhost:3000/map", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000); // let tiles render
  await page.screenshot({ path: path.join(artifactDir, "masterclass_google_map.png") });

  console.log("3. Capturing Games Arcade Hub...");
  await page.goto("http://localhost:3000/games", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, "masterclass_games_hub.png") });

  console.log("4. Capturing Lightning Game (Interactive Choice)...");
  await page.goto("http://localhost:3000/games/lightning", { waitUntil: "networkidle" });
  // Click first option to trigger interactive choice feedback
  const safeButton = page.locator("button:has-text('Safe to do')");
  if (await safeButton.count() > 0) {
    await safeButton.first().click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: path.join(artifactDir, "masterclass_lightning_game.png") });

  console.log("5. Capturing Go-Bag Packing Game...");
  await page.goto("http://localhost:3000/games/go-bag", { waitUntil: "networkidle" });
  // Select a few items into backpack
  const waterBtn = page.locator("button:has-text('Drinking water')");
  if (await waterBtn.count() > 0) await waterBtn.first().click();
  const torchBtn = page.locator("button:has-text('Torch')");
  if (await torchBtn.count() > 0) await torchBtn.first().click();
  const medBtn = page.locator("button:has-text('Essential medicines')");
  if (await medBtn.count() > 0) await medBtn.first().click();
  const radioBtn = page.locator("button:has-text('radio')");
  if (await radioBtn.count() > 0) await radioBtn.first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactDir, "masterclass_go_bag_game.png") });

  console.log("6. Capturing Quiz Hub Catalog...");
  await page.goto("http://localhost:3000/quiz", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, "masterclass_quiz_hub.png") });

  console.log("7. Capturing Cyclone Quiz Player...");
  await page.goto("http://localhost:3000/quiz/cyclone", { waitUntil: "networkidle" });
  // Click an option to show interactive explanation
  const optButton = page.locator("button:has-text('A')");
  if (await optButton.count() > 0) {
    await optButton.first().click();
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: path.join(artifactDir, "masterclass_quiz_player.png") });

  await browser.close();
  console.log("Screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
