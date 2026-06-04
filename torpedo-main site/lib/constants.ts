export const ROLES = ['admin', 'team', 'client'] as const;
export type AppRole = (typeof ROLES)[number];

/** Allowed email domain for admin sign-in and auth callback (e.g. @torpedoweb.org). */
export const ADMIN_EMAIL_DOMAIN = '@torpedoweb.org';

/** Public contact info for footer, schema, and booking (default / US). */
export const CONTACT_PHONE = '+1 (808) 3018338';
export const CONTACT_PHONE_TEL = 'tel:+18083018338';
export const CONTACT_EMAIL = 'hello@torpedoweb.org';
export const CONTACT_ADDRESS = '8 The Green, Suite B, Dover, Delaware, USA-19901';

/** Google Calendar appointment scheduling — TorpedoWeb Discovery Call (public booking page). */
export const GOOGLE_CALENDAR_APPOINTMENT_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2u5zwDGc4tZMwvrltp0naFPFBh16oCo03NnFZoitMzY31I4QvqW_YIa8nRKX92mabsA-lC8Eyx';
/** Public booking shortlink that redirects via `book.torpedoweb.org`. */
export const BOOKING_SHORT_URL = 'https://book.torpedoweb.org';

/** Same schedule in embed mode for iframes (`?gv=true`). */
export const GOOGLE_CALENDAR_APPOINTMENT_EMBED_URL = `${GOOGLE_CALENDAR_APPOINTMENT_URL}?gv=true`;

/** Indian numbers: one entry per line, each with its own tel: link (never combine in one string). */
export const CONTACT_INDIA_PHONES = [
  { label: '+91 9889301201', tel: 'tel:+919889301201' },
] as const;

/** India (en-in) contact info. */
export const CONTACT_INDIA = {
  /** @deprecated use CONTACT_INDIA_PHONES — kept for clarity in context mapping */
  phone: CONTACT_INDIA_PHONES[0].label,
  phoneTel: CONTACT_INDIA_PHONES[0].tel,
  phoneSecondary: null,
  phoneSecondaryTel: null,
  email: CONTACT_EMAIL,
  address: '616/145, Sitapur Rd, Aziz Nagar, Madiyanva, Lucknow, Uttar Pradesh 226021',
} as const;

export const PREVIEW_TOKEN_LENGTH = 6;
export const PREVIEW_TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const PREVIEW_JWT_TTL_SEC = 30 * 60; // 30 minutes
export const PREVIEW_VALIDATE_RATE_LIMIT = { windowMs: 15 * 60 * 1000, max: 10 };
export const PREVIEW_PROXY_RATE_LIMIT = { windowMs: 60 * 1000, max: 60 };
export const BOOKING_RATE_LIMIT = { windowMs: 60 * 1000, max: 5 };
export const CONTACT_RATE_LIMIT = { windowMs: 60 * 1000, max: 5 };
export const SIGNUP_OTP_RATE_LIMIT = { windowMs: 60 * 1000, max: 3 };
export const CHAT_CREATE_LEAD_RATE_LIMIT = { windowMs: 60 * 1000, max: 5 };
export const CHAT_SEND_RATE_LIMIT = { windowMs: 60 * 1000, max: 30 };
export const CHAT_MESSAGES_RATE_LIMIT = { windowMs: 60 * 1000, max: 120 };
export const CHAT_REQUEST_AGENT_RATE_LIMIT = { windowMs: 60 * 1000, max: 10 };
export const CHAT_TYPING_RATE_LIMIT = { windowMs: 60 * 1000, max: 60 };

/** Minutes of inactivity before a new lead is considered offline in CRM status. */
export const CRM_NEW_LEAD_IDLE_MINUTES = 15;

/** Google Analytics 4 measurement ID (public; embedded in gtag.js). */
export const GA_MEASUREMENT_ID = 'G-SNLMV0LRYD';
