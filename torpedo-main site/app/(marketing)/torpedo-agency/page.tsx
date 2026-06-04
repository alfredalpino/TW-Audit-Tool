import type { Metadata } from 'next';
import Link from 'next/link';
import { buildBreadcrumb, buildFAQ } from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';

const faqItems = [
  {
    question: 'Is Torpedo Agency the same as Torpedo Web?',
    answer:
      'Yes. Torpedo Agency on this website refers to Torpedo Web, the growth-focused web engineering and SEO team at torpedoweb.org.',
  },
  {
    question: 'Is Torpedo Web affiliated with torpedogroup.com?',
    answer:
      'No. Torpedo Web (torpedoweb.org) operates as a separate business identity and is not affiliated with torpedogroup.com.',
  },
  {
    question: 'What services does Torpedo Web provide?',
    answer:
      'Torpedo Web provides technical SEO, web development, conversion systems, paid growth execution, and automation workflows.',
  },
];

export const metadata: Metadata = {
  title: 'Torpedo Agency | Torpedo Web Official Site',
  description:
    'Official Torpedo Agency page for Torpedo Web. If you searched for torpedo agency, this is Torpedo Web at torpedoweb.org.',
  keywords: [
    'torpedo agency',
    'torpedo web agency',
    'torpedoweb',
    'torpedo web official website',
  ],
  openGraph: {
    title: 'Torpedo Agency | Torpedo Web Official Site',
    description:
      'Official Torpedo Agency page for Torpedo Web at torpedoweb.org.',
    url: '/torpedo-agency',
  },
  alternates: buildLanguageAlternates('/torpedo-agency', 'us'),
};

export default function TorpedoAgencyPage() {
  const pageUrl = toAbsoluteUrl('/torpedo-agency');
  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl('/') },
      { name: 'Torpedo Agency', url: pageUrl },
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
      <div className="container mx-auto w-full min-w-0 max-w-4xl px-4 pb-24 pt-12 sm:px-6 md:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">Official Brand Page</p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">Torpedo Agency = Torpedo Web</h1>
        <p className="mb-6 text-base leading-relaxed text-torpedo-gray md:text-lg">
          If you searched for <strong>torpedo agency</strong>, you are in the right place. This is the official Torpedo Web website:
          <strong> torpedoweb.org</strong>.
        </p>
        <p className="mb-8 text-sm leading-relaxed text-torpedo-gray">
          Torpedo Web is a web engineering and growth partner focused on high-performance websites, technical SEO, conversion systems, and measurable pipeline outcomes.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/services"
            className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
          >
            Explore Services
          </Link>
          <Link
            href="/plans"
            className="rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-torpedo-dark transition hover:border-torpedo-orange hover:text-torpedo-orange"
          >
            Book Discovery Call
          </Link>
        </div>
      </div>
    </main>
  );
}
