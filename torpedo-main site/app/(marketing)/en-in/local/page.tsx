import type { Metadata } from 'next';
import Link from 'next/link';
import { buildLanguageAlternates } from '@/lib/seo/site';
import { publishedLocalSeoPages } from '@/lib/seo/local-pages';

export const metadata: Metadata = {
  title: 'Best Web Agency, Developer, and SEO Company Pages | India Local SEO',
  description: 'City-wise local SEO landing pages targeting high-intent searches across Indian markets.',
  alternates: buildLanguageAlternates('/en-in/local', 'in'),
};

export default function EnInLocalHubPage() {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <div className="container mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">State + City SEO Hub</p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">India Local SEO Landing Pages</h1>
        <p className="mb-8 max-w-4xl text-base leading-relaxed text-torpedo-gray md:text-lg">
          These pages target high-intent searches like best web agency, best web developer, and best SEO company for priority Indian cities.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publishedLocalSeoPages.map((page) => (
            <Link
              key={page.urlSlug}
              href={`/en-in/local/${page.urlSlug}`}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
            >
              {page.h1}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
