'use client';

import { motion } from 'framer-motion';
import Search from 'lucide-react/dist/esm/icons/search.js';
import Layers from 'lucide-react/dist/esm/icons/layers.js';
import PenTool from 'lucide-react/dist/esm/icons/pen-tool.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.js';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { useContactInfo } from '@/components/ContactInfoContext';
import type { ProcessPhase } from '@/lib/process-phases';
import { ProcessTimelineScroll } from '@/components/how-we-work/ProcessTimelineScroll';
import { MonoBracketEyebrowScramble } from '@/components/ui/MonoBracketEyebrowScramble';
import Button from '@/components/ui/Button';
import { useTranslations } from '@/components/i18n/LocaleProvider';

const PHASE_KEYS = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'] as const;
const PHASE_ICONS = [Search, Layers, PenTool, Zap, TrendingUp];

/**
 * Process page: intro + scroll-driven vertical timeline + CTAs.
 */
export function HowWeWorkSection() {
  const { basePath } = useContactInfo();
  const startHref = `${basePath || ''}/#start`;
  const { t: tProcess } = useTranslations('process');

  const phases: ProcessPhase[] = PHASE_KEYS.map((key, index) => ({
    phaseLabel: tProcess(`phases.${key}.label`, `Phase ${index + 1}`),
    title: tProcess(`phases.${key}.title`, ''),
    description: tProcess(`phases.${key}.description`, ''),
    icon: PHASE_ICONS[index]!,
  }));

  return (
    <div id="how-we-work" className="scroll-mt-[var(--nav-h)] bg-[var(--bg-muted)]">
      <section className="border-b border-[var(--border)] bg-[linear-gradient(180deg,var(--bg-base)_0%,var(--bg-muted)_100%)] py-16 md:py-24">
        <div className="tw-section text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <MonoBracketEyebrowScramble
              text={tProcess('howWeWork.eyebrow', '[ Polyphasic roadmap ]')}
              className="font-bold"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="tw-heading-section mt-4 font-display font-bold tracking-tight text-[var(--fg-primary)]"
          >
            {tProcess('howWeWork.heading', 'From Idea to Execution, Engineered for Outcomes')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="tw-prose-flow mx-auto mt-5 max-w-2xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg"
          >
            {tProcess('howWeWork.intro', 'Structured phases to design, build, and scale digital systems that perform.')}
          </motion.p>
        </div>
      </section>

      <ProcessTimelineScroll phases={phases} />

      <section className="border-t border-[var(--border)] bg-[var(--bg-base)] py-16 md:py-20">
        <motion.div
          className="tw-section text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-base font-medium leading-[1.6] text-[var(--fg-primary)] md:text-lg">
            {tProcess('howWeWork.closingP', 'Each phase moves you toward measurable outcomes, not just a finished site.')}
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
            <Button href={startHref} variant="brand" size="md" className="w-full sm:w-auto md:px-10 md:py-4 md:text-base">
              {tProcess('howWeWork.startProject', 'Start Your Project')}
            </Button>
            <Button
              href={GOOGLE_CALENDAR_APPOINTMENT_URL}
              variant="secondary"
              size="md"
              className="w-full sm:w-auto md:px-10 md:py-4 md:text-base"
            >
              {tProcess('howWeWork.bookIntroCall', 'Book Intro Call')}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
