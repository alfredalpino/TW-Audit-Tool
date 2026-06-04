import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo/site';

export const metadata: Metadata = {
  title: 'Our Work | Portfolio',
  description: 'Our India portfolio is being refreshed with latest launches. Check back soon.',
  openGraph: {
    title: 'Our Work | Portfolio | TORPEDO WEB',
    description: 'Our India portfolio is being refreshed with latest launches. Check back soon.',
    url: '/en-in/portfolio',
  },
  alternates: { canonical: `${SITE_URL}/en-in/portfolio` },
};

export default function EnInPortfolioPage() {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-white pt-20">
      <section className="container mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-torpedo-orange">Our Work</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-torpedo-dark sm:text-5xl md:text-6xl">
            Portfolio Coming Soon
          </h1>
          <p className="mt-6 text-lg text-torpedo-gray md:text-xl">
            We are updating our India catalog with our newest live launches and detailed case studies.
          </p>
          <p className="mt-4 inline-flex rounded-md bg-torpedo-orange/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-torpedo-orange">
            Refresh in Progress
          </p>
        </div>
      </section>
    </main>
  );
}
