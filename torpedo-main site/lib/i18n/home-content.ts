import type { Metadata } from 'next';
import type { LocaleCode } from '@/lib/i18n/config';
import { loadMessages, type Messages } from '@/lib/i18n/load-messages';
import { getOpenGraphLocale } from '@/lib/i18n/server';
import { buildLanguageAlternates, getLocalizedPaths, toAbsoluteUrl } from '@/lib/seo/site';
import type { FaqItem } from '@/lib/seo/faqs';
import { homePageFaqs } from '@/lib/seo/faqs';

type StaticPageMeta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function buildStaticPageMetadata(
  pathname: string,
  locale: LocaleCode,
  meta: StaticPageMeta,
): Metadata {
  const { paths } = getLocalizedPaths(pathname);
  const pageUrl = toAbsoluteUrl(paths[locale]);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle ?? meta.title,
      description: meta.ogDescription ?? meta.description,
      url: pageUrl,
      locale: getOpenGraphLocale(locale),
    },
    alternates: buildLanguageAlternates(pathname, locale),
  };
}

function getHomeBucket(messages: Messages): Record<string, unknown> | null {
  const home = messages.home;
  if (!home || typeof home !== 'object') return null;
  return home as Record<string, unknown>;
}

export function getHomeFaqItems(messages: Messages): FaqItem[] {
  const home = getHomeBucket(messages);
  const faq = home?.faq;
  if (!faq || typeof faq !== 'object') return homePageFaqs;

  const items = (faq as Record<string, unknown>).items;
  if (!Array.isArray(items)) return homePageFaqs;

  const parsed = items
    .filter((item): item is FaqItem => {
      if (!item || typeof item !== 'object') return false;
      const record = item as Record<string, unknown>;
      return typeof record.question === 'string' && typeof record.answer === 'string';
    })
    .map((item) => ({ question: item.question, answer: item.answer }));

  return parsed.length > 0 ? parsed : homePageFaqs;
}

export async function getHomeFaqItemsForLocale(locale: LocaleCode): Promise<FaqItem[]> {
  const messages = await loadMessages(locale, ['home']);
  return getHomeFaqItems(messages);
}
