/**
 * Hero.js — AET
 * i18n-aware: uses t() for static labels.
 */

import { ASSETS } from '../content/assets.js';
import { t } from '../i18n/i18n.js';

export function Hero(container, character, onNextChar) {
  container.innerHTML = `
    <p class="hero__chapter" id="hero-chapter">${character.serial || ''}</p>
    <p class="hero__kicker" data-i18n="hero.kicker">${t('hero.kicker')}</p>

    <h1 class="hero__char-name" id="hero-char-name">
      ${character.name}
    </h1>

    <div class="hero__info" id="hero-info">
      <div class="hero__about-card">
        <p class="hero__about-text" id="hero-about-text">
          ${character.description}
        </p>
      </div>
    </div>

    <div class="char-frame" id="char-frame">
      <div class="char-frame__hud">
        <span class="char-frame__hud-label" data-i18n="hero.hudLabel">${t('hero.hudLabel')}</span>
        <span class="char-frame__hud-name" id="char-frame-hud-name">${character.primaryTag || ''}</span>
      </div>

      <div class="char-frame__art" id="char-frame-art">
        <img
          id="char-frame-img"
          src="${character.frameImage}"
          alt="${character.name} visual"
          loading="lazy"
          decoding="async"
        />
      </div>

      <button
        class="char-frame__nav-btn"
        id="char-frame-nav-btn"
        type="button"
        data-i18n-aria="hero.nextPillar"
        aria-label="${t('hero.nextPillar')}"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </button>
    </div>
  `;

  const navBtn = container.querySelector('#char-frame-nav-btn');
  navBtn?.addEventListener('click', () => {
    if (typeof onNextChar === 'function') onNextChar();
  });

  requestAnimationFrame(() => {
    container.classList.add('is-mounted');
  });
}

export function updateHero(container, character) {
  const DURATION = 300;

  const chapterEl  = container.querySelector('#hero-chapter');
  const nameEl     = container.querySelector('#hero-char-name');
  const aboutEl    = container.querySelector('#hero-about-text');
  const frameImg   = container.querySelector('#char-frame-img');
  const frameHudEl = container.querySelector('#char-frame-hud-name');
  const moreLabelEl = container.querySelector('.btn-more__label');
  const moreBtn    = container.querySelector('#hero-more-btn');

  [nameEl, aboutEl, frameImg].forEach((el) => el?.classList.add('transitioning'));
  container.classList.add('is-transitioning');

  setTimeout(() => {
    if (chapterEl)  chapterEl.textContent   = character.serial || '';
    if (nameEl)     nameEl.textContent       = character.name;
    if (aboutEl)    aboutEl.textContent      = character.description;
    if (frameImg)   { frameImg.src = character.frameImage; frameImg.alt = `${character.name} visual`; }
    if (frameHudEl) frameHudEl.textContent   = character.primaryTag || '';
    if (moreLabelEl) moreLabelEl.textContent = character.buttonLabel || t('hero.projectIntro');
    if (moreBtn)    moreBtn.setAttribute('aria-label', t('hero.backToIntro'));

    [nameEl, aboutEl, frameImg].forEach((el) => el?.classList.remove('transitioning'));
    container.classList.remove('is-transitioning');
  }, DURATION);
}
