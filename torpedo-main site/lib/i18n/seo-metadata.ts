import type { Metadata } from 'next';
import type { LocaleCode } from '@/lib/i18n/config';
import { loadMessages, type Messages } from '@/lib/i18n/load-messages';
import { getOpenGraphLocale } from '@/lib/i18n/server';
import { buildLanguageAlternates, getLocalizedPaths, toAbsoluteUrl } from '@/lib/seo/site';

export type SeoPageKey =
  | 'home'
  | 'services'
  | 'process'
  | 'systems'
  | 'blog'
  | 'whatWeDo'
  | 'privacyPolicy'
  | 'termsOfService'
  | 'dmca';

type SeoPageMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
};

/** Region-specific high-intent phrases merged into meta keywords (not literal EN translations). */
const LOCALE_KEYWORD_SUPPLEMENTS: Partial<Record<LocaleCode, Partial<Record<SeoPageKey, string[]>>>> = {
  'fr-FR': {
    home: [
      'agence web Paris',
      'création site vitrine professionnel',
      'refonte site internet entreprise',
      'agence SEO technique France',
    ],
    services: ['prestation développement web', 'audit SEO technique', 'optimisation conversion site'],
  },
  'fr-MA': {
    home: ['agence web Maroc', 'création site web Casablanca', 'agence digitale Maroc'],
  },
  'fr-CH': {
    home: ['agence web Genève', 'développement web Suisse romande', 'agence SEO Suisse'],
  },
  'es-MX': {
    home: [
      'agencia desarrollo web CDMX',
      'diseño web empresas México',
      'SEO técnico México',
      'página web que convierte',
    ],
    services: ['servicios desarrollo web México', 'optimización conversión sitio web'],
  },
  'de-CH': {
    home: [
      'Webagentur Zürich',
      'Webentwicklung Schweiz',
      'technisches SEO Agentur',
      'Website Relaunch Schweiz',
    ],
    services: ['Webentwicklung Dienstleistungen', 'Conversion Optimierung Agentur'],
  },
  'fi-FI': {
    home: [
      'verkkokehitystoimisto Helsinki',
      'yrityksen verkkosivut Suomi',
      'tekninen SEO toimisto',
      'konversio-optimointi verkkosivusto',
    ],
    services: ['verkkokehityspalvelut', 'SEO auditointi', 'konversion optimointi'],
  },
  'sv-SE': {
    home: [
      'webbyrå Stockholm',
      'webbutveckling företag Sverige',
      'teknisk SEO byrå',
      'konverteringsoptimering webbplats',
    ],
    services: ['webbutvecklingstjänster', 'SEO audit', 'konverteringsoptimering'],
  },
  'it-IT': {
    home: [
      'agenzia web Milano',
      'sviluppo siti web Roma',
      'agenzia SEO tecnico Italia',
      'ottimizzazione conversioni sito web',
    ],
    services: ['servizi sviluppo web', 'audit SEO', 'ottimizzazione conversioni'],
  },
  'tr-TR': {
    home: [
      'web geliştirme ajansı İstanbul',
      'kurumsal web sitesi tasarımı',
      'teknik SEO ajansı Türkiye',
      'dönüşüm odaklı web sitesi',
    ],
    services: ['web sitesi geliştirme hizmetleri', 'dönüşüm optimizasyonu ajansı'],
  },
  'ru-RU': {
    home: [
      'агентство web разработки Москва',
      'разработка сайта под ключ',
      'технический SEO агентство',
      'сайт для бизнеса с конверсией',
    ],
    services: ['услуги создания сайтов', 'оптимизация конверсии сайта'],
  },
  'ar-AE': {
    home: [
      'شركة تصميم مواقع دبي',
      'تطوير مواقع إلكترونية الإمارات',
      'SEO تقني دبي',
      'موقع إلكتروني للشركات',
    ],
    services: ['خدمات تطوير المواقع', 'تحسين معدل التحويل'],
  },
  'ja-JP': {
    home: [
      'Web制作会社 東京',
      'コーポレートサイト制作',
      'テクニカルSEO エージェンシー',
      'コンバージョン重視 Web開発',
    ],
    services: ['Web開発サービス', 'CRO エージェンシー', 'Next.js 開発'],
  },
  'zh-CN': {
    home: [
      '网站开发公司 上海',
      '企业官网建设',
      '技术SEO 代理',
      '高转化网站开发',
    ],
    services: ['网站开发服务', '转化率优化', 'Next.js 开发'],
  },
  'zh-HK': {
    home: [
      '網站開發公司 香港',
      '企業官網建設',
      '技術SEO 代理',
      '高轉化網站開發',
    ],
    services: ['網站開發服務', '轉化率優化', 'Next.js 開發'],
  },
  'ko-KR': {
    home: [
      '웹 개발 회사 서울',
      '기업 홈페이지 제작',
      '기술 SEO 에이전시',
      '전환 중심 웹 개발',
    ],
    services: ['웹 개발 서비스', '전환율 최적화', 'Next.js 개발'],
  },
  'en-IN': {
    home: [
      'web development company India',
      'SEO agency Lucknow',
      'website development Uttar Pradesh',
      'conversion focused web agency India',
    ],
  },
};

function getSeoPage(messages: Messages, pageKey: SeoPageKey): SeoPageMeta | null {
  const bucket = messages.seo;
  if (!bucket || typeof bucket !== 'object') return null;

  const page = (bucket as Record<string, unknown>)[pageKey];
  if (!page || typeof page !== 'object') return null;

  const record = page as Record<string, string>;
  if (!record.title || !record.description) return null;

  return {
    title: record.title,
    description: record.description,
    ogTitle: record.ogTitle ?? record.title,
    ogDescription: record.ogDescription ?? record.description,
    keywords: record.keywords ?? '',
  };
}

function buildKeywords(locale: LocaleCode, pageKey: SeoPageKey, baseKeywords: string): string {
  const supplements = LOCALE_KEYWORD_SUPPLEMENTS[locale]?.[pageKey] ?? [];
  const parts = [baseKeywords, ...supplements].filter(Boolean);
  return [...new Set(parts.flatMap((part) => part.split(',').map((kw) => kw.trim())).filter(Boolean))].join(', ');
}

export async function buildLocaleMetadata(
  pathname: string,
  locale: LocaleCode,
  pageKey: SeoPageKey,
): Promise<Metadata> {
  const messages = await loadMessages(locale, ['seo']);
  const page = getSeoPage(messages, pageKey);

  if (!page) {
    throw new Error(`Missing SEO metadata for page "${pageKey}" in locale "${locale}"`);
  }

  const { paths } = getLocalizedPaths(pathname);
  const pageUrl = toAbsoluteUrl(paths[locale]);

  return {
    title: page.title,
    description: page.description,
    keywords: buildKeywords(locale, pageKey, page.keywords),
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      url: pageUrl,
      locale: getOpenGraphLocale(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.ogTitle,
      description: page.ogDescription,
    },
    alternates: buildLanguageAlternates(pathname, locale),
  };
}
