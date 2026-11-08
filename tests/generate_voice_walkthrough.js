const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const chapters = [
  {
    id: "01_intro",
    title: "Homepage & Platform Overview",
    url: "http://localhost:3000",
    text: "Welcome to Surokkha BD, Bangladesh's National Disaster Resilience Platform, presented in Dark Mode. Surokkha BD equips citizens and emergency responders with real-time early warnings, crisis response coordination, and community recovery tools.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      const half = Math.floor(durationMs / 2);
      await page.evaluate(() => window.scrollBy({ top: 600, behavior: "smooth" }));
      await page.waitForTimeout(half - 500);
      await page.evaluate(() => window.scrollBy({ top: 600, behavior: "smooth" }));
      await page.waitForTimeout(half - 500);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await page.waitForTimeout(500);
    }
  },
  {
    id: "02_hazards",
    title: "14-Hazard Vulnerability Directory",
    url: "http://localhost:3000/hazards",
    text: "Navigating to the Hazards Directory, citizens can explore all fourteen major disaster hazards affecting Bangladesh, including coastal cyclones, Haor flash floods, riverbank erosion, earthquakes, and deadly lightning strikes.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 650, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "03_cyclone",
    title: "Cyclone Survival Guide",
    url: "http://localhost:3000/hazards/cyclone",
    text: "Opening the Cyclone Survival Guide, we see Bangladesh's official maritime and river warning signals one through ten clearly explained, accompanied by comprehensive Before, During, and After safety checklists.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "04_map",
    title: "Interactive GIS Disaster Map",
    url: "http://localhost:3000/map",
    text: "Here is the interactive GIS Disaster Map, powered by Leaflet. Users can inspect vulnerable coastal surge zones, toggle satellite reconnaissance and topographic terrain layers, and view verified emergency shelters across the coast.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(2000);
      const mapEl = page.locator(".leaflet-container");
      if (await mapEl.count() > 0) {
        const box = await mapEl.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.wheel(0, -250);
          await page.waitForTimeout(1500);
          const marker = page.locator(".leaflet-marker-icon").first();
          if (await marker.count() > 0) {
            await marker.click({ force: true });
          }
        }
      }
      await page.waitForTimeout(Math.max(1000, durationMs - 4000));
    }
  },
  {
    id: "05_shelters",
    title: "Cyclone Shelters Proximity Finder",
    url: "http://localhost:3000/shelters",
    text: "In the Shelters Finder, citizens can filter by district, like Cox's Bazar or Bhola, to instantly locate nearby emergency shelters, inspecting GPS coordinates, maximum capacity, solar generators, and separate quarters for women.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      const input = page.locator("input[type='search'], input[type='text']").first();
      if (await input.count() > 0) {
        await input.fill("Cox's Bazar");
        await page.waitForTimeout(1000);
      }
      await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 2500));
    }
  },
  {
    id: "06_report",
    title: "Citizen Disaster Incident Reporting",
    url: "http://localhost:3000/report",
    text: "During an active crisis, affected citizens can submit crowdsourced disaster reports. By dropping a GPS pin directly on the map and detailing the hazard, vital ground truth is routed to emergency response teams, even with offline queuing support.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      const map = page.locator(".leaflet-container");
      if (await map.count() > 0) {
        await map.click({ position: { x: 240, y: 170 } });
        await page.waitForTimeout(800);
      }
      const desc = page.locator("textarea, input[name='description']").first();
      if (await desc.count() > 0) {
        await desc.fill("Tidal surge overtopping coastal embankment near Kutubdia. Urgent sandbag support requested.");
      }
      await page.waitForTimeout(Math.max(1000, durationMs - 2500));
    }
  },
  {
    id: "07_relief",
    title: "ReliefLink Verified Supply Needs",
    url: "http://localhost:3000/relief",
    text: "ReliefLink connects affected communities directly with verified supply requests, including clean drinking water, oral rehydration saline, and dry food rations, ensuring total transparency between donors, volunteers, and ground teams.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "08_volunteer",
    title: "Volunteer Response Hub",
    url: "http://localhost:3000/volunteer",
    text: "The Volunteer Hub coordinates local citizen responders across all sixty-four districts of Bangladesh, mobilizing skilled teams for flood rescue, medical first aid, and community logistics during national emergencies.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "09_explorer",
    title: "Historical Disaster Data Explorer",
    url: "http://localhost:3000/explorer",
    text: "In the Historical Data Explorer, interactive analytics display Bangladesh's disaster history, comparing casualty trends from the 1970 Bhola cyclone to modern early warning successes such as Cyclone Amphan.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 600, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "10_quiz",
    title: "Disaster Preparedness Quiz",
    url: "http://localhost:3000/quiz/cyclone",
    text: "Public education is gamified through interactive disaster preparedness quizzes. Answering questions provides instant audio-visual feedback, streak multipliers, and life-saving explanations.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1200);
      const choice = page.locator("button:has-text('B'), button[class*='border']").first();
      if (await choice.count() > 0) {
        await choice.click();
      }
      await page.waitForTimeout(Math.max(1000, durationMs - 1800));
    }
  },
  {
    id: "11_games",
    title: "Life-Safety Games Arcade",
    url: "http://localhost:3000/games/lightning",
    text: "The Games Arcade features micro-simulations, including the Lightning Survival Challenge, teaching instant reflexes under simulated storm conditions, and the 72-Hour Emergency Go-Bag Challenge to pack essential survival supplies.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1200);
      const safeBtn = page.locator("button:has-text('Safe'), button:has-text('নিরাপদ')").first();
      if (await safeBtn.count() > 0) {
        await safeBtn.click();
        await page.waitForTimeout(1500);
      }
      // Switch to go bag
      await page.goto("http://localhost:3000/games/go-bag", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);
      const items = page.locator("button:has-text('Water'), button:has-text('Torch'), button:has-text('First Aid'), button:has-text('পানি')");
      const c = await items.count();
      for (let i = 0; i < Math.min(c, 2); i++) {
        await items.nth(i).click();
        await page.waitForTimeout(400);
      }
      await page.waitForTimeout(Math.max(1000, durationMs - 4500));
    }
  },
  {
    id: "12_ferries",
    title: "Inland Ferries & River Transit",
    url: "http://localhost:3000/ferries",
    text: "With Bangladesh's extensive river network, the Inland Ferries module tracks water transit routes, monsoon storm advisories, and river warning signals to keep river travelers and commuters safe.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "13_contacts",
    title: "24/7 Emergency Contacts Directory",
    url: "http://localhost:3000/contacts",
    text: "The 24/7 Emergency Contacts Directory provides one-tap telephone links to National Emergency Service 999, Disaster Early Warning 1090, Fire Service 16163, and Coastal Red Crescent units.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1500));
    }
  },
  {
    id: "14_outro",
    title: "Conclusion & Return Home",
    url: "http://localhost:3000",
    text: "Returning to the homepage, Surokkha BD delivers a comprehensive, zero-budget, bilingual disaster management ecosystem built for resilience. Thank you for watching.",
    action: async (page, durationMs) => {
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      await page.waitForTimeout(Math.max(1000, durationMs - 1000));
    }
  }
];

function getAudioDuration(wavPath) {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${wavPath}"`, { encoding: "utf8" });
    return parseFloat(out.trim()) * 1000;
  } catch (e) {
    return 10000;
  }
}

async function main() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const chromePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

  const baseDir = "d:\\surokkha-bd\\docs\\images\\readme_dark_showcase";
  const audioDir = path.join(baseDir, "voiceover_audio");
  const tempVideoDir = path.join(baseDir, "temp_voice_video");
  const artifactDir = "C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\c5d85ce1-4da6-469d-a72c-622e7e7000bf";

  [baseDir, audioDir, tempVideoDir, artifactDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  console.log("🎙️ STEP 1: Generating high quality Voiceover narration clips...");
  const wavFiles = [];
  const durations = [];

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const wavPath = path.join(audioDir, `${ch.id}.wav`);
    wavFiles.push(wavPath);

    // Escape text for powershell
    const safeText = ch.text.replace(/'/g, "''");
    const psScript = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice('Microsoft Zira Desktop')
$s.Rate = -1
$s.SetOutputToWaveFile('${wavPath.replace(/\\/g, "\\\\")}')
$s.Speak('${safeText}')
$s.Dispose()
`;
    fs.writeFileSync(path.join(audioDir, `gen_${ch.id}.ps1`), psScript, "utf8");
    execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(audioDir, `gen_${ch.id}.ps1`)}"`);

    const dur = getAudioDuration(wavPath);
    // Add 1.2s padding per chapter for natural pauses
    const paddedDur = Math.ceil(dur + 1200);
    durations.push(paddedDur);
    console.log(`  🔊 [${i+1}/${chapters.length}] ${ch.title}: ${(dur/1000).toFixed(1)}s (allocated ${(paddedDur/1000).toFixed(1)}s)`);
  }

  // Create concat file for ffmpeg to create continuous voiceover
  console.log("\n🎵 Concatenating audio tracks into master voiceover...");
  const concatList = path.join(audioDir, "concat.txt");
  // Create padded silence wav
  const silenceWav = path.join(audioDir, "silence.wav");
  execSync(`ffmpeg -y -f lavfi -i anullsrc=r=22050:cl=mono -t 1.2 -c:a pcm_s16le "${silenceWav}"`, { stdio: "ignore" });

  let concatContent = "";
  for (const wav of wavFiles) {
    concatContent += `file '${wav.replace(/\\/g, "/")}'\n`;
    concatContent += `file '${silenceWav.replace(/\\/g, "/")}'\n`;
  }
  fs.writeFileSync(concatList, concatContent, "utf8");

  const masterAudio = path.join(audioDir, "master_voiceover.wav");
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatList}" -c copy "${masterAudio}"`, { stdio: "ignore" });
  const totalAudioSec = (getAudioDuration(masterAudio) / 1000).toFixed(1);
  console.log(`✅ Master Voiceover Ready: ${masterAudio} (Duration: ${totalAudioSec}s)`);

  console.log("\n🎬 STEP 2: Recording browser in Dark Mode synchronized with voiceover...");
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--window-size=1440,900"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 1440, height: 900 },
    },
  });

  await context.addInitScript(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  });

  const page = await context.newPage();

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const durMs = durations[i];
    console.log(`  📽️ [${i+1}/${chapters.length}] Recording ${ch.title} (${(durMs/1000).toFixed(1)}s)...`);

    await page.goto(ch.url, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    });

    await ch.action(page, durMs);
  }

  const videoObj = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const recordedRawVideo = await videoObj.path();
  console.log(`\n📹 Raw Video Captured: ${recordedRawVideo}`);

  console.log("\n🎞️ STEP 3: Merging video and voiceover into final MP4 & WebM with FFmpeg...");
  const finalMp4Repo = path.join(baseDir, "surokkha_dark_mode_voiceover_walkthrough.mp4");
  const finalMp4Artifact = path.join(artifactDir, "surokkha_dark_mode_voiceover_walkthrough.mp4");

  const finalWebmRepo = path.join(baseDir, "surokkha_dark_mode_voiceover_walkthrough.webm");
  const finalWebmArtifact = path.join(artifactDir, "surokkha_dark_mode_voiceover_walkthrough.webm");

  // Merge video with audio track
  execSync(`ffmpeg -y -i "${recordedRawVideo}" -i "${masterAudio}" -map 0:v -map 1:a -c:v libx264 -preset fast -crf 21 -c:a aac -b:a 192k -shortest -pix_fmt yuv420p "${finalMp4Repo}"`, { stdio: "inherit" });
  fs.copyFileSync(finalMp4Repo, finalMp4Artifact);

  execSync(`ffmpeg -y -i "${finalMp4Repo}" -c:v libvpx -b:v 1500k -c:a libvorbis "${finalWebmRepo}"`, { stdio: "inherit" });
  fs.copyFileSync(finalWebmRepo, finalWebmArtifact);

  console.log("\n🎉 VOICE-NARRATED SCREEN RECORDING COMPLETE!");
  console.log(`📁 MP4 File: ${finalMp4Repo}`);
  console.log(`📁 Artifact MP4: ${finalMp4Artifact}`);
}

main().catch(e => {
  console.error("Voice recording failed:", e);
  process.exit(1);
});
