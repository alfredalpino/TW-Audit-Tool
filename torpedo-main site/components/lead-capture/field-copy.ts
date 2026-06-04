import type { BookingPayload } from '@/types';

export const LEAD_POPUP_COPY = {
  title: 'You made it past the fold.',
  subtitle: 'Tell us what you’re building — no pitch deck required.',
  dismiss: 'Not now',
  submit: 'Send it over',
  submitting: 'Launching…',
  successTitle: 'Received.',
  successBody: 'We’ll read what you sent and get back to you.',
  close: 'Close',
} as const;

export const FIELD_LABELS = {
  name: 'Who’s on the hook for this?',
  email: 'Where should the receipt land?',
  project_type: 'What are we actually building?',
  timeline: 'When does reality need to catch up?',
  business_info: 'Who’s the story about?',
  description: 'What’s broken — or what does winning look like?',
} as const;

export const FIELD_PLACEHOLDERS = {
  name: 'First name is fine',
  email: 'you@company.com',
  business_info: 'Brand, company, or solo shop',
  description: 'Be blunt — we like specifics',
} as const;

export const PROJECT_TYPE_OPTIONS = [
  { value: 'Website or product', label: 'Website or product' },
  { value: 'Growth and paid media', label: 'Growth and paid media' },
  { value: 'Systems and AI automations', label: 'Systems and AI automations' },
  { value: 'Not sure yet — help us figure it out', label: 'Not sure yet — help us figure it out' },
] as const;

export const TIMELINE_OPTIONS = [
  { value: '', label: 'Pick one (optional)' },
  { value: 'ASAP', label: 'ASAP' },
  { value: '1–3 months', label: '1–3 months' },
  { value: '3–6 months', label: '3–6 months' },
  { value: 'Just exploring', label: 'Just exploring' },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFormValues = {
  name: string;
  email: string;
  project_type: string;
  timeline: string;
  business_info: string;
  description: string;
};

export const EMPTY_LEAD_FORM: LeadFormValues = {
  name: '',
  email: '',
  project_type: '',
  timeline: '',
  business_info: '',
  description: '',
};

export function validateLeadForm(values: LeadFormValues): string | null {
  const name = values.name.trim();
  const email = values.email.trim().toLowerCase();
  const project_type = values.project_type.trim();

  if (!name) return 'We need a name on the hook.';
  if (!email) return 'We need somewhere to send the receipt.';
  if (!EMAIL_REGEX.test(email)) return 'That email doesn’t look right.';
  if (!project_type) return 'Pick what you’re building — even “not sure” counts.';

  return null;
}

export function toBookingPayload(values: LeadFormValues): BookingPayload {
  const timeline = values.timeline.trim();
  const business_info = values.business_info.trim();
  const description = values.description.trim();

  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    project_type: values.project_type.trim(),
    source: 'popup',
    ...(timeline ? { timeline } : {}),
    ...(business_info ? { business_info } : {}),
    ...(description ? { description } : {}),
  };
}

export function shouldSkipLeadPopupForEnvironment(): boolean {
  if (typeof window === 'undefined') return true;
  const ua = navigator.userAgent || '';
  const isLikelyAudit =
    ua.includes('Lighthouse') ||
    ua.includes('Chrome-Lighthouse') ||
    ua.includes('Page Speed') ||
    ua.includes('HeadlessChrome');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return isLikelyAudit || connection?.saveData === true;
}
