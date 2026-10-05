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
    colorScheme: "dark",
  });

  const page = await context.newPage();
  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3";

  // Force data-theme="dark"
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.screenshot({ path: path.join(artifactDir, "masterclass_home_dark.png") });

  await page.goto("http://localhost:3000/map", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(artifactDir, "masterclass_map_dark.png") });

  await page.goto("http://localhost:3000/games/lightning", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.screenshot({ path: path.join(artifactDir, "masterclass_lightning_dark.png") });

  await browser.close();
  console.log("Dark mode screenshots captured!");
}

main().catch((err) => {
  console.error("Dark capture failed:", err);
  process.exit(1);
});
