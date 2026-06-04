'use client';

import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { useContactInfo } from '@/components/ContactInfoContext';
import { MonoBracketEyebrowScramble } from '@/components/ui/MonoBracketEyebrowScramble';
import Button from '@/components/ui/Button';
import { useTranslations } from '@/components/i18n/LocaleProvider';

const ROW_KEYS = [
  'approach',
  'projectThinking',
  'executionDepth',
  'performanceOptimization',
  'speedAgility',
  'longTermScalability',
  'clientExperience',
] as const;

export default function WhyUsSection() {
  const { basePath } = useContactInfo();
  const startHref = `${basePath || ''}/#start`;
  const { t: tProcess } = useTranslations('process');

  const comparisonRows = ROW_KEYS.map((key) => ({
    capability: tProcess(`whyUs.rows.${key}.capability`, key),
    torpedo: tProcess(`whyUs.rows.${key}.torpedo`, ''),
    freelancers: tProcess(`whyUs.rows.${key}.freelancers`, ''),
    agencies: tProcess(`whyUs.rows.${key}.agencies`, ''),
  }));

  return (
    <section
      id="why-us"
      className="scroll-mt-[var(--nav-h)] w-full border-t border-[var(--border)] bg-[var(--bg-base)] py-16 md:py-24"
    >
      <div className="tw-section">
        <div className="mx-auto max-w-3xl text-center">
          <MonoBracketEyebrowScramble text={tProcess('whyUs.eyebrow', '[ Positioning ]')} className="font-bold" />
          <h2 className="tw-heading-section mt-4 font-display font-bold tracking-tight text-[var(--fg-primary)]">
            {tProcess('whyUs.heading', 'A different kind of agency')}
          </h2>
          <p className="tw-prose-flow mx-auto mt-5 max-w-2xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
            {tProcess('whyUs.intro', 'Most agencies focus on design and delivery. We focus on systems, performance, and outcomes.')}
          </p>
        </div>

        <p className="tw-prose-flow mx-auto mt-10 max-w-3xl text-center text-base leading-[1.6] text-[var(--fg-secondary)] md:mt-12 md:text-lg">
          {tProcess(
            'whyUs.contextP',
            'Choosing a partner is not about freelancers versus agencies. It is about the level of thinking, execution, and long-term impact you need.',
          )}
        </p>

        <div className="mt-10 hidden overflow-hidden rounded-[var(--card-radius)] border border-[var(--border)] bg-[var(--bg-surface)] md:block">
          <table className="w-full border-collapse text-left text-sm leading-snug">
            <caption className="sr-only">
              {tProcess(
                'whyUs.tableCaption',
                'Capability comparison: Torpedo Web versus typical freelancers and traditional agencies',
              )}
            </caption>
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-muted)]">
                <th scope="col" className="px-4 py-4 font-semibold text-[var(--fg-primary)] sm:px-5 md:px-6">
                  {tProcess('whyUs.columnCapability', 'Capability')}
                </th>
                <th
                  scope="col"
                  className="border-x border-[rgba(255,78,0,0.2)] bg-[rgba(255,78,0,0.06)] px-3 py-4 text-left font-semibold text-[var(--fg-primary)] sm:px-4 md:px-5"
                >
                  {tProcess('whyUs.columnTorpedo', 'Torpedo Web')}
                </th>
                <th scope="col" className="px-3 py-4 text-left font-medium text-[var(--fg-secondary)] sm:px-4 md:px-5">
                  {tProcess('whyUs.columnFreelancers', 'Typical freelancers')}
                </th>
                <th scope="col" className="px-3 py-4 text-left font-medium text-[var(--fg-secondary)] sm:px-4 md:px-5">
                  {tProcess('whyUs.columnAgencies', 'Traditional agencies')}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.capability}
                  className="border-b border-[var(--border)] bg-[var(--bg-surface)] transition-colors last:border-b-0 hover:bg-[var(--bg-muted)]"
                >
                  <th
                    scope="row"
                    className="max-w-[8.5rem] px-4 py-4 font-medium text-[var(--fg-primary)] sm:max-w-none sm:px-5 md:px-6"
                  >
                    {row.capability}
                  </th>
                  <td className="border-x border-[rgba(255,78,0,0.12)] bg-[rgba(255,78,0,0.04)] px-3 py-4 font-semibold text-[var(--fg-primary)] sm:px-4 md:px-5">
                    {row.torpedo}
                  </td>
                  <td className="px-3 py-4 text-[var(--fg-secondary)] sm:px-4 md:px-5">{row.freelancers}</td>
                  <td className="px-3 py-4 text-[var(--fg-secondary)] sm:px-4 md:px-5">{row.agencies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4 md:hidden">
          {comparisonRows.map((row) => (
            <article
              key={row.capability}
              className="rounded-[var(--card-radius)] border border-[var(--border)] bg-[var(--bg-surface)] p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--fg-primary)]">{row.capability}</h3>
              <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
                <div className="rounded-lg border border-[rgba(255,78,0,0.2)] bg-[rgba(255,78,0,0.06)] px-3 py-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                    {tProcess('whyUs.columnTorpedo', 'Torpedo Web')}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold leading-snug text-[var(--fg-primary)]">{row.torpedo}</p>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--fg-secondary)]">
                    {tProcess('whyUs.columnFreelancers', 'Typical freelancers')}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[var(--fg-secondary)]">{row.freelancers}</p>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-3">
                  <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--fg-secondary)]">
                    {tProcess('whyUs.columnAgencies', 'Traditional agencies')}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[var(--fg-secondary)]">{row.agencies}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-6 text-center md:mt-14">
          <p className="text-base font-medium leading-[1.6] text-[var(--fg-primary)] md:text-lg">
            {tProcess(
              'whyUs.closingP',
              'We operate as a focused engineering partner: freelancer agility with agency structure and reliability, without the usual trade-offs.',
            )}
          </p>
          <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Button href={startHref} variant="brand" size="md" className="w-full sm:w-auto md:px-10 md:py-4 md:text-base">
              {tProcess('whyUs.startProject', 'Start your project')}
            </Button>
            <Button
              href={GOOGLE_CALENDAR_APPOINTMENT_URL}
              variant="secondary"
              size="md"
              className="w-full sm:w-auto md:px-10 md:py-4 md:text-base"
            >
              {tProcess('whyUs.bookIntroCall', 'Book intro call')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
