'use client';

import React from 'react';
import Button from './ui/Button';
import LazyPixelArtAnimation from './LazyPixelArtAnimation';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const Hero: React.FC = () => {
  const { locale } = useContactInfo();
  const processHref = buildPathForLocale(locale as LocaleCode, '/process');
  return (
    <section id="hero" className="relative flex min-h-screen w-full min-w-0 items-center overflow-hidden bg-[var(--bg-base)] tw-texture-void">
      {/* Background Pixel Art Layer */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <LazyPixelArtAnimation />
      </div>

      {/* Container */}
      <div className="container relative z-10 mx-auto min-w-0 max-w-7xl px-4 py-24 sm:px-6 md:px-12 md:py-28 pointer-events-none">
        <div className="flex justify-center">
          {/* Centered Hero Content (Pointer events auto to allow interaction) */}
          <div className="max-w-3xl pointer-events-auto text-center relative">
            <div
              aria-hidden
              className="absolute inset-x-4 top-8 -bottom-10 rounded-[2rem] bg-[var(--bg-base)]/72 blur-2xl md:hidden -z-10"
            />
            <h1 className="mb-8 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="block text-torpedo-dark">Built on Belief.</span>
              <span className="block text-torpedo-orange">Deployed for Growth.</span>
            </h1>

            <p className="text-lg md:text-2xl text-torpedo-dark/80 max-w-2xl leading-relaxed mb-10 font-light mx-auto">
              Web development and growth infrastructure for founders: revenue and operations systems, automation, and execution so missed leads and manual ops do not cap growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href={GOOGLE_CALENDAR_APPOINTMENT_URL}
                variant="light-brand"
                withArrow
                onClick={() => {
                  trackEvent('cta_click', {
                    cta_name: 'hero_discovery_call',
                    cta_location: 'hero',
                    destination: GOOGLE_CALENDAR_APPOINTMENT_URL,
                  });
                }}
              >
                Book a Discovery Call
              </Button>
              <Button
                href={processHref}
                variant="light-secondary"
                onClick={() => {
                  trackEvent('cta_click', {
                    cta_name: 'hero_process',
                    cta_location: 'hero',
                    destination: processHref,
                  });
                }}
              >
                Process
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20 pointer-events-none" aria-hidden>
        <span className="text-xs uppercase tracking-widest text-[var(--fg-tertiary)]">Scroll</span>
        <div className="w-[1px] h-12 bg-[var(--border)] overflow-hidden">
          <span className="block w-full h-1/2 bg-torpedo-orange animate-[torpedo-scroll_1.5s_linear_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;