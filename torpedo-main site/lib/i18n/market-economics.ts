import type { LocaleCode } from '@/lib/i18n/config';

export type MarketEconomics = {
  target: number;
  currency: string;
  numberLocale: string;
  caption: string;
  study: { href: string; title: string };
  readStudy: string;
};

const US_ECONOMICS: MarketEconomics = {
  target: 14_800,
  currency: 'USD',
  numberLocale: 'en-US',
  caption:
    'Illustrative annual revenue gap from low digital visibility for a $1M/year business with no SEO presence.',
  study: {
    href: 'https://smallbusinessmajority.org/sites/default/files/research-reports/small-businesses-face-obstacles-opportunities-growing-online-presence.pdf',
    title:
      'Small Business Majority (US): Digital transformation and online presence survey, May 2023 — 871 SMB owners',
  },
  readStudy: 'Read the study here',
};

const IN_ECONOMICS: MarketEconomics = {
  target: 1_240_000,
  currency: 'INR',
  numberLocale: 'en-IN',
  caption:
    'Illustrative annual revenue gap from low digital visibility for a ₹1Cr/year business with no SEO presence.',
  study: {
    href: 'https://assets.kpmg.com/content/dam/kpmg/in/pdf/2017/01/Impact-of-internet-and-digitisation.pdf',
    title: 'Google–KPMG: Impact of internet and digitisation on SMBs in India (2017)',
  },
  readStudy: 'Read the study here',
};

const MX_ECONOMICS: MarketEconomics = {
  target: 280_000,
  currency: 'MXN',
  numberLocale: 'es-MX',
  caption:
    'Brecha anual ilustrativa por baja visibilidad digital para un negocio de ~$5M MXN/año sin presencia SEO.',
  study: {
    href: 'https://www.gob.mx/se/articulos/pymes-y-comercio-electronico',
    title: 'Secretaría de Economía (MX): digitalización de PyMEs',
  },
  readStudy: 'Ver el estudio',
};

const FR_ECONOMICS: MarketEconomics = {
  target: 12_500,
  currency: 'EUR',
  numberLocale: 'fr-FR',
  caption:
    'Écart de revenu annuel illustratif lié à une faible visibilité digitale pour une entreprise à ~1 M€/an sans SEO.',
  study: {
    href: 'https://www.bpifrance.fr/nos-solutions/etudes',
    title: 'Bpifrance : études sur la digitalisation des PME en France',
  },
  readStudy: 'Lire l\'étude',
};

const DE_ECONOMICS: MarketEconomics = {
  target: 13_200,
  currency: 'CHF',
  numberLocale: 'de-CH',
  caption:
    'Illustrativer jährlicher Umsatzverlust durch geringe digitale Sichtbarkeit bei ~1 Mio. CHF/Jahr ohne SEO.',
  study: {
    href: 'https://www.kmu.admin.ch/kmu/en/home.html',
    title: 'SECO / KMU: Digitale Transformation für KMU in der Schweiz',
  },
  readStudy: 'Studie lesen',
};

const FI_ECONOMICS: MarketEconomics = {
  target: 11_800,
  currency: 'EUR',
  numberLocale: 'fi-FI',
  caption:
    'Havainnollistava vuosittainen liikevaihtoaukko heikosta digitaalisesta näkyvyydestä ~1 M€/v liikevaihdolla ilman SEO:ta.',
  study: {
    href: 'https://www.stat.fi/',
    title: 'Tilastokeskus: yritysten digitaalinen transformaatio Suomessa',
  },
  readStudy: 'Lue tutkimus',
};

const SE_ECONOMICS: MarketEconomics = {
  target: 125_000,
  currency: 'SEK',
  numberLocale: 'sv-SE',
  caption:
    'Illustrativ årlig intäktsförlust från låg digital synlighet för ett företag med ~10 Mkr/år utan SEO.',
  study: {
    href: 'https://www.scb.se/',
    title: 'SCB: digitalisering och e-handel bland svenska företag',
  },
  readStudy: 'Läs studien',
};

const IT_ECONOMICS: MarketEconomics = {
  target: 11_900,
  currency: 'EUR',
  numberLocale: 'it-IT',
  caption:
    'Gap di fatturato annuo illustrativo da bassa visibilità digitale per un\'azienda con ~1 M€/anno senza SEO.',
  study: {
    href: 'https://www.mise.gov.it/',
    title: 'MIMIT: digitalizzazione delle PMI in Italia',
  },
  readStudy: 'Leggi lo studio',
};

const TR_ECONOMICS: MarketEconomics = {
  target: 420_000,
  currency: 'TRY',
  numberLocale: 'tr-TR',
  caption:
    'Düşük dijital görünürlükten kaynaklanan örnek yıllık gelir kaybı — yıllık ~5M ₺ ciro, SEO yok.',
  study: {
    href: 'https://www.turkstat.gov.tr/',
    title: 'TÜİK: işletmelerde dijitalleşme ve e-ticaret verileri',
  },
  readStudy: 'Çalışmayı okuyun',
};

const RU_ECONOMICS: MarketEconomics = {
  target: 980_000,
  currency: 'RUB',
  numberLocale: 'ru-RU',
  caption:
    'Иллюстративный годовой разрыв выручки из-за низкой цифровой видимости для бизнеса ~10 млн ₽/год без SEO.',
  study: {
    href: 'https://www.nafi.ru/',
    title: 'НАФИ: исследования цифровизации малого бизнеса в РФ',
  },
  readStudy: 'Читать исследование',
};

const AE_ECONOMICS: MarketEconomics = {
  target: 52_000,
  currency: 'AED',
  numberLocale: 'ar-AE',
  caption:
    'فجوة إيرادات سنوية تقريبية من ضعف الظهور الرقمي لشركة ~500 ألف درهم/سنة بدون SEO.',
  study: {
    href: 'https://www.digitaldubai.ae/',
    title: 'Digital Dubai: تقارير التحول الرقمي للمنشآت',
  },
  readStudy: 'اقرأ الدراسة',
};

const ECONOMICS_BY_LOCALE: Partial<Record<LocaleCode, MarketEconomics>> = {
  'en-US': US_ECONOMICS,
  'en-IN': IN_ECONOMICS,
  'es-MX': MX_ECONOMICS,
  'fr-FR': FR_ECONOMICS,
  'fr-MA': FR_ECONOMICS,
  'fr-CH': FR_ECONOMICS,
  'de-CH': DE_ECONOMICS,
  'fi-FI': FI_ECONOMICS,
  'sv-SE': SE_ECONOMICS,
  'it-IT': IT_ECONOMICS,
  'tr-TR': TR_ECONOMICS,
  'ru-RU': RU_ECONOMICS,
  'ar-AE': AE_ECONOMICS,
};

export function getMarketEconomics(locale: LocaleCode): MarketEconomics {
  return ECONOMICS_BY_LOCALE[locale] ?? US_ECONOMICS;
}

export function formatMarketCurrency(value: number, economics: MarketEconomics): string {
  return new Intl.NumberFormat(economics.numberLocale, {
    style: 'currency',
    currency: economics.currency,
    maximumFractionDigits: 0,
  }).format(value);
}
