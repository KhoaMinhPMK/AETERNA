/**
 * app.js — AET
 * Application entry point — i18n-aware.
 *
 * Boot sequence:
 *   1. Init i18n (detect locale, load strings)
 *   2. Mount all components with translated data
 *   3. Listen to 'localechange' → re-render text in all components
 */

import { initI18n, t, applyDOMTranslations } from './i18n/i18n.js';
import { Navbar, updateNavbarLocale }        from './navigation/Navbar.js';
import { Sidebar }                           from './navigation/Sidebar.js';
import { CountryStorySlider }                from './sections/CountryStorySlider.js';

/* ── i18n must boot before any component renders ─────────── */
await initI18n();

/* ============================================================
   0. Preloader
   ============================================================ */
(function initPreloader() {
  const preloaderEl = document.getElementById('preloader');
  const fillEl      = document.getElementById('preloader-fill');
  const statusEl    = document.getElementById('preloader-status');
  if (!preloaderEl) return;

  if (statusEl) statusEl.textContent = t('preloader.initialising');
  const fillEl2 = fillEl;

  let pct = 0;
  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 92);
    if (fillEl2) fillEl2.style.width = Math.round(pct) + '%';
    if (statusEl) statusEl.textContent = t('preloader.loading', { pct: Math.round(pct) });
  }, 200);

  function dismiss() {
    clearInterval(interval);
    if (fillEl2) fillEl2.style.width = '100%';
    if (statusEl) statusEl.textContent = t('preloader.entering');
    setTimeout(() => {
      preloaderEl.classList.add('is-done');
      preloaderEl.addEventListener('transitionend', () => preloaderEl.remove(), { once: true });
    }, 320);
  }

  const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
  fontPromise.then(() => setTimeout(dismiss, 600));
})();

/* ============================================================
   1. App shell
   ============================================================ */
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);


/* ============================================================
   2. Scroll helper
   ============================================================ */
function smoothScrollToSection(id) {
  const target = document.getElementById(id);

  if (!target) return;
  const headerOffset = window.innerWidth <= 960 ? 92 : 108;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset, behavior: 'smooth' });
}
window.smoothScrollToSection = smoothScrollToSection;


/* ============================================================
   3. Mount components
   ============================================================ */
const navbarEl = document.getElementById('navbar');
Navbar(navbarEl);
Sidebar(document.getElementById('sidebar'));

const sliderSectionEl = document.getElementById('slider-section');
CountryStorySlider(sliderSectionEl);
const worldSectionEl    = document.getElementById('world-section');
const featuresSectionEl = document.getElementById('features-section');
const journeyNavLinks   = Array.from(document.querySelectorAll('.journey-nav__link'));


/* ── Intro video CTA ─────────────────────────────────────── */
(function initIntroVideoCta() {
  const ctaBtn = document.querySelector('.intro-video__cta');
  if (!ctaBtn) return;
  ctaBtn.addEventListener('click', () => smoothScrollToSection('slider-section'));
})();

/* ── Ensure intro video autoplay ────────────────────────── */
(function ensureIntroVideoAutoplay() {
  const vid = document.getElementById('intro-video');
  if (!vid) return;
  vid.muted = true;
  vid.play().catch(() => {
    const resume = () => { vid.play().catch(() => {}); document.removeEventListener('click', resume); };
    document.addEventListener('click', resume, { once: true });
  });
})();

/* ── Feature card video autoplay + reveal ────────────────── */
(function initFeatureCards() {
  const cards = Array.from(document.querySelectorAll('.feature-card'));
  if (!cards.length) return;

  // One-shot reveal for the features-section itself (header + section bg)
  // Uses a separate observer so the header stays visible once revealed,
  // even when the tall section scrolls partially out of view.
  if (featuresSectionEl) {
    const sectionRevealObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        featuresSectionEl.classList.add('is-visible');
        sectionRevealObs.disconnect();
      }
    }, { threshold: 0.05 });
    sectionRevealObs.observe(featuresSectionEl);
  }

  // Stagger reveal animation
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card) => {
    revealObs.observe(card);

    const videoEl = card.querySelector('.feature-card__video');
    if (!videoEl) return;
    videoEl.muted = true;
    videoEl.playsInline = true;

    // Preload when nearby
    const preloadObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        videoEl.preload = 'auto';
        videoEl.load();
        preloadObs.unobserve(card);
      }
    }, { rootMargin: '0px 0px 400px 0px', threshold: 0 });
    preloadObs.observe(card);

    // Play/pause on visibility
    const playObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      });
    }, { threshold: 0.25 });
    playObs.observe(card);
  });
})();

/* ── Journey rail ────────────────────────────────────────── */
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
  const obs = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setActive(visible[0].target.id);
  }, { threshold: [0.35, 0.55, 0.75] });
  journeyTargets.forEach(({ target }) => obs.observe(target));
})();

/* ── Header navigation ───────────────────────────────────── */
(function initHeaderNavigation() {
  const headerOverlayEl = document.getElementById('header-overlay');
  if (!navbarEl) return;
  const mobileMenuButton = navbarEl.querySelector('.navbar__menu-btn');
  const mobileBackdrop   = navbarEl.querySelector('.navbar__mobile-backdrop');
  const clickableTargets = Array.from(navbarEl.querySelectorAll('[data-target]'));
  const desktopLinks     = Array.from(navbarEl.querySelectorAll('.navbar__link'));
  const mobileLinks      = Array.from(navbarEl.querySelectorAll('.navbar__mobile-link'));
  const navSections = [
    document.getElementById('hero-section'),
    document.getElementById('solution-section'),
    sliderSectionEl,
    featuresSectionEl,
    worldSectionEl,
    document.getElementById('site-footer'),
  ].filter(Boolean);

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

  const obs = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setHeaderActive(visible[0].target.id);
  }, { threshold: [0.3, 0.55, 0.75] });
  navSections.forEach((section) => obs.observe(section));
})();

/* ── Footer actions ──────────────────────────────────────── */
(function initFooterActions() {
  Array.from(document.querySelectorAll('#site-footer [data-scroll-target]')).forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (trigger.dataset.scrollTarget) smoothScrollToSection(trigger.dataset.scrollTarget);
    });
  });
})();

/* ── Narrative motion ────────────────────────────────────── */
(function initNarrativeMotion() {
  const revealTargets = [
    document.getElementById('solution-section'),
    sliderSectionEl,
    // featuresSectionEl excluded — handled by one-shot observer in initFeatureCards
    worldSectionEl,
    document.getElementById('site-footer'),
    ...Array.from(document.querySelectorAll('.journey-bridge')),
  ].filter(Boolean);
  if (!revealTargets.length) return;
  document.getElementById('hero-section')?.classList.add('is-visible');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.22 });
  revealTargets.forEach((target) => obs.observe(target));
})();

/* ── Scroll-to-top FAB ───────────────────────────────────── */
(function initScrollTopFab() {
  const fab = document.getElementById('scroll-top-fab');
  if (!fab) return;
  window.addEventListener('scroll', () => { fab.classList.toggle('is-visible', window.scrollY > 400); }, { passive: true });
  fab.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();


/* ============================================================
   6. Keyboard navigation
   ============================================================ */
// (Country story slider handles its own keyboard events internally)

/* ============================================================
   7. Locale change → update all components
   ============================================================ */
window.addEventListener('localechange', () => {
  applyDOMTranslations();
  updateNavbarLocale(navbarEl);
});
