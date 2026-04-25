/**
 * app.js
 * Application entry point — i18n-aware.
 *
 * Boot sequence:
 *   1. Init i18n (detect locale, load strings)
 *   2. Mount all components with translated data
 *   3. Listen to 'localechange' → re-render text in all components
 */

import { initI18n, t, applyDOMTranslations } from './i18n/i18n.js';
import { getCharacters, getHeroLanding }     from './content/characters.js';
import { Navbar, updateNavbarLocale }        from './navigation/Navbar.js';
import { Sidebar }                           from './navigation/Sidebar.js';
import { Hero, updateHero }                  from './sections/Hero.js';
import { CharacterSlider }                   from './sections/CharacterSlider.js';
import { HeroDetail }                        from './sections/HeroDetail.js';

/* ── i18n must boot before any component renders ─────────────────────────── */
await initI18n();

/* ============================================================
   0. Preloader
   ============================================================ */
(function initPreloader() {
  const preloaderEl = document.getElementById('preloader');
  const fillEl      = document.getElementById('preloader-fill');
  const statusEl    = document.getElementById('preloader-status');
  if (!preloaderEl) return;

  const heroLanding = getHeroLanding();
  const chars       = getCharacters();

  const criticalUrls = [
    heroLanding.bgImage,
    heroLanding.detailArt,
    heroLanding.frameImage,
    'assets/media/images/backgrounds/logo.svg',
    ...chars.map((c) => c.bgImage),
    ...chars.map((c) => c.frameImage),
    ...chars.map((c) => c.cardImage),
  ].filter((url, idx, arr) => url && arr.indexOf(url) === idx);

  let loaded = 0;
  const total = criticalUrls.length;

  if (statusEl) statusEl.textContent = t('preloader.initialising');

  function setProgress(n) {
    const pct = Math.min(Math.round((n / total) * 100), 100);
    if (fillEl)   fillEl.style.width    = pct + '%';
    if (statusEl) statusEl.textContent  = pct < 100 ? t('preloader.loading', { pct }) : t('preloader.entering');
  }

  function dismiss() {
    preloaderEl.classList.add('is-done');
    preloaderEl.addEventListener('transitionend', () => preloaderEl.remove(), { once: true });
  }

  setProgress(0);

  const imagePromises = criticalUrls.map(
    (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => { loaded++; setProgress(loaded); resolve(); };
        img.src = url;
      })
  );

  const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([...imagePromises, fontPromise]).then(() => setTimeout(dismiss, 360));
})();

/* ============================================================
   1. App shell
   ============================================================ */
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ============================================================
   2. State
   ============================================================ */
let currentIndex = 0;

function getActive() { return getCharacters()[currentIndex]; }

function smoothScrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const headerOffset = window.innerWidth <= 960 ? 92 : 108;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset, behavior: 'smooth' });
}

function nextCharacter() {
  currentIndex = (currentIndex + 1) % getCharacters().length;
  handleCharacterChange();
}

function selectCharacter(id) {
  const idx = getCharacters().findIndex((c) => c.id === id);
  if (idx === -1 || idx === currentIndex) return;
  currentIndex = idx;
  handleCharacterChange();
}

function handleCharacterChange() {
  const char = getActive();
  updateSectionBackground(sliderBgEl, char.bgImage);
  updateHero(heroEl, char);
  sliderEl.setActive?.(char.id);
}

/* ============================================================
   3. Per-section background layers
   ============================================================ */
const heroBgEl   = document.getElementById('hero-bg');
const sliderBgEl = document.getElementById('slider-bg');

function initSectionBackground(container, src) {
  const img = document.createElement('img');
  img.src = src; img.alt = ''; img.setAttribute('aria-hidden', 'true');
  container.appendChild(img);
}

function updateSectionBackground(container, src) {
  const prevImg = container.querySelector('img');
  const newImg  = document.createElement('img');
  newImg.src    = src; newImg.alt = ''; newImg.setAttribute('aria-hidden', 'true');
  newImg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.6s ease;';
  container.appendChild(newImg);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    newImg.style.opacity = '1';
    if (prevImg) {
      prevImg.style.transition = 'opacity 0.6s ease';
      prevImg.style.opacity = '0';
      prevImg.addEventListener('transitionend', () => prevImg.remove(), { once: true });
    }
  }));
}

initSectionBackground(heroBgEl, getHeroLanding().bgImage);

(function lazySliderBackground() {
  const _sec = document.getElementById('slider-section');
  if (!_sec) { initSectionBackground(sliderBgEl, getActive().bgImage); return; }
  const _obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { initSectionBackground(sliderBgEl, getActive().bgImage); _obs.disconnect(); }
  }, { rootMargin: '0px 0px 400px 0px', threshold: 0 });
  _obs.observe(_sec);
})();

/* ============================================================
   4. Mount components
   ============================================================ */
const navbarEl = document.getElementById('navbar');
Navbar(navbarEl);
Sidebar(document.getElementById('sidebar'));

const heroEl       = document.getElementById('hero');
const heroDetailEl = document.getElementById('hero-detail');
const sliderEl     = document.getElementById('character-slider');

Hero(heroEl, getActive(), nextCharacter);
HeroDetail(heroDetailEl, getHeroLanding(), scrollToSliderSection);
CharacterSlider(sliderEl, getCharacters(), getActive().id, selectCharacter);

const heroSectionEl   = document.getElementById('hero-section');
const sliderSectionEl = document.getElementById('slider-section');
const worldSectionEl  = document.getElementById('world-section');
const impactSectionEl = document.getElementById('video-section-2');
const scrollVideoSections = Array.from(document.querySelectorAll('.landing-section--video'));
const journeyNavLinks     = Array.from(document.querySelectorAll('.journey-nav__link'));

/* ── Firefly particles ───────────────────────────────────────────────────── */
(function spawnFireflies() {
  const container = document.createElement('div');
  container.className = 'fireflies';
  heroSectionEl.appendChild(container);
  const COUNT = 28;
  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'firefly';
    const size = 3 + Math.random() * 5;
    dot.style.width  = size + 'px';
    dot.style.height = size + 'px';
    dot.style.left   = Math.random() * 100 + '%';
    dot.style.top    = Math.random() * 100 + '%';
    const r = () => (Math.random() > 0.5 ? '' : '-') + (20 + Math.random() * 80) + 'px';
    dot.style.setProperty('--dx1', r()); dot.style.setProperty('--dy1', r());
    dot.style.setProperty('--dx2', r()); dot.style.setProperty('--dy2', r());
    dot.style.setProperty('--dx3', r()); dot.style.setProperty('--dy3', r());
    dot.style.setProperty('--fly-duration',  (10 + Math.random() * 18) + 's');
    dot.style.setProperty('--fly-delay',     (Math.random() * -20) + 's');
    dot.style.setProperty('--glow-duration', (3 + Math.random() * 5) + 's');
    dot.style.setProperty('--glow-delay',    (Math.random() * -6) + 's');
    dot.style.setProperty('--max-opacity',   (0.4 + Math.random() * 0.5).toFixed(2));
    container.appendChild(dot);
  }
})();

/* ── Auto-play video sections ────────────────────────────────────────────── */
(function initAutoPlayVideoSections() {
  if (!scrollVideoSections.length) return;
  scrollVideoSections.forEach((sectionEl) => {
    const videoEl = sectionEl.querySelector('.video-scroll__video');
    if (!videoEl) return;
    const startOffset = Number(sectionEl.dataset.videoStart || 0);
    let reverseRaf = 0, hasEnded = false;
    videoEl.pause(); videoEl.muted = true; videoEl.playsInline = true;
    function setupVideo() { if (videoEl.duration > startOffset) videoEl.currentTime = startOffset; }
    const STOP_BEFORE = 0.3;
    videoEl.addEventListener('timeupdate', () => {
      if (!hasEnded && videoEl.duration && videoEl.currentTime >= videoEl.duration - STOP_BEFORE) { videoEl.pause(); hasEnded = true; }
    });
    videoEl.addEventListener('loadedmetadata', setupVideo);
    if (videoEl.readyState >= 1) setupVideo();
    function stopReverse() { if (reverseRaf) { cancelAnimationFrame(reverseRaf); reverseRaf = 0; } }
    function reversePlay() {
      videoEl.currentTime = Math.max(videoEl.currentTime - 1/60, startOffset);
      reverseRaf = videoEl.currentTime > startOffset ? requestAnimationFrame(reversePlay) : 0;
    }
    const preloadObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { videoEl.preload = 'auto'; videoEl.load(); preloadObserver.unobserve(sectionEl); }
    }, { rootMargin: '0px 0px 500px 0px', threshold: 0 });
    preloadObserver.observe(sectionEl);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stopReverse(); hasEnded = false;
          if (videoEl.duration > startOffset) videoEl.currentTime = startOffset;
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause(); stopReverse();
          if (!hasEnded && videoEl.currentTime > startOffset) reverseRaf = requestAnimationFrame(reversePlay);
        }
      });
    }, { threshold: 0.35 });
    observer.observe(sectionEl);
  });
})();

/* ── Journey rail ────────────────────────────────────────────────────────── */
(function initJourneyRail() {
  if (!journeyNavLinks.length) return;
  const journeyTargets = journeyNavLinks.map((link) => {
    const target = document.getElementById(link.dataset.target);
    return target ? { link, target } : null;
  }).filter(Boolean);
  function setActive(id) {
    journeyNavLinks.forEach((link) => link.classList.toggle('active', link.dataset.target === id));
  }
  journeyTargets.forEach(({ link, target }) => {
    link.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setActive(visible[0].target.id);
  }, { threshold: [0.35, 0.55, 0.75] });
  journeyTargets.forEach(({ target }) => observer.observe(target));
})();

/* ── Header navigation ───────────────────────────────────────────────────── */
(function initHeaderNavigation() {
  const headerOverlayEl = document.getElementById('header-overlay');
  if (!navbarEl) return;
  const mobileMenuButton = navbarEl.querySelector('.navbar__menu-btn');
  const mobileBackdrop   = navbarEl.querySelector('.navbar__mobile-backdrop');
  const clickableTargets = Array.from(navbarEl.querySelectorAll('[data-target]'));
  const desktopLinks     = Array.from(navbarEl.querySelectorAll('.navbar__link'));
  const mobileLinks      = Array.from(navbarEl.querySelectorAll('.navbar__mobile-link'));
  const navSections = [heroSectionEl, sliderSectionEl, document.getElementById('video-section'), worldSectionEl, impactSectionEl].filter(Boolean);

  function closeMenu() {
    navbarEl.classList.remove('is-menu-open');
    document.body.classList.remove('nav-open');
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    mobileMenuButton?.setAttribute('aria-label', t('nav.openNav'));
    navbarEl.querySelector('.navbar__mobile-panel')?.setAttribute('aria-hidden', 'true');
  }
  function openMenu() {
    navbarEl.classList.add('is-menu-open');
    document.body.classList.add('nav-open');
    mobileMenuButton?.setAttribute('aria-expanded', 'true');
    mobileMenuButton?.setAttribute('aria-label', t('nav.closeNav'));
    navbarEl.querySelector('.navbar__mobile-panel')?.setAttribute('aria-hidden', 'false');
  }
  function toggleMenu() { navbarEl.classList.contains('is-menu-open') ? closeMenu() : openMenu(); }
  function setHeaderActive(id) {
    desktopLinks.forEach((link) => {
      const ids = (link.dataset.activeFor || link.dataset.target || '').split(',');
      link.classList.toggle('active', ids.includes(id));
    });
    mobileLinks.forEach((link) => link.classList.toggle('active', link.dataset.target === id));
    const isLightSection = id === 'world-section';
    navbarEl.classList.toggle('is-light', isLightSection);
    headerOverlayEl?.classList.toggle('is-light', isLightSection);
  }
  function syncScrolledState() { navbarEl.classList.toggle('is-scrolled', window.scrollY > 24); }

  clickableTargets.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!trigger.dataset.target || trigger.closest('#lang-switcher')) return;
      closeMenu();
      smoothScrollToSection(trigger.dataset.target);
    });
  });

  mobileMenuButton?.addEventListener('click', toggleMenu);
  mobileBackdrop?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) closeMenu(); });
  window.addEventListener('scroll', syncScrolledState, { passive: true });
  syncScrolledState();

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setHeaderActive(visible[0].target.id);
  }, { threshold: [0.3, 0.55, 0.75] });
  navSections.forEach((section) => observer.observe(section));
})();

/* ── Footer actions ──────────────────────────────────────────────────────── */
(function initFooterActions() {
  const footerTriggers = Array.from(document.querySelectorAll('#site-footer [data-scroll-target]'));
  footerTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (trigger.dataset.scrollTarget) smoothScrollToSection(trigger.dataset.scrollTarget);
    });
  });
})();

/* ── Narrative motion ────────────────────────────────────────────────────── */
(function initNarrativeMotion() {
  const revealTargets = [
    sliderSectionEl, document.getElementById('video-section'), worldSectionEl,
    document.getElementById('video-section-2'), document.getElementById('site-footer'),
    ...Array.from(document.querySelectorAll('.journey-bridge')),
  ].filter(Boolean);
  if (!revealTargets.length) return;
  heroSectionEl?.classList.add('is-visible');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.22 });
  revealTargets.forEach((target) => observer.observe(target));
})();

/* ============================================================
   5. Section navigation helpers
   ============================================================ */
function scrollToSliderSection() { smoothScrollToSection('slider-section'); }

heroEl.addEventListener('click', (e) => {
  if (e.target.closest('#hero-more-btn')) smoothScrollToSection('hero-section');
});

/* ============================================================
   6. Keyboard navigation
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextCharacter();
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + getCharacters().length) % getCharacters().length;
    handleCharacterChange();
  }
});

/* ============================================================
   7. Locale change → update all components
   ============================================================ */
window.addEventListener('localechange', () => {
  /* 1. Static HTML elements with data-i18n attributes */
  applyDOMTranslations();

  /* 2. Update Navbar labels in-place (preserves event listeners) */
  updateNavbarLocale(navbarEl);

  /* 3. Re-render HeroDetail with new strings */
  HeroDetail(heroDetailEl, getHeroLanding(), scrollToSliderSection);

  /* 4. Re-render Hero with new character strings */
  updateHero(heroEl, getActive());

  /* 5. Rebuild CharacterSlider (full re-render; restores drag/click events internally) */
  CharacterSlider(sliderEl, getCharacters(), getActive().id, selectCharacter);
});
