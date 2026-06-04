import type { Metadata } from 'next';
import { HomeHashScroll } from '@/components/HomeHashScroll';
import { HomePageSections } from '@/components/home/HomePageSections';
import { ShimmerStars } from '@/components/ui/ShimmerStars';
import { getHomeFaqItemsForLocale } from '@/lib/i18n/home-content';
import { buildFAQ } from '@/lib/seo/schema';
import { buildLanguageAlternates } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Torpedo Web Agency India | Web Engineering and Growth Systems',
  description:
    'India-focused web engineering, technical SEO architecture, and conversion growth systems by Torpedo Web Agency for startups and scaling businesses.',
  openGraph: {
    title: 'Torpedo Web Agency India | Web Engineering and Growth Systems',
    description:
      'Torpedo Web Agency delivers technical SEO, web engineering, and growth systems for high-intent search and lead quality in India.',
    url: '/en-in',
  },
  alternates: buildLanguageAlternates('/en-in', 'in'),
};

export default async function EnInHomePage() {
  const faqItems = await getHomeFaqItemsForLocale('en-IN');
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
          <HomePageSections basePath="/en-in" faqItems={faqItems} />
        </div>
      </div>
    </main>
  );
}
