/**
 * Navbar.js
 * Functional desktop/mobile navigation shell + Language Switcher.
 */

import { t, getLocale, setLocale, SUPPORTED_LOCALES } from '../i18n/i18n.js';

/* ── Link data (keys only — labels resolved via t() at render time) ──────── */
const DESKTOP_LINKS = [
  { key: 'nav.platform', target: 'slider-section',  activeFor: ['hero-section', 'slider-section', 'video-section'] },
  { key: 'nav.atlas',    target: 'world-section',   activeFor: ['world-section'] },
  { key: 'nav.impact',   target: 'video-section-2', activeFor: ['video-section-2'] },
];

const MOBILE_LINKS = [
  { index: '01', key: 'journeyNav.intro',    target: 'hero-section' },
  { index: '02', key: 'journeyNav.pillars',  target: 'slider-section' },
  { index: '03', key: 'journeyNav.living',   target: 'video-section' },
  { index: '04', key: 'journeyNav.atlas',    target: 'world-section' },
  { index: '05', key: 'journeyNav.impact',   target: 'video-section-2' },
];

/* ── Lang Switcher HTML builder ──────────────────────────────────────────── */
function buildLangSwitcher() {
  const current = SUPPORTED_LOCALES.find((l) => l.code === getLocale()) || SUPPORTED_LOCALES[0];

  const globalOptions = SUPPORTED_LOCALES.filter((l) => l.group === 'global').map(optionHTML).join('');
  const aseanOptions  = SUPPORTED_LOCALES.filter((l) => l.group === 'asean').map(optionHTML).join('');

  return `
    <div class="lang-switcher" id="lang-switcher" role="listbox" aria-label="${t('nav.changeLanguage')}">
      <button
        class="lang-switcher__toggle"
        type="button"
        id="lang-switcher-toggle"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label="${t('nav.changeLanguage')}"
      >
        <svg class="lang-switcher__globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span class="lang-switcher__current" id="lang-switcher-label">${current.code.toUpperCase()}</span>
        <svg class="lang-switcher__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div class="lang-switcher__menu" id="lang-switcher-menu" aria-hidden="true">
        <div class="lang-switcher__group-label">Global</div>
        ${globalOptions}
        <div class="lang-switcher__divider"></div>
        <div class="lang-switcher__group-label">Southeast Asia</div>
        ${aseanOptions}
      </div>
    </div>
  `;
}

function optionHTML(locale) {
  const active = locale.code === getLocale();
  return `
    <button
      class="lang-switcher__option${active ? ' active' : ''}"
      type="button"
      role="option"
      aria-selected="${active}"
      data-lang="${locale.code}"
    >
      <span class="lang-switcher__flag">${locale.flag}</span>
      <span class="lang-switcher__native">${locale.native}</span>
      ${active ? '<span class="lang-switcher__check">✓</span>' : ''}
    </button>
  `;
}

/* ── Main render ─────────────────────────────────────────────────────────── */
export function Navbar(container) {
  const desktopLinksHTML = DESKTOP_LINKS.map(
    (link) => `
      <button
        class="navbar__link ${link.key === 'nav.platform' ? 'active' : ''}"
        type="button"
        data-target="${link.target}"
        data-active-for="${link.activeFor.join(',')}"
        data-i18n-key="${link.key}"
      >
        ${t(link.key)}
      </button>
    `
  ).join('');

  const mobileLinksHTML = MOBILE_LINKS.map(
    (link) => `
      <button
        class="navbar__mobile-link ${link.target === 'hero-section' ? 'active' : ''}"
        type="button"
        data-target="${link.target}"
        data-i18n-key="${link.key}"
      >
        <span class="navbar__mobile-index">${link.index}</span>
        <span class="navbar__mobile-text">${t(link.key)}</span>
      </button>
    `
  ).join('');

  container.innerHTML = `
    <button class="navbar__mobile-backdrop" type="button" aria-label="${t('nav.closeNav')}"></button>

    <div class="navbar__shell">
      <button class="navbar__logo" type="button" data-target="hero-section" aria-label="${t('nav.goToIntro')}">
        <img class="navbar__logo-img" src="assets/media/images/backgrounds/logo.svg" alt="" aria-hidden="true" />
        <span class="navbar__logo-text">
          <span class="navbar__logo-word">AETERNA</span>
          <span class="navbar__logo-sub" data-i18n="nav.logoSub">${t('nav.logoSub')}</span>
        </span>
      </button>

      <div class="navbar__right">
        <nav class="navbar__links" role="navigation" aria-label="${t('nav.platform')}">
          ${desktopLinksHTML}
        </nav>

        <div class="navbar__auth">
          ${buildLangSwitcher()}
          <button class="btn-login"  type="button" data-target="hero-section"    aria-label="${t('nav.readManifesto')}">${t('nav.manifesto')}</button>
          <button class="btn-signin" type="button" data-target="video-section-2" aria-label="${t('nav.partnerWithUs')}">${t('nav.partner')}</button>
        </div>

        <button class="navbar__menu-btn" type="button" aria-expanded="false" aria-controls="navbar-mobile-panel" aria-label="${t('nav.openNav')}">
          <span class="navbar__menu-line"></span>
          <span class="navbar__menu-line"></span>
          <span class="navbar__menu-line"></span>
        </button>
      </div>
    </div>

    <div class="navbar__mobile-panel" id="navbar-mobile-panel" aria-hidden="true">
      <div class="navbar__mobile-panel-inner">
        <p class="navbar__mobile-eyebrow" data-i18n="nav.journeyMap">${t('nav.journeyMap')}</p>

        <nav class="navbar__mobile-nav" role="navigation" aria-label="${t('nav.journeyMap')}">
          ${mobileLinksHTML}
        </nav>

        <div class="navbar__mobile-actions">
          <button class="navbar__mobile-action navbar__mobile-action--ghost" type="button" data-target="hero-section">${t('nav.manifesto')}</button>
          <button class="navbar__mobile-action navbar__mobile-action--solid" type="button" data-target="video-section-2">${t('nav.partner')}</button>
        </div>
      </div>
    </div>
  `;

  /* Wire language switcher */
  _initLangSwitcher(container);
}

/* ── Lang switcher interaction ───────────────────────────────────────────── */
function _initLangSwitcher(container) {
  const wrapper = container.querySelector('#lang-switcher');
  const toggle  = container.querySelector('#lang-switcher-toggle');
  const menu    = container.querySelector('#lang-switcher-menu');
  if (!wrapper || !toggle || !menu) return;

  function openMenu() {
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    wrapper.classList.add('is-open');
  }
  function closeMenu() {
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('is-open');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    wrapper.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  menu.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    const code = btn.dataset.lang;
    closeMenu();
    await setLocale(code);
    /* Navbar re-renders itself via localechange listener in app.js */
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ── Update labels in-place (called on localechange without full re-render) ─ */
export function updateNavbarLocale(container) {
  /* Desktop links */
  container.querySelectorAll('.navbar__link[data-i18n-key]').forEach((btn) => {
    btn.textContent = t(btn.dataset.i18nKey);
  });
  /* Mobile links */
  container.querySelectorAll('.navbar__mobile-link[data-i18n-key]').forEach((btn) => {
    const textEl = btn.querySelector('.navbar__mobile-text');
    if (textEl) textEl.textContent = t(btn.dataset.i18nKey);
  });
  /* Static labeled elements */
  const logoSub = container.querySelector('.navbar__logo-sub');
  if (logoSub) logoSub.textContent = t('nav.logoSub');

  const eyebrow = container.querySelector('.navbar__mobile-eyebrow');
  if (eyebrow) eyebrow.textContent = t('nav.journeyMap');

  /* Buttons */
  const btnLogin  = container.querySelector('.btn-login');
  const btnSignin = container.querySelector('.btn-signin');
  if (btnLogin)  { btnLogin.textContent  = t('nav.manifesto'); btnLogin.setAttribute('aria-label',  t('nav.readManifesto')); }
  if (btnSignin) { btnSignin.textContent = t('nav.partner');   btnSignin.setAttribute('aria-label', t('nav.partnerWithUs')); }

  const mobileGhost = container.querySelector('.navbar__mobile-action--ghost');
  const mobileSolid = container.querySelector('.navbar__mobile-action--solid');
  if (mobileGhost) mobileGhost.textContent = t('nav.manifesto');
  if (mobileSolid) mobileSolid.textContent = t('nav.partner');

  /* Rebuild lang switcher dropdown (active marker + current label) */
  const langSwitcher = container.querySelector('#lang-switcher');
  if (langSwitcher) {
    const currentLabel = langSwitcher.querySelector('#lang-switcher-label');
    if (currentLabel) currentLabel.textContent = getLocale().toUpperCase();

    langSwitcher.querySelectorAll('.lang-switcher__option').forEach((btn) => {
      const isActive = btn.dataset.lang === getLocale();
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      /* Rebuild inner content */
      const locale = SUPPORTED_LOCALES.find((l) => l.code === btn.dataset.lang);
      if (locale) {
        btn.innerHTML = `
          <span class="lang-switcher__flag">${locale.flag}</span>
          <span class="lang-switcher__native">${locale.native}</span>
          ${isActive ? '<span class="lang-switcher__check">✓</span>' : ''}
        `;
      }
    });
  }
}
