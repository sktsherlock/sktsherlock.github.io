(function () {
  'use strict';
  var root = document.documentElement;
  var chinese = /^zh(?:-|$)/i.test(root.lang);
  var header = document.querySelector('.masthead');
  var links = Array.from(document.querySelectorAll('.masthead nav a'));
  var sections = links.map(function (link) {
    return { link: link, section: document.querySelector(link.getAttribute('href')) };
  }).filter(function (item) { return item.section; });
  var scheduled = false;

  function updateReadingPosition() {
    scheduled = false;
    var scrollTop = window.scrollY;
    var distance = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.style.setProperty('--reading-progress', String(distance > 0 ? Math.min(1, Math.max(0, scrollTop / distance)) : 0));
    var current = sections[0];
    var threshold = (header ? header.getBoundingClientRect().height : 0) + 90;
    sections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= threshold) current = item;
    });
    sections.forEach(function (item) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }
  function scheduleReadingPosition() {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateReadingPosition); }
  }
  window.addEventListener('scroll', scheduleReadingPosition, { passive: true });
  window.addEventListener('resize', scheduleReadingPosition, { passive: true });
  window.addEventListener('hashchange', scheduleReadingPosition);
  if (typeof ResizeObserver === 'function') new ResizeObserver(scheduleReadingPosition).observe(document.body);
  updateReadingPosition();

  var dialog = document.getElementById('figure-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var image = document.createElement('img');
  image.setAttribute('data-figure-image', '');
  var heading = dialog.querySelector('[data-figure-heading]');
  var description = dialog.querySelector('[data-figure-description]');
  var stage = dialog.querySelector('.figure-stage');
  var zoom = dialog.querySelector('[data-figure-zoom]');
  var close = dialog.querySelector('[data-figure-close]');
  var trigger = null;
  root.dataset.readerReady = 'true';

  function setZoom(zoomed) {
    stage.dataset.zoomed = String(zoomed);
    zoom.setAttribute('aria-pressed', String(zoomed));
    zoom.textContent = zoomed ? (chinese ? '适应' : 'Fit') : '2×';
    zoom.setAttribute('aria-label', zoomed ? (chinese ? '适应窗口' : 'Fit figure to window') : (chinese ? '放大两倍' : 'Zoom figure to twice its size'));
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  }
  document.querySelectorAll('[data-figure-view]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      var preview = link.querySelector('img');
      var paper = link.closest('.paper');
      image.src = link.href;
      image.alt = preview.alt;
      stage.appendChild(image);
      heading.textContent = link.dataset.figureLabel;
      description.textContent = paper.querySelector('h3').textContent;
      setZoom(false);
      dialog.showModal();
      close.focus({ preventScroll: true });
    });
  });
  close.addEventListener('click', function () { dialog.close(); });
  zoom.addEventListener('click', function () { setZoom(stage.dataset.zoomed !== 'true'); });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    if (trigger) trigger.focus({ preventScroll: true });
    image.removeAttribute('src');
    image.alt = '';
    image.remove();
  });
}());
