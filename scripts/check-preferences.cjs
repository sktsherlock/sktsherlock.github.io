const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'design-demos', 'screenshots');
const data = JSON.parse(fs.readFileSync(path.join(root, 'design-demos', 'content.json'), 'utf8'));
const papers = new Map(data.publications.map(paper => [paper.id, paper]));
const firstAuthors = data.publications.filter(paper => paper.firstAuthor);
const base = (process.env.PREVIEW_URL || 'http://127.0.0.1:8768').replace(/\/$/, '');
const reports = [];
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  async function scenario(name, options, test, init) {
    const context = await browser.newContext({ reducedMotion: 'reduce', ...options });
    try {
      if (init) await context.addInitScript(init);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.url().startsWith(base + '/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await test(page);
      assert.deepEqual(errors, [], `${name}: browser or local resource errors`);
      reports.push({ scenario: name, passed: true });
    } finally { await context.close(); }
  }
  const theme = (page, value) => page.waitForFunction(expected => document.documentElement.dataset.theme === expected, value);
  async function publications(page) {
    assert.equal(await page.locator('article.paper, article.archive-paper').count(), data.publications.length);
    assert.equal(firstAuthors.length, 5);
    for (const selector of ['article.paper', 'article.archive-paper']) {
      const ids = await page.locator(selector).evaluateAll(items => items.map(item => item.id));
      const grades = ids.map(id => { assert(papers.has(id), `Unknown paper: ${id}`); return papers.get(id).ccf; });
      assert.deepEqual(grades, [...grades].sort(), `${selector}: CCF-A must precede CCF-B`);
    }
    for (const paper of data.publications) {
      const item = page.locator(`article[id="${paper.id}"]`);
      assert.equal(await item.count(), 1, `Missing or repeated ${paper.id}`);
      assert.equal((await item.locator('.ccf-badge').textContent()).trim(), `CCF-${paper.ccf}`);
      if (paper.firstAuthor) {
        assert(await item.isVisible(), `First-author paper not visible: ${paper.id}`);
        assert(!(await item.evaluate(el => !!el.closest('details'))), `First-author paper inside disclosure: ${paper.id}`);
        assert.equal(await item.locator('figure img').count(), 1);
      }
    }
  }
  async function layout(page) {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async image => { image.loading = 'eager'; try { await image.decode(); } catch {} }));
    });
    const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    assert.equal(state.overflow, false, 'Horizontal overflow');
    assert.deepEqual(state.broken, [], 'Broken images');
    await page.evaluate(() => document.querySelectorAll('details').forEach(item => { item.open = true; }));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Expanded content overflows');
    await page.evaluate(() => document.querySelectorAll('details').forEach(item => { item.open = false; }));
  }
  try {
    for (const language of ['en', 'zh']) for (const mode of ['light', 'dark']) {
      for (const [screen, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['mobile320', 320, 700]]) {
        const name = `${language}-${mode}-${screen}`;
        await scenario(name, { viewport: { width, height }, colorScheme: mode }, async page => {
          await page.goto(`${base}/${language === 'zh' ? 'zh/' : ''}`, { waitUntil: 'networkidle' });
          assert.equal(await page.locator('html').getAttribute('lang'), language === 'zh' ? 'zh-CN' : 'en');
          await theme(page, mode);
          await publications(page);
          await layout(page);
          assert(await page.locator('#theme-toggle').isVisible());
          assert(await page.locator('#theme-toggle').getAttribute('aria-label'));
          await page.screenshot({ path: path.join(output, `${name}.png`) });
          if (screen !== 'mobile320') {
            await page.locator('#research').scrollIntoViewIfNeeded();
            await page.screenshot({ path: path.join(output, `${name}-research.png`) });
          }
        });
      }
    }
    await scenario('theme preferences and system changes', { colorScheme: 'dark' }, async page => {
      await page.goto(base + '/'); await theme(page, 'dark');
      await page.emulateMedia({ colorScheme: 'light' }); await theme(page, 'light');
      await page.emulateMedia({ colorScheme: 'dark' }); await theme(page, 'dark');
      await page.locator('#theme-toggle').focus(); await page.keyboard.press('Space'); await theme(page, 'light');
      assert.equal(await page.evaluate(() => localStorage.getItem('homepage-theme')), 'light');
      await page.emulateMedia({ colorScheme: 'light' }); await page.emulateMedia({ colorScheme: 'dark' });
      await theme(page, 'light'); await page.reload(); await theme(page, 'light');
      await page.locator('#theme-toggle').click(); await theme(page, 'dark');
      await page.reload(); await theme(page, 'dark');
    });
    await scenario('language navigation, URL state and remembered entry', {}, async page => {
      await page.goto(base + '/?review=preferences#research');
      await page.locator('#language-toggle').focus(); await page.keyboard.press('Enter');
      await page.waitForURL(`${base}/zh/?review=preferences#research`);
      assert.equal(await page.evaluate(() => localStorage.getItem('homepage-language')), 'zh-CN');
      await page.goto(base + '/?review=return#projects');
      await page.waitForURL(`${base}/zh/?review=return#projects`);
      await page.locator('#language-toggle').click(); await page.waitForURL(`${base}/?review=return#projects`);
      assert.equal(await page.evaluate(() => localStorage.getItem('homepage-language')), 'en');
      await page.reload(); assert.equal(new URL(page.url()).pathname, '/');
    });
    await scenario('blocked browser storage', { colorScheme: 'light' }, async page => {
      await page.goto(base + '/'); await theme(page, 'light');
      await page.locator('#theme-toggle').click(); await theme(page, 'dark');
      await page.locator('#language-toggle').click(); await page.waitForURL(base + '/zh/');
      await theme(page, 'light'); await page.locator('#theme-toggle').click(); await theme(page, 'dark');
    }, () => {
      for (const method of ['getItem', 'setItem']) Object.defineProperty(Storage.prototype, method, { configurable: true, value() { throw new DOMException('Storage blocked', 'SecurityError'); } });
    });
    await scenario('Chinese static HTML without JavaScript', { javaScriptEnabled: false }, async page => {
      await page.goto(base + '/zh/');
      assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
      const biography = await page.locator('#about').textContent();
      for (const text of ['中南大学', '香港理工大学']) assert(biography.includes(text), `Chinese biography missing ${text}`);
      await publications(page);
      await page.locator('nav a[href="#research"]').click(); assert.equal(new URL(page.url()).hash, '#research');
      await page.locator('#language-toggle').click(); await page.waitForURL(base + '/');
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    });
    fs.writeFileSync(path.join(output, 'preferences-checks.json'), JSON.stringify(reports, null, 2) + '\n');
    console.log(JSON.stringify({ passed: reports.length, publications: data.publications.length, firstAuthorPapers: firstAuthors.length, scenarios: reports }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
