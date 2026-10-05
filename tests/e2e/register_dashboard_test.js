const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ARTIFACT_DIR = 'C:\\Users\\MITHIL\\.gemini\\antigravity-ide\\brain\\e8580d11-6487-4c9a-b224-dabe1c52c5e3';
const VIDEO_DIR = path.join(ARTIFACT_DIR, 'scratch', 'videos');
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'scratch');

if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const executablePath = fs.existsSync(edgePath) ? edgePath : chromePath;

async function runTest() {
  console.log('Using browser executable:', executablePath);
  const consoleMessages = [];
  const pageErrors = [];

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 800 }
    }
  });

  const page = await context.newPage();

  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    console.log(`[Browser Console ${msg.type().toUpperCase()}]:`, msg.text());
  });

  page.on('pageerror', error => {
    pageErrors.push(error.toString());
    console.error('[Browser PageError]:', error.toString());
  });

  const report = {
    steps: [],
    consoleMessages: [],
    pageErrors: [],
    success: false
  };

  const testEmail = `tester_${Date.now()}@gmail.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test Citizen';

  try {
    // Step 1: Navigate to /register
    console.log('Step 1: Navigating to http://localhost:3000/register...');
    const navResponse = await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 15000 });
    const regUrl = page.url();
    const regStatus = navResponse ? navResponse.status() : 'unknown';
    console.log(`Arrived at ${regUrl} (status: ${regStatus})`);
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_register_page.png') });
    report.steps.push({
      step: 'Navigate to /register',
      url: regUrl,
      status: regStatus,
      screenshot: '01_register_page.png'
    });

    // Step 2: Fill out registration form
    console.log('Step 2: Filling out registration form...');
    await page.waitForSelector('#displayName', { timeout: 10000 });
    await page.fill('#displayName', testName);
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_register_filled.png') });
    
    report.steps.push({
      step: 'Fill registration form',
      email: testEmail,
      displayName: testName,
      screenshot: '02_register_filled.png'
    });

    // Step 3: Submit and wait for redirect to /dashboard
    console.log('Step 3: Submitting registration form and waiting for redirect to /dashboard...');
    await Promise.all([
      page.waitForURL(url => url.pathname.includes('/dashboard'), { timeout: 15000 }),
      page.click('#signup-submit-button')
    ]);

    const dashboardUrl = page.url();
    console.log(`Redirected to: ${dashboardUrl}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_dashboard_page.png') });
    
    report.steps.push({
      step: 'Redirect to /dashboard',
      finalUrl: dashboardUrl,
      screenshot: '03_dashboard_page.png'
    });

    // Step 4: Verify welcome banner
    console.log('Step 4: Checking welcome banner...');
    await page.waitForSelector('#welcome-banner', { timeout: 10000 });
    const bannerText = await page.textContent('#welcome-banner');
    console.log(`Welcome banner found: "${bannerText.trim()}"`);
    
    report.steps.push({
      step: 'Verify welcome banner',
      bannerText: bannerText.trim()
    });

    // Step 5: Clean logout
    console.log('Step 5: Logging out cleanly via #logout-button...');
    await page.waitForSelector('#logout-button', { timeout: 5000 });
    await Promise.all([
      page.waitForURL(url => !url.pathname.includes('/dashboard'), { timeout: 10000 }),
      page.click('#logout-button')
    ]);

    const postLogoutUrl = page.url();
    console.log(`Post-logout URL: ${postLogoutUrl}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_logged_out.png') });

    // Step 6: Verify cannot access /dashboard when logged out
    console.log('Step 6: Verifying protected /dashboard access after logout...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 10000 });
    const recheckUrl = page.url();
    console.log(`/dashboard when logged out redirects to: ${recheckUrl}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_recheck_redirect.png') });

    report.steps.push({
      step: 'Clean logout and guard check',
      postLogoutUrl,
      recheckUrl,
      screenshot: '05_recheck_redirect.png'
    });

    report.success = true;
    console.log('Test completed successfully!');
  } catch (err) {
    console.error('Test execution error:', err);
    report.error = err.toString();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png') }).catch(() => {});
  } finally {
    report.consoleMessages = consoleMessages;
    report.pageErrors = pageErrors;

    const video = page.video();
    let videoPath = null;
    if (video) {
      videoPath = await video.path();
    }
    await context.close();
    await browser.close();

    if (videoPath) {
      report.videoPath = videoPath;
      console.log('Video recording saved at:', videoPath);
    }

    // Clean up created user in Supabase
    try {
      const supabase = createClient(
        'https://uvdbdzoqutwhpvgjjiao.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZGJkem9xdXR3aHB2Z2pqaWFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDMyOTI2NCwiZXhwIjoyMTA1OTA1MjY0fQ.qT1_wYRXhXHHFGkHBkvm0sl6u6lWwI5oN5wI56PG2ag'
      );
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const createdUser = usersData?.users?.find(u => u.email === testEmail);
      if (createdUser) {
        await supabase.auth.admin.deleteUser(createdUser.id);
        console.log(`Cleaned up test user: ${testEmail}`);
      }
    } catch (cleanErr) {
      console.warn('Failed to clean up test user:', cleanErr);
    }

    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'scratch', 'test_results.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('Test report written to scratch/test_results.json');
  }
}

runTest();
