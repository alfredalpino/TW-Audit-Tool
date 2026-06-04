'use client';

import { HowWeWorkSection } from '@/components/how-we-work/HowWeWorkSection';
import WhyUs from '@/components/WhyUs';

/**
 * Dedicated Process page: polyphasic roadmap (#how-we-work) + positioning comparison (#why-us).
 */
export function ProcessPageContent() {
  return (
    <div className="flex w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <HowWeWorkSection />
      <WhyUs />
    </div>
  );
}
