import React from 'react';
import type { Metadata } from 'next';
import { usServicesPageFaqs } from '@/lib/seo/faqs';
import { buildFAQ } from '@/lib/seo/schema';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import { ServicesIndexView } from '@/components/services/ServicesIndexView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/services', locale, 'services');
}

export default async function ServicesPage() {
  const faqSchema = buildFAQ(usServicesPageFaqs);

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicesIndexView faqs={usServicesPageFaqs} />
    </main>
  );
}
