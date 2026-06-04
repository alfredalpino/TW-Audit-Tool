import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CityPage } from '@/components/seo/CityPage';
import { getBlogPosts } from '@/lib/blog';
import { CITY_SERVICE_SLUGS, cities, citiesBySlug } from '@/lib/seo/cities';
import { buildBreadcrumb, buildFAQ, buildIndiaLocalBusiness, buildService } from '@/lib/seo/schema';
import { SITE_URL, buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';

type Props = {
  params: Promise<{ city: string }>;
};

const serviceLabelMap: Record<(typeof CITY_SERVICE_SLUGS)[number], string> = {
  'web-development': 'Web Development',
  'digital-marketing': 'Digital Marketing',
  'custom-software': 'Custom Software',
  'ai-agents-automations': 'AI Agents and Automations',
};

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = citiesBySlug.get(citySlug);
  if (!city) return {};

  const path = `/en-in/${city.slug}`;
  return {
    title: `Best Web Agency ${city.name} | Torpedo Web India`,
    description: `Torpedo Web helps ${city.name} businesses with web development, technical SEO, AI automation, and conversion-focused growth systems.`,
    openGraph: {
      title: `Best Web Agency ${city.name} | Torpedo Web India`,
      description: `High-performance websites, technical SEO, and growth infrastructure for businesses in ${city.name}, ${city.state}.`,
      url: path,
    },
    alternates: buildLanguageAlternates(path, 'in'),
  };
}

export default async function EnInCityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = citiesBySlug.get(citySlug);
  if (!city) notFound();

  const posts = await getBlogPosts();
  const relatedPosts = posts.filter((post) => city.relatedBlogSlugs.includes(post.slug)).slice(0, 6);
  const services = CITY_SERVICE_SLUGS.map((slug) => ({ slug, label: serviceLabelMap[slug] }));
  const pageUrl = toAbsoluteUrl(`/en-in/${city.slug}`);

  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl('/en-in') },
      { name: 'Cities', url: toAbsoluteUrl('/en-in/services') },
      { name: city.name, url: pageUrl },
    ]),
    buildIndiaLocalBusiness({
      cityName: city.name,
      stateName: city.state,
      pagePath: `/en-in/${city.slug}`,
      areaServed: ['India', city.state, city.name],
    }),
    buildService({
      name: `Web Development and Growth Infrastructure in ${city.name}`,
      description: `Technical SEO, conversion UX, high-performance websites, and AI automation systems for ${city.name} businesses.`,
      url: pageUrl,
      areaServed: [city.name, city.state, 'India'],
    }),
    buildFAQ([
      {
        question: `How fast can Torpedo Web launch a growth-focused website in ${city.name}?`,
        answer:
          'Most projects begin with a technical audit and conversion blueprint. Launch speed depends on scope, integrations, and content readiness.',
      },
      {
        question: `Do you handle both SEO and paid growth for ${city.name} businesses?`,
        answer:
          'Yes. We build integrated systems across technical SEO, conversion-focused UX, and paid channels such as Google Ads and Meta Ads.',
      },
      {
        question: `Can you optimize local rankings for map-pack and organic results in ${city.name}?`,
        answer:
          'Yes. We combine local landing pages, citation consistency, schema implementation, and conversion tracking to improve local visibility and lead quality.',
      },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <CityPage city={city} relatedPosts={relatedPosts} serviceLinks={services} />
    </>
  );
}
