/**
 * Homepage hero — server-rendered for fast LCP (no GSAP opacity gates on copy).
 */

import { HomeHeroDecor } from '@/components/home/HomeHeroDecor';
import { HomeHeroEyebrow } from '@/components/home/HomeHeroEyebrow';
import { HomeHeroCopy } from '@/components/home/HomeHeroCopy';
import { HomeHeroScrollHint } from '@/components/home/HomeHeroScrollHint';

export function HomeHero({ basePath = '' }: { basePath?: string }) {
  return (
    <section
      className="relative flex min-h-[calc(100dvh-var(--nav-h))] min-w-0 flex-col items-center justify-center overflow-hidden bg-[var(--bg-void)] pb-24 pt-6 sm:pb-28 sm:pt-8"
      aria-labelledby="home-hero-heading"
    >
      <HomeHeroDecor />

      <div className="relative z-[10] mx-auto flex w-full min-w-0 max-w-[1280px] flex-col items-center px-4 pb-20 text-center sm:px-6 md:px-12 md:pb-16 lg:px-24">
        <HomeHeroEyebrow />
        <HomeHeroCopy basePath={basePath} />
      </div>

      <HomeHeroScrollHint />
    </section>
  );
}
