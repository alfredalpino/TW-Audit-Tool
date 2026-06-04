import { CONTACT_EMAIL, CONTACT_INDIA, CONTACT_INDIA_PHONES } from '@/lib/constants';
import { type LocaleCode, getSchemaLanguages } from '@/lib/i18n/config';
import { SITE_URL } from '@/lib/seo/site';

type JsonLdObject = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}#organization`;
const WEBSITE_ID = `${SITE_URL}#website`;
const INDIA_LOCAL_BUSINESS_ID = `${SITE_URL}/en-in#localbusiness`;

function withInLanguage(input: JsonLdObject, locale?: LocaleCode): JsonLdObject {
  return {
    ...input,
    inLanguage: getSchemaLanguages(locale),
  };
}

export function buildOrganization(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'TorpedoWeb LLC',
    alternateName: ['Torpedo Web', 'Torpedo Web Agency', 'Torpedo Agency'],
    legalName: 'TorpedoWeb LLC',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: CONTACT_EMAIL,
    founder: {
      '@type': 'Person',
      name: 'Ubaid',
    },
    sameAs: [
      'https://linkedin.com/company/torpedoweb',
      'https://x.com/TorpedoWebOrg',
      'https://www.facebook.com/people/Torpedo-Web/61589591844825/',
      'https://www.instagram.com/torpedoweb/',
    ],
  };
}

export function buildWebSite(locale?: LocaleCode): JsonLdObject {
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'Torpedo Web',
      publisher: {
        '@id': ORGANIZATION_ID,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/blog?query={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    locale,
  );
}

export function buildUSLocalBusiness(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#us-localbusiness`,
    name: 'TorpedoWeb LLC',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    telephone: '+18083018338',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '8 The Green, Suite B',
      addressLocality: 'Dover',
      addressRegion: 'Delaware',
      postalCode: '19901',
      addressCountry: 'US',
    },
  };
}

export function buildIndiaLocalBusiness(input?: {
  cityName?: string;
  stateName?: string;
  pagePath?: string;
  areaServed?: string[];
}): JsonLdObject {
  const cityName = input?.cityName ?? 'Lucknow';
  const stateName = input?.stateName ?? 'Uttar Pradesh';
  const pagePath = input?.pagePath ?? '/en-in';
  const areaServed = input?.areaServed ?? ['India', stateName, cityName, 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad'];
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': INDIA_LOCAL_BUSINESS_ID,
    name: 'Torpedo Web India',
    url: `${SITE_URL}${pagePath}`,
    logo: `${SITE_URL}/logo.png`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_INDIA_PHONES[0].label.replace(/\s+/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'E/III-321, Sector J, Aliganj',
      addressLocality: cityName,
      addressRegion: stateName,
      postalCode: '226024',
      addressCountry: 'IN',
    },
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: CONTACT_EMAIL,
      telephone: CONTACT_INDIA.phoneTel.replace('tel:', ''),
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
  };
}

export function buildBreadcrumb(items: Array<{ name: string; url: string }>): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQ(
  items: Array<{ question: string; answer: string }>,
  locale?: LocaleCode,
): JsonLdObject {
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    locale,
  );
}

export function buildService(input: {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
  locale?: LocaleCode;
}): JsonLdObject {
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: input.name,
      description: input.description,
      provider: { '@id': ORGANIZATION_ID },
      url: input.url,
      areaServed: (input.areaServed ?? ['India']).map((name) => ({ '@type': 'Place', name })),
    },
    input.locale,
  );
}

export function buildArticle(input: {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  locale?: LocaleCode;
}): JsonLdObject {
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: input.headline,
      description: input.description,
      url: input.url,
      author: { '@id': ORGANIZATION_ID },
      publisher: { '@id': ORGANIZATION_ID },
      datePublished: input.datePublished ?? undefined,
      dateModified: input.dateModified ?? input.datePublished ?? undefined,
    },
    input.locale,
  );
}

export function buildItemList(
  name: string,
  items: Array<{ name: string; url: string }>,
  locale?: LocaleCode,
): JsonLdObject {
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    },
    locale,
  );
}

const ORGANIZATION_COPY: Partial<
  Record<LocaleCode, { name: string; alternateName: string[]; description: string }>
> = {
  'en-US': {
    name: 'TorpedoWeb LLC',
    alternateName: ['Torpedo Web', 'Torpedo Web Agency', 'Torpedo Agency'],
    description: 'Web development, technical SEO, and AI automation for growth-focused businesses.',
  },
  'fr-FR': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Développement web, SEO technique et automatisation IA pour entreprises en croissance.',
  },
  'es-MX': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Desarrollo web, SEO técnico y automatización con IA para marcas en crecimiento.',
  },
  'de-CH': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Webentwicklung, technisches SEO und KI-Automatisierung für wachstumsorientierte Unternehmen.',
  },
  'fi-FI': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Verkkokehitys, tekninen SEO ja tekoälyautomaatio kasvuhakuisille yrityksille.',
  },
  'sv-SE': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Webbutveckling, teknisk SEO och AI-automation för tillväxtfokuserade företag.',
  },
  'it-IT': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Sviluppo web, SEO tecnico e automazione IA per aziende orientate alla crescita.',
  },
  'fr-CH': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Développement web, SEO technique et automatisation IA pour entreprises en croissance.',
  },
  'tr-TR': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Web geliştirme, teknik SEO ve büyüme odaklı yapay zeka otomasyonu.',
  },
  'ru-RU': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'Веб-разработка, техническое SEO и ИИ-автоматизация для растущего бизнеса.',
  },
  'ar-AE': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: 'تطوير المواقع وتحسين محركات البحث وأتمتة الذكاء الاصطناعي للشركات النامية.',
  },
  'ja-JP': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: '成長志向の企業向けWeb開発、テクニカルSEO、AI自動化。',
  },
  'zh-CN': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: '为成长型企业提供网站开发、技术 SEO 与 AI 自动化。',
  },
  'zh-HK': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: '為成長型企業提供網站開發、技術 SEO 同 AI 自動化。',
  },
  'ko-KR': {
    name: 'Torpedo Web',
    alternateName: ['Torpedo Web Agency', 'TorpedoWeb LLC'],
    description: '성장 지향 기업을 위한 웹 개발, 기술 SEO, AI 자동화.',
  },
};

function organizationCopy(locale: LocaleCode) {
  return ORGANIZATION_COPY[locale] ?? ORGANIZATION_COPY['en-US']!;
}

export function buildLocalizedOrganization(locale: LocaleCode): JsonLdObject {
  const copy = organizationCopy(locale);
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: copy.name,
      alternateName: copy.alternateName,
      legalName: 'TorpedoWeb LLC',
      description: copy.description,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      email: CONTACT_EMAIL,
      founder: { '@type': 'Person', name: 'Ubaid' },
      sameAs: [
        'https://linkedin.com/company/torpedoweb',
        'https://x.com/TorpedoWebOrg',
        'https://www.facebook.com/people/Torpedo-Web/61589591844825/',
        'https://www.instagram.com/torpedoweb/',
      ],
    },
    locale,
  );
}

export function buildLocalizedBreadcrumb(
  items: Array<{ name: string; url: string }>,
  locale?: LocaleCode,
): JsonLdObject {
  return withInLanguage(buildBreadcrumb(items), locale);
}

export function buildLocalizedFAQ(
  items: Array<{ question: string; answer: string }>,
  locale?: LocaleCode,
): JsonLdObject {
  return buildFAQ(items, locale);
}

export function buildLocalizedServiceSchema(input: {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
  locale?: LocaleCode;
}): JsonLdObject {
  return buildService(input);
}

export function buildLocalizedArticleSchema(input: {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  locale?: LocaleCode;
}): JsonLdObject {
  return buildArticle(input);
}

export function buildLocalizedWebSite(locale: LocaleCode): JsonLdObject {
  const copy = organizationCopy(locale);
  return withInLanguage(
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: copy.name,
      description: copy.description,
      publisher: { '@id': ORGANIZATION_ID },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/blog?query={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    locale,
  );
}
