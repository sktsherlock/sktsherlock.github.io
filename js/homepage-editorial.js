(function () {
  'use strict';
  var root = document.documentElement;
  // Keyboard interactions and their anchor navigation respond immediately.
  window.addEventListener('keydown', function () { root.dataset.input = 'keyboard'; }, { capture: true });
  window.addEventListener('pointerdown', function () { root.dataset.input = 'pointer'; }, { capture: true, passive: true });
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

  // The fixed frame reads the same figures and source links as the static page.
  // No separate publication record, image crops or translated copy to maintain.
  var researchStage = document.getElementById('research-stage');
  if (researchStage && typeof window.matchMedia === 'function') {
    var stageMedia = window.matchMedia('(min-width: 1100px)');
    var stageLink = document.getElementById('stage-image-link');
    var stageTitle = document.getElementById('stage-title');
    var stageContext = researchStage.querySelector('[data-stage-context]');
    var stageCredit = researchStage.querySelector('[data-stage-credit]');
    var stageAction = researchStage.querySelector('[data-stage-action]');
    var stageRecords = {};
    var stageTargets = [];
    var stageKey = 'magb';
    var activeStageImage = stageLink.querySelector('img');
    var stageSequence = 0;
    var previewKey = null;
    var stagePending = false;
    var quietMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('.paper[data-stage-key],.history-entry[data-stage-key]').forEach(function (item) {
      var paper = item.classList.contains('paper');
      var link = item.querySelector(paper ? '[data-figure-view]' : '.history-visual a');
      var picture = link.querySelector('img');
      stageRecords[item.dataset.stageKey] = {
        title: item.querySelector('h3').textContent,
        context: item.querySelector(paper ? '.venue > span' : '.history-date').textContent,
        source: link.href,
        image: paper ? link.href : picture.src,
        alt: picture.alt,
        credit: item.querySelector('figcaption') ? item.querySelector('figcaption').textContent : item.querySelector('h3').textContent,
        figureTitle: paper ? item.querySelector('.paper-title-link').textContent : '',
        label: link.dataset.figureLabel,
        place: !paper
      };
      stageTargets.push({ element: item, key: item.dataset.stageKey });
    });
    var lifeImage = document.querySelector('#life .interest-card a');
    if (lifeImage) {
      stageRecords.life = { title: lifeImage.querySelector('figcaption').textContent,
        context: document.querySelector('#life h2').textContent, source: lifeImage.href,
        image: lifeImage.querySelector('img').src, alt: lifeImage.querySelector('img').alt,
        credit: document.querySelector('#life .personal-intro').textContent, place: true };
    }
    ['.publication-record', '#service', '#recognition', '#life'].forEach(function (selector) {
      var element = document.querySelector(selector);
      if (element) stageTargets.push({ element: element, key: selector === '#life' ? 'life' : 'csu' });
    });
    stageTargets.sort(function (a, b) {
      return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    function showStage(key) {
      var record = stageRecords[key];
      if (!record || key === stageKey || !stageMedia.matches || document.hidden) return;
      var sequence = ++stageSequence;
      var current = activeStageImage;
      var next = new Image();
      next.className = 'stage-image';
      next.alt = record.alt;
      next.src = record.image;
      next.decode().then(function () {
        if (sequence !== stageSequence || !stageMedia.matches) return;
        stageKey = key;
        stageTitle.textContent = record.title;
        stageContext.textContent = record.context;
        stageCredit.textContent = record.credit;
        stageAction.textContent = record.figureTitle ? (chinese ? '查看配图' : 'View figure') : (chinese ? '图片来源' : 'Photo source');
        researchStage.classList.toggle('is-place', record.place);
        stageLink.href = record.source;
        stageLink.setAttribute('aria-label', record.figureTitle ? (chinese ? '查看完整配图：' : 'Open full figure: ') + record.figureTitle : record.alt);
        if (record.figureTitle) {
          stageLink.setAttribute('data-figure-view', '');
          stageLink.dataset.figureLabel = record.label;
          stageLink.dataset.figureTitle = record.figureTitle;
        } else stageLink.removeAttribute('data-figure-view');
        stageLink.appendChild(next);
        activeStageImage = next;
        if (!quietMotion.matches && root.dataset.input !== 'keyboard') {
          var fade = next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' });
          fade.finished.then(function () { if (current.parentNode) current.remove(); }).catch(function () { if (current.parentNode) current.remove(); });
        } else current.remove();
      }).catch(function () { /* Keep the visible, fully loaded frame on a failed request. */ });
    }
    function updateStage() {
      stagePending = false;
      if (!stageMedia.matches) return;
      var key = 'magb';
      var threshold = (header ? header.getBoundingClientRect().bottom : 0) + window.innerHeight * .24;
      stageTargets.forEach(function (target) {
        if (target.element.getBoundingClientRect().top <= threshold) key = target.key;
      });
      showStage(previewKey || key);
    }
    function scheduleStage() {
      if (!stagePending) { stagePending = true; window.requestAnimationFrame(updateStage); }
    }
    function stageLayout() {
      if (stageMedia.matches) root.dataset.stageReady = 'true';
      else { delete root.dataset.stageReady; stageSequence++; }
      scheduleStage();
    }
    stageMedia.addEventListener('change', stageLayout);
    window.addEventListener('scroll', scheduleStage, { passive: true });
    document.addEventListener('visibilitychange', scheduleStage);
    document.querySelectorAll('.paper-index a,.focus-links a').forEach(function (link) {
      function preview() { previewKey = link.hash.slice(1); scheduleStage(); }
      function stopPreview() { previewKey = null; scheduleStage(); }
      link.addEventListener('mouseenter', preview);
      link.addEventListener('focus', preview);
      link.addEventListener('mouseleave', stopPreview);
      link.addEventListener('blur', stopPreview);
      link.addEventListener('click', stopPreview);
    });
    stageLayout();
  }

  // Entrances animate already-visible content. A script or observer failure never
  // leaves a blank section, and keyboard/reduced-motion reading is immediate.
  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (typeof IntersectionObserver === 'function' && !motionPreference.matches) {
    var entrance = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entrance.unobserve(entry.target);
        if (motionPreference.matches || root.dataset.input === 'keyboard') return;
        entry.target.classList.add(entry.target.matches('img') ? 'arrive-picture'
          : entry.target.matches('h1,h3') ? 'arrive-title' : 'arrive-copy');
      });
    }, { threshold: .08 });
    document.querySelectorAll('.identity h1,.primary-action,.hero-bio>p,.research-overview h2,.focus-item h3,.focus-item p,.section-heading h2,.paper-copy h3,.paper-summary,.history-entry h3,.history-entry .detail,.interest-card img').forEach(function (element) {
      element.dataset.entranceDelay = String(element.matches('p,.detail') ? 70 : element.matches('img') ? 140 : 0);
      entrance.observe(element);
    });
    motionPreference.addEventListener('change', function (event) {
      if (event.matches) document.getAnimations().forEach(function (animation) { animation.cancel(); });
    });
  }

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
      if (!link.hasAttribute('data-figure-view') || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      var preview = link.querySelector('img');
      var paper = link.closest('.paper');
      image.src = link.href;
      image.alt = preview.alt;
      stage.appendChild(image);
      heading.textContent = link.dataset.figureLabel;
      description.textContent = link.dataset.figureTitle || (paper ? paper.querySelector('.paper-title-link').textContent : preview.alt);
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
