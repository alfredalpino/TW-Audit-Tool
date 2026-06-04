/** Static slug maps — safe to import from next.config without pulling the full i18n graph. */

export const MARKETING_PAGE_KEYS = [
  'process',
  'services',
  'systems',
  'blog',
  'what-we-do',
  'privacy-policy',
  'terms-of-service',
  'dmca',
] as const;

export type MarketingPageKey = (typeof MARKETING_PAGE_KEYS)[number];

export const ENGLISH_SLUG_BY_PAGE_KEY: Record<MarketingPageKey, string> = {
  process: 'process',
  services: 'services',
  systems: 'systems',
  blog: 'blog',
  'what-we-do': 'what-we-do',
  'privacy-policy': 'privacy-policy',
  'terms-of-service': 'terms-of-service',
  dmca: 'dmca',
};

export type OverlayLocaleCode =
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

export const OVERLAY_LOCALE_PREFIX: Record<OverlayLocaleCode, string> = {
  'es-MX': '/es',
  'fr-FR': '/fr',
  'fr-MA': '/fr-ma',
  'de-CH': '/de-ch',
  'fr-CH': '/fr-ch',
  'fi-FI': '/fi',
  'sv-SE': '/sv',
  'it-IT': '/it',
  'tr-TR': '/tr',
  'ru-RU': '/ru',
  'ar-AE': '/ar',
  'ja-JP': '/ja',
  'zh-CN': '/zh-cn',
  'zh-HK': '/zh-hk',
  'ko-KR': '/ko',
};

export const LOCALIZED_SLUGS: Record<MarketingPageKey, Partial<Record<OverlayLocaleCode, string>>> = {
  process: {
    'es-MX': 'proceso',
    'fr-FR': 'processus',
    'fr-MA': 'processus',
    'de-CH': 'prozess',
    'fr-CH': 'processus',
    'fi-FI': 'prosessi',
    'sv-SE': 'process',
    'it-IT': 'processo',
    'tr-TR': 'surec',
    'ru-RU': 'protsess',
    'ar-AE': 'marhala',
    'ja-JP': 'purosesu',
    'zh-CN': 'liucheng',
    'zh-HK': 'gwocheng',
    'ko-KR': 'peurosesu',
  },
  services: {
    'es-MX': 'servicios',
    'de-CH': 'leistungen',
    'fi-FI': 'palvelut',
    'sv-SE': 'tjanster',
    'it-IT': 'servizi',
    'tr-TR': 'hizmetler',
    'ru-RU': 'uslugi',
    'ar-AE': 'khadamat',
    'ja-JP': 'sabisu',
    'zh-CN': 'fuwu',
    'zh-HK': 'fukmou',
    'ko-KR': 'seobiseu',
  },
  systems: {
    'es-MX': 'sistemas',
    'fr-FR': 'systemes',
    'fr-MA': 'systemes',
    'de-CH': 'systeme',
    'fr-CH': 'systemes',
    'fi-FI': 'jarjestelmat',
    'sv-SE': 'system',
    'it-IT': 'sistemi',
    'tr-TR': 'sistemler',
    'ru-RU': 'sistemy',
    'ar-AE': 'anzima',
    'ja-JP': 'shisutemu',
    'zh-CN': 'xitong',
    'zh-HK': 'taikei',
    'ko-KR': 'siseutem',
  },
  blog: {
    'es-MX': 'blog',
    'fr-FR': 'blog',
    'fr-MA': 'blog',
    'de-CH': 'blog',
    'fr-CH': 'blog',
    'fi-FI': 'blogi',
    'sv-SE': 'blogg',
    'it-IT': 'blog',
    'tr-TR': 'blog',
    'ru-RU': 'blog',
    'ar-AE': 'blog',
    'ja-JP': 'blog',
    'zh-CN': 'blog',
    'zh-HK': 'blog',
    'ko-KR': 'blog',
  },
  'what-we-do': {
    'es-MX': 'que-hacemos',
    'fr-FR': 'ce-que-nous-faisons',
    'fr-MA': 'ce-que-nous-faisons',
    'de-CH': 'was-wir-tun',
    'fr-CH': 'ce-que-nous-faisons',
    'fi-FI': 'mita-teemme',
    'sv-SE': 'vad-vi-gor',
    'it-IT': 'cosa-facciamo',
    'tr-TR': 'ne-yapiyoruz',
    'ru-RU': 'chto-my-delaem',
    'ar-AE': 'ma-naqumu-bihi',
    'ja-JP': 'jigyou-naiyou',
    'zh-CN': 'women-zuo-shenme',
    'zh-HK': 'ng-mun-zou-mat-ye',
    'ko-KR': 'mueol-haneunji',
  },
  'privacy-policy': {
    'es-MX': 'politica-de-privacidad',
    'fr-FR': 'politique-de-confidentialite',
    'fr-MA': 'politique-de-confidentialite',
    'de-CH': 'datenschutz',
    'fr-CH': 'politique-de-confidentialite',
    'fi-FI': 'tietosuojakaytanto',
    'sv-SE': 'integritetspolicy',
    'it-IT': 'informativa-sulla-privacy',
    'tr-TR': 'gizlilik-politikasi',
    'ru-RU': 'politika-konfidentsialnosti',
    'ar-AE': 'siyasat-al-khususiya',
    'ja-JP': 'puraibashi-porishi',
    'zh-CN': 'yinsi-zhengce',
    'zh-HK': 'yins-si-sing-seng-ming',
    'ko-KR': 'geumincheok-bangchim',
  },
  'terms-of-service': {
    'es-MX': 'terminos-de-servicio',
    'fr-FR': 'conditions-d-utilisation',
    'fr-MA': 'conditions-d-utilisation',
    'de-CH': 'nutzungsbedingungen',
    'fr-CH': 'conditions-d-utilisation',
    'fi-FI': 'kayttoehdot',
    'sv-SE': 'anvandarvillkor',
    'it-IT': 'termini-di-servizio',
    'tr-TR': 'hizmet-sartlari',
    'ru-RU': 'usloviya-ispolzovaniya',
    'ar-AE': 'shurut-al-khidma',
    'ja-JP': 'riyou-kiyaku',
    'zh-CN': 'fuwu-tiaokuan',
    'zh-HK': 'fuk-mou-tiu-kwan',
    'ko-KR': 'iyong-yakgwan',
  },
  dmca: {
    'es-MX': 'dmca',
    'fr-FR': 'dmca',
    'fr-MA': 'dmca',
    'de-CH': 'dmca',
    'fr-CH': 'dmca',
    'fi-FI': 'dmca',
    'sv-SE': 'dmca',
    'it-IT': 'dmca',
    'tr-TR': 'dmca',
    'ru-RU': 'dmca',
    'ar-AE': 'dmca',
    'ja-JP': 'dmca',
    'zh-CN': 'dmca',
    'zh-HK': 'dmca',
    'ko-KR': 'dmca',
  },
};

export function slugForOverlayLocale(pageKey: MarketingPageKey, locale: OverlayLocaleCode): string {
  return LOCALIZED_SLUGS[pageKey][locale] ?? ENGLISH_SLUG_BY_PAGE_KEY[pageKey];
}
