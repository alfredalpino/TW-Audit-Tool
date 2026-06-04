import type { Metadata } from 'next';
import {
  DEFAULT_LOCALE,
  buildPathForLocale,
  type LegacyCanonicalLocale,
  type LocaleCode,
} from '@/lib/i18n/config';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getOpenGraphLocale } from '@/lib/i18n/server';
import { buildLanguageAlternates } from '@/lib/seo/site';

export type BlogIndexCopy = {
  title: string;
  description: string;
  ogTitle: string;
  heroTitle: string;
  heroIntro: string;
  schemaListName: string;
  featuredLabel: string;
  readGuide: string;
  breadcrumbBlog: string;
  postsComingSoon: string;
  listAriaLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  yearLabel: string;
  yearAll: string;
  noResults: string;
  emptyFilterHint: string;
  resultCountOne: string;
  resultCountOther: string;
  readMore: string;
};

export type BlogPostMetaOverlay = {
  title: string;
  excerpt?: string;
};

const BLOG_LIST_COPY: Record<
  LocaleCode,
  Pick<
    BlogIndexCopy,
    | 'postsComingSoon'
    | 'listAriaLabel'
    | 'searchLabel'
    | 'searchPlaceholder'
    | 'yearLabel'
    | 'yearAll'
    | 'noResults'
    | 'emptyFilterHint'
    | 'resultCountOne'
    | 'resultCountOther'
    | 'readMore'
  >
> = {
  'en-US': {
    postsComingSoon: 'Posts coming soon.',
    listAriaLabel: 'Blog posts',
    searchLabel: 'Search posts by title or excerpt',
    searchPlaceholder: 'Search by title or excerpt…',
    yearLabel: 'Year:',
    yearAll: 'All',
    noResults: 'No posts match your search or filter.',
    emptyFilterHint: 'Try a different search term or clear the year filter.',
    resultCountOne: '1 post',
    resultCountOther: 'posts',
    readMore: 'Read more →',
  },
  'en-IN': {
    postsComingSoon: 'Posts coming soon.',
    listAriaLabel: 'Blog posts',
    searchLabel: 'Search posts by title or excerpt',
    searchPlaceholder: 'Search by title or excerpt…',
    yearLabel: 'Year:',
    yearAll: 'All',
    noResults: 'No posts match your search or filter.',
    emptyFilterHint: 'Try a different search term or clear the year filter.',
    resultCountOne: '1 post',
    resultCountOther: 'posts',
    readMore: 'Read more →',
  },
  'es-MX': {
    postsComingSoon: 'Publicaciones próximamente.',
    listAriaLabel: 'Entradas del blog',
    searchLabel: 'Buscar por título o extracto',
    searchPlaceholder: 'Buscar por título o extracto…',
    yearLabel: 'Año:',
    yearAll: 'Todos',
    noResults: 'Ninguna entrada coincide con tu búsqueda o filtro.',
    emptyFilterHint: 'Prueba otro término o quita el filtro de año.',
    resultCountOne: '1 entrada',
    resultCountOther: 'entradas',
    readMore: 'Leer más →',
  },
  'fr-FR': {
    postsComingSoon: 'Articles à venir.',
    listAriaLabel: 'Articles du blog',
    searchLabel: 'Rechercher par titre ou extrait',
    searchPlaceholder: 'Rechercher par titre ou extrait…',
    yearLabel: 'Année :',
    yearAll: 'Toutes',
    noResults: 'Aucun article ne correspond à votre recherche ou filtre.',
    emptyFilterHint: 'Essayez un autre terme ou effacez le filtre par année.',
    resultCountOne: '1 article',
    resultCountOther: 'articles',
    readMore: 'Lire la suite →',
  },
  'fr-MA': {
    postsComingSoon: 'Articles à venir.',
    listAriaLabel: 'Articles du blog',
    searchLabel: 'Rechercher par titre ou extrait',
    searchPlaceholder: 'Rechercher par titre ou extrait…',
    yearLabel: 'Année :',
    yearAll: 'Toutes',
    noResults: 'Aucun article ne correspond à votre recherche ou filtre.',
    emptyFilterHint: 'Essayez un autre terme ou effacez le filtre par année.',
    resultCountOne: '1 article',
    resultCountOther: 'articles',
    readMore: 'Lire la suite →',
  },
  'de-CH': {
    postsComingSoon: 'Beiträge folgen in Kürze.',
    listAriaLabel: 'Blog-Beiträge',
    searchLabel: 'Beiträge nach Titel oder Auszug suchen',
    searchPlaceholder: 'Nach Titel oder Auszug suchen…',
    yearLabel: 'Jahr:',
    yearAll: 'Alle',
    noResults: 'Keine Beiträge entsprechen Ihrer Suche oder Ihrem Filter.',
    emptyFilterHint: 'Versuchen Sie einen anderen Suchbegriff oder entfernen Sie den Jahresfilter.',
    resultCountOne: '1 Beitrag',
    resultCountOther: 'Beiträge',
    readMore: 'Weiterlesen →',
  },
  'fr-CH': {
    postsComingSoon: 'Articles à venir.',
    listAriaLabel: 'Articles du blog',
    searchLabel: 'Rechercher par titre ou extrait',
    searchPlaceholder: 'Rechercher par titre ou extrait…',
    yearLabel: 'Année :',
    yearAll: 'Toutes',
    noResults: 'Aucun article ne correspond à votre recherche ou filtre.',
    emptyFilterHint: 'Essayez un autre terme ou effacez le filtre par année.',
    resultCountOne: '1 article',
    resultCountOther: 'articles',
    readMore: 'Lire la suite →',
  },
  'fi-FI': {
    postsComingSoon: 'Julkaisuja tulossa pian.',
    listAriaLabel: 'Blogikirjoitukset',
    searchLabel: 'Hae otsikon tai tiivistelmän perusteella',
    searchPlaceholder: 'Hae otsikon tai tiivistelmän perusteella…',
    yearLabel: 'Vuosi:',
    yearAll: 'Kaikki',
    noResults: 'Yksikään kirjoitus ei vastaa hakua tai suodatinta.',
    emptyFilterHint: 'Kokeile toista hakusanaa tai poista vuosisuodatin.',
    resultCountOne: '1 kirjoitus',
    resultCountOther: 'kirjoitusta',
    readMore: 'Lue lisää →',
  },
  'sv-SE': {
    postsComingSoon: 'Inlägg kommer snart.',
    listAriaLabel: 'Blogginlägg',
    searchLabel: 'Sök efter titel eller utdrag',
    searchPlaceholder: 'Sök efter titel eller utdrag…',
    yearLabel: 'År:',
    yearAll: 'Alla',
    noResults: 'Inga inlägg matchar din sökning eller ditt filter.',
    emptyFilterHint: 'Prova ett annat sökord eller rensa årsfiltret.',
    resultCountOne: '1 inlägg',
    resultCountOther: 'inlägg',
    readMore: 'Läs mer →',
  },
  'it-IT': {
    postsComingSoon: 'Articoli in arrivo.',
    listAriaLabel: 'Articoli del blog',
    searchLabel: 'Cerca per titolo o estratto',
    searchPlaceholder: 'Cerca per titolo o estratto…',
    yearLabel: 'Anno:',
    yearAll: 'Tutti',
    noResults: 'Nessun articolo corrisponde alla ricerca o al filtro.',
    emptyFilterHint: 'Prova un altro termine o rimuovi il filtro per anno.',
    resultCountOne: '1 articolo',
    resultCountOther: 'articoli',
    readMore: 'Leggi di più →',
  },
  'tr-TR': {
    postsComingSoon: 'Yazılar yakında.',
    listAriaLabel: 'Blog yazıları',
    searchLabel: 'Başlık veya özetle ara',
    searchPlaceholder: 'Başlık veya özetle ara…',
    yearLabel: 'Yıl:',
    yearAll: 'Tümü',
    noResults: 'Aramanız veya filtrenizle eşleşen yazı yok.',
    emptyFilterHint: 'Farklı bir terim deneyin veya yıl filtresini temizleyin.',
    resultCountOne: '1 yazı',
    resultCountOther: 'yazı',
    readMore: 'Devamını oku →',
  },
  'ru-RU': {
    postsComingSoon: 'Публикации скоро появятся.',
    listAriaLabel: 'Записи блога',
    searchLabel: 'Поиск по заголовку или описанию',
    searchPlaceholder: 'Поиск по заголовку или описанию…',
    yearLabel: 'Год:',
    yearAll: 'Все',
    noResults: 'Нет записей по вашему запросу или фильтру.',
    emptyFilterHint: 'Попробуйте другой запрос или сбросьте фильтр по году.',
    resultCountOne: '1 запись',
    resultCountOther: 'записей',
    readMore: 'Читать далее →',
  },
  'ar-AE': {
    postsComingSoon: 'مقالات قريباً.',
    listAriaLabel: 'مقالات المدونة',
    searchLabel: 'البحث بالعنوان أو المقتطف',
    searchPlaceholder: 'البحث بالعنوان أو المقتطف…',
    yearLabel: 'السنة:',
    yearAll: 'الكل',
    noResults: 'لا توجد مقالات تطابق بحثك أو الفلتر.',
    emptyFilterHint: 'جرّب كلمة بحث أخرى أو أزل فلتر السنة.',
    resultCountOne: 'مقالة واحدة',
    resultCountOther: 'مقالات',
    readMore: 'اقرأ المزيد ←',
  },
  'ja-JP': {
    postsComingSoon: '記事は近日公開予定です。',
    listAriaLabel: 'ブログ記事',
    searchLabel: 'タイトルまたは抜粋で検索',
    searchPlaceholder: 'タイトルまたは抜粋で検索…',
    yearLabel: '年:',
    yearAll: 'すべて',
    noResults: '検索またはフィルターに一致する記事がありません。',
    emptyFilterHint: '別のキーワードを試すか、年フィルターを解除してください。',
    resultCountOne: '1件',
    resultCountOther: '件',
    readMore: '続きを読む →',
  },
  'zh-CN': {
    postsComingSoon: '文章即将发布。',
    listAriaLabel: '博客文章',
    searchLabel: '按标题或摘要搜索',
    searchPlaceholder: '按标题或摘要搜索…',
    yearLabel: '年份：',
    yearAll: '全部',
    noResults: '没有符合搜索或筛选条件的文章。',
    emptyFilterHint: '请尝试其他关键词或清除年份筛选。',
    resultCountOne: '1 篇',
    resultCountOther: '篇',
    readMore: '阅读更多 →',
  },
  'zh-HK': {
    postsComingSoon: '文章即將發布。',
    listAriaLabel: '網誌文章',
    searchLabel: '按標題或摘要搜尋',
    searchPlaceholder: '按標題或摘要搜尋…',
    yearLabel: '年份：',
    yearAll: '全部',
    noResults: '冇符合搜尋或篩選條件嘅文章。',
    emptyFilterHint: '試下其他關鍵詞或清除年份篩選。',
    resultCountOne: '1 篇',
    resultCountOther: '篇',
    readMore: '閱讀更多 →',
  },
  'ko-KR': {
    postsComingSoon: '게시물이 곧 올라옵니다.',
    listAriaLabel: '블로그 게시물',
    searchLabel: '제목 또는 요약으로 검색',
    searchPlaceholder: '제목 또는 요약으로 검색…',
    yearLabel: '연도:',
    yearAll: '전체',
    noResults: '검색 또는 필터와 일치하는 게시물이 없습니다.',
    emptyFilterHint: '다른 검색어를 시도하거나 연도 필터를 해제하세요.',
    resultCountOne: '1개',
    resultCountOther: '개',
    readMore: '더 읽기 →',
  },
};

const BLOG_INDEX_BY_LOCALE: Record<LocaleCode, Omit<BlogIndexCopy, keyof typeof BLOG_LIST_COPY['en-US']>> = {
  'en-US': {
    title: 'Blog',
    description:
      'Insights on web development, design systems, and building high-performance digital experiences. Torpedo Web.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Insights on web development, design systems, and building high-performance digital experiences.',
    schemaListName: 'Torpedo Web Blog',
    featuredLabel: 'Featured',
    breadcrumbBlog: 'Blog',
    readGuide: 'Read the guide →',
  },
  'en-IN': {
    title: 'Blog',
    description:
      'Practical guides on SEO, performance marketing, web development, and growth systems for Indian founders. Torpedo Web India.',
    ogTitle: 'Blog | Torpedo Web India',
    heroTitle: 'Blog',
    heroIntro:
      'Practical guides on SEO, performance marketing, web development, and growth systems for Indian founders.',
    schemaListName: 'Torpedo Web India Blog',
    featuredLabel: 'Featured',
    breadcrumbBlog: 'Blog',
    readGuide: 'Read the guide →',
  },
  'es-MX': {
    title: 'Blog',
    description:
      'Guías prácticas sobre desarrollo web, SEO, marketing de rendimiento y sistemas de crecimiento para empresas en México.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Guías prácticas sobre desarrollo web, SEO, marketing de rendimiento y sistemas de crecimiento para empresas en México.',
    schemaListName: 'Blog de Torpedo Web',
    featuredLabel: 'Destacado',
    breadcrumbBlog: 'Blog',
    readGuide: 'Leer la guía →',
  },
  'fr-FR': {
    title: 'Blog',
    description:
      'Guides pratiques sur le développement web, le SEO, le marketing performance et les systèmes de croissance pour les entreprises en France.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Guides pratiques sur le développement web, le SEO, le marketing performance et les systèmes de croissance pour les entreprises en France.',
    schemaListName: 'Blog Torpedo Web',
    featuredLabel: 'À la une',
    breadcrumbBlog: 'Blog',
    readGuide: 'Lire le guide →',
  },
  'fr-MA': {
    title: 'Blog',
    description:
      'Guides pratiques sur le développement web, le SEO et la croissance digitale pour les entreprises au Maroc.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Guides pratiques sur le développement web, le SEO et la croissance digitale pour les entreprises au Maroc.',
    schemaListName: 'Blog Torpedo Web',
    featuredLabel: 'À la une',
    breadcrumbBlog: 'Blog',
    readGuide: 'Lire le guide →',
  },
  'de-CH': {
    title: 'Blog',
    description:
      'Praxisleitfäden zu Webentwicklung, SEO, Performance-Marketing und Wachstumssystemen für Unternehmen in der Schweiz.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Praxisleitfäden zu Webentwicklung, SEO, Performance-Marketing und Wachstumssystemen für Unternehmen in der Schweiz.',
    schemaListName: 'Torpedo Web Blog',
    featuredLabel: 'Empfohlen',
    breadcrumbBlog: 'Blog',
    readGuide: 'Leitfaden lesen →',
  },
  'fr-CH': {
    title: 'Blog',
    description:
      'Guides pratiques sur le développement web, le SEO et la croissance digitale pour les entreprises en Suisse romande.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Guides pratiques sur le développement web, le SEO et la croissance digitale pour les entreprises en Suisse romande.',
    schemaListName: 'Blog Torpedo Web',
    featuredLabel: 'À la une',
    breadcrumbBlog: 'Blog',
    readGuide: 'Lire le guide →',
  },
  'fi-FI': {
    title: 'Blogi',
    description:
      'Käytännön oppaita verkkokehityksestä, SEO:sta, suorituskykymarkkinoinnista ja kasvujärjestelmistä suomalaisille yrityksille.',
    ogTitle: 'Blogi | TORPEDO WEB',
    heroTitle: 'Blogi',
    heroIntro:
      'Käytännön oppaita verkkokehityksestä, SEO:sta, suorituskykymarkkinoinnista ja kasvujärjestelmistä suomalaisille yrityksille.',
    schemaListName: 'Torpedo Web Blogi',
    featuredLabel: 'Suositeltu',
    breadcrumbBlog: 'Blogi',
    readGuide: 'Lue opas →',
  },
  'sv-SE': {
    title: 'Blogg',
    description:
      'Praktiska guider om webbutveckling, SEO, performance marketing och tillväxtsystem för svenska företag.',
    ogTitle: 'Blogg | TORPEDO WEB',
    heroTitle: 'Blogg',
    heroIntro:
      'Praktiska guider om webbutveckling, SEO, performance marketing och tillväxtsystem för svenska företag.',
    schemaListName: 'Torpedo Web Blogg',
    featuredLabel: 'Utvald',
    breadcrumbBlog: 'Blogg',
    readGuide: 'Läs guiden →',
  },
  'it-IT': {
    title: 'Blog',
    description:
      'Guide pratiche su sviluppo web, SEO, performance marketing e sistemi di crescita per aziende italiane.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Guide pratiche su sviluppo web, SEO, performance marketing e sistemi di crescita per aziende italiane.',
    schemaListName: 'Torpedo Web Blog',
    featuredLabel: 'In evidenza',
    breadcrumbBlog: 'Blog',
    readGuide: 'Leggi la guida →',
  },
  'tr-TR': {
    title: 'Blog',
    description:
      'Türkiye\'deki işletmeler için web geliştirme, SEO, performans pazarlaması ve büyüme sistemleri hakkında pratik rehberler.',
    ogTitle: 'Blog | TORPEDO WEB',
    heroTitle: 'Blog',
    heroIntro:
      'Türkiye\'deki işletmeler için web geliştirme, SEO, performans pazarlaması ve büyüme sistemleri hakkında pratik rehberler.',
    schemaListName: 'Torpedo Web Blog',
    featuredLabel: 'Öne çıkan',
    breadcrumbBlog: 'Blog',
    readGuide: 'Rehberi oku →',
  },
  'ru-RU': {
    title: 'Блог',
    description:
      'Практические материалы о веб-разработке, SEO, performance-маркетинге и системах роста для бизнеса.',
    ogTitle: 'Блог | TORPEDO WEB',
    heroTitle: 'Блог',
    heroIntro:
      'Практические материалы о веб-разработке, SEO, performance-маркетинге и системах роста для бизнеса.',
    schemaListName: 'Блог Torpedo Web',
    featuredLabel: 'Избранное',
    breadcrumbBlog: 'Блог',
    readGuide: 'Читать руководство →',
  },
  'ar-AE': {
    title: 'المدونة',
    description:
      'أدلة عملية حول تطوير الويب، تحسين محركات البحث، التسويق بالأداء وأنظمة النمو للشركات في الإمارات.',
    ogTitle: 'المدونة | TORPEDO WEB',
    heroTitle: 'المدونة',
    heroIntro:
      'أدلة عملية حول تطوير الويب، تحسين محركات البحث، التسويق بالأداء وأنظمة النمو للشركات في الإمارات.',
    schemaListName: 'مدونة Torpedo Web',
    featuredLabel: 'مميز',
    breadcrumbBlog: 'المدونة',
    readGuide: 'اقرأ الدليل ←',
  },
  'ja-JP': {
    title: 'ブログ',
    description:
      '日本の企業向けに、Web開発、SEO、パフォーマンスマーケティング、成長システムに関する実践ガイド。',
    ogTitle: 'ブログ | TORPEDO WEB',
    heroTitle: 'ブログ',
    heroIntro:
      '日本の企業向けに、Web開発、SEO、パフォーマンスマーケティング、成長システムに関する実践ガイド。',
    schemaListName: 'Torpedo Web ブログ',
    featuredLabel: '注目',
    breadcrumbBlog: 'ブログ',
    readGuide: 'ガイドを読む →',
  },
  'zh-CN': {
    title: '博客',
    description:
      '面向中国企业的 Web 开发、SEO、效果营销与增长系统实践指南。',
    ogTitle: '博客 | TORPEDO WEB',
    heroTitle: '博客',
    heroIntro:
      '面向中国企业的 Web 开发、SEO、效果营销与增长系统实践指南。',
    schemaListName: 'Torpedo Web 博客',
    featuredLabel: '精选',
    breadcrumbBlog: '博客',
    readGuide: '阅读指南 →',
  },
  'zh-HK': {
    title: '網誌',
    description:
      '面向香港企業嘅 Web 開發、SEO、效果營銷同增長系統實踐指南。',
    ogTitle: '網誌 | TORPEDO WEB',
    heroTitle: '網誌',
    heroIntro:
      '面向香港企業嘅 Web 開發、SEO、效果營銷同增長系統實踐指南。',
    schemaListName: 'Torpedo Web 網誌',
    featuredLabel: '精選',
    breadcrumbBlog: '網誌',
    readGuide: '閱讀指南 →',
  },
  'ko-KR': {
    title: '블로그',
    description:
      '한국 기업을 위한 웹 개발, SEO, 퍼포먼스 마케팅, 성장 시스템 실전 가이드.',
    ogTitle: '블로그 | TORPEDO WEB',
    heroTitle: '블로그',
    heroIntro:
      '한국 기업을 위한 웹 개발, SEO, 퍼포먼스 마케팅, 성장 시스템 실전 가이드.',
    schemaListName: 'Torpedo Web 블로그',
    featuredLabel: '추천',
    breadcrumbBlog: '블로그',
    readGuide: '가이드 읽기 →',
  },
};

/** Metadata-only overlays for English body fallback on overlay locales. */
export const BLOG_POST_META_OVERLAYS: Partial<
  Record<LocaleCode, Record<string, BlogPostMetaOverlay>>
> = {
  'fr-FR': {
    'agency-selection-checklist-for-founders-no-fluff': {
      title: 'Checklist de sélection d\'agence pour fondateurs : sans blabla',
      excerpt:
        'Comment choisir une agence web ou marketing en France sans se faire piéger par les promesses creuses.',
    },
    'conversion-rate-optimization-checklist-website-lead-gen': {
      title: 'Checklist CRO pour sites de génération de leads : corriger les fuites avant d\'acheter du trafic',
      excerpt:
        'Priorisez les optimisations qui améliorent réellement la conversion sur les sites de services en France.',
    },
  },
  'es-MX': {
    'agency-selection-checklist-for-founders-no-fluff': {
      title: 'Checklist para elegir agencia digital sin caer en promesas vacías',
      excerpt:
        'Criterios prácticos para fundadores en México que evalúan agencias de web, SEO o performance.',
    },
    'website-conversion-tracking-implementation-guide-ga4-gtm': {
      title: 'Implementación de seguimiento de conversiones con GA4 y GTM',
      excerpt:
        'Guía operativa para medir leads y ventas en sitios de servicios sin perder datos entre campañas.',
    },
  },
};

export function getBlogIndexCopy(locale: LocaleCode): BlogIndexCopy {
  const base = BLOG_INDEX_BY_LOCALE[locale] ?? BLOG_INDEX_BY_LOCALE[DEFAULT_LOCALE];
  const list = BLOG_LIST_COPY[locale] ?? BLOG_LIST_COPY[DEFAULT_LOCALE];
  return { ...base, ...list };
}

export function getBlogPostMetaOverlay(
  locale: LocaleCode,
  slug: string,
): BlogPostMetaOverlay | undefined {
  return BLOG_POST_META_OVERLAYS[locale]?.[slug];
}

export function resolveBlogCanonicalLocale(locale: LocaleCode): LegacyCanonicalLocale | LocaleCode {
  if (locale === 'en-IN') return 'in';
  return locale;
}

export function buildBlogIndexPath(locale: LocaleCode): string {
  return buildPathForLocale(locale, '/blog');
}

export function buildBlogPostPath(locale: LocaleCode, slug: string): string {
  return buildPathForLocale(locale, `/blog/${slug}`);
}

const BLOG_INDEX_BASE_PATH = '/blog';

export async function buildBlogIndexMetadata(locale: LocaleCode): Promise<Metadata> {
  return buildLocaleMetadata(BLOG_INDEX_BASE_PATH, locale, 'blog');
}

export function buildBlogPostMetadata(
  locale: LocaleCode,
  slug: string,
  post: { title: string; excerpt?: string | null },
): Metadata {
  const overlay = getBlogPostMetaOverlay(locale, slug);
  const title = overlay?.title ?? post.title;
  const description = overlay?.excerpt ?? post.excerpt ?? undefined;
  const path = buildBlogPostPath(locale, slug);
  const canonicalLocale = resolveBlogCanonicalLocale(locale);
  const brandSuffix = locale === 'en-IN' ? 'Torpedo Web India' : 'TORPEDO WEB';
  const blogPostBasePath = `/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${brandSuffix}`,
      description,
      url: path,
      locale: getOpenGraphLocale(locale),
    },
    alternates: buildLanguageAlternates(blogPostBasePath, canonicalLocale),
  };
}

export function formatBlogDate(date: string, locale: LocaleCode): string {
  const tag =
    locale === 'en-IN'
      ? 'en-IN'
      : locale.startsWith('fr')
        ? 'fr-FR'
        : locale === 'fi-FI'
          ? 'fi-FI'
          : locale === 'sv-SE'
            ? 'sv-SE'
            : locale === 'it-IT'
              ? 'it-IT'
              : locale === 'ja-JP'
                ? 'ja-JP'
                : locale === 'zh-CN'
                  ? 'zh-CN'
                  : locale === 'zh-HK'
                    ? 'zh-HK'
                    : locale === 'ko-KR'
                      ? 'ko-KR'
                      : locale;
  try {
    return new Date(date).toLocaleDateString(tag, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}
