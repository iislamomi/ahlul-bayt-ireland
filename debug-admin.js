const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto('http://localhost:8765', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.locator('.abi-nav > div').nth(4).click();
  await p.waitForTimeout(300);
  await p.locator('text=Admin Dashboard').first().click();
  await p.waitForSelector('input[placeholder="Admin ID"]', { timeout: 8000 });
  await p.fill('input[placeholder="Admin ID"]', 'abiadmin');
  await p.fill('input[placeholder="Password"]', 'Admin123@');
  await p.locator('text=Sign In').click();
  await p.waitForTimeout(1000);

  const adminText = await p.evaluate(() => document.body.innerText);
  console.log('Logged in:', adminText.includes('Stories'));

  // Find and click Announcement tab
  const allDivs = await p.$$('div');
  let clicked = false;
  for (const tab of allDivs) {
    const txt = (await tab.textContent() || '').trim();
    const style = await tab.getAttribute('style') || '';
    if (txt === 'Announcement' && style.includes('border-radius: 20px')) {
      await tab.click(); clicked = true; break;
    }
  }
  console.log('Clicked Announcement tab:', clicked);
  await p.waitForTimeout(600);

  const sectionText = await p.evaluate(() => document.body.innerText);
  console.log('After tab click (first 400 chars):\n', sectionText.slice(0, 400));

  const inputs = await p.evaluate(() =>
    Array.from(document.querySelectorAll('input,textarea'))
      .map(i => ({ tag: i.tagName, type: i.type, placeholder: i.placeholder }))
  );
  console.log('Inputs/textareas:', JSON.stringify(inputs, null, 2));

  await b.close();
})().catch(e => console.error('FATAL:', e.message));
