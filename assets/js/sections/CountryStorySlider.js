/**
 * CountryStorySlider.js
 * Cinematic story slider for the 11 ASEAN nations.
 * Layout: fullscreen background image + left story panel + bottom thumbnail strip
 */

import { getCountries } from '../content/countries.js';
import { t } from '../i18n/i18n.js';

export function CountryStorySlider(sectionEl) {
  let countries = getCountries();
  let currentIndex = 0;
  let isAnimating = false;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000;

  /* ── Build DOM ────────────────────────────────────────────────── */
  sectionEl.innerHTML = `
    <!-- Full-screen background -->
    <div class="css__bg" id="css-bg" aria-hidden="true">
      <div class="css__bg-img" id="css-bg-img"></div>
      <div class="css__bg-veil"></div>
      <div class="css__bg-grain"></div>
    </div>

    <!-- Section header -->
    <div class="css__header" aria-hidden="true">
      <span class="css__header-kicker" data-i18n="sliderSection.kicker">AETERNA · ASEAN CHRONICLES</span>
      <div class="css__header-line"></div>
      <span class="css__header-count" id="css-count">01 / 11</span>
    </div>

    <!-- Left story panel -->
    <div class="css__story" id="css-story" role="region" aria-live="polite" aria-label="Country story">
      <div class="css__story-serial" id="css-serial">01</div>
      <div class="css__story-eyebrow" id="css-eyebrow"></div>
      <h2 class="css__story-name" id="css-name"></h2>
      <div class="css__story-divider"></div>
      <p class="css__story-quest-label" data-i18n="sliderSection.questLabel">QUEST</p>
      <p class="css__story-quest" id="css-quest"></p>
      <div class="css__story-actions">
        <button class="css__btn css__btn--prev" id="css-prev" data-i18n-aria="sliderSection.prev" aria-label="Previous nation" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <button class="css__btn css__btn--next" id="css-next" data-i18n-aria="sliderSection.next" aria-label="Next nation" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="css__progress" aria-hidden="true">
      <div class="css__progress-fill" id="css-progress-fill"></div>
    </div>

    <!-- Bottom thumbnail strip -->
    <div class="css__strip-wrap" aria-hidden="true">
      <div class="css__strip" id="css-strip">
        ${countries.map((c, i) => `
          <button
            class="css__thumb ${i === 0 ? 'is-active' : ''}"
            data-index="${i}"
            type="button"
            title="${c.name}"
            aria-label="${t('sliderSection.select', { name: c.name })}"
          >
            <img class="css__thumb-img" src="${c.image}" alt="${c.name}" loading="lazy" draggable="false" />
            <span class="css__thumb-serial">${c.serial}</span>
            <span class="css__thumb-name">${c.name.split(':')[0].trim()}</span>
            <div class="css__thumb-active-bar"></div>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  /* ── Element refs ──────────────────────────────────────────────── */
  const bgImgEl     = sectionEl.querySelector('#css-bg-img');
  const storyEl     = sectionEl.querySelector('#css-story');
  const serialEl    = sectionEl.querySelector('#css-serial');
  const eyebrowEl   = sectionEl.querySelector('#css-eyebrow');
  const nameEl      = sectionEl.querySelector('#css-name');
  const questEl     = sectionEl.querySelector('#css-quest');
  const countEl     = sectionEl.querySelector('#css-count');
  const progressEl  = sectionEl.querySelector('#css-progress-fill');
  const prevBtn     = sectionEl.querySelector('#css-prev');
  const nextBtn     = sectionEl.querySelector('#css-next');
  const stripEl     = sectionEl.querySelector('#css-strip');
  const thumbs      = Array.from(sectionEl.querySelectorAll('.css__thumb'));

  /* ── Render ────────────────────────────────────────────────────── */
  function render(index, direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;

    const c = countries[index];
    const exitClass = direction === 'next' ? 'exit-left' : 'exit-right';
    const enterClass = direction === 'next' ? 'enter-right' : 'enter-left';

    // Animate story panel out
    storyEl.classList.add(exitClass);

    setTimeout(() => {
      // Update content
      serialEl.textContent = c.serial;
      eyebrowEl.textContent = c.realm;
      nameEl.textContent = c.name;
      questEl.textContent = c.story;
      countEl.textContent = `${String(index + 1).padStart(2, '0')} / 11`;

      // Update background
      bgImgEl.style.backgroundImage = `url('${c.image}')`;
      bgImgEl.classList.remove('bg-zoom');
      void bgImgEl.offsetWidth; // reflow
      bgImgEl.classList.add('bg-zoom');

      // Update thumbnails active state
      thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));

      // Scroll active thumb into view within the strip (don't scroll page)
      const activeThumb = thumbs[index];
      if (activeThumb && stripEl) {
        const thumbLeft  = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.offsetWidth;
        const stripWidth = stripEl.clientWidth;
        const target     = thumbLeft - stripWidth / 2 + thumbWidth / 2;
        stripEl.scrollTo({ left: target, behavior: 'smooth' });
      }

      // Swap panel classes
      storyEl.classList.remove(exitClass);
      storyEl.classList.add(enterClass);
      void storyEl.offsetWidth;
      storyEl.classList.remove(enterClass);

      isAnimating = false;
    }, 350);

    // Reset and restart progress bar
    restartProgress();
  }

  /* ── Progress bar ──────────────────────────────────────────────── */
  function restartProgress() {
    if (progressEl) {
      progressEl.style.transition = 'none';
      progressEl.style.width = '0%';
      void progressEl.offsetWidth;
      progressEl.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
      progressEl.style.width = '100%';
    }
  }

  /* ── Navigation ────────────────────────────────────────────────── */
  function goTo(index, direction) {
    const dir = direction ?? (index > currentIndex ? 'next' : 'prev');
    currentIndex = (index + countries.length) % countries.length;
    render(currentIndex, dir);
    resetAutoplay();
  }

  function goNext() { goTo(currentIndex + 1, 'next'); }
  function goPrev() { goTo(currentIndex - 1, 'prev'); }

  /* ── Autoplay ──────────────────────────────────────────────────── */
  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(goNext, AUTOPLAY_DELAY);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  /* ── Events ────────────────────────────────────────────────────── */
  nextBtn?.addEventListener('click', goNext);
  prevBtn?.addEventListener('click', goPrev);

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const idx = Number(thumb.dataset.index);
      if (idx === currentIndex) return;
      goTo(idx);
    });
  });

  /* Touch / drag swipe on story panel */
  let touchStartX = 0;
  sectionEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sectionEl.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
  }, { passive: true });

  /* ── Drag-to-scroll on strip (without pointer capture so clicks still fire) ── */
  const DRAG_THRESHOLD = 5;  // px — below this = click intent, not drag
  let sdragging = false, sDragged = false, sstartX = 0, sscroll = 0;

  stripEl.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    sdragging = true;
    sDragged  = false;
    sstartX   = e.clientX;
    sscroll   = stripEl.scrollLeft;
    stripEl.style.cursor = 'grabbing';
  });

  stripEl.addEventListener('pointermove', (e) => {
    if (!sdragging) return;
    const dx = e.clientX - sstartX;
    if (!sDragged && Math.abs(dx) > DRAG_THRESHOLD) sDragged = true;
    if (sDragged) stripEl.scrollLeft = sscroll - dx;
  });

  stripEl.addEventListener('pointerup', () => {
    sdragging = false;
    stripEl.style.cursor = '';
  });

  stripEl.addEventListener('pointercancel', () => {
    sdragging = false;
    stripEl.style.cursor = '';
  });

  /* Block click on the strip itself if we dragged, but let button clicks through */
  stripEl.addEventListener('click', (e) => {
    if (sDragged) { e.stopPropagation(); sDragged = false; }
  }, true); // capture phase so it precedes button listeners

  /* ── Keyboard navigation ──────────────────────────────────────── */
  sectionEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  /* ── Pause autoplay when tab hidden ──────────────────────────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(autoplayTimer);
    else startAutoplay();
  });

  /* ── Init ──────────────────────────────────────────────────────── */
  render(currentIndex);
  startAutoplay();

  /* Preload all 11 background images so later slides never blank out */
  countries.forEach((c) => {
    const img = new Image();
    img.src = c.image;
  });

  /* One-time stagger reveal for all 11 thumbs — not tied to is-visible cycling */
  thumbs.forEach((thumb, i) => {
    thumb.style.opacity = '0';
    thumb.style.transform = 'translateY(12px)';
    thumb.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => {
      thumb.style.opacity  = '';
      thumb.style.transform = '';
    }, 120 + i * 55); // 55ms stagger per thumb — finishes in ~730ms
  });

  /* ── Auto-update text on locale change ─────────────────────────── */
  window.addEventListener('localechange', () => {
    countries = getCountries();
    // Update currently rendered main panel text
    const cur = countries[currentIndex];
    eyebrowEl.textContent = cur.realm;
    nameEl.textContent = cur.name;
    questEl.textContent = cur.story;
    
    // Update thumbnail labels and aria attributes
    thumbs.forEach((thumb, i) => {
      const c = countries[i];
      thumb.setAttribute('title', c.name);
      thumb.setAttribute('aria-label', t('sliderSection.select', { name: c.name }));
      const nameSpan = thumb.querySelector('.css__thumb-name');
      if (nameSpan) nameSpan.textContent = c.name.split(':')[0].trim();
    });
  });
}
