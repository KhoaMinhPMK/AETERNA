/**
 * i18n.js
 * Lightweight i18n engine — zero dependencies, pure ES Module.
 *
 * API:
 *   getLocale()              → current locale code (e.g. 'en')
 *   setLocale(code)          → switch locale, saves to localStorage,
 *                              dispatches window 'localechange' event
 *   t(key, vars?)            → translate dotted key, optional {{var}} interpolation
 *   applyDOMTranslations()   → update all [data-i18n] / [data-i18n-aria] elements
 *   SUPPORTED_LOCALES        → array of { code, label, dir, flag } descriptors
 */

/* ── Locale descriptors ─────────────────────────────────────────────────── */
export const SUPPORTED_LOCALES = [
  /* Global */
  { code: 'en', label: 'English',            native: 'English',          flag: '🌐', dir: 'ltr', group: 'global' },
  { code: 'fr', label: 'French',             native: 'Français',         flag: '🇫🇷', dir: 'ltr', group: 'global' },
  { code: 'es', label: 'Spanish',            native: 'Español',          flag: '🇪🇸', dir: 'ltr', group: 'global' },
  { code: 'ar', label: 'Arabic',             native: 'العربية',          flag: '🇸🇦', dir: 'rtl', group: 'global' },
  { code: 'zh', label: 'Chinese',            native: '中文',              flag: '🇨🇳', dir: 'ltr', group: 'global' },
  { code: 'ja', label: 'Japanese',           native: '日本語',            flag: '🇯🇵', dir: 'ltr', group: 'global' },
  { code: 'ko', label: 'Korean',             native: '한국어',            flag: '🇰🇷', dir: 'ltr', group: 'global' },
  /* Southeast Asia */
  { code: 'vi', label: 'Vietnamese',         native: 'Tiếng Việt',       flag: '🇻🇳', dir: 'ltr', group: 'asean' },
  { code: 'th', label: 'Thai',               native: 'ภาษาไทย',          flag: '🇹🇭', dir: 'ltr', group: 'asean' },
  { code: 'id', label: 'Indonesian',         native: 'Bahasa Indonesia',  flag: '🇮🇩', dir: 'ltr', group: 'asean' },
  { code: 'ms', label: 'Malay',              native: 'Bahasa Melayu',     flag: '🇲🇾', dir: 'ltr', group: 'asean' },
  { code: 'tl', label: 'Filipino',           native: 'Filipino',          flag: '🇵🇭', dir: 'ltr', group: 'asean' },
  { code: 'my', label: 'Burmese',            native: 'မြန်မာဘာသာ',       flag: '🇲🇲', dir: 'ltr', group: 'asean' },
  { code: 'km', label: 'Khmer',              native: 'ភាសាខ្មែរ',        flag: '🇰🇭', dir: 'ltr', group: 'asean' },
  { code: 'lo', label: 'Lao',                native: 'ພາສາລາວ',           flag: '🇱🇦', dir: 'ltr', group: 'asean' },
];

const LOCALE_CODES = new Set(SUPPORTED_LOCALES.map((l) => l.code));
const STORAGE_KEY  = 'aeterna_locale';

/* ── Dynamic locale map (lazy-loaded) ──────────────────────────────────── */
const _loaded = {}; /* { code: translationObject } */

async function loadLocale(code) {
  if (_loaded[code]) return _loaded[code];
  try {
    const mod = await import(`./locales/${code}.js`);
    _loaded[code] = mod.default ?? mod[code] ?? mod;
    return _loaded[code];
  } catch {
    console.warn(`[i18n] locale "${code}" not found, falling back to "en".`);
    return _loaded['en'] || {};
  }
}

/* ── Active locale state ────────────────────────────────────────────────── */
let _locale = 'en';
let _strings = {}; /* active locale strings */
let _en      = {}; /* always-loaded EN fallback */

function detectInitialLocale() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LOCALE_CODES.has(saved)) return saved;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (LOCALE_CODES.has(browser)) return browser;
  /* Also check full tag e.g. zh-TW → zh */
  return 'en';
}

/* ── Bootstrap (called once from app.js before components mount) ────────── */
export async function initI18n() {
  _locale  = detectInitialLocale();
  _en      = await loadLocale('en');
  _strings = _locale === 'en' ? _en : await loadLocale(_locale);
  _loaded['en'] = _en;

  const meta = SUPPORTED_LOCALES.find((l) => l.code === _locale);
  document.documentElement.lang = _locale;
  document.documentElement.dir  = meta?.dir ?? 'ltr';

  /* Apply translations to any pre-rendered HTML elements on first load */
  if (_locale !== 'en') applyDOMTranslations();
}

/* ── Public API ─────────────────────────────────────────────────────────── */
export function getLocale() { return _locale; }

export function getLocaleDir() {
  return SUPPORTED_LOCALES.find((l) => l.code === _locale)?.dir ?? 'ltr';
}

/**
 * Switch locale. Returns a Promise that resolves after strings are loaded
 * and the 'localechange' event has fired.
 */
export async function setLocale(code) {
  if (!LOCALE_CODES.has(code) || code === _locale) return;
  _locale  = code;
  _strings = await loadLocale(code);
  localStorage.setItem(STORAGE_KEY, code);

  const meta = SUPPORTED_LOCALES.find((l) => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir  = meta?.dir ?? 'ltr';

  applyDOMTranslations();
  window.dispatchEvent(new CustomEvent('localechange', { detail: { locale: code } }));
}

/**
 * Translate a dotted key with optional {{var}} interpolation.
 *   t('nav.platform')
 *   t('preloader.loading', { pct: 42 }) → 'Loading… 42%'
 */
export function t(key, vars = {}) {
  const val = _resolve(_strings, key) ?? _resolve(_en, key) ?? key;
  if (typeof val !== 'string') return key;
  return val.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ''));
}

function _resolve(obj, key) {
  return key.split('.').reduce((o, k) => (o != null && typeof o === 'object' ? o[k] : undefined), obj);
}

/**
 * Update every element annotated with data-i18n / data-i18n-aria / data-i18n-placeholder.
 * Safe to call after any component re-render.
 */
export function applyDOMTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key) el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) el.setAttribute('aria-label', t(key));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.setAttribute('placeholder', t(key));
  });
}
