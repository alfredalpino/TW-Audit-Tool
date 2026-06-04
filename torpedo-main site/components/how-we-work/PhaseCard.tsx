'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClayCard } from '@/components/ui/ClayCard';

export type PhaseCardProps = {
  phaseLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
};

export function PhaseCard({ phaseLabel, title, description, icon: Icon, index }: PhaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <ClayCard
        as="article"
        light
        hover
        className="group relative flex h-full min-h-0 flex-col p-4 sm:p-5 lg:h-full lg:p-4 xl:p-5 motion-reduce:transition-none motion-reduce:hover:transform-none"
      >
        <div className="mb-3 flex shrink-0 items-start justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-torpedo-orange sm:text-[0.9rem] sm:tracking-[0.12em]">
            {phaseLabel}
          </span>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-torpedo-light/80 text-torpedo-dark transition-colors duration-300 group-hover:border-torpedo-orange/25 group-hover:bg-white group-hover:text-torpedo-orange"
            aria-hidden
          >
            <Icon className="h-4 w-4 stroke-[1.5]" strokeWidth={1.75} />
          </div>
        </div>
        <h3 className="shrink-0 text-[0.95rem] font-bold leading-tight tracking-tight text-torpedo-dark lg:text-[0.9rem] xl:text-[0.95rem]">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-[0.8125rem] leading-snug text-torpedo-gray xl:text-[0.84375rem] xl:leading-snug">
          {description}
        </p>
      </ClayCard>
    </motion.div>
  );
}
