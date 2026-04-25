/**
 * characters.js
 * Returns translated content using the active i18n locale.
 * Call getCharacters() / getHeroLanding() at render time (not module load time).
 */

import { ASSETS } from './assets.js';
import { t } from '../i18n/i18n.js';

/* Map character id → pillar key in locale files */
const ID_TO_KEY = {
  'edutainment':  'edutainment',
  'neo-asean':    'neo_asean',
  'narrative-ai': 'narrative_ai',
  'o2o-impact':   'o2o_impact',
  'global-reach': 'global_reach',
};

/** Returns the heroLanding object with current-locale strings. */
export function getHeroLanding() {
  return {
    id: 'aeterna-landing',
    name: 'AETERNA',
    eyebrow:     t('heroLanding.eyebrow'),
    manifesto:   t('heroLanding.manifesto'),
    description: t('heroLanding.description'),
    heroBadges:  [t('heroLanding.badge1'), t('heroLanding.badge2')],
    heroMetrics: [
      { value: t('heroLanding.metric1Value'), label: t('heroLanding.metric1Label') },
      { value: t('heroLanding.metric2Value'), label: t('heroLanding.metric2Label') },
      { value: t('heroLanding.metric3Value'), label: t('heroLanding.metric3Label') },
    ],
    bgImage:    ASSETS.bgNahida,
    detailArt:  'assets/media/images/backgrounds/char1.svg',
    frameImage: ASSETS.frameNahida,
    detailSections: [
      { title: t('heroLanding.visionTitle'),  body: t('heroLanding.visionBody') },
      { title: t('heroLanding.missionTitle'), body: t('heroLanding.missionBody') },
    ],
  };
}

/** Raw character list — image assets stay fixed across locales. */
const CHARACTER_ASSETS = [
  { id: 'edutainment',  serial: '01', frameImage: ASSETS.cardChar5, bgImage: ASSETS.bgNahida,  cardImage: ASSETS.cardChar5 },
  { id: 'neo-asean',    serial: '02', frameImage: ASSETS.cardChar1, bgImage: ASSETS.cardChar1, cardImage: ASSETS.cardChar1 },
  { id: 'narrative-ai', serial: '03', frameImage: ASSETS.cardChar2, bgImage: ASSETS.cardChar2, cardImage: ASSETS.cardChar2 },
  { id: 'o2o-impact',   serial: '04', frameImage: ASSETS.cardChar3, bgImage: ASSETS.cardChar3, cardImage: ASSETS.cardChar3 },
  { id: 'global-reach', serial: '05', frameImage: ASSETS.cardChar4, bgImage: ASSETS.cardChar4, cardImage: ASSETS.cardChar4 },
];

/** Returns the characters array with current-locale strings. */
export function getCharacters() {
  return CHARACTER_ASSETS.map((c) => {
    const key = ID_TO_KEY[c.id];
    return {
      ...c,
      name:         t(`pillars.${key}.name`),
      primaryTag:   t(`pillars.${key}.primaryTag`),
      secondaryTag: t(`pillars.${key}.secondaryTag`),
      buttonLabel:  t(`pillars.${key}.buttonLabel`),
      description:  t(`pillars.${key}.description`),
    };
  });
}

/** Convenience getter — single character by id. */
export function getCharacterById(id) {
  return getCharacters().find((c) => c.id === id) ?? getCharacters()[0];
}

/* ── Backward-compat exports (used by existing code before i18n) ─────────── */
/* These are static snapshots; prefer getCharacters() / getHeroLanding()      */
export const heroLanding  = getHeroLanding();
export const characters   = getCharacters();
