const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

async function snapshot() {
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('Capturing /hazards...');
  await page.goto('http://localhost:3000/hazards', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'upgraded_hazards.png') });

  console.log('Capturing /hazards/cyclone...');
  await page.goto('http://localhost:3000/hazards/cyclone', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'upgraded_cyclone_guide.png') });

  console.log('Capturing /map (Google Maps)...');
  await page.goto('http://localhost:3000/map', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500); // let tiles load
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'upgraded_google_map.png') });

  console.log('Capturing /quiz/lightning...');
  await page.goto('http://localhost:3000/quiz/lightning', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'upgraded_quiz.png') });

  console.log('Capturing /games/lightning...');
  await page.goto('http://localhost:3000/games/lightning', { waitUntil: 'networkidle', timeout: 15000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'upgraded_lightning_game.png') });

  console.log('Capturing /games/go-bag...');
  await page.goto('http://localhost:3000/games/go-bag', { waitUntil: 'networkidle', timeout: 15000 });
  // select a couple of items to show the visual backpack slots
  await page.click('text=Drinking water');
  await page.click('text=Essential medicines');
  await page.click('text=Torch / flashlight');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'upgraded_go_bag_game.png') });

  await browser.close();
  console.log('All upgraded screenshots captured successfully!');
}

snapshot().catch(console.error);
