/**
 * Sidebar.js
 * Left pill-shaped navigation sidebar.
 */

import { ASSETS } from '../content/assets.js';

const ICONS = [
  { src: ASSETS.iconHome,  label: 'Home',     target: 'hero-section',     active: true  },
  { src: ASSETS.iconMusic, label: 'Pillars',  target: 'slider-section',   active: false },
  { src: ASSETS.iconStar,  label: 'Features', target: 'features-section', active: false },
  { src: ASSETS.iconArrow, label: 'Atlas',    target: 'world-section',    active: false },
];

export function Sidebar(container) {
  const iconsHTML = ICONS.map(
    (icon) => `
      <button
        class="sidebar__icon-wrap ${icon.active ? 'active' : ''}"
        type="button"
        aria-label="${icon.label}"
        title="${icon.label}"
        data-target="${icon.target}"
      >
        <img src="${icon.src}" alt="${icon.label}" loading="lazy" />
      </button>
    `
  ).join('');

  container.innerHTML = `
    <div class="sidebar__pill" role="navigation" aria-label="Side navigation">
      <div class="sidebar__icons">
        ${iconsHTML}
      </div>
    </div>
  `;

  /* Toggle active state & scroll */
  const buttons = container.querySelectorAll('.sidebar__icon-wrap');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (window.smoothScrollToSection) {
        window.smoothScrollToSection(targetId);
      }
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
