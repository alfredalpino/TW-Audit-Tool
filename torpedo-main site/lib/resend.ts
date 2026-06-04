import { Resend } from 'resend';

/**
 * Resend client for sending emails. Uses RESEND_API_KEY from env.
 * Replace `re_xxxxxxxxx` in .env with your real Resend API key from https://resend.com
 */
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;
