const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = (process.env.PREVIEW_URL || 'http://127.0.0.1:8768').replace(/\/$/, '');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  let passed = 0;
  async function ready(page) {
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = 'eager';
      await document.fonts.ready;
    });
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  }
  async function place(page, selector, progress) {
    await page.evaluate(({ selector, progress }) => {
      const box = document.querySelector(selector).getBoundingClientRect();
      const line = document.querySelector('.masthead').getBoundingClientRect().bottom + 24;
      window.scrollTo({ top: scrollY + box.top + box.height * progress - line, behavior: 'instant' });
    }, { selector, progress });
  }
  async function position(page, selector) {
    return page.evaluate(selector => {
      const box = document.querySelector(selector).getBoundingClientRect();
      const line = document.querySelector('.masthead').getBoundingClientRect().bottom + 24;
      return { progress: (line - box.top) / box.height, y: scrollY, url: location.pathname + location.search + location.hash };
    }, selector);
  }
  async function switchLanguage(page, selector, expectedPath) {
    const before = await position(page, selector);
    const button = await page.locator('#language-toggle').boundingBox();
    // Use a real pointer click; locator auto-scroll can move a sticky header first.
    await page.mouse.click(button.x + button.width / 2, button.y + button.height / 2);
    await page.waitForURL(url => url.pathname === expectedPath && !url.searchParams.has('homepage-position'));
    await ready(page);
    const after = await position(page, selector);
    assert(Math.abs(after.progress - before.progress) < .05, `Reading position lost: ${JSON.stringify({ selector, before, after })}`);
    assert(after.y > 0, 'Language switch returned to the top');
    passed++;
  }
  try {
    for (const width of [1440, 390, 320]) {
      for (const hash of ['', '#name', '#research']) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        try {
          const page = await context.newPage();
          await page.goto(base + '/?reading=test' + hash); await ready(page);
          await place(page, '#cake', .45);
          const beforeTheme = await position(page, '#cake');
          const themeButton = await page.locator('#theme-toggle').boundingBox();
          await page.mouse.click(themeButton.x + themeButton.width / 2, themeButton.y + themeButton.height / 2);
          const afterTheme = await position(page, '#cake');
          assert(Math.abs(beforeTheme.progress - afterTheme.progress) < .01, 'Theme switch moved the reading position');
          await switchLanguage(page, '#cake', '/zh/');
          assert.equal(new URL(page.url()).search, '?reading=test');
          assert.equal(new URL(page.url()).hash, hash);
          await switchLanguage(page, '#cake', '/');
          await page.evaluate(() => { document.querySelector('.publication-record').open = false; });
          // Match an individual translated item; the whole section changes height.
          const honor = '.honors-section li:nth-child(2)';
          await place(page, honor, .3);
          const beforeHistory = await position(page, honor);
          await switchLanguage(page, honor, '/zh/');
          const targetHistory = await position(page, honor);
          assert.equal(await page.locator('.publication-record').evaluate(el => el.open), false, 'Collapsed publication list was reopened');
          await page.goBack(); await ready(page);
          assert.equal(new URL(page.url()).pathname, '/');
          const afterHistory = await position(page, honor);
          assert(Math.abs(beforeHistory.progress - afterHistory.progress) < .05, 'Back lost the source reading position');
          passed++;
          await page.goForward(); await ready(page);
          assert.equal(new URL(page.url()).pathname, '/zh/');
          const afterForward = await position(page, honor);
          assert(Math.abs(targetHistory.progress - afterForward.progress) < .05, 'Forward lost the target reading position');
          passed++;
        } finally { await context.close(); }
      }
    }
    const blocked = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    await blocked.addInitScript(() => {
      for (const method of ['getItem', 'setItem', 'removeItem']) Object.defineProperty(Storage.prototype, method, { configurable: true, value() { throw new DOMException('Storage blocked', 'SecurityError'); } });
    });
    try {
      const page = await blocked.newPage(); await page.goto(base + '/'); await ready(page);
      await place(page, '#magb', .4); await switchLanguage(page, '#magb', '/zh/');
      assert.equal(new URL(page.url()).search, '', 'Temporary position parameter remained in URL');
      await switchLanguage(page, '#magb', '/');
    } finally { await blocked.close(); }
    const keyboard = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await keyboard.addInitScript(() => {
      localStorage.setItem('homepage-theme', 'dark');
      localStorage.setItem('homepage-style', 'claude');
    });
    try {
      const page = await keyboard.newPage(); await page.goto(base + '/#name'); await ready(page);
      await place(page, '#magb', .4);
      const before = await position(page, '#magb');
      await page.locator('#language-toggle').evaluate(el => el.focus({ preventScroll: true }));
      await page.keyboard.press('Enter'); await page.waitForURL('**/zh/#name'); await ready(page);
      const after = await position(page, '#magb');
      assert(Math.abs(after.progress - before.progress) < .05, 'Keyboard switch moved the reading position');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      assert.equal(await page.locator('html').getAttribute('data-style'), 'claude');
      passed++;
      for (const end of ['top', 'bottom']) {
        await page.evaluate(end => window.scrollTo({ top: end === 'top' ? 0 : document.documentElement.scrollHeight, behavior: 'instant' }), end);
        const target = new URL(page.url()).pathname === '/' ? '/zh/' : '/';
        const button = await page.locator('#language-toggle').boundingBox();
        await page.mouse.click(button.x + button.width / 2, button.y + button.height / 2);
        await page.waitForURL(url => url.pathname === target); await ready(page);
        const distance = await page.evaluate(end => end === 'top' ? scrollY : document.documentElement.scrollHeight - innerHeight - scrollY, end);
        assert(Math.abs(distance) <= 2, `Language switch did not preserve the page ${end}`);
        passed++;
      }
    } finally { await keyboard.close(); }
    console.log(JSON.stringify({ passed, widths: [1440,390,320], checks: 'Both language directions; absent/stale/current hash; unchanged query; reading fraction; collapsed publications; Back/Forward; blocked storage; keyboard; theme/style; top/bottom.' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
