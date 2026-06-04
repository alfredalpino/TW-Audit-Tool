import type { Metadata } from 'next';
import { HomePageClient } from '@/components/HomePageClient';
import { WhatWeBuild } from '@/components/home/WhatWeBuild';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/what-we-do', locale, 'whatWeDo');
}

export default function EnInWhatWeDoPage() {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-[var(--nav-h)]">
      <HomePageClient initialSectionId="what-we-do">
        <WhatWeBuild />
      </HomePageClient>
    </main>
  );
}
