import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts } from '@/lib/blog';
import { buildBreadcrumb, buildFAQ, buildService } from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';
import { services, servicesBySlug } from '@/lib/seo/services';

type Props = {
  params: Promise<{ service: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = servicesBySlug.get(serviceSlug);
  if (!service) return {};

  const path = `/services/${service.slug}`;
  return {
    title: `${service.name} Services | Torpedo Web`,
    description: service.intro,
    openGraph: {
      title: `${service.name} Services | Torpedo Web`,
      description: service.intro,
      url: path,
    },
    alternates: buildLanguageAlternates(path, 'us'),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { service: serviceSlug } = await params;
  const service = servicesBySlug.get(serviceSlug);
  if (!service) notFound();

  const posts = await getBlogPosts();
  const relatedPosts = posts.filter((post) => service.relatedBlogSlugs.includes(post.slug)).slice(0, 6);
  const pageUrl = toAbsoluteUrl(`/services/${service.slug}`);

  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl('/') },
      { name: 'Services', url: toAbsoluteUrl('/services') },
      { name: service.name, url: pageUrl },
    ]),
    buildService({
      name: service.name,
      description: service.intro,
      url: pageUrl,
      areaServed: ['United States', 'India'],
    }),
    buildFAQ(service.faqs),
  ];

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div className="container mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">
          Service Delivery Framework
        </p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">{service.h1}</h1>
        <p className="mb-10 max-w-4xl text-base leading-relaxed text-torpedo-gray md:text-lg">{service.intro}</p>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Execution Scope</h2>
          <ul className="space-y-2 text-sm text-torpedo-gray">
            {service.deliverables.map((deliverable) => (
              <li key={deliverable}>- {deliverable}</li>
            ))}
          </ul>
        </section>

        {relatedPosts.length > 0 && (
          <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Related Strategic Reads</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-md border border-gray-200 px-4 py-3 text-sm text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">FAQ</h2>
          <div className="space-y-4">
            {service.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-1 text-base font-semibold text-torpedo-dark">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-torpedo-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

