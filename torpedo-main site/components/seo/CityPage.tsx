import Link from 'next/link';
import type { BlogPostPublic } from '@/lib/blog';
import type { CitySeoData } from '@/lib/seo/cities';

type CityPageProps = {
  city: CitySeoData;
  relatedPosts: BlogPostPublic[];
  serviceLinks: Array<{ slug: string; label: string }>;
};

export function CityPage({ city, relatedPosts, serviceLinks }: CityPageProps) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${city.name}, ${city.state}, India`)}`;

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <div className="container mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">
          India Growth Infrastructure
        </p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">
          Web Development & Growth Infrastructure Agency in {city.name}
        </h1>
        <p className="mb-10 max-w-4xl text-base leading-relaxed text-torpedo-gray md:text-lg">
          Torpedo Web helps founders in {city.name} build high-performance websites, technical SEO systems, and conversion-first funnels. {city.marketInsight}
        </p>

        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Local Search Priorities in {city.name}</h2>
            <ul className="space-y-2 text-sm text-torpedo-gray">
              {city.localPainPoints.map((painPoint) => (
                <li key={painPoint}>- {painPoint}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">High-Intent {city.name} Keywords</h2>
            <ul className="space-y-2 text-sm text-torpedo-gray">
              {city.localKeywords.map((keyword) => (
                <li key={keyword}>- {keyword}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Service Stack for {city.name} Brands</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceLinks.map((service) => (
              <Link
                key={service.slug}
                href={`/en-in/services/${service.slug}`}
                className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
              >
                {service.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Local Market Lens</h2>
          <p className="mb-4 text-sm leading-relaxed text-torpedo-gray">
            Top sectors we commonly build for in {city.name}: {city.localIndustries.join(', ')}.
          </p>
          <Link href={mapUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-torpedo-orange hover:underline">
            Open {city.name} on Google Maps
          </Link>
        </section>

        {relatedPosts.length > 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Read Next: {city.name} Growth Playbooks</h2>
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
