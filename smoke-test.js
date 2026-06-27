const { chromium } = require('playwright');

const BASE = 'http://localhost:8765';
const SB_URL = 'https://zwpimotdtuhbpwjcooiz.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGltb3RkdHVoYnB3amNvb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODIxMTUsImV4cCI6MjA5ODE1ODExNX0.BEdbAK9_lquFL8WyWwOU_DQ1bGbwzSpO9A54kKQxZFU';
const ADMIN_ID = 'admin';
const ADMIN_PW = 'AhlulBayt2024!';

let pass = 0, fail = 0, warns = [];
const jsErrors = [];

function ok(label, val) {
  if (val) { console.log(`  ✅ ${label}`); pass++; }
  else      { console.log(`  ❌ FAIL: ${label}`); fail++; }
}
function warn(msg) { console.log(`  ⚠️  ${msg}`); warns.push(msg); }

async function clickAdminTab(page, label) {
  const tabs = await page.$$('div');
  for (const tab of tabs) {
    const txt = (await tab.textContent() || '').trim();
    const style = await tab.getAttribute('style') || '';
    if (txt === label && style.includes('border-radius: 20px')) {
      await tab.click(); return true;
    }
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox']
  });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('pageerror', e => jsErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });

  // ── 1. BASIC LOAD ──────────────────────────────────────────────────────────
  console.log('\n── 1. Basic load');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  ok('Page title', (await page.title()) === 'Ahlul Bayt Ireland');
  ok('App container renders', await page.locator('.app').isVisible());

  // ── 2. NAV TABS ────────────────────────────────────────────────────────────
  console.log('\n── 2. Nav tabs');
  ok('Nav has 5 tabs', await page.locator('.abi-nav > div').count() === 5);
  for (const [idx, label] of [[1,'Prayer'],[2,'Library'],[3,'Updates'],[4,'More'],[0,'Home']]) {
    await page.locator('.abi-nav > div').nth(idx).click();
    await page.waitForTimeout(300);
    ok(`Nav ${label}`, (await page.content()).length > 5000);
  }

  // ── 3. HOME SCREEN ─────────────────────────────────────────────────────────
  console.log('\n── 3. Home screen');
  await page.locator('.abi-nav > div').nth(0).click();
  await page.waitForTimeout(400);
  const homeText = await page.evaluate(() => document.body.innerText);
  ok('Greeting (English)', ['Good morning','Good afternoon','Good evening'].some(g => homeText.includes(g)));
  ok('Salaam', homeText.includes('السلام عليكم'));
  ok('NEXT PRAYER widget', homeText.toUpperCase().includes('NEXT PRAYER'));
  ok('Prayer name in widget', ['Fajr','Dhuhr','Asr','Maghrib','Isha','Midnight'].some(p => homeText.includes(p)));

  // ── 4. PRAYER SCREEN ───────────────────────────────────────────────────────
  console.log('\n── 4. Prayer screen');
  await page.locator('.abi-nav > div').nth(1).click();
  await page.waitForTimeout(300);
  const prayerText = await page.evaluate(() => document.body.innerText);
  ok('Fajr shows', prayerText.includes('Fajr'));
  ok('Today tab', prayerText.includes('Today'));
  ok('Monthly tab', prayerText.includes('Monthly'));

  // ── 5. LIBRARY SCREEN ──────────────────────────────────────────────────────
  console.log('\n── 5. Library screen');
  await page.locator('.abi-nav > div').nth(2).click();
  await page.waitForTimeout(300);
  ok('Library renders', (await page.evaluate(() => document.body.innerText)).includes('Library'));

  // ── 6. UPDATES/STORIES ─────────────────────────────────────────────────────
  console.log('\n── 6. Updates / Stories');
  await page.locator('.abi-nav > div').nth(3).click();
  await page.waitForTimeout(300);
  ok('Stories screen renders', (await page.content()).length > 5000);

  // ── 7. MORE SCREEN ─────────────────────────────────────────────────────────
  console.log('\n── 7. More screen content & language');
  await page.locator('.abi-nav > div').nth(4).click();
  await page.waitForTimeout(300);
  const moreText = await page.evaluate(() => document.body.innerText);
  ok('Calendar on More', moreText.includes('Calendar'));
  ok('Admin on More', moreText.includes('Admin'));
  ok('Kids Corner NOT on More', !moreText.includes('Kids Corner'));
  ok('Health & Wellness NOT on More', !moreText.includes('Health & Wellness'));
  ok('Qibla NOT on More', !moreText.includes('Qibla Finder'));
  ok('Classifieds NOT on More', !moreText.includes('Classifieds'));
  ok('Hindi option', moreText.includes('हिन्दी'));
  ok('Persian option', moreText.includes('فارسی'));
  ok('French removed', !moreText.includes('Français'));

  // ── 8. ADMIN LOGIN ─────────────────────────────────────────────────────────
  console.log('\n── 8. Admin login');
  await page.locator('text=Admin Dashboard').first().click();
  await page.waitForSelector('input[placeholder="Admin ID"]', { timeout: 8000 });

  await page.fill('input[placeholder="Admin ID"]', 'baduser');
  await page.fill('input[placeholder="Password"]', 'badpass');
  await page.locator('text=Sign In').click();
  await page.waitForTimeout(600);
  const loginErrText = await page.evaluate(() => document.body.innerText);
  ok('Wrong creds rejected', loginErrText.includes('Invalid') || loginErrText.includes('!'));

  await page.fill('input[placeholder="Admin ID"]', ADMIN_ID);
  await page.fill('input[placeholder="Password"]', ADMIN_PW);
  await page.locator('text=Sign In').click();
  await page.waitForTimeout(1000);
  const adminText = await page.evaluate(() => document.body.innerText);
  ok('Admin panel loads', adminText.includes('Stories') && adminText.includes('Events'));
  ok('Log out button', adminText.includes('Log out'));

  // ── 9. DEPLOY / REVERT BUTTONS ─────────────────────────────────────────────
  console.log('\n── 9. Deploy / Revert buttons');
  const hasDeployBtn = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div'))
      .some(d => d.textContent.includes('Deploy to all users') || d.textContent.includes('All changes deployed')));
  ok('Deploy button present', hasDeployBtn);
  const hasRevertBtn = await page.evaluate(() =>
    Array.from(document.querySelectorAll('div')).some(d => d.textContent.trim() === 'Revert'));
  ok('Revert button present', hasRevertBtn);
  ok('Deploy shows deployed state (no pending changes)',
    await page.evaluate(() => Array.from(document.querySelectorAll('div'))
      .some(d => d.textContent.includes('All changes deployed'))));

  // ── 10. SECTION SAVE → DEPLOY FLOW ─────────────────────────────────────────
  console.log('\n── 10. Admin edit → section save → deploy to Supabase');
  await clickAdminTab(page, 'Announcement');
  await page.waitForTimeout(400);

  await page.fill('input[placeholder="Headline"]', 'QA Smoke Test');
  await page.locator('textarea').first().fill('Automated smoke test message.');

  const sectionSaved = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('div'))
      .find(d => d.textContent.trim() === 'Save' &&
        (d.style.borderRadius === '11px' || d.style.borderRadius === '10px'));
    if (btn) { btn.click(); return true; }
    return false;
  });
  await page.waitForTimeout(600);
  ok('Section Save clicked', sectionSaved);

  ok('Deploy button activates (green) after section save',
    await page.evaluate(() => Array.from(document.querySelectorAll('div'))
      .some(d => d.textContent.includes('Deploy to all users') && d.style.background.includes('31, 81, 69'))));

  // Click Deploy
  await page.evaluate(() => {
    const d = Array.from(document.querySelectorAll('div'))
      .find(el => el.textContent.trim() === '↑ Deploy to all users');
    if (d) d.click();
  });
  await page.waitForTimeout(2500);

  ok('Toast shows after deploy',
    (await page.evaluate(() => document.body.innerText)).includes('Deployed'));
  ok('Deploy button resets after deploy',
    await page.evaluate(() => Array.from(document.querySelectorAll('div'))
      .some(d => d.textContent.includes('All changes deployed'))));

  // ── 11. SUPABASE DIRECT READ-BACK ──────────────────────────────────────────
  console.log('\n── 11. Supabase direct verification');
  const sbCheck = await page.evaluate(async ({ url, key }) => {
    try {
      const r = await fetch(url + '/rest/v1/content?select=key,value&key=eq.announcement', {
        headers: { apikey: key, Authorization: 'Bearer ' + key }
      });
      const rows = await r.json();
      return { ok: r.ok, status: r.status, rows };
    } catch(e) { return { ok: false, error: e.message }; }
  }, { url: SB_URL, key: SB_KEY });
  ok('Supabase REST reachable', sbCheck.ok);
  ok('Row exists in content table', Array.isArray(sbCheck.rows) && sbCheck.rows.length > 0);
  ok('Correct title stored in Supabase', sbCheck.rows?.[0]?.value?.title === 'QA Smoke Test');

  // ── 12. SECOND DEVICE (fresh load) ─────────────────────────────────────────
  console.log('\n── 12. Second device sees deployed content');
  const page2 = await ctx.newPage();
  page2.on('pageerror', e => jsErrors.push('page2: ' + e.message));
  await page2.goto(BASE, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(2500);
  await page2.locator('.abi-nav > div').nth(0).click();
  await page2.waitForTimeout(500);
  const freshBody = await page2.evaluate(() => document.body.innerText);
  ok('Fresh device sees QA Smoke Test announcement', freshBody.includes('QA Smoke Test'));
  await page2.close();

  // ── 13. REVERT BUTTON ──────────────────────────────────────────────────────
  console.log('\n── 13. Revert button');
  await page.evaluate(() => {
    const d = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'Revert');
    if (d) d.click();
  });
  await page.waitForTimeout(2500);
  ok('Revert toast shows',
    (await page.evaluate(() => document.body.innerText)).includes('Reverted') ||
    (await page.evaluate(() => document.body.innerText)).includes('version'));

  // ── 14. LANGUAGE SWITCHER ──────────────────────────────────────────────────
  console.log('\n── 14. Language switcher');
  await page.locator('.abi-nav > div').nth(4).click();
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const d = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'हिन्दी');
    if (d) d.click();
  });
  await page.waitForTimeout(400);
  ok('Hindi UI activates', (await page.evaluate(() => document.body.innerText)).includes('होम') ||
    (await page.evaluate(() => document.body.innerText)).includes('अधिक'));
  await page.evaluate(() => {
    const d = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'English');
    if (d) d.click();
  });
  await page.waitForTimeout(300);

  // ── 15. CSP ────────────────────────────────────────────────────────────────
  console.log('\n── 15. Security / CSP');
  const csp = await page.evaluate(() => {
    const m = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return m ? m.getAttribute('content') : '';
  });
  ok('CSP meta present', csp.length > 0);
  ok("script-src 'self' in CSP", csp.includes("script-src 'self'"));
  ok('No unsafe-eval in CSP', !csp.includes('unsafe-eval'));

  // ── 16. SERVICE WORKER ─────────────────────────────────────────────────────
  console.log('\n── 16. Service worker');
  ok('SW registered', await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const regs = await navigator.serviceWorker.getRegistrations();
    return regs.length > 0;
  }));

  // ── 17. JS ERRORS ──────────────────────────────────────────────────────────
  console.log('\n── 17. JS errors');
  const realErrors = jsErrors.filter(e => !e.includes('favicon'));
  ok('Zero JS errors', realErrors.length === 0);
  if (realErrors.length) realErrors.forEach(e => warn('JS: ' + e.slice(0,120)));

  await browser.close();

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log(`  ${pass + fail} checks — ✅ ${pass} passed  ❌ ${fail} failed`);
  if (warns.length) { console.log('\nWarnings:'); warns.forEach(w => console.log('  ⚠️  ' + w)); }
  console.log(fail === 0 ? '\n  🟢 ALL CHECKS PASSED' : '\n  🔴 FAILURES FOUND');
  process.exit(fail > 0 ? 1 : 0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
