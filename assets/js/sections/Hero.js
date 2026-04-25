/**
 * Hero.js
 * Main hero section:
 *   - Character name (large, right-aligned)
 *   - Frosted-glass about card
 *   - Element badge + star rating + More button
 *   - Right-side character art frame + nav button
 * Subscribes to the app state and re-renders on character change.
 */

import { ASSETS } from '../content/assets.js';
import { t } from '../i18n/i18n.js';

/**
 * Render / update the hero section.
 * @param {HTMLElement}  container
 * @param {object}       character    — current character data
 * @param {function}     onNextChar   — callback for nav-btn click
 */
export function Hero(container, character, onNextChar) {
  container.innerHTML = `
    <p class="hero__chapter" id="hero-chapter">${character.serial || ''}</p>
    <p class="hero__kicker" data-i18n="hero.kicker">${t('hero.kicker')}</p>

    <!-- Pillar name (large title) -->
    <h1 class="hero__char-name" id="hero-char-name">
      ${character.name}
    </h1>

    <!-- Left info panel -->
    <div class="hero__info" id="hero-info">

      <!-- About card -->
      <div class="hero__about-card">
        <p class="hero__about-text" id="hero-about-text">
          ${character.description}
        </p>
      </div>

      <!-- Tags row -->
      <div class="hero__tags">

        <!-- Primary tag -->
        <div class="badge-element" id="hero-element-badge">
          <span class="badge-element__name" id="hero-element-name">
            ${character.primaryTag || ''}
          </span>
        </div>

        <!-- Secondary tag -->
        <div class="badge-stars">
          <span class="badge-stars__label" id="hero-secondary-tag">${character.secondaryTag || ''}</span>
        </div>

        <!-- Intro button -->
        <button class="btn-more" type="button" id="hero-more-btn" aria-label="${t('hero.backToIntro')}">
          <span class="btn-more__label">${character.buttonLabel || t('hero.projectIntro')}</span>
          <img
            class="btn-more__arrow"
            src="${ASSETS.iconArrow}"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </button>

      </div>
    </div>

    <!-- Right visual frame -->
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

      <!-- Circular navigation button -->
      <button
        class="char-frame__nav-btn"
        id="char-frame-nav-btn"
        type="button"
        data-i18n-aria="hero.nextPillar"
        aria-label="${t('hero.nextPillar')}"
      >
        <!-- Arrow SVG inline for reliability -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </button>
    </div>
  `;

  /* Wire up nav button */
  const navBtn = container.querySelector('#char-frame-nav-btn');
  navBtn?.addEventListener('click', () => {
    if (typeof onNextChar === 'function') onNextChar();
  });

  requestAnimationFrame(() => {
    container.classList.add('is-mounted');
  });
}

/**
 * Smoothly transition to a new character without full re-render.
 * @param {HTMLElement} container
 * @param {object}      character
 */
export function updateHero(container, character) {
  const DURATION = 300; // ms

  const chapterEl   = container.querySelector('#hero-chapter');
  const nameEl      = container.querySelector('#hero-char-name');
  const aboutEl     = container.querySelector('#hero-about-text');
  const frameImg    = container.querySelector('#char-frame-img');
  const frameHudEl  = container.querySelector('#char-frame-hud-name');
  const elementName = container.querySelector('#hero-element-name');
  const secondaryEl = container.querySelector('#hero-secondary-tag');
  const moreBtn     = container.querySelector('#hero-more-btn');
  const moreLabelEl = container.querySelector('.btn-more__label');

  /* Fade out */
  [nameEl, aboutEl, frameImg].forEach((el) => el?.classList.add('transitioning'));
  container.classList.add('is-transitioning');

  setTimeout(() => {
    if (chapterEl)   chapterEl.textContent   = character.serial || '';
    if (nameEl)      nameEl.textContent      = character.name;
    if (aboutEl)     aboutEl.textContent     = character.description;
    if (frameImg)    frameImg.src            = character.frameImage;
    if (frameImg)    frameImg.alt            = `${character.name} visual`;
    if (frameHudEl)  frameHudEl.textContent  = character.primaryTag || '';
    if (elementName) elementName.textContent = character.primaryTag || '';
    if (secondaryEl) secondaryEl.textContent = character.secondaryTag || '';
    if (moreLabelEl) moreLabelEl.textContent = character.buttonLabel || t('hero.projectIntro');
    if (moreBtn)     moreBtn.setAttribute('aria-label', t('hero.backToIntro'));

    /* Fade back in */
    [nameEl, aboutEl, frameImg].forEach((el) => el?.classList.remove('transitioning'));
    container.classList.remove('is-transitioning');
  }, DURATION);
}
