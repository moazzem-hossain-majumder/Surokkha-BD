const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");

const HAZARDS = [
  "cyclone",
  "riverine-flood",
  "flash-flood",
  "urban-waterlogging",
  "riverbank-erosion",
  "landslide",
  "earthquake",
  "lightning",
  "nor-wester",
  "drought",
  "heatwave",
  "cold-wave-fog",
  "salinity",
  "tsunami",
];

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3";
  const guidesDir = path.join(artifactDir, "hazard_guides");
  if (!fs.existsSync(guidesDir)) fs.mkdirSync(guidesDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  // 1. Capture Light Mode
  console.log("=== CAPTURING LIGHT (NORMAL) MODE ===");
  const lightContext = await browser.newContext({
    viewport: { width: 1366, height: 800 },
    colorScheme: "light",
  });
  await lightContext.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });
  const lightPage = await lightContext.newPage();

  // Catalog in light mode
  await lightPage.goto("http://localhost:3000/hazards", { waitUntil: "networkidle" });
  await lightPage.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await lightPage.screenshot({ path: path.join(guidesDir, "hazards_catalog_light.png") });

  for (const slug of HAZARDS) {
    console.log(`Capturing Light: ${slug}`);
    await lightPage.goto(`http://localhost:3000/hazards/${slug}`, { waitUntil: "networkidle" });
    await lightPage.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
    await lightPage.waitForTimeout(300);
    await lightPage.screenshot({ path: path.join(guidesDir, `guide_${slug}_light.png`) });
  }
  await lightContext.close();

  // 2. Capture Dark Mode
  console.log("=== CAPTURING DARK MODE ===");
  const darkContext = await browser.newContext({
    viewport: { width: 1366, height: 800 },
    colorScheme: "dark",
  });
  await darkContext.addInitScript(() => {
    localStorage.setItem("theme", "dark");
  });
  const darkPage = await darkContext.newPage();

  // Catalog in dark mode
  await darkPage.goto("http://localhost:3000/hazards", { waitUntil: "networkidle" });
  await darkPage.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await darkPage.screenshot({ path: path.join(guidesDir, "hazards_catalog_dark.png") });

  for (const slug of HAZARDS) {
    console.log(`Capturing Dark: ${slug}`);
    await darkPage.goto(`http://localhost:3000/hazards/${slug}`, { waitUntil: "networkidle" });
    await darkPage.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
    await darkPage.waitForTimeout(300);
    await darkPage.screenshot({ path: path.join(guidesDir, `guide_${slug}_dark.png`) });
  }
  await darkContext.close();

  await browser.close();
  console.log("All 14 hazard guides successfully captured in Light and Dark mode!");
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
