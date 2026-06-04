'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import X from 'lucide-react/dist/esm/icons/x.js';
import { trackEvent } from '@/lib/analytics';
import type { BookingPayload } from '@/types';
import {
  EMPTY_LEAD_FORM,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  LEAD_POPUP_COPY,
  PROJECT_TYPE_OPTIONS,
  shouldSkipLeadPopupForEnvironment,
  TIMELINE_OPTIONS,
  toBookingPayload,
  validateLeadForm,
  type LeadFormValues,
} from './field-copy';
import { isHomepagePath, wasHomepageDocumentLoad } from './homepage-load';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const POPUP_DELAY_MS = 2000;

const fieldClass =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm text-[var(--fg-primary)] transition-[border-color,box-shadow] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25';

const labelClass = 'mb-1 block text-xs font-medium tracking-tight text-[var(--fg-secondary)]';

export function LeadCapturePopup() {
  const pathname = usePathname() ?? '/';
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LeadFormValues>(EMPTY_LEAD_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      document.body.classList.remove('lead-popup-open');
      document.documentElement.classList.remove('lead-popup-open');
    };
  }, []);

  useEffect(() => {
    if (!mounted || shouldSkipLeadPopupForEnvironment() || !wasHomepageDocumentLoad()) return;

    const timer = window.setTimeout(() => {
      if (!isHomepagePath(window.location.pathname)) return;
      setOpen(true);
      trackEvent('lead_popup_open', { location: '/' });
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    body.classList.add('lead-popup-open');
    html.classList.add('lead-popup-open');
    return () => {
      body.classList.remove('lead-popup-open');
      html.classList.remove('lead-popup-open');
    };
  }, [open]);

  useEffect(() => {
    if (!open || success) return;
    const id = requestAnimationFrame(() => firstFieldRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [open, success]);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (open && !isHomepagePath(pathname)) {
      handleDismiss();
    }
  }, [pathname, open, handleDismiss]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleDismiss();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, handleDismiss]);

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

  const handleCloseAfterSuccess = useCallback(() => {
    setOpen(false);
    setSuccess(false);
    setForm(EMPTY_LEAD_FORM);
  }, []);

  useEffect(() => {
    if (!success) return;
    const id = window.setTimeout(handleCloseAfterSuccess, 3200);
    return () => window.clearTimeout(id);
  }, [success, handleCloseAfterSuccess]);

  const updateField = useCallback(<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || success) return;

    const validationError = validateLeadForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: BookingPayload = toBookingPayload(form);
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.');
        return;
      }

      trackEvent('lead_popup_submit', { project_type: payload.project_type });
      setSuccess(true);
    } catch {
      setError('Network hiccup. Try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  const overlayVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.22 } },
        exit: { opacity: 0, transition: { duration: 0.16 } },
      };

  const panelVariants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, scale: 0.97, y: 12 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: 'spring' as const, stiffness: 420, damping: 32 },
        },
        exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.2 } },
      };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1400] flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-4 sm:pb-4 sm:pt-5"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[var(--overlay-backdrop)] backdrop-blur-md"
            aria-label="Close dialog"
            onClick={handleDismiss}
            tabIndex={-1}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={panelVariants}
            className="relative z-10 flex max-h-[min(calc(100dvh-1.5rem),40rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgb(var(--bg-base-rgb)/0.94)] shadow-[0_24px_48px_rgba(28,25,22,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
              <div className="min-w-0 pr-1">
                <h2
                  id={titleId}
                  className="font-display text-lg font-semibold leading-snug tracking-tight text-[var(--fg-primary)]"
                >
                  {success ? LEAD_POPUP_COPY.successTitle : LEAD_POPUP_COPY.title}
                </h2>
                <p className="mt-0.5 text-xs leading-snug text-[var(--fg-secondary)]">
                  {success ? LEAD_POPUP_COPY.successBody : LEAD_POPUP_COPY.subtitle}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={success ? handleCloseAfterSuccess : handleDismiss}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--fg-secondary)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-ghost)] hover:text-[var(--fg-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/25"
                aria-label={success ? LEAD_POPUP_COPY.close : LEAD_POPUP_COPY.dismiss}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
              {success ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--fg-primary)]"
                    aria-hidden
                  >
                    ✓
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseAfterSuccess}
                    className="text-xs text-[var(--fg-tertiary)] underline-offset-4 transition-colors hover:text-[var(--fg-secondary)] hover:underline"
                  >
                    {LEAD_POPUP_COPY.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div>
                    <label htmlFor="lead-name" className={labelClass}>
                      {FIELD_LABELS.name}
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="lead-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder={FIELD_PLACEHOLDERS.name}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-email" className={labelClass}>
                      {FIELD_LABELS.email}
                    </label>
                    <input
                      id="lead-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder={FIELD_PLACEHOLDERS.email}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-project-type" className={labelClass}>
                      {FIELD_LABELS.project_type}
                    </label>
                    <select
                      id="lead-project-type"
                      name="project_type"
                      required
                      value={form.project_type}
                      onChange={(e) => updateField('project_type', e.target.value)}
                      className={`${fieldClass} cursor-pointer appearance-none pr-8`}
                    >
                      <option value="" disabled className="bg-[var(--bg-surface)] text-[var(--fg-primary)]">
                        Choose one
                      </option>
                      {PROJECT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--bg-surface)]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="lead-timeline" className={labelClass}>
                      {FIELD_LABELS.timeline}
                    </label>
                    <select
                      id="lead-timeline"
                      name="timeline"
                      value={form.timeline}
                      onChange={(e) => updateField('timeline', e.target.value)}
                      className={`${fieldClass} cursor-pointer appearance-none`}
                    >
                      {TIMELINE_OPTIONS.map((opt) => (
                        <option key={opt.value || 'empty'} value={opt.value} className="bg-[var(--bg-surface)]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="lead-business" className={labelClass}>
                      {FIELD_LABELS.business_info}
                    </label>
                    <input
                      id="lead-business"
                      name="business_info"
                      type="text"
                      value={form.business_info}
                      onChange={(e) => updateField('business_info', e.target.value)}
                      placeholder={FIELD_PLACEHOLDERS.business_info}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-description" className={labelClass}>
                      {FIELD_LABELS.description}
                    </label>
                    <textarea
                      id="lead-description"
                      name="description"
                      rows={2}
                      value={form.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder={FIELD_PLACEHOLDERS.description}
                      className={`${fieldClass} min-h-[4.5rem] resize-none`}
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-400/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200/90"
                    >
                      {error}
                    </p>
                  )}

                  <div className="mt-1 flex flex-col gap-2 border-t border-white/[0.08] pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="tw-clay-btn tw-clay-btn-brand min-h-[44px] w-full px-5 py-2.5 text-sm disabled:opacity-50"
                    >
                      {submitting ? LEAD_POPUP_COPY.submitting : LEAD_POPUP_COPY.submit}
                    </button>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="py-0.5 text-center text-xs text-[var(--fg-tertiary)] transition-colors hover:text-[var(--fg-secondary)]"
                    >
                      {LEAD_POPUP_COPY.dismiss}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
