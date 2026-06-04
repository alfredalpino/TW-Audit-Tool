import dynamic from 'next/dynamic';
import type { FaqItem } from '@/lib/seo/faqs';
import { HomeHero } from '@/components/home/HomeHero';

const InvisibilityTax = dynamic(() =>
  import('@/components/home/InvisibilityTax').then((m) => ({ default: m.InvisibilityTax })),
);
const ParadoxBlock = dynamic(() =>
  import('@/components/home/ParadoxBlock').then((m) => ({ default: m.ParadoxBlock })),
);
const WhatWeBuild = dynamic(() =>
  import('@/components/home/WhatWeBuild').then((m) => ({ default: m.WhatWeBuild })),
);
const SocialProof = dynamic(() =>
  import('@/components/home/SocialProof').then((m) => ({ default: m.SocialProof })),
);
const ManifestoBanner = dynamic(() =>
  import('@/components/home/ManifestoBanner').then((m) => ({ default: m.ManifestoBanner })),
);
const HomeFAQ = dynamic(() => import('@/components/home/HomeFAQ').then((m) => ({ default: m.HomeFAQ })));
const FinalHomeCTA = dynamic(() =>
  import('@/components/home/FinalHomeCTA').then((m) => ({ default: m.FinalHomeCTA })),
);

export function HomePageSections({ basePath = '', faqItems }: { basePath?: string; faqItems: FaqItem[] }) {
  return (
    <>
      <HomeHero basePath={basePath} />
      <div className="tw-below-fold">
        <InvisibilityTax />
      </div>
      <div className="tw-below-fold">
        <ParadoxBlock />
        <WhatWeBuild />
        <SocialProof />
        <ManifestoBanner />
        <HomeFAQ items={faqItems} />
        <FinalHomeCTA />
      </div>
    </>
  );
}
