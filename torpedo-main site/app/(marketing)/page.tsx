import type { Metadata } from 'next';
import { HomeHashScroll } from '@/components/HomeHashScroll';
import { HomePageSections } from '@/components/home/HomePageSections';
import { ShimmerStars } from '@/components/ui/ShimmerStars';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getHomeFaqItemsForLocale } from '@/lib/i18n/home-content';
import { getRequestLocale } from '@/lib/i18n/server';
import { buildFAQ } from '@/lib/seo/schema';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/', locale, 'home');
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const faqItems = await getHomeFaqItemsForLocale(locale);
  const faqSchema = buildFAQ(faqItems);

  return (
    <main id="main-content" className="relative isolate flex min-h-screen w-full flex-col">
      <div className="relative flex min-h-screen w-full flex-1 flex-col">
        <ShimmerStars />
        <div className="relative z-[5] flex w-full flex-1 flex-col">
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          <HomeHashScroll />
          <HomePageSections basePath="" faqItems={faqItems} />
        </div>
      </div>
    </main>
  );
}
