const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3";

  // Capture Cyclone hazard guide
  await page.goto("http://localhost:3000/hazards/cyclone", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, "fixed_cyclone_guide.png") });

  // Capture Tsunami hazard guide
  await page.goto("http://localhost:3000/hazards/tsunami", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactDir, "fixed_tsunami_guide.png") });

  await browser.close();
  console.log("Comparison screenshots saved!");
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
