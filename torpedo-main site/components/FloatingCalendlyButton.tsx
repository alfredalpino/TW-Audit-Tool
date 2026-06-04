import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Calendar from 'lucide-react/dist/esm/icons/calendar.js';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';

const HERO_SECTION_ID = 'hero';

/**
 * Fixed "Book a Discovery Call" CTA in bottom-right corner (Google Calendar).
 * Visible only when the hero section has scrolled out of view; hidden while user is on the hero.
 */
const FloatingCalendlyButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === 'undefined') return;
    const hero = document.getElementById(HERO_SECTION_ID);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [mounted]);

  const showButton = mounted && !heroInView;

  const button = (
    <motion.div
      initial={false}
      animate={{
        opacity: showButton ? 1 : 0,
        scale: showButton ? 1 : 0.9,
        pointerEvents: showButton ? 'auto' : 'none',
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-[9998] sm:bottom-8 sm:right-8"
      aria-hidden={!showButton}
    >
      <Button
        href={GOOGLE_CALENDAR_APPOINTMENT_URL}
        variant="light-brand"
        className="rounded-clay-sm"
        aria-label="Book a Discovery Call (opens in new tab)"
        aria-hidden={!showButton}
        tabIndex={showButton ? 0 : -1}
      >
        <Calendar className="w-5 h-5 flex-shrink-0" aria-hidden />
        Book a Discovery Call
      </Button>
    </motion.div>
  );

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(button, document.body);
};

export default FloatingCalendlyButton;
