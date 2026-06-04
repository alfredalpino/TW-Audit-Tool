'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Section from './ui/Section';
import Layers from 'lucide-react/dist/esm/icons/layers.js';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import { ClayCard } from '@/components/ui/ClayCard';
import { useContactInfo } from '@/components/ContactInfoContext';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import { services } from '@/lib/seo/services';

type ServiceItem = {
  slug: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  highlights: string[];
};

const SERVICE_SLUGS = ['web-development', 'digital-marketing', 'custom-software', 'ai-agents-automations'] as const;
const SERVICE_ICONS = [Layers, TrendingUp, Zap, Sparkles];
const CAROUSEL_KEYS = ['webDevelopment', 'digitalMarketing', 'customSoftware', 'aiAgents'] as const;

const AUTO_SCROLL_INTERVAL_MS = 4500;
const GAP_PX = 16;

function useAutoScrollCarousel<T>(items: T[], enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const advance = () => {
      if (el.offsetParent === null || el.scrollWidth <= el.clientWidth) return;
      const first = el.querySelector('[data-carousel-card]') as HTMLElement | null;
      if (!first) return;
      const cardWidth = first.offsetWidth + GAP_PX;
      const halfWidth = el.scrollWidth / 2;
      const newLeft = el.scrollLeft + cardWidth;
      if (newLeft >= halfWidth - 10) {
        el.scrollLeft = 0;
      } else {
        el.scrollTo({ left: newLeft, behavior: 'smooth' });
      }
    };

    const id = setInterval(advance, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, items.length]);

  return containerRef;
}

function ServiceCard({
  service,
  href,
  variant,
}: {
  service: ServiceItem;
  href: string;
  variant: 'desktop' | 'mobile';
}) {
  const Icon = service.icon;
  const isDesktop = variant === 'desktop';

  return (
    <Link
      href={href}
      className={`group block h-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 ${
        isDesktop ? '' : 'flex-shrink-0 w-[min(300px,82vw)] snap-center'
      }`}
      {...(isDesktop ? {} : { 'data-carousel-card': true })}
      aria-label={service.title}
    >
      <ClayCard
        as="article"
        hover
        light
        className={`relative flex h-full flex-col overflow-hidden ${
          isDesktop ? 'min-h-[380px] p-7' : 'p-5'
        }`}
      >
        <div
          className={`flex shrink-0 items-center justify-center rounded-[var(--clay-radius-sm)] border border-[var(--brand)]/15 bg-[var(--brand)]/10 text-[var(--brand)] ${
            isDesktop ? 'mb-5 h-12 w-12' : 'mb-3 h-10 w-10'
          }`}
        >
          <Icon className={isDesktop ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={1.75} aria-hidden />
        </div>
        <h3
          className={`font-display font-bold leading-tight text-[var(--fg-primary)] transition-colors group-hover:text-[var(--brand)] ${
            isDesktop ? 'text-xl' : 'text-base'
          }`}
        >
          {service.title}
        </h3>
        <p
          className={`mt-3 flex-1 leading-snug text-[var(--fg-secondary)] ${
            isDesktop ? 'text-sm leading-[1.65]' : 'text-xs'
          }`}
        >
          {service.description}
        </p>
        <ul className={`mt-4 space-y-1.5 ${isDesktop ? 'text-xs' : 'text-[0.68rem]'}`}>
          {service.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[var(--fg-secondary)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--brand)]">
          Learn more
          <ArrowRight className="h-3 w-3" strokeWidth={2.25} aria-hidden />
        </span>
      </ClayCard>
    </Link>
  );
}

const Services: React.FC = () => {
  const { t: tServices } = useTranslations('services');
  const { basePath } = useContactInfo();
  const [shouldLoopOnClient, setShouldLoopOnClient] = React.useState(false);

  const serviceItems: ServiceItem[] = SERVICE_SLUGS.map((slug, index) => {
    const key = CAROUSEL_KEYS[index]!;
    const data = services.find((s) => s.slug === slug);
    return {
      slug,
      icon: SERVICE_ICONS[index]!,
      title: tServices(`carousel.items.${key}.title`, data?.name ?? slug),
      description: tServices(`carousel.items.${key}.description`, data?.intro ?? ''),
      highlights: [1, 2, 3, 4].map((n) => tServices(`carousel.items.${key}.highlight${n}`, '')),
    };
  });

  const carouselRef = useAutoScrollCarousel(serviceItems, true);
  const mobileServices = shouldLoopOnClient ? [...serviceItems, ...serviceItems] : serviceItems;

  React.useEffect(() => {
    setShouldLoopOnClient(true);
  }, []);

  return (
    <Section id="what-we-do" className="border-t border-[var(--border)] bg-[var(--bg-base)]">
      <div className="mb-8 md:mb-14 lg:mb-16 mx-auto max-w-3xl text-center">
        <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand)] md:mb-3">
          {tServices('carousel.eyebrow', 'What We Do')}
        </span>
        <h2 className="font-display text-2xl font-bold text-[var(--fg-primary)] sm:text-3xl md:text-5xl">
          {tServices('carousel.heading', 'Four service lines. One growth stack.')}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--fg-secondary)] md:mt-4 md:text-lg">
          {tServices(
            'carousel.description',
            'Web development, digital marketing, custom software you own, and AI agents — built to work together.',
          )}
        </p>
      </div>

      <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8">
        {serviceItems.map((service) => (
          <ServiceCard
            key={service.slug}
            service={service}
            href={`${basePath}/services/${service.slug}`}
            variant="desktop"
          />
        ))}
      </div>

      <div
        ref={carouselRef}
        style={{ WebkitOverflowScrolling: 'touch' }}
        className="flex flex-nowrap gap-4 overflow-x-auto overscroll-x-contain pb-2 [-mx-4] px-4 scroll-smooth scroll-touch snap-x snap-mandatory [scrollbar-width:none] sm:[-mx-6] sm:px-6 md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {mobileServices.map((service, index) => (
          <ServiceCard
            key={`${service.slug}-${index}`}
            service={service}
            href={`${basePath}/services/${service.slug}`}
            variant="mobile"
          />
        ))}
      </div>
    </Section>
  );
};

export default Services;
