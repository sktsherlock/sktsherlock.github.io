(function () {
  'use strict';

  var THEME_KEY = 'homepage-theme';
  var STYLE_KEY = 'homepage-style';
  var LANGUAGE_KEY = 'homepage-language';
  var POSITION_KEY = 'homepage-reading-position';
  var POSITION_PARAMETER = 'homepage-position';
  var styles = ['editorial', 'apple', 'claude', 'linear', 'spotify'];
  // These content units have the same order in both static language versions.
  var readingUnits = ['.identity-row', '#about h2', '.hero-bio > p', '.focus-item',
    '.research-direction', '.availability', '#research .section-heading', '.paper-index',
    '.paper', '.publication-record > summary', '.archive-paper', '.education-history h2',
    '.education-list .history-entry', '.experience-history h2', '.experience-list .history-entry',
    '#service .section-heading', '.service-body', '#recognition .section-heading',
    '.honors-section li', '#life .section-heading', '.personal-intro',
    '.life-animation', '.life-side article', '.portrait-hint', '.footer'];
  var root = document.documentElement;
  var themeButton;
  var themeLabel;
  var chinese = /^zh(?:-|$)/i.test(root.lang);
  var navigation = window.performance && window.performance.getEntriesByType
    ? window.performance.getEntriesByType('navigation')[0] : null;
  var historyTraversal = navigation && navigation.type === 'back_forward';

  function readPreference(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function savePreference(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // The current page still works when browser storage is unavailable.
    }
  }

  function takeReadingPosition() {
    var url = new URL(window.location.href);
    var serialized = url.searchParams.get(POSITION_PARAMETER);
    if (serialized !== null) {
      url.searchParams.delete(POSITION_PARAMETER);
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } else {
      try { serialized = window.sessionStorage.getItem(POSITION_KEY); } catch (error) {}
      if (!serialized && historyTraversal && window.history.state && window.history.state[POSITION_KEY]) {
        serialized = JSON.stringify(window.history.state[POSITION_KEY]);
      }
    }
    if (!serialized || serialized.length > 2048) return null;
    var position;
    try { position = JSON.parse(serialized); } catch (error) { return null; }
    if (!position || position.path !== window.location.pathname ||
        position.search !== window.location.search || position.hash !== window.location.hash ||
        typeof position.time !== 'number' || (!historyTraversal && Date.now() - position.time > 300000)) return null;
    try { window.sessionStorage.removeItem(POSITION_KEY); } catch (error) {}
    return position;
  }

  var pendingPosition = takeReadingPosition();
  var savedTheme = pendingPosition ? pendingPosition.theme : readPreference(THEME_KEY);
  var savedStyle = pendingPosition ? pendingPosition.style : readPreference(STYLE_KEY);
  root.dataset.style = styles.indexOf(savedStyle) >= 0
    ? savedStyle : 'editorial';
  var themeOverride = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
  var systemTheme = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  function updateThemeButton(theme) {
    if (!themeButton) return;
    var dark = theme === 'dark';
    if (themeLabel) themeLabel.textContent = chinese
      ? (dark ? '日间' : '夜间')
      : (dark ? 'Light' : 'Dark');
    themeButton.setAttribute('aria-label', chinese
      ? (dark ? '切换到日间模式' : '切换到夜间模式')
      : (dark ? 'Switch to light mode' : 'Switch to dark mode'));
    themeButton.setAttribute('aria-pressed', String(dark));
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateThemeButton(theme);
  }

  // This script runs before CSS so the first paint uses the chosen theme.
  applyTheme(themeOverride || (systemTheme && systemTheme.matches ? 'dark' : 'light'));

  function systemThemeChanged(event) {
    if (themeOverride === null) applyTheme(event.matches ? 'dark' : 'light');
  }

  if (systemTheme) {
    if (typeof systemTheme.addEventListener === 'function') {
      systemTheme.addEventListener('change', systemThemeChanged);
    } else if (typeof systemTheme.addListener === 'function') {
      systemTheme.addListener(systemThemeChanged);
    }
  }

  // Only the English entry point restores a previously chosen Chinese page.
  if ((window.location.pathname === '/' || window.location.pathname === '/index.html') &&
      !historyTraversal && readPreference(LANGUAGE_KEY) === 'zh-CN') {
    window.location.replace('/zh/' + window.location.search + window.location.hash);
    return;
  }
  window.addEventListener('pageshow', function (event) {
    if (historyTraversal || event.persisted) savePreference(LANGUAGE_KEY, chinese ? 'zh-CN' : 'en');
  });

  function rememberHistoryPosition(position) {
    var state = Object.assign({}, window.history.state || {});
    state[POSITION_KEY] = position;
    window.history.replaceState(state, '');
  }

  function readingLine() {
    var header = document.querySelector('.masthead');
    return (header ? header.getBoundingClientRect().bottom : 0) + 24;
  }

  function captureReadingPosition(destination) {
    var line = readingLine();
    var bestTop = -Infinity;
    var block = null;
    readingUnits.forEach(function (selector) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (element, index) {
        if (!element.getClientRects().length) return;
        var box = element.getBoundingClientRect();
        if (box.height <= 0 || box.top > line || box.top <= bestTop) return;
        bestTop = box.top;
        block = { selector: selector, index: index,
          progress: Math.max(0, Math.min(1, (line - box.top) / box.height)),
          gap: Math.max(0, line - box.bottom) };
      });
    });
    var record = document.querySelector('.publication-record');
    return { path: destination.pathname, search: destination.search, hash: destination.hash,
      time: Date.now(), y: window.scrollY, block: block,
      bottom: window.scrollY > 0 && root.scrollHeight - window.innerHeight - window.scrollY <= 2,
      publicationsOpen: record ? record.open : true,
      theme: themeOverride, style: root.dataset.style };
  }

  function restoreReadingPosition() {
    if (!pendingPosition) return;
    var position = pendingPosition;
    pendingPosition = null;
    rememberHistoryPosition(position);
    var record = document.querySelector('.publication-record');
    if (record && typeof position.publicationsOpen === 'boolean') record.open = position.publicationsOpen;
    var previousBehavior = root.style.scrollBehavior;
    var previousRestoration = window.history.scrollRestoration;
    root.style.scrollBehavior = 'auto';
    window.history.scrollRestoration = 'manual';
    var finished = false;
    function restore() {
      if (finished) return;
      var y = typeof position.y === 'number' && isFinite(position.y) ? position.y : 0;
      var block = position.block;
      if (y > 0 && block && readingUnits.indexOf(block.selector) >= 0 &&
          Number.isInteger(block.index) && block.index >= 0 &&
          typeof block.progress === 'number' && isFinite(block.progress)) {
        var element = document.querySelectorAll(block.selector)[block.index];
        if (element && element.getClientRects().length) {
          var box = element.getBoundingClientRect();
          var gap = typeof block.gap === 'number' && isFinite(block.gap) ? Math.max(0, block.gap) : 0;
          y = window.scrollY + box.top + box.height * Math.max(0, Math.min(1, block.progress)) + gap - readingLine();
        }
      }
      if (position.bottom) y = root.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.max(0, y));
    }
    function finish(cancelled) {
      if (finished) return;
      if (!cancelled) restore();
      finished = true;
      root.style.scrollBehavior = previousBehavior;
      window.history.scrollRestoration = previousRestoration;
      ['wheel', 'touchstart', 'keydown'].forEach(function (type) { window.removeEventListener(type, cancel); });
    }
    function cancel() { finish(true); }
    ['wheel', 'touchstart', 'keydown'].forEach(function (type) { window.addEventListener(type, cancel, { passive: true, once: true }); });
    restore();
    // Hash navigation and font loading can occur after DOM readiness.
    var loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(function (resolve) {
      window.addEventListener('load', resolve, { once: true });
    });
    Promise.all([loaded, document.fonts ? document.fonts.ready : Promise.resolve()]).then(function () {
      window.requestAnimationFrame(function () { finish(false); });
    });
  }

  function initializeControls() {
    restoreReadingPosition();
    themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
      themeLabel = themeButton.querySelector('[data-theme-label]');
      updateThemeButton(root.dataset.theme);
      themeButton.hidden = false;
      themeButton.addEventListener('click', function () {
        themeOverride = root.dataset.theme === 'dark' ? 'light' : 'dark';
        savePreference(THEME_KEY, themeOverride);
        applyTheme(themeOverride);
      });
    }

    var languageToggle = document.getElementById('language-toggle');
    if (!languageToggle) return;
    var destination = new URL(languageToggle.getAttribute('href'), window.location.href);
    var destinationLanguage = /^zh(?:-|$)/i.test(languageToggle.hreflang) ? 'zh-CN' : 'en';

    function updateLanguageDestination() {
      destination.search = window.location.search;
      destination.hash = window.location.hash;
      languageToggle.href = destination.href;
    }

    updateLanguageDestination();
    window.addEventListener('hashchange', updateLanguageDestination);
    window.addEventListener('popstate', updateLanguageDestination);
    languageToggle.addEventListener('click', function (event) {
      updateLanguageDestination();
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
          event.metaKey || event.shiftKey || event.altKey ||
          languageToggle.hasAttribute('download') ||
          (languageToggle.target && languageToggle.target.toLowerCase() !== '_self')) return;
      savePreference(LANGUAGE_KEY, destinationLanguage);
      var snapshot = captureReadingPosition(destination);
      rememberHistoryPosition(Object.assign({}, snapshot, {
        path: window.location.pathname, search: window.location.search, hash: window.location.hash
      }));
      var position = JSON.stringify(snapshot);
      try {
        window.sessionStorage.setItem(POSITION_KEY, position);
      } catch (error) {
        // Carry the same small snapshot in a temporary URL parameter if storage is blocked.
        var fallback = new URL(destination.href);
        fallback.searchParams.set(POSITION_PARAMETER, position);
        languageToggle.href = fallback.href;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeControls, { once: true });
  } else {
    initializeControls();
  }
}());
