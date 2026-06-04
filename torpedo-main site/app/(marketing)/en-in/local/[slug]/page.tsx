import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts } from '@/lib/blog';
import { buildBreadcrumb, buildFAQ, buildIndiaLocalBusiness } from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';
import {
  clusterSupportingBlogSlugs,
  getLocationBySlug,
  localSeoPageRecords,
  localSeoPageRecordsBySlug,
  publishedLocalSeoPages,
} from '@/lib/seo/local-pages';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publishedLocalSeoPages.map((record) => ({ slug: record.urlSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = localSeoPageRecordsBySlug.get(slug);
  if (!page || !page.isPublished) return {};

  const path = `/en-in/local/${page.urlSlug}`;
  return {
    title: page.title,
    description: `${page.h1}. Conversion-focused local SEO and web growth systems for ${page.city}, ${page.state}.`,
    keywords: [page.keyword, `${page.city} web agency`, `${page.city} SEO agency`],
    openGraph: {
      title: page.title,
      description: `Search-first growth systems for ${page.city} businesses with technical SEO, high-performance web architecture, and conversion optimization.`,
      url: path,
    },
    alternates: buildLanguageAlternates(path, 'in'),
  };
}

export default async function EnInLocalSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = localSeoPageRecordsBySlug.get(slug);
  if (!page || !page.isPublished) notFound();

  const location = getLocationBySlug(page.city.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  if (!location) notFound();

  const posts = await getBlogPosts();
  const clusterBlogSlugs = clusterSupportingBlogSlugs[page.cluster];
  const relatedPosts = posts.filter((post) => clusterBlogSlugs.includes(post.slug)).slice(0, 2);
  const siblingPages = localSeoPageRecords
    .filter((record) => record.city === page.city && record.urlSlug !== page.urlSlug && record.isPublished)
    .slice(0, 6);

  const pageUrl = toAbsoluteUrl(`/en-in/local/${page.urlSlug}`);
  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl('/en-in') },
      { name: 'Local SEO', url: toAbsoluteUrl('/en-in/local') },
      { name: page.h1, url: pageUrl },
    ]),
    buildIndiaLocalBusiness({
      cityName: page.city,
      stateName: page.state,
      pagePath: `/en-in/local/${page.urlSlug}`,
      areaServed: ['India', page.state, page.city],
    }),
    buildFAQ(page.faqSet),
  ];

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div className="container mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">Local Intent Page</p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">{page.h1}</h1>
        <p className="mb-8 max-w-4xl text-base leading-relaxed text-torpedo-gray md:text-lg">
          {location.marketInsight} This page is optimized for <strong>{page.keyword}</strong> and built to convert high-intent local search demand into qualified leads.
        </p>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Primary CTA</h2>
          <p className="mb-4 text-sm leading-relaxed text-torpedo-gray">
            We deploy location-specific SEO architecture, conversion-focused landing page systems, and measurement stacks for {page.city} growth teams.
          </p>
          <a
            href="/en-in/plans"
            className="inline-flex rounded-md border border-torpedo-orange bg-torpedo-orange px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {page.primaryCta}
          </a>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">{page.city}, {page.state} Proof Snippets</h2>
          <ul className="space-y-2 text-sm text-torpedo-gray">
            {location.proofSnippets.map((snippet) => (
              <li key={snippet}>- {snippet}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Client Proof from {page.city}</h2>
          <div className="space-y-4">
            {location.testimonials.map((testimonial) => (
              <blockquote key={testimonial.id} className="rounded-md border border-gray-200 p-4">
                <p className="text-sm leading-relaxed text-torpedo-gray">{testimonial.quote}</p>
                <footer className="mt-2 text-xs font-semibold text-torpedo-dark">
                  {testimonial.person} - {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Related Intent Pages</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {siblingPages.map((sibling) => (
              <Link
                key={sibling.urlSlug}
                href={`/en-in/local/${sibling.urlSlug}`}
                className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
              >
                {sibling.h1}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">FAQ</h2>
          <div className="space-y-4">
            {page.faqSet.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-1 text-base font-semibold text-torpedo-dark">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-torpedo-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Cluster Support Blogs</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/en-in/blog/${post.slug}`}
                  className="rounded-md border border-gray-200 px-4 py-3 text-sm text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
