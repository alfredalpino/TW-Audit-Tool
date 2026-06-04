'use client';

import Link from 'next/link';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { SystemsWebGlobeClient } from '@/components/systems/SystemsWebGlobeClient';
import { ClayCard } from '@/components/ui/ClayCard';
import { MonoBracketEyebrowScramble } from '@/components/ui/MonoBracketEyebrowScramble';
import Button from '@/components/ui/Button';
import { useTranslations } from '@/components/i18n/LocaleProvider';

const PILLAR_KEYS = ['webFoundation', 'automation', 'execution'] as const;

export function SystemsLanding({ basePath = '' }: { basePath?: string }) {
  const { t: tSystems } = useTranslations('systems');

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-void)] md:min-h-[min(100dvh,920px)]">
        <SystemsWebGlobeClient />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,var(--bg-void)_0%,rgba(6,6,6,0.92)_45%,transparent_100%)] min-[768px]:bg-[linear-gradient(90deg,var(--bg-void)_0%,rgba(6,6,6,0.88)_52%,transparent_88%)]" aria-hidden />

        <div className="relative z-[2] flex flex-col justify-start px-6 pb-10 pt-4 sm:px-8 sm:pt-5 md:min-h-[min(100dvh,920px)] md:justify-center md:px-12 md:pb-32 md:pt-10 lg:pl-24 lg:pr-8 min-[768px]:max-w-[50vw]">
          <div className="flex max-w-xl flex-col gap-4 md:gap-6">
            <MonoBracketEyebrowScramble
              text={tSystems('hero.eyebrow', '[ SYSTEMS ]')}
              className="!text-[12.1px] font-bold"
            />
            <h1 className="tw-heading-section font-display font-extrabold tracking-tight text-[var(--fg-primary)]">
              {tSystems('hero.heading', 'Built to Run Growth End-to-End')}
            </h1>
            <p className="max-w-xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
              {tSystems(
                'hero.description',
                'We do not ship disconnected deliverables. We build systems where web, automation, and execution work as one.',
              )}
            </p>
            <Button
              href={GOOGLE_CALENDAR_APPOINTMENT_URL}
              variant="brand"
              className="w-full sm:w-auto"
            >
              {tSystems('hero.bookCall', 'Book Strategy Call')}
            </Button>
            <div>
              <Link
                href={`${basePath}/what-we-do`}
                className="text-sm font-medium text-[var(--brand)] hover:text-[var(--brand-hover)]"
              >
                {tSystems('hero.exploreLink', 'Explore service details →')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-10 md:py-16">
        <div className="tw-section">
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-6">
            {PILLAR_KEYS.map((key) => (
              <ClayCard
                as="article"
                key={key}
                hover
                className="tw-prose-flow flex h-full min-h-0 flex-col p-5 md:p-8"
              >
                <h2 className="tw-heading-section font-display text-xl font-bold text-[var(--fg-primary)] md:text-2xl">
                  {tSystems(`pillars.${key}.title`, key)}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-[1.6] text-[var(--fg-secondary)] md:mt-3 md:text-base">
                  {tSystems(`pillars.${key}.detail`, '')}
                </p>
              </ClayCard>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-2xl text-center md:mt-12">
            <p className="text-lg font-medium leading-[1.6] text-[var(--fg-primary)] md:text-xl">
              {tSystems(
                'closing.text',
                'Start with a strategy call to map your current bottlenecks and next system upgrades.',
              )}
            </p>
            <Button
              href={GOOGLE_CALENDAR_APPOINTMENT_URL}
              variant="surface"
              size="lg"
              className="mt-6 w-full sm:mt-8 sm:w-auto"
            >
              {tSystems('closing.bookCall', 'Book Strategy Call')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
