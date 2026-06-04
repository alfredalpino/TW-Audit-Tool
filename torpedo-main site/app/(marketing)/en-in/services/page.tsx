import type { Metadata } from 'next';
import { indiaServicesPageFaqs } from '@/lib/seo/faqs';
import { buildFAQ } from '@/lib/seo/schema';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import { ServicesIndexView } from '@/components/services/ServicesIndexView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/services', locale, 'services');
}

export default async function EnInServicesPage() {
  const faqSchema = buildFAQ(indiaServicesPageFaqs);

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicesIndexView faqs={indiaServicesPageFaqs} />
    </main>
  );
}
