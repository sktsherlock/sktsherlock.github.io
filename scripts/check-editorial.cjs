const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8768';
const output = path.resolve(__dirname, '../design-demos/screenshots');
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../design-demos/content.json'), 'utf8'));
const styles = ['editorial', 'apple', 'claude', 'linear', 'spotify'];
fs.mkdirSync(output, { recursive: true });
const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
const luminance = values => values.map(value => {
  value /= 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  let scenarios = 0;
  let contrastSamples = 0, lowestContrast = Infinity;
  try {
    for (const language of ['en', 'zh']) {
      for (const width of [1440, 740, 320]) {
        const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        await page.goto(base + (language === 'zh' ? '/zh/' : '/'), { waitUntil: 'networkidle' });
        await page.evaluate(async () => { await Promise.all([...document.images].map(async image => { image.loading = 'eager'; await image.decode(); })); });
        assert.equal(await page.locator('.chapter-index').count(), 6);
        assert.equal(await page.locator('.paper-index a').count(), 5);
        assert.equal(await page.locator('.focus-step').count(), 3);
        for (const style of styles) {
          for (const mode of ['light', 'dark']) {
            await page.evaluate(({ style, mode }) => { document.documentElement.dataset.style = style; document.documentElement.dataset.theme = mode; }, { style, mode });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${language}/${width}/${style}/${mode}: overflow`);
            if (width === 1440) {
              const samples = await page.locator('.focus-item p,.focus-links a,.paper-summary,.venue>span:first-child,.authors,.figure-index,.publication-note,.chapter-index,.bio-background').evaluateAll(nodes => nodes.map(element => {
                const foreground = getComputedStyle(element).color;
                let background;
                for (let parent = element; parent; parent = parent.parentElement) {
                  const value = getComputedStyle(parent).backgroundColor;
                  if (value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') { background = value; break; }
                }
                return { foreground, background, text: element.textContent.slice(0, 40) };
              }));
              for (const sample of samples) {
                const foreground = luminance(rgb(sample.foreground)), background = luminance(rgb(sample.background));
                const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
                assert(ratio >= 4.5, `${style}/${mode}: small text contrast ${ratio.toFixed(2)} for ${sample.text}`);
                contrastSamples++;
                lowestContrast = Math.min(lowestContrast, ratio);
              }
            }
            for (const link of await page.locator('.paper-index a').all()) {
              const id = (await link.getAttribute('href')).slice(1);
              assert.equal(await page.locator(`article#${id}`).count(), 1);
            }
            scenarios++;
          }
        }
        await page.evaluate(() => { document.documentElement.dataset.style = 'editorial'; document.documentElement.dataset.theme = 'light'; });
        await page.locator('.paper-index a[href="#magb"]').click();
        const top = await page.locator('#magb').evaluate(element => element.getBoundingClientRect().top);
        const headerBottom = await page.locator('.masthead').evaluate(element => element.getBoundingClientRect().bottom);
        assert(top >= headerBottom, 'Anchor target obscured by sticky navigation');
        await page.waitForFunction(() => document.querySelector('a[href="#research"][aria-current="location"]'));
        const figureLink = page.locator('#magb [data-figure-view]');
        await figureLink.click();
        const viewer = page.locator('#figure-viewer');
        assert(await viewer.isVisible());
        await viewer.locator('img').evaluate(image => image.decode());
        const record = data.publications.find(paper => paper.id === 'magb');
        assert((await viewer.locator('img').getAttribute('src')).endsWith(record.image.replace('../', '/')));
        assert.equal(await viewer.locator('img').getAttribute('alt'), await figureLink.locator('img').getAttribute('alt'));
        await viewer.locator('[data-figure-zoom]').click();
        assert.equal(await viewer.locator('[data-figure-zoom]').getAttribute('aria-pressed'), 'true');
        assert(await viewer.locator('.figure-stage').evaluate(element => element.scrollWidth > element.clientWidth));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.keyboard.press('Tab');
        assert(await page.evaluate(() => document.activeElement.closest('#figure-viewer') !== null), 'Focus escaped the modal');
        await page.screenshot({ path: path.join(output, `craft-viewer-${language}-${width}.png`) });
        await page.keyboard.press('Escape');
        assert.equal(await viewer.isVisible(), false);
        assert(await figureLink.evaluate(element => document.activeElement === element), 'Figure focus was not restored');
        await page.locator('#tag [data-figure-view]').click();
        await viewer.locator('img').evaluate(image => image.decode());
        assert((await viewer.locator('[data-figure-heading]').innerText()).startsWith('CS-TAG'));
        await viewer.locator('[data-figure-close]').click();
        await page.locator('[data-figure-image]').waitFor({ state: 'detached' });
        assert.equal(await page.locator('[data-figure-image]').count(), 0, 'Closed viewer retained an unused image');
        await page.locator('.masthead a[href="#background"]').click();
        await page.waitForFunction(() => document.querySelector('a[href="#background"][aria-current="location"]'));
        const education = await page.locator('#background h2').first().boundingBox();
        assert(education.y >= headerBottom, 'Education heading obscured by navigation');
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(output, `craft-final-${language}-${width}.png`), fullPage: true });
        if (width === 1440) {
          await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
          await page.locator('.masthead a[href="#research"]').click();
          await page.screenshot({ path: path.join(output, `craft-final-dark-${language}.png`) });
        }
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    const page = await noJS.newPage();
    await page.goto(base);
    assert((await page.locator('#magb [data-figure-view]').getAttribute('href')).endsWith('magb-data-example-arxiv-v2.png'));
    assert.equal(await page.locator('#figure-viewer').isVisible(), false);
    assert.equal(await page.locator('article.paper').count(), 5);
    await noJS.close();
    console.log(JSON.stringify({ passed: true, layoutCombinations: scenarios, contrastSamples, lowestContrast: lowestContrast.toFixed(2), checks: 'Bilingual chapter hierarchy; all five styles and both modes at desktop/tablet/mobile; sticky anchors; original KDD Fig. 1; figure zoom; native focus containment and restoration; two consecutive figures; image decoding; no JavaScript fallback; no page errors.' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
