(function () {
  'use strict';

  var THEME_KEY = 'homepage-theme';
  var LANGUAGE_KEY = 'homepage-language';
  var root = document.documentElement;
  var themeButton;
  var themeLabel;
  var chinese = /^zh(?:-|$)/i.test(root.lang);

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

  var savedTheme = readPreference(THEME_KEY);
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
      readPreference(LANGUAGE_KEY) === 'zh-CN') {
    window.location.replace('/zh/' + window.location.search + window.location.hash);
    return;
  }

  function initializeControls() {
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
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeControls, { once: true });
  } else {
    initializeControls();
  }
}());
