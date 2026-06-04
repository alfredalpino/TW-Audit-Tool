import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  type LegacyCanonicalLocale,
  type LocaleCode,
  buildPathForLocale,
  getPathsByLocale,
  resolveCanonicalLocale,
  stripLocalePrefix,
} from '@/lib/i18n/config';

function normalizeSiteUrl(input?: string): string {
  const fallback = 'https://www.torpedoweb.org';
  const candidate = (input ?? fallback).trim();
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteTitleUS = 'TORPEDO WEB | Web Development & Growth Infrastructure Partner';
export const siteTitleIN = 'Torpedo Web India | Web Engineering, SEO & Growth Infrastructure';

const torpedoBrandModifiers = [
  'best',
  'top',
  'leading',
  'trusted',
  'reliable',
  'expert',
  'professional',
  'result driven',
  'performance focused',
  'growth focused',
  'high converting',
  'premium',
  'affordable',
  'local',
  'near me',
  'google trusted',
  'award winning',
  'enterprise',
  'startup friendly',
  'roi driven',
];

const torpedoBrandIntentPhrases = [
  'torpedo web agency',
  'torpedo web development agency',
  'torpedo digital agency',
  'torpedo seo agency',
  'torpedo performance marketing agency',
  'torpedo web design agency',
  'torpedo website development company',
  'torpedo growth agency',
  'torpedo branding and web agency',
  'torpedo digital marketing agency',
];

// 20 modifiers x 10 intent phrases = 200 branded keyword variations.
const torpedoBrandKeywordBank = torpedoBrandModifiers.flatMap((modifier) =>
  torpedoBrandIntentPhrases.map((intent) => `${modifier} ${intent}`)
);

export const indiaKeywordBank = [
  'torpedo agency',
  'torpedo agency website',
  'torpedo web torpedo agency',
  'torpedoweb agency',
  'best web agency India',
  'web development company India',
  'SEO agency India',
  'web design agency Lucknow',
  'AI automation agency India',
  'software development company Uttar Pradesh',
  'technical SEO agency India',
  'conversion focused website development India',
  'Google Ads agency India',
  'Meta Ads agency India',
  'torpedo web agency',
  'torpedo web agency india',
  'torpedo web agency lucknow',
  'torpedo web agency uttar pradesh',
  'torpedo web agency near me',
  'torpedo digital agency india',
  'torpedo seo agency india',
  'torpedo website development agency',
  'torpedo performance marketing agency',
  'torpedo growth infrastructure agency',
  ...torpedoBrandKeywordBank,
];

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function toAbsoluteUrl(pathname: string): string {
  const normalizedPath = normalizePath(pathname);
  return `${SITE_URL}${normalizedPath}`;
}

export type LocalizedPaths = {
  /** Base path with locale prefix removed (e.g. `/blog`, `/services/web-dev`). */
  basePath: string;
  /** Absolute paths for every configured locale. */
  paths: Record<LocaleCode, string>;
  /** Backward-compatible en-US path (prefix ``). */
  usPath: string;
  /** Backward-compatible en-IN path (prefix `/en-in`). */
  indiaPath: string;
};

export function getLocalizedPaths(pathname: string): LocalizedPaths {
  const normalizedPath = normalizePath(pathname);
  const basePath = stripLocalePrefix(normalizedPath);
  const paths = getPathsByLocale(basePath);

  return {
    basePath,
    paths,
    usPath: paths['en-US'],
    indiaPath: paths['en-IN'],
  };
}

/**
 * Build hreflang alternates for a route.
 * @param pathname Locale-neutral base path (e.g. `/blog`, `/markets/france`).
 *   A prefixed path (e.g. `/fr/blog`) is accepted but stripped — prefer base paths at call sites.
 */
export function buildLanguageAlternates(
  pathname: string,
  canonicalLocale: LegacyCanonicalLocale | LocaleCode = DEFAULT_LOCALE,
) {
  const { paths } = getLocalizedPaths(pathname);
  const canonicalCode = resolveCanonicalLocale(canonicalLocale);
  const canonicalPath = paths[canonicalCode];

  const languages = Object.fromEntries(
    LOCALE_CODES.map((code) => [code, toAbsoluteUrl(paths[code])]),
  ) as Record<LocaleCode, string>;

  return {
    canonical: toAbsoluteUrl(canonicalPath),
    languages: {
      ...languages,
      'x-default': toAbsoluteUrl(paths[DEFAULT_LOCALE]),
    },
  };
}

/** Sitemap hreflang alternates for a route (includes x-default). */
export function buildSitemapLanguageAlternates(pathname: string): Record<string, string> {
  return buildLanguageAlternates(pathname).languages;
}

/** Whether a route has the same base path across all configured locales. */
export function isGloballyLocalizedBasePath(basePath: string): boolean {
  const normalized = stripLocalePrefix(normalizePath(basePath));
  if (normalized.startsWith('/local/') || normalized.startsWith('/best/')) return false;
  if (/^\/[^/]+$/.test(normalized) && !isSharedTopLevelSegment(normalized.slice(1))) return false;
  return true;
}

function isSharedTopLevelSegment(segment: string): boolean {
  const shared = new Set([
    'blog',
    'services',
    'portfolio',
    'process',
    'systems',
    'plans',
    'torpedo-agency',
    'what-we-do',
    'privacy-policy',
    'terms-of-service',
    'dmca',
    'markets',
    'global-services',
  ]);
  return shared.has(segment);
}

export function buildPathForLocaleFromPathname(pathname: string, locale: LocaleCode): string {
  return buildPathForLocale(locale, stripLocalePrefix(normalizePath(pathname)));
}
