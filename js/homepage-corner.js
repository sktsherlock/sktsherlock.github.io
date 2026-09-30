(function () {
  'use strict';
  var root = document.documentElement;
  var chinese = /^zh(?:-|$)/i.test(root.lang);
  var dialog = document.getElementById('personal-corner');
  var portrait = document.getElementById('personal-corner-trigger');
  if (!dialog || !portrait || typeof dialog.showModal !== 'function') return;

  var lastTrigger;
  var previousStyle;
  var noticeTimer;
  var notice = document.getElementById('style-notice');
  var tabs = Array.prototype.slice.call(dialog.querySelectorAll('[data-corner-tab]'));
  var styleChoices = Array.prototype.slice.call(dialog.querySelectorAll('[data-style-choice]'));
  var footerTrigger = document.getElementById('style-lab-trigger');

  function showTab(id) {
    tabs.forEach(function (tab) {
      var selected = tab.dataset.cornerTab === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
  }

  function updateStyles() {
    styleChoices.forEach(function (choice) {
      choice.setAttribute('aria-pressed', String(choice.dataset.styleChoice === root.dataset.style));
    });
  }

  function openCorner(event, tab) {
    event.preventDefault();
    lastTrigger = event.currentTarget;
    showTab(tab);
    updateStyles();
    hideNotice();
    if (!dialog.open) dialog.showModal();
  }

  function applyStyle(style) {
    if (!styleChoices.some(function (choice) { return choice.dataset.styleChoice === style; })) return;
    root.dataset.style = style;
    try { window.localStorage.setItem('homepage-style', style); } catch (error) { /* In-memory selection still works. */ }
    updateStyles();
  }

  function hideNotice() {
    window.clearTimeout(noticeTimer);
    notice.hidden = true;
  }

  function showNotice(title) {
    window.clearTimeout(noticeTimer);
    notice.querySelector('[data-style-notice-text]').textContent = chinese
      ? '已切换为「' + title + '」风格。'
      : title + ' style applied.';
    notice.hidden = false;
    noticeTimer = window.setTimeout(hideNotice, 9000);
  }

  portrait.setAttribute('aria-haspopup', 'dialog');
  portrait.setAttribute('aria-controls', dialog.id);
  portrait.addEventListener('click', function (event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    openCorner(event, 'interests');
  });
  if (footerTrigger) {
    footerTrigger.hidden = false;
    footerTrigger.addEventListener('click', function (event) { openCorner(event, 'styles'); });
  }
  dialog.querySelector('[data-close-corner]').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { if (lastTrigger) lastTrigger.focus({ preventScroll: true }); });
  // Only a click completed on the backdrop closes the dialog, not a drag from its content.
  var backdropPointer = false;
  dialog.addEventListener('pointerdown', function (event) {
    var rect = dialog.getBoundingClientRect();
    backdropPointer = event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  });
  dialog.addEventListener('click', function (event) {
    var rect = dialog.getBoundingClientRect();
    if (backdropPointer && event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    backdropPointer = false;
  });

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { showTab(tab.dataset.cornerTab); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      showTab(tabs[next].dataset.cornerTab);
      tabs[next].focus();
    });
  });

  dialog.querySelectorAll('[data-interest-category]').forEach(function (button) {
    button.addEventListener('click', function () {
      dialog.querySelectorAll('[data-interest-category]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      dialog.querySelectorAll('[data-interest-panel]').forEach(function (panel) {
        panel.hidden = panel.dataset.interestPanel !== button.dataset.interestCategory;
      });
    });
  });

  styleChoices.forEach(function (choice) {
    choice.addEventListener('click', function () {
      previousStyle = root.dataset.style;
      applyStyle(choice.dataset.styleChoice);
      dialog.close();
      showNotice(choice.dataset.styleTitle);
    });
  });
  notice.querySelector('[data-undo-style]').addEventListener('click', function () {
    applyStyle(previousStyle || 'editorial');
    hideNotice();
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });
  notice.querySelector('[data-dismiss-notice]').addEventListener('click', hideNotice);
  updateStyles();
}());
