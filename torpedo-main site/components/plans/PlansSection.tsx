'use client';

import { motion } from 'framer-motion';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { PLANS_INR, PLANS_USD } from '@/lib/plans-data';
import { PricingCard } from '@/components/plans/PricingCard';
import { BookingWidget } from '@/components/plans/BookingWidget';
import Button from '@/components/ui/Button';

export type PlansSectionProps = {
  /** `usd`: torpedoweb.org/plans (global). `inr`: /en-in/portfolio (India). */
  variant?: 'usd' | 'inr';
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function PlansSection({ variant = 'usd' }: PlansSectionProps) {
  const bookHref = GOOGLE_CALENDAR_APPOINTMENT_URL;
  const plans = variant === 'inr' ? PLANS_INR : PLANS_USD;

  return (
    <section
      id="plans"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_45%,#F5F5F7_100%)]"
      aria-labelledby="plans-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgb(var(--torpedo-orange-rgb)_/_0.07),transparent_55%)]" />
      <div className="relative container mx-auto min-w-0 max-w-7xl px-4 py-20 sm:px-6 md:px-12 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-torpedo-orange"
          >
            Plans
          </motion.p>
          <motion.h1
            id="plans-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-3xl font-bold tracking-tight text-torpedo-dark sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Plans Built for Performance, Not Just Presence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 text-lg text-torpedo-gray md:text-xl"
          >
            We don&apos;t charge for pages. We price for outcomes.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-8%' }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:mt-20 lg:grid-cols-4 lg:gap-5 lg:items-stretch"
        >
          {plans.map((plan) => (
            <motion.div key={plan.slug} variants={item} className="flex min-h-0">
              <PricingCard
                slug={plan.slug}
                name={plan.name}
                priceRange={plan.priceRange}
                tag={plan.tag}
                features={[...plan.features]}
                featured={plan.featured}
                ctaLabel={plan.ctaLabel}
                ctaHref={bookHref}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mt-20 max-w-2xl text-center"
        >
          <p className="text-lg font-medium text-torpedo-dark md:text-xl">Built for revenue, not just design.</p>
          <Button href={bookHref} variant="light-brand" size="lg" className="mt-8">
            Book Intro Call
          </Button>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
