const { chromium } = require('playwright');

(async () => {
  const SB_URL = 'https://zwpimotdtuhbpwjcooiz.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGltb3RkdHVoYnB3amNvb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODIxMTUsImV4cCI6MjA5ODE1ODExNX0.BEdbAK9_lquFL8WyWwOU_DQ1bGbwzSpO9A54kKQxZFU';

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--ignore-certificate-errors', '--disable-web-security']
  });
  const page = await browser.newPage();
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });

  await page.goto('http://localhost:8765', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // ── Admin login ────────────────────────────────────────────────────────────
  await page.locator('.abi-nav > div').nth(4).click();
  await page.waitForTimeout(300);
  await page.locator('text=Admin Dashboard').first().click();
  await page.waitForSelector('input[placeholder="Admin ID"]', { timeout: 8000 });
  await page.fill('input[placeholder="Admin ID"]', 'abiadmin');
  await page.fill('input[placeholder="Password"]', 'Admin123@');
  await page.locator('text=Sign In').click();
  await page.waitForTimeout(1500);

  const adminText = await page.evaluate(() => document.body.innerText);
  console.log('[1] Admin login: ' + (adminText.includes('Stories') ? 'PASS' : 'FAIL'));
  console.log('[2] Auto-publish info visible: ' + (adminText.includes('Changes publish instantly') ? 'PASS' : 'FAIL'));
  console.log('[3] Cancel button present: ' + (adminText.includes('Cancel') ? 'PASS' : 'FAIL'));

  // ── Click Announcement tab ─────────────────────────────────────────────────
  const allDivs = await page.$$('div');
  for (const tab of allDivs) {
    const txt = (await tab.textContent() || '').trim();
    const style = await tab.getAttribute('style') || '';
    if (txt === 'Announcement' && style.includes('border-radius: 20px')) {
      await tab.click(); break;
    }
  }
  await page.waitForTimeout(400);

  // Click "Edit Announcement" to enter edit mode
  await page.locator('text=Edit Announcement').first().click();
  await page.waitForTimeout(400);
  console.log('[4] Announcement edit form: ' + (await page.locator('input[placeholder="Headline"]').isVisible() ? 'PASS' : 'FAIL'));

  // ── Fill and save ──────────────────────────────────────────────────────────
  const testTitle = 'SyncTest-' + Date.now();
  await page.fill('input[placeholder="Headline"]', testTitle);
  await page.locator('textarea').first().fill('Supabase sync verification.');
  const sectionSaved = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('div'))
      .find(d => d.textContent.trim() === 'Save' && d.style.borderRadius === '11px');
    if (btn) { btn.click(); return true; }
    return false;
  });
  await page.waitForTimeout(2000);
  console.log('[5] Section save clicked: ' + (sectionSaved ? 'PASS' : 'FAIL'));

  // Check toast appeared
  const afterSave = await page.evaluate(() => document.body.innerText);
  console.log('[6] Save toast shown: ' + (afterSave.includes('Saved') ? 'PASS' : 'FAIL'));

  // ── Supabase direct read-back (from browser context — avoids sandbox CORS) ──
  const sbResult = await page.evaluate(async ({ url, key }) => {
    try {
      const r = await fetch(url + '/rest/v1/content?select=key,value&key=eq.announcement&order=updated_at.desc', {
        headers: { apikey: key, Authorization: 'Bearer ' + key }
      });
      const rows = await r.json();
      return { ok: r.ok, status: r.status, title: rows[0]?.value?.title, count: rows.length };
    } catch (e) { return { ok: false, error: e.message }; }
  }, { url: SB_URL, key: SB_KEY });
  console.log('[7] Supabase reachable: ' + (sbResult.ok ? 'PASS' : 'FAIL - ' + (sbResult.error || sbResult.status)));
  console.log('[8] Row in DB: ' + (sbResult.count > 0 ? 'PASS' : 'FAIL'));
  console.log('[9] Correct title in DB: ' + (sbResult.title === testTitle ? 'PASS' : 'FAIL - got: ' + sbResult.title));

  // ── Second device simulation ───────────────────────────────────────────────
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  await page2.goto('http://localhost:8765', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(3000);
  await page2.locator('.abi-nav > div').nth(0).click();
  await page2.waitForTimeout(500);
  const freshBody = await page2.evaluate(() => document.body.innerText);
  console.log('[10] Second device sees update: ' + (freshBody.includes(testTitle) ? 'PASS' : 'FAIL'));
  await page2.close();

  // ── JS errors ─────────────────────────────────────────────────────────────
  const realErrors = jsErrors.filter(e => !e.includes('favicon') && !e.includes('404') && !e.includes('net::ERR'));
  console.log('[11] JS errors: ' + (realErrors.length === 0 ? 'PASS (0 errors)' : 'FAIL - ' + realErrors.join('; ').slice(0, 300)));

  await browser.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
