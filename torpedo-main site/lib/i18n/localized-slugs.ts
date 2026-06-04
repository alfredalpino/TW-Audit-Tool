import {
  getLocaleFromPathname,
  localeByCode,
  stripLocalePrefix,
  type LocaleCode,
} from '@/lib/i18n/config';
import { isUiOverlayLocale } from '@/lib/i18n/detection';
import {
  ENGLISH_SLUG_BY_PAGE_KEY,
  LOCALIZED_SLUGS,
  MARKETING_PAGE_KEYS,
  OVERLAY_LOCALE_PREFIX,
  type MarketingPageKey,
  type OverlayLocaleCode,
} from '@/lib/i18n/localized-slugs-data';

export {
  ENGLISH_SLUG_BY_PAGE_KEY,
  LOCALIZED_SLUGS,
  MARKETING_PAGE_KEYS,
  type MarketingPageKey,
} from '@/lib/i18n/localized-slugs-data';

export { getLegacyEnglishSlugRedirects, type LocaleSlugRedirect } from '@/lib/i18n/legacy-slug-redirects';

const englishSlugToPageKey = Object.fromEntries(
  MARKETING_PAGE_KEYS.map((key) => [ENGLISH_SLUG_BY_PAGE_KEY[key], key]),
) as Record<string, MarketingPageKey>;

function overlayLocale(locale: LocaleCode): locale is OverlayLocaleCode {
  return isUiOverlayLocale(locale);
}

function localizedSlugToPageKeyByLocale(): Map<LocaleCode, Map<string, MarketingPageKey>> {
  const byLocale = new Map<LocaleCode, Map<string, MarketingPageKey>>();
  for (const locale of Object.keys(OVERLAY_LOCALE_PREFIX) as OverlayLocaleCode[]) {
    const map = new Map<string, MarketingPageKey>();
    for (const pageKey of MARKETING_PAGE_KEYS) {
      const slug = getSlugForLocale(pageKey, locale);
      map.set(slug, pageKey);
      map.set(ENGLISH_SLUG_BY_PAGE_KEY[pageKey], pageKey);
    }
    byLocale.set(locale, map);
  }
  return byLocale;
}

const LOCALIZED_SLUG_TO_PAGE_KEY = localizedSlugToPageKeyByLocale();

export function getSlugForLocale(pageKey: MarketingPageKey, locale: LocaleCode): string {
  if (!overlayLocale(locale)) {
    return ENGLISH_SLUG_BY_PAGE_KEY[pageKey];
  }
  return LOCALIZED_SLUGS[pageKey][locale] ?? ENGLISH_SLUG_BY_PAGE_KEY[pageKey];
}

export function getPageKeyFromSlug(slug: string, locale: LocaleCode): MarketingPageKey | null {
  if (overlayLocale(locale)) {
    return LOCALIZED_SLUG_TO_PAGE_KEY.get(locale)?.get(slug) ?? null;
  }
  return englishSlugToPageKey[slug] ?? null;
}

function splitPath(pathname: string): { segments: string[] } {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized === '/') return { segments: [] };
  return { segments: normalized.split('/').filter(Boolean) };
}

function joinPath(segments: string[]): string {
  if (segments.length === 0) return '/';
  return `/${segments.join('/')}`;
}

/** Map the first marketing segment to its locale-specific slug (overlay locales only). */
export function localizeMarketingPath(pathname: string, locale: LocaleCode): string {
  if (!isUiOverlayLocale(locale)) return pathname;
  const { segments } = splitPath(pathname);
  if (segments.length === 0) return '/';

  const pageKey = getPageKeyFromSlug(segments[0]!, locale);
  if (!pageKey) return pathname;

  const localizedFirst = getSlugForLocale(pageKey, locale);
  return joinPath([localizedFirst, ...segments.slice(1)]);
}

/** Map the first marketing segment to the canonical English slug for middleware rewrites. */
export function canonicalizeMarketingPath(pathname: string, locale: LocaleCode): string {
  if (!isUiOverlayLocale(locale)) return pathname;
  const { segments } = splitPath(pathname);
  if (segments.length === 0) return '/';

  const pageKey = getPageKeyFromSlug(segments[0]!, locale);
  if (!pageKey) return pathname;

  const englishFirst = ENGLISH_SLUG_BY_PAGE_KEY[pageKey];
  return joinPath([englishFirst, ...segments.slice(1)]);
}

/** Build a full public path for a marketing page key, including locale prefix and localized slug. */
export function buildLocalizedPath(locale: LocaleCode, pageKey: MarketingPageKey): string {
  const slug = getSlugForLocale(pageKey, locale);
  const segment = `/${slug}`;
  const prefix = localeByCode[locale].prefix;
  if (!prefix) return segment;
  return `${prefix}${segment}`;
}

/** Nav active-state helper: detect page key from full pathname. */
export function getMarketingPageKeyFromPathname(pathname: string): MarketingPageKey | null {
  const locale = getLocaleFromPathname(pathname);
  const base = stripLocalePrefix(pathname);
  const { segments } = splitPath(base);
  if (segments.length === 0) return null;
  return getPageKeyFromSlug(segments[0]!, locale);
}
