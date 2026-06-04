import type { Metadata } from 'next';
import Link from 'next/link';
import { buildBreadcrumb, buildFAQ } from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';

const faqItems = [
  {
    question: 'Is Torpedo Agency this website?',
    answer:
      'Yes. This page represents Torpedo Web at torpedoweb.org for users searching for torpedo agency.',
  },
  {
    question: 'Is Torpedo Web the same as torpedogroup.com?',
    answer:
      'No. Torpedo Web (torpedoweb.org) is a separate business identity.',
  },
];

export const metadata: Metadata = {
  title: 'Torpedo Agency India | Torpedo Web Official',
  description:
    'Official Torpedo Agency India page for Torpedo Web on torpedoweb.org.',
  keywords: ['torpedo agency', 'torpedo agency india', 'torpedo web agency'],
  openGraph: {
    title: 'Torpedo Agency India | Torpedo Web Official',
    description: 'Official Torpedo Agency India page for Torpedo Web.',
    url: '/en-in/torpedo-agency',
  },
  alternates: buildLanguageAlternates('/en-in/torpedo-agency', 'in'),
};

export default function EnInTorpedoAgencyPage() {
  const pageUrl = toAbsoluteUrl('/en-in/torpedo-agency');
  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl('/en-in') },
      { name: 'Torpedo Agency India', url: pageUrl },
    ]),
    buildFAQ(faqItems),
  ];

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div className="container mx-auto w-full max-w-4xl px-6 pb-24 pt-12 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">Official Brand Page</p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">Torpedo Agency India by Torpedo Web</h1>
        <p className="mb-8 text-base leading-relaxed text-torpedo-gray md:text-lg">
          Torpedo Web is the official identity on this domain for users searching <strong>torpedo agency</strong>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/en-in/services"
            className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
          >
            Explore Services
          </Link>
          <Link
            href="/en-in/plans"
            className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
          >
            Book Strategy Call
          </Link>
        </div>
      </div>
    </main>
  );
}
