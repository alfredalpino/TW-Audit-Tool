'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Search, X } from 'lucide-react';
import {
  type LanguageOption,
  buildPathForLocale,
  getDefaultCountryForLocale,
  getLanguageOptionForLocale,
  getLanguagesForPicker,
  getLocaleFromPathname,
  writeLocaleCookies,
} from '@/lib/i18n/config';
import { trackLocaleSwitch } from '@/lib/i18n/analytics';
import { useTranslations } from '@/components/i18n/LocaleProvider';

const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type RegionSelectorProps = {
  open: boolean;
  onClose: () => void;
  /** Element to restore focus when the modal closes */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function RegionSelector({ open, onClose, returnFocusRef }: RegionSelectorProps) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { t: tCommon } = useTranslations('common');
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeLocale = getLocaleFromPathname(pathname);
  const activeLanguage = getLanguageOptionForLocale(activeLocale);

  const languages = useMemo(() => getLanguagesForPicker(query), [query]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    body.classList.add('region-selector-open');
    html.classList.add('region-selector-open');
    return () => {
      body.classList.remove('region-selector-open');
      html.classList.remove('region-selector-open');
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setFocusedIndex(0);
      return;
    }
    const id = requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let dialog: HTMLDivElement | null = null;
    let handleKeyDown: (e: KeyboardEvent) => void = () => {};
    const t = setTimeout(() => {
      dialog = dialogRef.current;
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
  }, [open]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      const id = setTimeout(() => returnFocusRef?.current?.focus({ preventScroll: true }), 0);
      wasOpenRef.current = open;
      return () => clearTimeout(id);
    }
    wasOpenRef.current = open;
  }, [open, returnFocusRef]);

  useEffect(() => {
    setFocusedIndex((prev) => {
      if (languages.length === 0) return 0;
      return Math.min(prev, languages.length - 1);
    });
  }, [languages.length]);

  const selectLanguage = useCallback(
    (language: LanguageOption) => {
      const countryId = getDefaultCountryForLocale(language.locale).id;
      trackLocaleSwitch(activeLocale, language.locale, countryId);
      writeLocaleCookies(countryId, language.locale);
      const nextPath = buildPathForLocale(language.locale, pathname);
      onClose();
      if (nextPath !== pathname) {
        router.push(nextPath);
      }
    },
    [activeLocale, onClose, pathname, router],
  );

  const moveFocus = useCallback(
    (delta: number) => {
      if (languages.length === 0) return;
      setFocusedIndex((prev) => {
        const next = (prev + delta + languages.length) % languages.length;
        itemRefs.current[next]?.focus({ preventScroll: true });
        itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    },
    [languages.length],
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (languages.length > 0) {
        itemRefs.current[focusedIndex]?.focus({ preventScroll: true });
      }
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        searchRef.current?.focus({ preventScroll: true });
      } else {
        moveFocus(-1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
      itemRefs.current[0]?.focus({ preventScroll: true });
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = languages.length - 1;
      setFocusedIndex(last);
      itemRefs.current[last]?.focus({ preventScroll: true });
    }
  };

  if (!mounted) return null;

  const overlayVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.22 } }, exit: { opacity: 0, transition: { duration: 0.16 } } };

  const panelVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 16, scale: 0.985 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const } },
        exit: { opacity: 0, y: 10, scale: 0.99, transition: { duration: 0.18 } },
      };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="region-selector-root"
          className="fixed inset-0 z-[1300] flex items-end justify-center sm:items-center sm:p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.button
            type="button"
            aria-label={tCommon('regionSelectorCloseOverlay', 'Close language selector')}
            className="absolute inset-0 z-0 cursor-default bg-[rgb(var(--bg-void-rgb)/0.88)] backdrop-blur-md"
            variants={overlayVariants}
            onClick={onClose}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="region-selector-title"
            aria-describedby="region-selector-description"
            className="relative z-10 flex max-h-[min(100dvh,920px)] w-full max-w-3xl flex-col overflow-hidden tw-clay-card sm:max-h-[min(88dvh,820px)] sm:rounded-[calc(var(--card-radius)+6px)]"
            variants={panelVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_80%_70%_at_50%_-20%,rgba(255,78,0,0.12),transparent_70%)]" aria-hidden />

            <header className="relative shrink-0 border-b border-[var(--border)] px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--brand)]">
                    {tCommon('languageEyebrow', 'Language')}
                  </p>
                  <h2 id="region-selector-title" className="font-display text-xl font-bold tracking-tight text-[var(--fg-primary)] sm:text-2xl">
                    {tCommon('languageSelectorTitle', 'Choose your language')}
                  </h2>
                  <p id="region-selector-description" className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--fg-secondary)]">
                    {tCommon(
                      'languageSelectorDescription',
                      'Select a language to view Torpedo Web in the translation best suited to you.',
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="tw-clay-btn-icon inline-flex h-10 w-10 shrink-0 items-center justify-center text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                  aria-label={tCommon('close', 'Close')}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <label htmlFor="region-selector-search" className="sr-only">
                {tCommon('searchLanguagesLabel', 'Search languages')}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-tertiary)]" aria-hidden />
                <input
                  ref={searchRef}
                  id="region-selector-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={tCommon('searchLanguagesPlaceholder', 'Search language')}
                  autoComplete="off"
                  spellCheck={false}
                  className="tw-clay-input min-h-[48px] w-full bg-[var(--bg-surface)] py-3 pl-10 pr-4 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                />
              </div>
            </header>

            <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-6">
              {languages.length === 0 ? (
                <p className="py-10 text-center text-sm text-[var(--fg-tertiary)]">
                  {tCommon('languageNoResults', 'No languages match your search.')}
                </p>
              ) : (
                <ul
                  className="divide-y divide-[var(--border)] rounded-[var(--card-radius)] border border-[var(--border)] bg-[var(--bg-surface)]/40"
                  role="listbox"
                  aria-label={tCommon('languageListLabel', 'Languages')}
                >
                  {languages.map((language, index) => {
                    const isActive = activeLanguage.id === language.id;
                    const isFocused = focusedIndex === index;

                    return (
                      <li key={language.id}>
                        <button
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          tabIndex={isFocused ? 0 : -1}
                          onFocus={() => setFocusedIndex(index)}
                          onKeyDown={(e) => handleItemKeyDown(e, index)}
                          onClick={() => selectLanguage(language)}
                          className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition sm:px-5 sm:py-4 ${
                            isActive
                              ? 'bg-[var(--brand)]/10'
                              : 'hover:bg-[var(--bg-muted)]/60 focus-visible:bg-[var(--bg-muted)]/60'
                          } focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]`}
                        >
                          <span className="min-w-0 text-sm font-medium text-[var(--fg-primary)] sm:text-[15px]">
                            {language.label}
                          </span>
                          {isActive ? (
                            <Check className="h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden />
                          ) : (
                            <span className="sr-only">
                              {tCommon('languageSelectOption', 'Select')} {language.label}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export default RegionSelector;
