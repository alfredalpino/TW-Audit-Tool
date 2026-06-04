export type LocaleCode =
  | 'en-US'
  | 'en-IN'
  | 'es-MX'
  | 'fr-FR'
  | 'fr-MA'
  | 'de-CH'
  | 'fr-CH'
  | 'fi-FI'
  | 'sv-SE'
  | 'it-IT'
  | 'tr-TR'
  | 'ru-RU'
  | 'ar-AE'
  | 'ja-JP'
  | 'zh-CN'
  | 'zh-HK'
  | 'ko-KR';

/** Alias used by region selector UI. */
export type TorpedoLocale = LocaleCode;

/** @deprecated Use `LocaleCode` — kept for metadata callers using `us` / `in`. */
export type LegacyCanonicalLocale = 'us' | 'in';

export type LocaleConfig = {
  code: LocaleCode;
  /** URL prefix without trailing slash; empty string for default (en-US). */
  prefix: string;
  label: string;
  direction: 'ltr' | 'rtl';
};

export type LocaleOption = {
  locale: TorpedoLocale;
  pathPrefix: string;
  label: string;
};

/** Language shown in the picker — one entry per language, not per region. */
export type LanguageOption = {
  id: string;
  label: string;
  /** Locale used when the user manually picks this language. */
  locale: LocaleCode;
  /** All routed locales that represent this language (for active-state matching). */
  localeCodes: LocaleCode[];
  searchAliases?: string[];
};

export type RegionGroupId = 'americas' | 'europe' | 'asia-pacific' | 'middle-east-africa';

export type CountryEntry = {
  id: string;
  name: string;
  /** Native script country name where applicable */
  nativeName?: string;
  region: RegionGroupId;
  locales: LocaleOption[];
  searchAliases?: string[];
};

export type RegionGroup = {
  id: RegionGroupId;
  label: string;
  countries: CountryEntry[];
};

export const DEFAULT_LOCALE: LocaleCode = 'en-US';

export const locales = [
  { code: 'en-US', prefix: '', label: 'English', direction: 'ltr' },
  { code: 'en-IN', prefix: '/en-in', label: 'English', direction: 'ltr' },
  { code: 'es-MX', prefix: '/es', label: 'Español', direction: 'ltr' },
  { code: 'fr-FR', prefix: '/fr', label: 'Français', direction: 'ltr' },
  { code: 'fr-MA', prefix: '/fr-ma', label: 'Français', direction: 'ltr' },
  { code: 'de-CH', prefix: '/de-ch', label: 'Deutsch', direction: 'ltr' },
  { code: 'fr-CH', prefix: '/fr-ch', label: 'Français', direction: 'ltr' },
  { code: 'fi-FI', prefix: '/fi', label: 'Suomi', direction: 'ltr' },
  { code: 'sv-SE', prefix: '/sv', label: 'Svenska', direction: 'ltr' },
  { code: 'it-IT', prefix: '/it', label: 'Italiano', direction: 'ltr' },
  { code: 'tr-TR', prefix: '/tr', label: 'Türkçe', direction: 'ltr' },
  { code: 'ru-RU', prefix: '/ru', label: 'Русский', direction: 'ltr' },
  { code: 'ar-AE', prefix: '/ar', label: 'العربية', direction: 'rtl' },
  { code: 'ja-JP', prefix: '/ja', label: '日本語', direction: 'ltr' },
  { code: 'zh-CN', prefix: '/zh-cn', label: '简体中文', direction: 'ltr' },
  { code: 'zh-HK', prefix: '/zh-hk', label: '繁體中文', direction: 'ltr' },
  { code: 'ko-KR', prefix: '/ko', label: '한국어', direction: 'ltr' },
] as const satisfies readonly LocaleConfig[];

/** Picker list: one row per language. Regional URL locales collapse into shared labels. */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'en', label: 'English', locale: 'en-US', localeCodes: ['en-US', 'en-IN'], searchAliases: ['english'] },
  { id: 'es', label: 'Español', locale: 'es-MX', localeCodes: ['es-MX'], searchAliases: ['spanish'] },
  { id: 'fr', label: 'Français', locale: 'fr-FR', localeCodes: ['fr-FR', 'fr-MA', 'fr-CH'], searchAliases: ['french'] },
  { id: 'de', label: 'Deutsch', locale: 'de-CH', localeCodes: ['de-CH'], searchAliases: ['german'] },
  { id: 'fi', label: 'Suomi', locale: 'fi-FI', localeCodes: ['fi-FI'], searchAliases: ['finnish'] },
  { id: 'sv', label: 'Svenska', locale: 'sv-SE', localeCodes: ['sv-SE'], searchAliases: ['swedish'] },
  { id: 'it', label: 'Italiano', locale: 'it-IT', localeCodes: ['it-IT'], searchAliases: ['italian'] },
  { id: 'tr', label: 'Türkçe', locale: 'tr-TR', localeCodes: ['tr-TR'], searchAliases: ['turkish'] },
  { id: 'ru', label: 'Русский', locale: 'ru-RU', localeCodes: ['ru-RU'], searchAliases: ['russian'] },
  { id: 'ar', label: 'العربية', locale: 'ar-AE', localeCodes: ['ar-AE'], searchAliases: ['arabic'] },
  { id: 'ja', label: '日本語', locale: 'ja-JP', localeCodes: ['ja-JP'], searchAliases: ['japanese'] },
  { id: 'zh-CN', label: '简体中文', locale: 'zh-CN', localeCodes: ['zh-CN'], searchAliases: ['chinese', 'mandarin', 'simplified chinese'] },
  { id: 'zh-HK', label: '繁體中文', locale: 'zh-HK', localeCodes: ['zh-HK'], searchAliases: ['traditional chinese', 'cantonese'] },
  { id: 'ko', label: '한국어', locale: 'ko-KR', localeCodes: ['ko-KR'], searchAliases: ['korean'] },
];

export const LOCALE_CODES = locales.map((locale) => locale.code) as LocaleCode[];

export const localeByCode = Object.fromEntries(
  locales.map((locale) => [locale.code, locale]),
) as Record<LocaleCode, LocaleConfig>;

export const TORPEDO_LOCALE_COOKIE = 'TORPEDO_LOCALE';
export const TORPEDO_COUNTRY_COOKIE = 'TORPEDO_COUNTRY';

export const REGION_GROUPS: { id: RegionGroupId; label: string }[] = [
  { id: 'americas', label: 'Americas' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia-pacific', label: 'Asia Pacific' },
  { id: 'middle-east-africa', label: 'Middle East & Africa' },
];

type CountrySeed = Omit<CountryEntry, 'locales'> & { localeCodes: LocaleCode[] };

const COUNTRY_SEEDS: CountrySeed[] = [
  { id: 'us', name: 'United States', region: 'americas', localeCodes: ['en-US'] },
  { id: 'ca', name: 'Canada', region: 'americas', localeCodes: ['en-US'] },
  { id: 'mx', name: 'Mexico', nativeName: 'México', region: 'americas', localeCodes: ['es-MX'] },
  { id: 'br', name: 'Brazil', nativeName: 'Brasil', region: 'americas', localeCodes: ['en-US'] },
  { id: 'ar', name: 'Argentina', region: 'americas', localeCodes: ['en-US'] },
  { id: 'cl', name: 'Chile', region: 'americas', localeCodes: ['en-US'] },
  { id: 'co', name: 'Colombia', region: 'americas', localeCodes: ['en-US'] },
  { id: 'pe', name: 'Peru', nativeName: 'Perú', region: 'americas', localeCodes: ['en-US'] },

  { id: 'gb', name: 'United Kingdom', region: 'europe', localeCodes: ['en-US'], searchAliases: ['uk', 'britain'] },
  { id: 'de', name: 'Germany', nativeName: 'Deutschland', region: 'europe', localeCodes: ['de-CH'] },
  { id: 'fr', name: 'France', region: 'europe', localeCodes: ['fr-FR'] },
  { id: 'es', name: 'Spain', nativeName: 'España', region: 'europe', localeCodes: ['es-MX'] },
  { id: 'it', name: 'Italy', nativeName: 'Italia', region: 'europe', localeCodes: ['it-IT'] },
  { id: 'nl', name: 'Netherlands', nativeName: 'Nederland', region: 'europe', localeCodes: ['en-US'] },
  { id: 'fi', name: 'Finland', nativeName: 'Suomi', region: 'europe', localeCodes: ['fi-FI'] },
  { id: 'se', name: 'Sweden', nativeName: 'Sverige', region: 'europe', localeCodes: ['sv-SE'] },
  {
    id: 'ch',
    name: 'Switzerland',
    nativeName: 'Schweiz',
    region: 'europe',
    localeCodes: ['de-CH'],
  },
  { id: 'pl', name: 'Poland', nativeName: 'Polska', region: 'europe', localeCodes: ['en-US'] },
  { id: 'ie', name: 'Ireland', region: 'europe', localeCodes: ['en-US'] },
  { id: 'ru', name: 'Russia', nativeName: 'Россия', region: 'europe', localeCodes: ['ru-RU'] },

  {
    id: 'in',
    name: 'India',
    nativeName: 'भारत',
    region: 'asia-pacific',
    localeCodes: ['en-IN'],
    searchAliases: ['bharat', 'hindustan'],
  },
  { id: 'au', name: 'Australia', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'nz', name: 'New Zealand', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'sg', name: 'Singapore', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'jp', name: 'Japan', nativeName: '日本', region: 'asia-pacific', localeCodes: ['ja-JP'] },
  {
    id: 'kr',
    name: 'Korea',
    nativeName: '한국',
    region: 'asia-pacific',
    localeCodes: ['ko-KR'],
    searchAliases: ['south korea'],
  },
  { id: 'cn', name: 'China', nativeName: '中国', region: 'asia-pacific', localeCodes: ['zh-CN'] },
  { id: 'hk', name: 'Hong Kong', nativeName: '香港', region: 'asia-pacific', localeCodes: ['zh-HK'] },
  { id: 'tw', name: 'Taiwan', nativeName: '台灣', region: 'asia-pacific', localeCodes: ['zh-HK'] },
  { id: 'my', name: 'Malaysia', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'th', name: 'Thailand', nativeName: 'ไทย', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'id', name: 'Indonesia', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'ph', name: 'Philippines', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'vn', name: 'Vietnam', nativeName: 'Việt Nam', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'pk', name: 'Pakistan', nativeName: 'پاکستان', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'bd', name: 'Bangladesh', nativeName: 'বাংলাদেশ', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'lk', name: 'Sri Lanka', nativeName: 'ශ්‍රී ලංකාව', region: 'asia-pacific', localeCodes: ['en-US'] },
  { id: 'np', name: 'Nepal', nativeName: 'नेपाल', region: 'asia-pacific', localeCodes: ['en-US'] },

  {
    id: 'ae',
    name: 'United Arab Emirates',
    region: 'middle-east-africa',
    localeCodes: ['ar-AE'],
    searchAliases: ['uae', 'dubai'],
  },
  { id: 'sa', name: 'Saudi Arabia', nativeName: 'السعودية', region: 'middle-east-africa', localeCodes: ['ar-AE'] },
  { id: 'qa', name: 'Qatar', nativeName: 'قطر', region: 'middle-east-africa', localeCodes: ['ar-AE'] },
  { id: 'il', name: 'Israel', nativeName: 'ישראל', region: 'middle-east-africa', localeCodes: ['en-US'] },
  {
    id: 'tr',
    name: 'Türkiye',
    region: 'middle-east-africa',
    localeCodes: ['tr-TR'],
    searchAliases: ['turkey'],
  },
  { id: 'ma', name: 'Morocco', nativeName: 'المغرب', region: 'middle-east-africa', localeCodes: ['fr-MA'] },
  { id: 'za', name: 'South Africa', region: 'middle-east-africa', localeCodes: ['en-US'] },
  { id: 'ng', name: 'Nigeria', region: 'middle-east-africa', localeCodes: ['en-US'] },
  { id: 'ke', name: 'Kenya', region: 'middle-east-africa', localeCodes: ['en-US'] },
  { id: 'eg', name: 'Egypt', nativeName: 'مصر', region: 'middle-east-africa', localeCodes: ['ar-AE'] },
];

function toLocaleOption(code: LocaleCode): LocaleOption {
  const config = localeByCode[code];
  return {
    locale: code,
    pathPrefix: config.prefix,
    label: config.label,
  };
}

export const COUNTRIES: CountryEntry[] = COUNTRY_SEEDS.map(({ localeCodes, ...country }) => ({
  ...country,
  locales: localeCodes.map(toLocaleOption),
}));

/** Longest prefix first so `/fr-ma` wins over `/fr`. */
const PREFIXES_BY_LENGTH = [...locales]
  .filter((locale) => locale.prefix)
  .sort((a, b) => b.prefix.length - a.prefix.length);

export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function resolveCanonicalLocale(input: LegacyCanonicalLocale | LocaleCode = DEFAULT_LOCALE): LocaleCode {
  if (input === 'us') return 'en-US';
  if (input === 'in') return 'en-IN';
  return input;
}

export function getLocaleFromPathname(pathname: string): LocaleCode {
  const normalized = normalizePath(pathname);
  for (const locale of PREFIXES_BY_LENGTH) {
    if (normalized === locale.prefix || normalized.startsWith(`${locale.prefix}/`)) {
      return locale.code;
    }
  }
  return DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = normalizePath(pathname);
  const activeLocale = getLocaleFromPathname(normalized);
  const prefix = localeByCode[activeLocale].prefix;
  if (!prefix) return normalized;

  const withoutPrefix = normalized.slice(prefix.length) || '/';
  return withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`;
}

import { buildPathForLocale as buildLocalizedPath } from '@/lib/i18n/build-path';

export function buildPathForLocale(locale: LocaleCode, basePath: string): string {
  const normalizedBase = stripLocalePrefix(normalizePath(basePath));
  let pathBase = normalizedBase;
  if (locale !== 'en-US' && locale !== 'en-IN') {
    const { localizeMarketingPath } = require('@/lib/i18n/localized-slugs') as typeof import('@/lib/i18n/localized-slugs');
    pathBase = localizeMarketingPath(normalizedBase, locale);
  }
  const prefix = localeByCode[locale].prefix;
  if (!prefix) return pathBase;
  return pathBase === '/' ? prefix : `${prefix}${pathBase}`;
}

export function getLocalizedPath(pathname: string, pathPrefix: string): string {
  const basePath = stripLocalePrefix(pathname);
  if (!pathPrefix) return basePath;
  return basePath === '/' ? pathPrefix : `${pathPrefix}${basePath}`;
}

export function getPathsByLocale(basePath: string): Record<LocaleCode, string> {
  const normalizedBase = stripLocalePrefix(normalizePath(basePath));
  return Object.fromEntries(
    LOCALE_CODES.map((code) => [code, buildLocalizedPath(code, normalizedBase)]),
  ) as Record<LocaleCode, string>;
}

export function getSchemaLanguages(locale?: LocaleCode): string[] {
  return locale ? [locale] : [...LOCALE_CODES];
}

export function getCountryById(id: string): CountryEntry | undefined {
  return COUNTRIES.find((country) => country.id === id);
}

export function getDefaultCountryForLocale(locale: LocaleCode): CountryEntry {
  const defaults: Partial<Record<LocaleCode, string>> = {
    'en-IN': 'in',
    'es-MX': 'mx',
    'fr-FR': 'fr',
    'fr-MA': 'ma',
    'de-CH': 'ch',
    'fr-CH': 'ch',
    'fi-FI': 'fi',
    'sv-SE': 'se',
    'it-IT': 'it',
    'tr-TR': 'tr',
    'ru-RU': 'ru',
    'ar-AE': 'ae',
    'ja-JP': 'jp',
    'zh-CN': 'cn',
    'zh-HK': 'hk',
    'ko-KR': 'kr',
  };
  const id = defaults[locale] ?? 'us';
  return getCountryById(id) ?? COUNTRIES[0]!;
}

function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

function localeMatchesQuery(country: CountryEntry, locale: LocaleOption, query: string): boolean {
  const haystack = [
    country.name,
    country.nativeName,
    country.id,
    ...(country.searchAliases ?? []),
    locale.label,
    locale.locale,
  ]
    .filter((term): term is string => Boolean(term))
    .map((term) => term.toLowerCase());

  return haystack.some((term) => term.includes(query));
}

export function getCountriesGroupedByRegion(query = ''): RegionGroup[] {
  const normalizedQuery = normalizeSearchQuery(query);

  return REGION_GROUPS.map((group) => ({
    ...group,
    countries: COUNTRIES.map((country) => {
      if (country.region !== group.id) return null;

      const filteredLocales = normalizedQuery
        ? country.locales.filter((locale) => localeMatchesQuery(country, locale, normalizedQuery))
        : country.locales;

      if (filteredLocales.length === 0) return null;
      return { ...country, locales: filteredLocales };
    }).filter((country): country is CountryEntry => country !== null),
  })).filter((group) => group.countries.length > 0);
}

export function formatCountryLabel(country: CountryEntry): string {
  if (country.nativeName && country.nativeName !== country.name) {
    return `${country.name} · ${country.nativeName}`;
  }
  return country.name;
}

export function formatLocaleLabel(locale: LocaleOption): string {
  return locale.label;
}

export function formatSelectionLabel(_country: CountryEntry, locale: LocaleCode): string {
  return formatLanguageLabel(locale);
}

export function getLanguageOptionForLocale(locale: LocaleCode): LanguageOption {
  return (
    LANGUAGE_OPTIONS.find((language) => language.localeCodes.includes(locale)) ?? LANGUAGE_OPTIONS[0]!
  );
}

export function formatLanguageLabel(locale: LocaleCode): string {
  return getLanguageOptionForLocale(locale).label;
}

function languageMatchesQuery(language: LanguageOption, query: string): boolean {
  const haystack = [language.label, language.id, ...(language.searchAliases ?? [])]
    .filter(Boolean)
    .map((term) => term.toLowerCase());
  return haystack.some((term) => term.includes(query));
}

export function getLanguagesForPicker(query = ''): LanguageOption[] {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return LANGUAGE_OPTIONS;
  return LANGUAGE_OPTIONS.filter((language) => languageMatchesQuery(language, normalizedQuery));
}

export function readLocaleCookie(): LocaleCode | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TORPEDO_LOCALE_COOKIE}=([^;]*)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return value && LOCALE_CODES.includes(value as LocaleCode) ? (value as LocaleCode) : null;
}

export function readCountryCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TORPEDO_COUNTRY_COOKIE}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function writeLocaleCookies(countryId: string, locale: LocaleCode): void {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${TORPEDO_LOCALE_COOKIE}=${encodeURIComponent(locale)};path=/;max-age=${maxAge};SameSite=Lax`;
  document.cookie = `${TORPEDO_COUNTRY_COOKIE}=${encodeURIComponent(countryId)};path=/;max-age=${maxAge};SameSite=Lax`;
}
