import { Resend } from "resend";

/**
 * Resend client for transactional email. Uses RESEND_API_KEY from env.
 * Get a key at https://resend.com (free tier: 100 emails/day).
 */
const apiKey = process.env.RESEND_API_KEY?.trim();
export const resend = apiKey ? new Resend(apiKey) : null;

/** From address for audit report emails (falls back to main-site booking var). */
export function getResendFromAddress(): string | null {
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.BOOKING_FROM_EMAIL?.trim();
  return from || null;
}

export function getResendClient(): Resend | null {
  return resend;
}

export function isEmailConfigured(): boolean {
  return !!resend && !!getResendFromAddress();
}
