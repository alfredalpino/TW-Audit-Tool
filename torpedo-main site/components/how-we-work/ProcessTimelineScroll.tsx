'use client';

/**
 * Vertical process rail: line draws on scroll (ScrollTrigger + scaleY); phase nodes pop in.
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProcessPhase } from '@/lib/process-phases';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = { phases: ProcessPhase[] };

export function ProcessTimelineScroll({ phases }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const n = phases.length;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set(line, { scaleY: 1 });
      nodesRef.current.forEach((el) => {
        if (el) gsap.set(el, { scale: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        },
      );

      nodesRef.current.forEach((node) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { scale: 0 },
          {
            scale: 1,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: node,
              start: 'top 88%',
              end: 'top 58%',
              scrub: 0.45,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, [n]);

  return (
    <section
      ref={sectionRef}
      className="timeline-section relative border-t border-[var(--border)] bg-[var(--bg-base)] py-16 md:py-24"
      aria-label="Process phases timeline"
    >
      <div className="tw-section relative">
        <div
          ref={lineRef}
          className="timeline-line pointer-events-none absolute left-10 top-8 bottom-8 z-0 w-1 origin-top -translate-x-1/2 rounded-full bg-[var(--brand)] md:top-10 md:bottom-10"
          style={{ transform: 'scaleY(0)' }}
        />

        <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-6 gap-y-6 md:grid-cols-[40px_minmax(0,1fr)] md:gap-x-8 md:gap-y-8">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <div key={phase.phaseLabel} className="contents">
                <div
                  ref={(el) => {
                    nodesRef.current[i] = el;
                  }}
                  className="phase-node relative z-[2] flex items-start justify-center justify-self-center pt-3 md:pt-4"
                  aria-hidden
                >
                  <span className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-[var(--bg-base)] bg-[var(--brand)] md:h-5 md:w-5" />
                </div>
                <article className="tw-prose-flow flex min-h-0 min-w-0 flex-col gap-4 self-stretch rounded-[var(--card-radius)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 sm:flex-row sm:items-start md:gap-6 md:p-8">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--brand)]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)]">
                      {phase.phaseLabel}
                    </p>
                    <h3 className="tw-heading-section mt-2 font-display text-xl font-bold text-[var(--fg-primary)] md:text-2xl">
                      {phase.title}
                    </h3>
                    <p className="mt-3 text-base leading-[1.6] text-[var(--fg-secondary)]">{phase.description}</p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
