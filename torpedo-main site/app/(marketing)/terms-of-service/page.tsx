import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { BackToHomeLinkSm } from '@/components/BackToHomeLink';
import { LegalDocumentPage } from '@/components/LegalDocumentPage';
import { MarkdownProse } from '@/components/MarkdownProse';
import { getLegalDocument, shouldUseLocalizedLegal } from '@/lib/i18n/legal-content';
import { buildPathForLocale } from '@/lib/i18n/config';
import { getOpenGraphLocale, getRequestLocale } from '@/lib/i18n/server';
import { buildLanguageAlternates } from '@/lib/seo/site';

function getTermsOfServiceContent(): string {
  const filePath = path.join(process.cwd(), 'public', 'term-of-services.md');
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const pathForLocale = buildPathForLocale(locale, '/terms-of-service');

  if (shouldUseLocalizedLegal(locale)) {
    const document = await getLegalDocument(locale, 'terms');
    if (document) {
      return {
        title: document.title,
        description: document.metaDescription,
        openGraph: {
          title: `${document.title} | TORPEDO WEB`,
          url: pathForLocale,
          locale: getOpenGraphLocale(locale),
        },
        alternates: buildLanguageAlternates('/terms-of-service', locale),
      };
    }
  }

  return {
    title: 'Terms of Service',
    description: 'Terms of Service for Torpedo Web. Growth infrastructure partner.',
    openGraph: {
      title: 'Terms of Service | TORPEDO WEB',
      url: pathForLocale,
    },
    alternates: buildLanguageAlternates('/terms-of-service', locale),
  };
}

export default async function TermsOfServicePage() {
  const locale = await getRequestLocale();

  if (shouldUseLocalizedLegal(locale)) {
    const document = await getLegalDocument(locale, 'terms');
    if (document) {
      return <LegalDocumentPage document={document} locale={locale} />;
    }
  }

  const content = getTermsOfServiceContent();

  return (
    <main id="main-content" className="flex flex-col w-full pt-20 min-h-screen">
      <article className="container mx-auto px-6 md:px-12 max-w-3xl pt-12 md:pt-16 pb-20 md:pb-24">
        <BackToHomeLinkSm />
        {content ? (
          <MarkdownProse content={content} />
        ) : (
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-torpedo-dark tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-torpedo-gray">Content unavailable.</p>
          </header>
        )}
      </article>
    </main>
  );
}
