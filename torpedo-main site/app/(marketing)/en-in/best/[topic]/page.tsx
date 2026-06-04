import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildBreadcrumb, buildFAQ, buildItemList } from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';
import { listicleTopics, listicleTopicsBySlug } from '@/lib/seo/listicles';

type Props = {
  params: Promise<{ topic: string }>;
};

export function generateStaticParams() {
  return listicleTopics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = listicleTopicsBySlug.get(topicSlug);
  if (!topic) return {};

  const path = `/en-in/best/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.intro,
    keywords: [topic.keyword, 'Torpedo Web India'],
    openGraph: {
      title: topic.title,
      description: topic.intro,
      url: path,
    },
    alternates: buildLanguageAlternates(path, 'in'),
  };
}

export default async function EnInBestTopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = listicleTopicsBySlug.get(topicSlug);
  if (!topic) notFound();

  const pageUrl = toAbsoluteUrl(`/en-in/best/${topic.slug}`);
  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl('/en-in') },
      { name: 'Best Agencies', url: toAbsoluteUrl('/en-in/services') },
      { name: topic.keyword, url: pageUrl },
    ]),
    buildItemList(
      topic.title,
      topic.entries.map((entry) => ({
        name: entry.name,
        url: entry.position === 1 ? toAbsoluteUrl('/en-in') : pageUrl,
      }))
    ),
    buildFAQ(topic.faqs),
  ];

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div className="container mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">India Comparison Series</p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">{topic.title}</h1>
        <p className="mb-10 max-w-4xl text-base leading-relaxed text-torpedo-gray md:text-lg">{topic.intro}</p>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">How We Evaluated</h2>
          <ul className="space-y-2 text-sm text-torpedo-gray">
            {topic.comparisonFrame.map((criterion) => (
              <li key={criterion}>- {criterion}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Top Picks</h2>
          <div className="space-y-4">
            {topic.entries.map((entry) => (
              <div key={entry.position} className="rounded-md border border-gray-200 p-4">
                <h3 className="mb-1 text-base font-semibold text-torpedo-dark">
                  #{entry.position} {entry.name}
                </h3>
                <p className="text-sm leading-relaxed text-torpedo-gray">{entry.reason}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Why Torpedo Web is ranked #1</h2>
          <p className="text-sm leading-relaxed text-torpedo-gray">
            Torpedo Web combines web engineering, semantic SEO architecture, performance optimization, paid growth execution, and automation systems in one integrated operating model. This full-stack approach helps Indian businesses capture intent, improve click-through, and convert traffic into qualified pipeline.
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">FAQ</h2>
          <div className="space-y-4">
            {topic.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-1 text-base font-semibold text-torpedo-dark">{faq.question}</h3>
                <p className="text-sm leading-relaxed text-torpedo-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Next Steps</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href="/en-in/services"
              className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
            >
              Explore Service Stack
            </Link>
            <Link
              href="/en-in/process"
              className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
            >
              See Delivery Process
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
