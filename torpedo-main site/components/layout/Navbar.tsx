'use client';

/**
 * Primary marketing navigation: scroll-reactive shell, GSAP logo pulse, Framer mobile overlay.
 * Conversion purpose: persistent path to booking and key funnel pages without visual noise.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useContactInfo } from '@/components/ContactInfoContext';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import { getMarketingPageKeyFromPathname } from '@/lib/i18n/localized-slugs';
import { BOOKING_SHORT_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

type NavKey = 'services' | 'process' | 'systems' | 'blog' | null;

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function activeNavFromPath(pathname: string | null): NavKey {
  if (!pathname) return null;
  if (/\/portfolio(\/|$)/.test(pathname) || /\/plans(\/|$)/.test(pathname)) return 'systems';
  const pageKey = getMarketingPageKeyFromPathname(pathname);
  if (pageKey === 'services' || pageKey === 'what-we-do') return 'services';
  if (pageKey === 'process') return 'process';
  if (pageKey === 'systems') return 'systems';
  if (pageKey === 'blog') return 'blog';
  return null;
}

export default function Navbar() {
  const isScrolled = useScrollPosition(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { basePath, locale } = useContactInfo();
  const localeCode = locale as LocaleCode;
  const { t: tNav } = useTranslations('nav');
  const logoMarkRef = useRef<HTMLSpanElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (mobileOpen) {
      body.classList.add('mobile-menu-open');
      html.classList.add('mobile-menu-open');
    } else {
      body.classList.remove('mobile-menu-open');
      html.classList.remove('mobile-menu-open');
    }
    return () => {
      body.classList.remove('mobile-menu-open');
      html.classList.remove('mobile-menu-open');
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !mobileOpen) {
      const id = setTimeout(() => menuToggleRef.current?.focus({ preventScroll: true }), 0);
      wasOpenRef.current = mobileOpen;
      return () => clearTimeout(id);
    }
    wasOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const id = requestAnimationFrame(() => {
      const dialog = menuDialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusables[0]?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    let dialog: HTMLDivElement | null = null;
    let handleKeyDown: (e: KeyboardEvent) => void = () => {};
    const t = setTimeout(() => {
      dialog = menuDialogRef.current;
      if (!dialog) return;
      handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const focusables = Array.from(dialog!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
          (el) => el.getClientRects().length > 0 && el.getAttribute('aria-hidden') !== 'true',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const target = e.target as HTMLElement;
        if (e.shiftKey) {
          if (target === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (target === last) {
          e.preventDefault();
          first.focus();
        }
      };
      dialog.addEventListener('keydown', handleKeyDown);
    }, 0);
    return () => {
      clearTimeout(t);
      if (dialog) dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const navActive = activeNavFromPath(pathname);

  const navLinks: { name: string; href: string; key: NavKey }[] = [
    { name: tNav('services', 'Services'), href: buildPathForLocale(localeCode, '/services'), key: 'services' },
    { name: tNav('process', 'Process'), href: buildPathForLocale(localeCode, '/process'), key: 'process' },
    { name: tNav('systems', 'Systems'), href: buildPathForLocale(localeCode, '/systems'), key: 'systems' },
    { name: tNav('blog', 'Blog'), href: buildPathForLocale(localeCode, '/blog'), key: 'blog' },
  ];

  const pulseLogo = () => {
    const el = logoMarkRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.remove('tw-logo-pulse');
    el.classList.add('tw-logo-pulse');
    el.addEventListener(
      'animationend',
      () => el.classList.remove('tw-logo-pulse'),
      { once: true },
    );
  };

  const closeMenu = useCallback(() => setMobileOpen(false), []);
  const toggleMenu = useCallback(() => setMobileOpen((v) => !v), []);

  const scrolledClass = isScrolled
    ? 'tw-nav-glass border-b border-[var(--border)]'
    : 'border-b border-[var(--border)] bg-[var(--bg-void)]';

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 h-[var(--nav-h)] transition-[background,box-shadow,border-color,backdrop-filter] duration-300 ${scrolledClass} ${
        mobileOpen ? 'z-[1200]' : ''
      }`}
      aria-label="Primary"
    >
      <div className="tw-section flex h-full items-center justify-between">
        <Link
          href={basePath || '/'}
          className="tw-nav-logo-offset relative z-[60] flex items-center gap-2"
          onMouseEnter={pulseLogo}
          aria-label="Torpedo Web home"
        >
          <span ref={logoMarkRef} className="inline-flex shrink-0" aria-hidden>
            <Image src="/logo.svg" alt="" width={32} height={32} className="h-7 w-7 min-[769px]:h-8 min-[769px]:w-8" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-[var(--fg-primary)] min-[380px]:text-base min-[769px]:text-xl">
            TORPEDO WEB
          </span>
        </Link>

        <div className="tw-nav-desktop-cluster hidden min-[769px]:flex min-[769px]:items-center min-[769px]:gap-8">
          {navLinks.map((link) => {
            const isOn = navActive === link.key;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative font-sans text-[13px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  isOn ? 'text-[var(--brand)]' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-[var(--brand)] transition-transform duration-300 ease-out ${
                    isOn ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  aria-hidden
                />
              </Link>
            );
          })}
          <Button
            href={BOOKING_SHORT_URL}
            variant="nav"
            size="sm"
            className="text-[13px] font-medium uppercase tracking-[0.08em]"
            data-cta="navbar_book_meet"
            data-cta-location="navbar_desktop"
          >
            {tNav('bookMeet', 'Book a Meet')}
            <ArrowRight className="ms-1 h-4 w-4" aria-hidden />
          </Button>
          <ThemeToggle size="nav" className="ms-1 shrink-0" />
        </div>

        <ThemeToggle size="nav" className="shrink-0 min-[769px]:hidden" />

        <button
          ref={menuToggleRef}
          type="button"
          className="tw-clay-btn-icon flex h-11 w-11 min-[769px]:hidden items-center justify-center p-2 text-[var(--fg-primary)]"
          onClick={toggleMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          aria-haspopup="dialog"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {mobileOpen ? (
              <motion.div
                className="fixed inset-0 z-[1500] min-[769px]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  className="absolute inset-0 z-0 h-full w-full cursor-pointer bg-[rgb(var(--bg-void-rgb)/0.85)] backdrop-blur-sm"
                  aria-label="Close menu overlay"
                  onClick={closeMenu}
                />
                <motion.div
                  ref={menuDialogRef}
                  id="mobile-nav-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation menu"
                  className="absolute inset-0 z-10 flex h-full w-full flex-col overflow-y-auto overscroll-contain bg-[var(--bg-void)]"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 md:px-12">
                    <Link href={basePath || '/'} className="flex items-center gap-2" onClick={closeMenu}>
                      <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
                      <span className="font-display text-lg font-bold tracking-tight">TORPEDO WEB</span>
                    </Link>
                    <button
                      type="button"
                      className="tw-clay-btn-icon flex min-h-[44px] min-w-[44px] items-center justify-center"
                      aria-label="Close menu"
                      onClick={closeMenu}
                    >
                      <X className="h-6 w-6" aria-hidden />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 md:px-12">
                    <div className="flex w-full max-w-md flex-col items-center text-center">
                      {navLinks.map((link, i) => {
                        const isOn = navActive === link.key;
                        return (
                          <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                          >
                            <Link
                              href={link.href}
                              onClick={closeMenu}
                              className={`block w-full border-b border-[var(--border)] py-4 text-center font-display text-2xl font-semibold tracking-tight ${
                                isOn ? 'text-[var(--brand)]' : 'text-[var(--fg-primary)]'
                              }`}
                            >
                              {link.name}
                            </Link>
                          </motion.div>
                        );
                      })}
                      <Button
                        href={BOOKING_SHORT_URL}
                        variant="brand"
                        fullWidth
                        withArrow
                        className="mt-8 max-w-xs"
                        data-cta="navbar_book_meet"
                        data-cta-location="navbar_mobile"
                        onClick={closeMenu}
                      >
                        {tNav('bookMeet', 'Book a Meet')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </nav>
  );
}
