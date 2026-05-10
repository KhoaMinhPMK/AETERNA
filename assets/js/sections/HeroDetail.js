/**
 * HeroDetail.js
 * Single-character hero landing section — professional game design.
 *   - Large character art feet anchored to section bottom
 *   - Right panel: eyebrow · name · badges · divider · description · section cards
 *   - Radial bloom glow behind character
 */

function buildBadges(badges = []) {
  return badges
    .map(
      (badge) => `
      <div class="detail-badge">
        <span class="detail-badge__label">${badge}</span>
      </div>
    `
    )
    .join('');
}

function buildSections(sections) {
  return sections
    .map(
      (section, index) => `
      <article class="detail-card detail-card--section">
        <div class="detail-card__meta">
          <span class="detail-card__index">${String(index + 1).padStart(2, '0')}</span>
          <h3 class="detail-card__title">${section.title}</h3>
        </div>
        <p class="detail-card__body">${section.body}</p>
      </article>
    `
    )
    .join('');
}

function buildMetrics(metrics = []) {
  return metrics
    .map(
      (metric) => `
      <article class="hero-detail__metric">
        <strong class="hero-detail__metric-value">${metric.value}</strong>
        <span class="hero-detail__metric-label">${metric.label}</span>
      </article>
    `
    )
    .join('');
}

export function HeroDetail(container, character, onBack) {
  container.__onBack = onBack;

  const sections = (character.detailSections || []).slice(0, 2);
  const sectionsHTML = buildSections(sections);
  const badgesHTML = buildBadges(character.heroBadges || []);
  const metricsHTML = buildMetrics(character.heroMetrics || []);

  container.innerHTML = `
    <!-- Radial bloom glow -->
    <div class="hero-detail__glow" aria-hidden="true"></div>
    <div class="hero-detail__glow hero-detail__glow--secondary" aria-hidden="true"></div>

    <!-- Character art — feet at section bottom -->
    <div class="hero-detail__art">
      <img
        id="detail-art-img"
        src="${character.detailArt || character.frameImage}"
        alt="${character.name}"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <!-- Right content panel -->
    <div class="hero-detail__panel">

      <div class="hero-detail__signal-group">
        <div class="hero-detail__crest" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="hero-detail__manifesto">${character.manifesto || ''}</p>
      </div>

      <!-- Eyebrow -->
      <div class="hero-detail__eyebrow">
        <span class="hero-detail__eyebrow-line"></span>
        <span class="hero-detail__eyebrow-text">${character.eyebrow || ''}</span>
      </div>

      <!-- Name -->
      <h1 class="hero-detail__name" id="detail-char-name">${character.name}</h1>

      <!-- Meta badges -->
      ${badgesHTML.length ? `<div class="hero-detail__tags">${badgesHTML}</div>` : ''}

      <!-- Divider -->
      <div class="hero-detail__divider"></div>

      <!-- Description -->
      <div class="hero-detail__about-wrap">
        <p class="hero-detail__about" id="detail-about-text">${character.description}</p>
      </div>

      ${metricsHTML.length ? `<div class="hero-detail__metrics">${metricsHTML}</div>` : ''}

      ${sectionsHTML.length ? `<div class="hero-detail__sections">${sectionsHTML}</div>` : ''}

    </div>

    <!-- Back button (hidden, navigation via scroll) -->
    <button class="hero-detail__back-btn" id="detail-back-btn" type="button" aria-label="Explore next section">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    </button>
  `;

  container.querySelector('#detail-back-btn')
    ?.addEventListener('click', () => typeof onBack === 'function' && onBack());
}

export function updateHeroDetail(container, character) {
  HeroDetail(container, character, container.__onBack);
}

