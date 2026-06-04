import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  TORPEDO_COUNTRY_COOKIE,
  TORPEDO_LOCALE_COOKIE,
  type LocaleCode,
} from '@/lib/i18n/config';

export type GeoContext = {
  country?: string;
  region?: string;
  city?: string;
};

export type DetectionInput = {
  pathname: string;
  acceptLanguage?: string | null;
  cookieLocale?: string | null;
  cookieCountry?: string | null;
  geo?: GeoContext;
};

const FRENCH_SPEAKING_CH_REGIONS = new Set([
  'GE', // Geneva
  'VD', // Vaud
  'NE', // Neuchâtel
  'JU', // Jura
  'FR', // Fribourg (bilingual)
  'VS', // Valais (partial)
]);

function isValidLocale(value: string | null | undefined): value is LocaleCode {
  return Boolean(value && LOCALE_CODES.includes(value as LocaleCode));
}

function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(',')
    .map((part) => part.trim().split(';')[0]?.toLowerCase())
    .filter((tag): tag is string => Boolean(tag));
}

function tagToLocale(tag: string): LocaleCode | null {
  const normalized = tag.toLowerCase();
  if (normalized.startsWith('en-in') || normalized === 'hi' || normalized === 'hi-in') return 'en-IN';
  if (
    normalized.startsWith('es-mx') ||
    normalized.startsWith('es-es') ||
    normalized === 'es'
  ) {
    return 'es-MX';
  }
  if (normalized.startsWith('fr-ma')) return 'fr-MA';
  if (normalized.startsWith('fr-ch')) return 'fr-CH';
  if (normalized.startsWith('de-ch')) return 'de-CH';
  if (normalized.startsWith('fi-fi') || normalized === 'fi') return 'fi-FI';
  if (normalized.startsWith('sv-se') || normalized === 'sv') return 'sv-SE';
  if (normalized.startsWith('it-it') || normalized === 'it') return 'it-IT';
  // Generic German (de, de-de, de-at): no de-DE locale — defer to geo or en-US default.
  if (normalized.startsWith('fr')) return 'fr-FR';
  if (normalized.startsWith('tr')) return 'tr-TR';
  if (normalized.startsWith('ru')) return 'ru-RU';
  if (normalized.startsWith('ar')) return 'ar-AE';
  if (normalized.startsWith('ja')) return 'ja-JP';
  if (normalized.startsWith('zh-hk') || normalized === 'zh-hant-hk') return 'zh-HK';
  if (normalized.startsWith('zh-cn') || normalized.startsWith('zh-hans') || normalized === 'zh') return 'zh-CN';
  if (normalized.startsWith('ko')) return 'ko-KR';
  if (normalized.startsWith('en')) return 'en-US';
  return null;
}

/** Geo-IP fallback: country (and optional region) → preferred locale. */
export function localeFromGeo(geo: GeoContext): LocaleCode {
  const country = (geo.country ?? '').toUpperCase();
  const region = (geo.region ?? '').toUpperCase();

  switch (country) {
    case 'IN':
      return 'en-IN';
    case 'US':
    case 'GB':
    case 'UK':
      return 'en-US';
    case 'MX':
    case 'ES':
      return 'es-MX';
    case 'FR':
      return 'fr-FR';
    case 'MA':
      return 'fr-MA';
    case 'CH':
      if (region && FRENCH_SPEAKING_CH_REGIONS.has(region)) return 'fr-CH';
      return 'de-CH';
    case 'FI':
      return 'fi-FI';
    case 'SE':
      return 'sv-SE';
    case 'IT':
      return 'it-IT';
    case 'TR':
      return 'tr-TR';
    case 'RU':
      return 'ru-RU';
    case 'JP':
      return 'ja-JP';
    case 'CN':
      return 'zh-CN';
    case 'HK':
    case 'MO':
      return 'zh-HK';
    case 'TW':
      return 'zh-HK';
    case 'KR':
      return 'ko-KR';
    case 'AE':
    case 'SA':
    case 'QA':
    case 'BH':
    case 'KW':
    case 'OM':
    case 'EG':
      return 'ar-AE';
    default:
      return DEFAULT_LOCALE;
  }
}

export function localeFromAcceptLanguage(header: string | null | undefined): LocaleCode | null {
  for (const tag of parseAcceptLanguage(header)) {
    const direct = tagToLocale(tag);
    if (direct) return direct;
    const base = tag.split('-')[0];
    if (base) {
      const fromBase = tagToLocale(base);
      if (fromBase) return fromBase;
    }
  }
  return null;
}

/**
 * Priority: URL prefix (caller) > cookie > Accept-Language > geo.
 * Manual selection is persisted via cookie when user picks in region selector.
 */
export function resolvePreferredLocale(input: DetectionInput): LocaleCode {
  if (isValidLocale(input.cookieLocale)) {
    return input.cookieLocale;
  }

  const fromBrowser = localeFromAcceptLanguage(input.acceptLanguage);
  if (fromBrowser) return fromBrowser;

  if (input.geo?.country) {
    return localeFromGeo(input.geo);
  }

  return DEFAULT_LOCALE;
}

export function readLocaleFromRequestCookies(cookieHeader: string | null | undefined): {
  locale: LocaleCode | null;
  country: string | null;
} {
  if (!cookieHeader) return { locale: null, country: null };

  const get = (name: string): string | null => {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    if (!match?.[1]) return null;
    try {
      return decodeURIComponent(match[1].trim());
    } catch {
      return match[1].trim();
    }
  };

  const localeRaw = get(TORPEDO_LOCALE_COOKIE);
  const country = get(TORPEDO_COUNTRY_COOKIE);

  return {
    locale: isValidLocale(localeRaw) ? localeRaw : null,
    country,
  };
}

/** Locales with dedicated page trees (no middleware rewrite). */
export const CONTENT_LOCALES = new Set<LocaleCode>(['en-US', 'en-IN']);

export function isContentLocale(locale: LocaleCode): boolean {
  return CONTENT_LOCALES.has(locale);
}

export function isUiOverlayLocale(locale: LocaleCode): boolean {
  return !isContentLocale(locale);
}
