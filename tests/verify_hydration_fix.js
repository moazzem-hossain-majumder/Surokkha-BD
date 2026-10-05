const { chromium } = require("playwright-core");
const fs = require("fs");

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext();

  // Emulate browser extension (e.g. ColorZilla) injecting cz-shortcut-listen before hydration
  await context.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.setAttribute("cz-shortcut-listen", "true");
    });
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Check if Next.js error overlay exists
  const nextErrorOverlay = await page.$("nextjs-portal, [data-nextjs-dialog-overlay]");
  console.log("Next error overlay present?", !!nextErrorOverlay);
  console.log("Console errors count:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log("Console errors:", consoleErrors);
  }

  await browser.close();

  if (consoleErrors.some(e => e.includes("hydration") || e.includes("cz-shortcut-listen"))) {
    console.error("Hydration error still detected!");
    process.exit(1);
  } else {
    console.log("Hydration check PASSED! Zero hydration errors with cz-shortcut-listen.");
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
