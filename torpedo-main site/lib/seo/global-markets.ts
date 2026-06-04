import { type LocaleCode, buildPathForLocale } from '@/lib/i18n/config';

export type GlobalMarketId =
  | 'france'
  | 'germany'
  | 'mexico'
  | 'switzerland'
  | 'turkey'
  | 'uae'
  | 'saudi-arabia'
  | 'russia';

export type GlobalServiceSlug = 'web-development' | 'seo' | 'ai-automation';

export type GlobalMarket = {
  id: GlobalMarketId;
  slug: GlobalMarketId;
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
  name: string;
  nativeName?: string;
  primaryLocale: LocaleCode;
  /** Locales where native market copy is authored */
  contentLocales: LocaleCode[];
  region: string;
  currency: string;
  timezone: string;
  /** Genuine search-intent service pairings for this market */
  services: GlobalServiceSlug[];
  valueProps: string[];
  complianceNotes: string[];
  businessContext: string;
};

export type ServiceMarketCombo = {
  slug: string;
  marketId: GlobalMarketId;
  service: GlobalServiceSlug;
};

const CORE_SERVICES: GlobalServiceSlug[] = ['web-development', 'seo', 'ai-automation'];

export const globalMarkets: GlobalMarket[] = [
  {
    id: 'france',
    slug: 'france',
    countryCode: 'FR',
    name: 'France',
    nativeName: 'France',
    primaryLocale: 'fr-FR',
    contentLocales: ['fr-FR', 'en-US'],
    region: 'Western Europe',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    services: CORE_SERVICES,
    valueProps: [
      'RGPD-first analytics, forms, and consent flows aligned with CNIL expectations',
      'French-language information architecture for high-intent B2B and premium D2C brands',
      'Performance budgets tuned for mobile-heavy Parisian and regional SME traffic',
    ],
    complianceNotes: [
      'Cookie banners with granular consent categories',
      'Data processing agreements for EU-hosted tooling',
      'Accessibility targets aligned with RGAA references where required',
    ],
    businessContext:
      'French buyers expect polished brand systems, credible case proof, and clear RGPD posture before sharing lead data. Mid-market firms often run WordPress or hybrid stacks and need measurable pipeline impact—not vanity redesigns.',
  },
  {
    id: 'germany',
    slug: 'germany',
    countryCode: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    primaryLocale: 'en-US',
    contentLocales: ['en-US'],
    region: 'Central Europe',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    services: ['web-development', 'seo'],
    valueProps: [
      'Engineering-grade documentation and SLA-friendly delivery for Mittelstand suppliers',
      'Technical SEO structured for German compound keywords and industry verticals',
      'Hosting and performance choices compatible with EU data residency expectations',
    ],
    complianceNotes: [
      'Impressum and legal notice blocks on commercial sites',
      'TTDSG-conscious tracking defaults with opt-in analytics',
      'B2B lead flows with explicit purpose statements',
    ],
    businessContext:
      'German procurement cycles favor precision, reliability, and proof of operational rigor. Industrial, SaaS, and professional services firms invest when vendors demonstrate maintainable architecture—not campaign-only tactics.',
  },
  {
    id: 'mexico',
    slug: 'mexico',
    countryCode: 'MX',
    name: 'Mexico',
    nativeName: 'México',
    primaryLocale: 'es-MX',
    contentLocales: ['es-MX', 'en-US'],
    region: 'North America',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    services: CORE_SERVICES,
    valueProps: [
      'Spanish (Mexico) UX and metadata for CDMX, Monterrey, and Guadalajara growth brands',
      'WhatsApp-ready conversion paths and CRM handoffs common in Mexican B2B funnels',
      'Core Web Vitals and mobile-first layouts for high Android share',
    ],
    complianceNotes: [
      'LFPDPPP-aware privacy notices on lead capture',
      'Clear opt-in for marketing communications',
      'Invoice-ready contact data for cross-border clients',
    ],
    businessContext:
      'Mexican growth teams blend performance marketing with relationship selling. Websites must load fast on mobile networks, surface trust signals, and connect cleanly to WhatsApp or inside sales workflows.',
  },
  {
    id: 'switzerland',
    slug: 'switzerland',
    countryCode: 'CH',
    name: 'Switzerland',
    nativeName: 'Schweiz / Suisse',
    primaryLocale: 'de-CH',
    contentLocales: ['de-CH', 'fr-CH', 'en-US'],
    region: 'Europe',
    currency: 'CHF',
    timezone: 'Europe/Zurich',
    services: ['web-development', 'seo'],
    valueProps: [
      'Bilingual DE/FR-ready structures for Zurich, Geneva, and Basel firms',
      'Premium positioning with restrained design systems suited to regulated industries',
      'Schema and FAQ systems for finance, medtech, and precision manufacturing niches',
    ],
    complianceNotes: [
      'nFADP / FADP-aware data handling for Swiss personal data',
      'Financial services disclaimers where applicable',
      'Multilingual legal footers for cross-canton audiences',
    ],
    businessContext:
      'Swiss buyers pay for precision and discretion. Sites must feel premium, load flawlessly, and support German or French copy without duplicate-content traps across language variants.',
  },
  {
    id: 'turkey',
    slug: 'turkey',
    countryCode: 'TR',
    name: 'Türkiye',
    nativeName: 'Türkiye',
    primaryLocale: 'tr-TR',
    contentLocales: ['tr-TR', 'en-US'],
    region: 'Europe / MENA bridge',
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    services: CORE_SERVICES,
    valueProps: [
      'Turkish-language SEO clusters for Istanbul and Ankara commercial intent',
      'Fast mobile experiences for high smartphone penetration',
      'Automation hooks for marketplace sellers and multi-branch operators',
    ],
    complianceNotes: [
      'KVKK-aligned privacy statements on forms',
      'Marketing consent checkboxes with audit-friendly logging',
      'E-commerce disclosures where online sales apply',
    ],
    businessContext:
      'Turkish digital teams move quickly on performance ads but often under-invest in durable SEO and maintainable web stacks. Brands that unify site speed, Turkish copy, and automation win repeat leads.',
  },
  {
    id: 'uae',
    slug: 'uae',
    countryCode: 'AE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات',
    primaryLocale: 'ar-AE',
    contentLocales: ['ar-AE', 'en-US'],
    region: 'Middle East',
    currency: 'AED',
    timezone: 'Asia/Dubai',
    services: ['web-development', 'seo'],
    valueProps: [
      'RTL-ready layouts with English fallbacks for Dubai and Abu Dhabi audiences',
      'High-trust design patterns for professional services, real estate, and hospitality',
      'Regional performance tuning for Gulf mobile networks',
    ],
    complianceNotes: [
      'PDPL-aware data collection on UAE-facing properties',
      'Clear commercial registration references where required',
      'Bilingual legal and privacy links in header/footer',
    ],
    businessContext:
      'UAE buyers judge credibility in seconds—bilingual polish, fast mobile loads, and WhatsApp or call CTAs must work together. Free-zone and mainland firms need sites that support both Arabic discovery and English deal rooms.',
  },
  {
    id: 'saudi-arabia',
    slug: 'saudi-arabia',
    countryCode: 'SA',
    name: 'Saudi Arabia',
    nativeName: 'السعودية',
    primaryLocale: 'en-US',
    contentLocales: ['en-US'],
    region: 'Middle East',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    services: ['web-development', 'seo'],
    valueProps: [
      'Vision 2030-aligned positioning for B2B services and industrial suppliers',
      'English-first enterprise copy with optional Arabic expansion paths',
      'Technical SEO for Riyadh, Jeddah, and Dammam commercial queries',
    ],
    complianceNotes: [
      'PDPL-conscious lead capture and storage choices',
      'Clear entity identification for cross-border contracts',
      'Accessibility considerations for government-adjacent vendors',
    ],
    businessContext:
      'Saudi organizations increasingly expect enterprise-grade web systems—not brochure sites. Procurement involves multiple stakeholders; clarity, performance proof, and maintainable CMS or headless stacks reduce friction.',
  },
  {
    id: 'russia',
    slug: 'russia',
    countryCode: 'RU',
    name: 'Russia',
    nativeName: 'Россия',
    primaryLocale: 'ru-RU',
    contentLocales: ['ru-RU', 'en-US'],
    region: 'Eastern Europe / CIS',
    currency: 'RUB',
    timezone: 'Europe/Moscow',
    services: ['web-development', 'seo'],
    valueProps: [
      'Russian-language IA for Moscow and regional B2B search behavior',
      'Structured data and FAQ blocks tuned for Yandex-rich results',
      'Performance-focused stacks that reduce reliance on heavy third-party scripts',
    ],
    complianceNotes: [
      'Localized privacy policies for personal data handling',
      'Clear contact and legal entity details on commercial pages',
      'Export-aware hosting discussions for cross-border clients',
    ],
    businessContext:
      'Russian B2B buyers research deeply before outreach. Sites need authoritative Russian copy, fast TTFB, and technical SEO that respects local search nuances while staying maintainable for international stakeholders.',
  },
];

export const globalMarketsById = new Map(globalMarkets.map((market) => [market.id, market]));

/** Curated service×market pages (max ~10) — high-intent only */
export const publishedServiceMarkets: ServiceMarketCombo[] = [
  { slug: 'web-development-france', marketId: 'france', service: 'web-development' },
  { slug: 'seo-france', marketId: 'france', service: 'seo' },
  { slug: 'ai-automation-france', marketId: 'france', service: 'ai-automation' },
  { slug: 'web-development-mexico', marketId: 'mexico', service: 'web-development' },
  { slug: 'seo-mexico', marketId: 'mexico', service: 'seo' },
  { slug: 'ai-automation-mexico', marketId: 'mexico', service: 'ai-automation' },
  { slug: 'web-development-germany', marketId: 'germany', service: 'web-development' },
  { slug: 'seo-germany', marketId: 'germany', service: 'seo' },
  { slug: 'web-development-uae', marketId: 'uae', service: 'web-development' },
  { slug: 'seo-uae', marketId: 'uae', service: 'seo' },
  { slug: 'web-development-turkey', marketId: 'turkey', service: 'web-development' },
  { slug: 'seo-turkey', marketId: 'turkey', service: 'seo' },
];

export const publishedServiceMarketsBySlug = new Map(
  publishedServiceMarkets.map((combo) => [combo.slug, combo]),
);

export function getMarketPath(marketId: GlobalMarketId): string {
  return `/markets/${marketId}`;
}

export function getServiceMarketPath(comboSlug: string): string {
  return `/global-services/${comboSlug}`;
}

export function buildLocalizedMarketPath(marketId: GlobalMarketId, locale: LocaleCode): string {
  return buildPathForLocale(locale, getMarketPath(marketId));
}

export function buildLocalizedServiceMarketPath(comboSlug: string, locale: LocaleCode): string {
  return buildPathForLocale(locale, getServiceMarketPath(comboSlug));
}

export function serviceLabel(slug: GlobalServiceSlug, locale: LocaleCode): string {
  const labels: Record<GlobalServiceSlug, Partial<Record<LocaleCode, string>> & { 'en-US': string }> = {
    'web-development': {
      'en-US': 'Web Development',
      'fr-FR': 'Développement web',
      'es-MX': 'Desarrollo web',
      'de-CH': 'Webentwicklung',
      'fr-CH': 'Développement web',
      'tr-TR': 'Web geliştirme',
      'ru-RU': 'Веб-разработка',
      'ar-AE': 'تطوير المواقع',
    },
    seo: {
      'en-US': 'Technical SEO',
      'fr-FR': 'SEO technique',
      'es-MX': 'SEO técnico',
      'de-CH': 'Technisches SEO',
      'fr-CH': 'SEO technique',
      'tr-TR': 'Teknik SEO',
      'ru-RU': 'Техническое SEO',
      'ar-AE': 'تحسين محركات البحث',
    },
    'ai-automation': {
      'en-US': 'AI Automation',
      'fr-FR': 'Automatisation IA',
      'es-MX': 'Automatización con IA',
      'de-CH': 'KI-Automatisierung',
      'fr-CH': 'Automatisation IA',
      'tr-TR': 'Yapay zeka otomasyonu',
      'ru-RU': 'ИИ-автоматизация',
      'ar-AE': 'أتمتة الذكاء الاصطناعي',
    },
  };
  const row = labels[slug];
  return row[locale] ?? row['en-US'];
}
