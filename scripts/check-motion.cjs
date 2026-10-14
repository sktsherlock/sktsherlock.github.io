const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8768';

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  try {
    await context.addInitScript(() => {
      window.editorialMotions = [];
      addEventListener('animationstart', event => {
        if (event.animationName.startsWith('editorial-')) window.editorialMotions.push(event.animationName);
      }, true);
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    await page.waitForFunction(() => window.editorialMotions.includes('editorial-title-in'));
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const image of document.images) image.loading = 'eager';
    });
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth));
    const before = await page.locator('#magb').evaluate(element => {
      element.scrollIntoView({ block: 'start', behavior: 'instant' });
      return element.getBoundingClientRect().toJSON();
    });
    await page.waitForFunction(() => window.editorialMotions.includes('editorial-image-in'));
    const during = await page.locator('#magb').boundingBox();
    assert(Math.abs(before.y - during.y) < 1 && Math.abs(before.height - during.height) < 1, 'Entrance moved the paper layout');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#magb img')).transform === 'none');
    const after = await page.locator('#magb').boundingBox();
    assert(Math.abs(before.y - after.y) < 1, 'Entrance changed the reading position');

    const figure = page.locator('#magb [data-figure-view]');
    await figure.click();
    await page.waitForFunction(() => window.editorialMotions.includes('editorial-dialog-in'));
    assert(await page.locator('#figure-viewer').isVisible());
    await page.keyboard.press('Escape');
    await figure.evaluate(element => element.focus({ preventScroll: true }));
    await page.keyboard.press('Enter');
    assert(await page.locator('#figure-viewer').isVisible());
    assert.equal(await page.locator('#figure-viewer').evaluate(element => getComputedStyle(element).animationName), 'none', 'Keyboard opened an animated dialog');
    await page.keyboard.press('Escape');

    const portrait = page.locator('#personal-corner-trigger');
    await portrait.click();
    assert(await page.locator('#personal-corner').isVisible());
    assert.equal(await page.locator('#personal-corner').evaluate(element => getComputedStyle(element).animationName), 'editorial-dialog-in');
    await page.keyboard.press('Escape');
    await portrait.evaluate(element => element.focus({ preventScroll: true }));
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#personal-corner').evaluate(element => getComputedStyle(element).animationName), 'none', 'Keyboard animated the personal corner');
    await page.keyboard.press('Escape');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const theme = await page.locator('#theme-toggle').boundingBox();
    await page.mouse.click(theme.x + theme.width / 2, theme.y + theme.height / 2);
    await figure.click();
    assert.equal(await page.locator('#figure-viewer').evaluate(element => getComputedStyle(element).animationName), 'none', 'Reduced motion was ignored');
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, checks: 'Visible entrances; stable paper layout and reading position; pointer feedback for both dialogs; immediate keyboard dialogs; reduced motion; no browser errors.' }));
  } finally {
    await context.close(); await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
