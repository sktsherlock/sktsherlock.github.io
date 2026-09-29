const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'design-demos', 'screenshots');
fs.mkdirSync(output, { recursive: true });
const content = JSON.parse(fs.readFileSync(path.join(root, 'design-demos', 'content.json'), 'utf8'));
const normalize = text => text.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8768';

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const reports = [];
  try {
    for (const name of (process.env.DESIGNS || 'editorial').split(',')) {
      const pageUrl = process.env.ROOT_MODE ? `${base}/` : `${base}/design-demos/${name}.html`;
      const screenshotName = process.env.ROOT_MODE ? 'homepage' : name;
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      for (const [screen, width, height] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['narrow', 320, 700]]) {
        await page.setViewportSize({ width, height });
        await page.goto(pageUrl, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          await Promise.all([...document.images].map(async image => {
            image.loading = 'eager';
            try { await image.decode(); } catch { /* Report failures below. */ }
          }));
        });
        const layout = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, h1: document.querySelectorAll('h1').length, images: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src) }));
        assert(layout.document <= layout.width, `${name}/${screen}: horizontal overflow ${JSON.stringify(layout)}`);
        assert.equal(layout.h1, 1, `${name}: expected one h1`);
        assert.deepEqual(layout.images, [], `${name}: broken image`);
        if (screen !== 'narrow') await page.screenshot({ path: path.join(output, `${screenshotName}-${screen}.png`), fullPage: false });
        if (screen === 'desktop') await page.screenshot({ path: path.join(output, `${screenshotName}-full.png`), fullPage: true });
        const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
        assert(!anchors.some(href => href === '#' || href === '' || href.startsWith('javascript:')), `${name}: placeholder link`);
        const invalid = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).map(a => a.getAttribute('href')));
        assert.deepEqual(invalid, [], `${name}: broken anchor`);
        await page.evaluate(() => document.querySelectorAll('details').forEach(item => { item.open = true; }));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}/${screen}: expanded content overflows`);
      }
      const summaries = page.locator('summary');
      for (let i = 0; i < await summaries.count(); i++) {
        const summary = summaries.nth(i);
        await summary.focus();
        const before = await summary.evaluate(el => el.parentElement.open);
        await page.keyboard.press('Enter');
        assert.notEqual(await summary.evaluate(el => el.parentElement.open), before, `${name}: disclosure not keyboard operable`);
      }
      const text = normalize(await page.locator('body').textContent());
      for (const paper of content.publications) assert(text.includes(normalize(paper.title)), `${name}: missing publication ${paper.id}`);
      assert(text.includes('2027'), `${name}: graduation missing`);
      if (name === 'editorial') {
        for (const fact of ['Sherirto', 'Senzhang Wang', 'Chengqi Zhang', 'Shirui Pan', 'July 2022', 'June 2027']) assert(text.includes(normalize(fact)), `Missing confirmed biographical fact: ${fact}`);
        for (const paper of content.publications) {
          const item = page.locator(`article[id="${paper.id}"]`);
          assert.equal(await item.count(), 1, `Publication missing or duplicated: ${paper.id}`);
          assert.equal(await item.locator('.ccf-badge').textContent(), `CCF-${paper.ccf}`, `Incorrect venue badge: ${paper.id}`);
          if (paper.firstAuthor) {
            assert.equal(await item.evaluate(el => !!el.closest('details')), false, `First-author paper hidden in disclosure: ${paper.id}`);
            assert.equal(await item.locator('figure img').count(), 1, `First-author figure missing: ${paper.id}`);
          }
        }
        assert((await page.locator('#magb img').getAttribute('src')).includes('magb-data-example-arxiv-v2.png'), 'KDD thumbnail still uses old figure');
      }
      assert(text.includes('remote'), `${name}: STCA remote missing`);
      for (const project of content.projects) assert(text.includes(normalize(project.name)), `${name}: missing project ${project.name}`);
      assert.deepEqual(errors, [], `${name}: browser errors`);
      if (process.env.ROOT_MODE) {
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://sktsherlock.github.io/');
        assert.equal(await page.locator('meta[name=robots]').count(), 0);
        for (const id of ['about-me', '-education', '-publication', '-experience', '-news', '-honor-and-award', '-after-research']) assert.equal(await page.locator(`[id="${id}"]`).count(), 1, `Missing legacy section ${id}`);
      }
      const noJs = await browser.newContext({ javaScriptEnabled: false });
      const plain = await noJs.newPage();
      await plain.goto(pageUrl);
      const plainText = normalize(await plain.locator('body').textContent());
      for (const paper of content.publications) assert(plainText.includes(normalize(paper.title)), `${name}: publication requires JS ${paper.id}`);
      await noJs.close();
      reports.push({ variant: name, viewports: [1440, 768, 390, 320], publications: content.publications.length, javascriptOptional: true, browserErrors: errors.length });
      await context.close();
    }
    if (fs.existsSync(path.join(root, 'design-demos', 'index.html'))) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${base}/design-demos/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(output, 'comparison.png'), fullPage: true });
    }
    fs.writeFileSync(path.join(output, process.env.ROOT_MODE ? 'homepage-checks.json' : 'checks.json'), JSON.stringify(reports, null, 2) + '\n');
    console.log(JSON.stringify(reports, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
