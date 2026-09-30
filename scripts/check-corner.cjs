const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8768';
const output = path.resolve(__dirname, '../design-demos/screenshots');
const styles = ['editorial', 'apple', 'claude', 'linear', 'spotify'];
const names = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../design-demos/personal-interests.json'), 'utf8')).groups.flatMap(group => group.items);
let scenarios = 0;
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  async function scenario(options, init, test) {
    const context = await browser.newContext({ reducedMotion: 'reduce', ...options });
    if (init) await context.addInitScript(init);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base + '/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    try { await test(page); assert.deepEqual(errors, []); scenarios++; } finally { await context.close(); }
  }
  async function layout(page, selector = 'html') {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async image => { image.loading = 'eager'; try { await image.decode(); } catch {} }));
    });
    const result = await page.locator(selector).evaluate(el => ({
      overflow: el.scrollWidth > el.clientWidth + 1,
      broken: [...document.images].filter(image => !image.naturalWidth).map(image => image.src)
    }));
    assert(!result.overflow, `${selector} overflows`);
    assert.deepEqual(result.broken, [], 'Broken assets');
  }
  try {
    for (const language of ['en','zh']) for (const mode of ['light','dark']) for (const width of [1440,320]) {
      await scenario({viewport:{width,height:1000},colorScheme:mode}, null, async page => {
        await page.goto(`${base}/${language === 'zh' ? 'zh/' : ''}`, {waitUntil:'networkidle'});
        assert.equal(await page.locator('article.paper, article.archive-paper').count(),14);
        assert.equal(await page.locator('a[href="tel:+8615869732997"]').count(),1);
        const body = await page.locator('#life').textContent();
        for (const item of names) assert(body.includes(item.name[language]), `Missing interest ${item.id} in ${language}`);
        await page.locator('#personal-corner-trigger').click();
        assert(await page.locator('#personal-corner').isVisible());
        assert.equal(await page.locator(':focus').getAttribute('data-close-corner'),'');
        for (const category of ['animation','series','music','games']) {
          await page.locator(`[data-interest-category="${category}"]`).click();
          assert(await page.locator(`[data-interest-panel="${category}"]`).isVisible());
          assert.equal(await page.locator('.corner-category:visible').count(),1);
          await layout(page,'#personal-corner');
        }
        await page.keyboard.press('Escape');
        assert(!(await page.locator('#personal-corner').isVisible()));
        assert.equal(await page.locator(':focus').getAttribute('id'),'personal-corner-trigger');
        for (const style of styles) {
          await page.locator('#style-lab-trigger').click();
          assert(await page.locator('#corner-styles').isVisible());
          await layout(page,'#personal-corner');
          await page.locator(`[data-style-choice="${style}"]`).click();
          assert.equal(await page.locator('html').getAttribute('data-style'),style);
          assert.equal(await page.locator('html').getAttribute('data-theme'),mode);
          assert.equal(await page.evaluate(() => localStorage.getItem('homepage-style')),style);
          assert(!(await page.locator('#personal-corner').isVisible()));
          await layout(page);
          await page.locator('#name').scrollIntoViewIfNeeded();
          if (language === 'en' && width === 1440 && mode === 'dark') {
            await page.screenshot({path:path.join(output,`corner-${style}-desktop.png`)});
            await page.locator('#research').scrollIntoViewIfNeeded();
            await page.screenshot({path:path.join(output,`corner-${style}-papers.png`)});
          }
          if (language === 'zh' && width === 320 && mode === 'light') await page.screenshot({path:path.join(output,`corner-${style}-mobile.png`)});
        }
        await page.reload();
        assert.equal(await page.locator('html').getAttribute('data-style'),'spotify');
        await page.locator('#personal-corner-trigger').click();
        await page.locator('[data-corner-tab="styles"]').focus();
        await page.keyboard.press('ArrowLeft');
        assert.equal(await page.locator('[data-corner-tab="interests"]').getAttribute('aria-selected'),'true');
        await page.keyboard.press('ArrowRight');
        assert(await page.locator('#corner-styles').isVisible());
        await page.locator('[data-style-choice="apple"]').click();
        await page.locator('[data-undo-style]').click();
        assert.equal(await page.locator('html').getAttribute('data-style'),'spotify');
        await page.locator('#theme-toggle').click();
        assert.equal(await page.locator('html').getAttribute('data-theme'),mode === 'light' ? 'dark' : 'light');
        assert.equal(await page.locator('html').getAttribute('data-style'),'spotify');
        await page.locator('#language-toggle').click();
        await page.waitForURL(`${base}/${language === 'en' ? 'zh/' : ''}`);
        assert.equal(await page.locator('html').getAttribute('data-style'),'spotify');
        if (language === 'en' && mode === 'light' && width === 1440) {
          await page.locator('#personal-corner-trigger').click();
          await page.locator('[data-interest-category="music"]').click();
          await page.screenshot({path:path.join(output,'corner-interests.png')});
          await page.locator('[data-corner-tab="styles"]').click();
          await page.screenshot({path:path.join(output,'corner-style-picker.png')});
          await page.keyboard.press('Escape');
          await page.locator('#life').scrollIntoViewIfNeeded();
          await layout(page);
          await page.screenshot({path:path.join(output,'corner-life.png')});
        }
      });
    }
    await scenario({viewport:{width:390,height:844}}, () => {
      for (const method of ['getItem','setItem']) Object.defineProperty(Storage.prototype,method,{configurable:true,value(){throw new DOMException('blocked','SecurityError');}});
    }, async page => {
      await page.goto(base + '/');
      await page.locator('#personal-corner-trigger').click();
      await page.locator('[data-corner-tab="styles"]').click();
      await page.locator('[data-style-choice="claude"]').click();
      assert.equal(await page.locator('html').getAttribute('data-style'),'claude');
      await layout(page);
    });
    await scenario({}, () => localStorage.setItem('homepage-style','unknown'), async page => {
      await page.goto(base + '/');
      assert.equal(await page.locator('html').getAttribute('data-style'),'editorial');
    });
    await scenario({javaScriptEnabled:false,viewport:{width:320,height:800}},null,async page => {
      await page.goto(base + '/zh/');
      assert(!(await page.locator('#style-lab-trigger').isVisible()));
      await page.locator('#personal-corner-trigger').click();
      assert.equal(new URL(page.url()).hash,'#life');
      for (const item of names) assert((await page.locator('#life').textContent()).includes(item.name.zh));
      await layout(page);
    });
    // Rebuilding twice must not duplicate modal controls or source sections.
    await scenario({},null,async page => {
      await page.goto(base + '/');
      assert.equal(await page.locator('#personal-corner').count(),1);
      assert.equal(await page.locator('#style-notice').count(),1);
      assert.equal(await page.locator('#life').count(),1);
      await page.locator('#personal-corner-trigger').click();
      await page.mouse.click(1,1);
      assert(!(await page.locator('#personal-corner').isVisible()),'Backdrop should close dialog');
    });
    console.log(JSON.stringify({passed:scenarios,styleCombinations:40,styles,interests:names.length}));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
