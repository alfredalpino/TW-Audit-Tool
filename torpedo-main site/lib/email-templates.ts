/**
 * HTML email templates for booking flow. Inline styles for email client compatibility.
 * Theme: orange #FF5500, dark #0A0A0B, gray #888888, light #F5F5F7
 */

import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { BRAND_TOKENS } from '@/lib/brand-tokens';

const BRAND = {
  orange: BRAND_TOKENS.orange,
  dark: BRAND_TOKENS.dark,
  gray: BRAND_TOKENS.gray,
  light: BRAND_TOKENS.light,
  white: BRAND_TOKENS.white,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface BookingEmailData {
  name: string;
  email: string;
  project_type: string;
  timeline?: string | null;
  business_info?: string | null;
  description?: string | null;
  scheduled_at?: string | null;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  body: string;
}

/**
 * Email sent to you (internal): new contact form inquiry.
 */
export function buildInternalContactEmail(data: ContactEmailData): string {
  const n = escapeHtml(data.name);
  const e = escapeHtml(data.email);
  const subj = data.subject ? escapeHtml(data.subject) : null;
  const phone = data.phone ? escapeHtml(data.phone) : null;
  const body = escapeHtml(data.body).replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact inquiry</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND.light}; color: ${BRAND.dark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND.light};">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background: ${BRAND.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,10,11,0.08);">
          <tr>
            <td style="background: ${BRAND.dark}; padding: 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${BRAND.orange};">New inquiry</span>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: ${BRAND.white}; line-height: 1.3;">${n}${subj ? `: ${subj}` : ''}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">NAME</span>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 500; color: ${BRAND.dark};">${n}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">EMAIL</span>
                    <p style="margin: 4px 0 0; font-size: 16px;"><a href="mailto:${e}" style="color: ${BRAND.orange}; text-decoration: none;">${e}</a></p>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">PHONE</span>
                    <p style="margin: 4px 0 0; font-size: 16px;"><a href="tel:${phone}" style="color: ${BRAND.orange}; text-decoration: none;">${phone}</a></p>
                  </td>
                </tr>
                ` : ''}
                ${subj ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">SUBJECT</span>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 500; color: ${BRAND.dark};">${subj}</p>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">MESSAGE</span>
                    <p style="margin: 8px 0 0; font-size: 15px; color: ${BRAND.dark}; line-height: 1.5;">${body}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 28px; background: ${BRAND.light}; border-top: 1px solid ${BRAND.light};">
              <p style="margin: 0; font-size: 12px; color: ${BRAND.gray};">
                Reply to this email to respond to ${n}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Email sent to you (internal): new booking notification.
 */
export function buildInternalBookingEmail(data: BookingEmailData): string {
  const n = escapeHtml(data.name);
  const e = escapeHtml(data.email);
  const pt = escapeHtml(data.project_type);
  const tl = data.timeline ? escapeHtml(data.timeline) : null;
  const slot = data.scheduled_at ? escapeHtml(data.scheduled_at) : null;
  const biz = data.business_info
    ? escapeHtml(data.business_info).replace(/\n/g, '<br/>')
    : null;
  const desc = data.description
    ? escapeHtml(data.description).replace(/\n/g, '<br/>')
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New booking</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BRAND.light}; color: ${BRAND.dark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND.light};">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background: ${BRAND.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,10,11,0.08);">
          <tr>
            <td style="background: ${BRAND.dark}; padding: 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${BRAND.orange};">New discovery call</span>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: ${BRAND.white}; line-height: 1.3;">${n}: ${pt}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">NAME</span>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 500; color: ${BRAND.dark};">${n}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">EMAIL</span>
                    <p style="margin: 4px 0 0; font-size: 16px;"><a href="mailto:${e}" style="color: ${BRAND.orange}; text-decoration: none;">${e}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">PROJECT TYPE</span>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 500; color: ${BRAND.dark};">${pt}</p>
                  </td>
                </tr>
                ${tl ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">TIMELINE</span>
                    <p style="margin: 4px 0 0; font-size: 16px; color: ${BRAND.dark};">${tl}</p>
                  </td>
                </tr>
                ` : ''}
                ${slot ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">REQUESTED SLOT</span>
                    <p style="margin: 4px 0 0; font-size: 16px; color: ${BRAND.dark};">${slot}</p>
                  </td>
                </tr>
                ` : ''}
                ${biz ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.light};">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">ABOUT YOUR BUSINESS</span>
                    <p style="margin: 8px 0 0; font-size: 15px; color: ${BRAND.dark}; line-height: 1.5;">${biz}</p>
                  </td>
                </tr>
                ` : ''}
                ${desc ? `
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.05em; color: ${BRAND.gray};">WHAT THEY WANT</span>
                    <p style="margin: 8px 0 0; font-size: 15px; color: ${BRAND.dark}; line-height: 1.5;">${desc}</p>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 28px; background: ${BRAND.light}; border-top: 1px solid ${BRAND.light};">
              <p style="margin: 0; font-size: 12px; color: ${BRAND.gray};">
                Reply to this email to respond to ${n}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/** Subject line for the client acknowledgment email. */
export const CLIENT_CONFIRMATION_SUBJECT = 'Your inquiry has been received';

/** Subject for signup verification OTP email. */
export const SIGNUP_OTP_SUBJECT = 'Your verification code';

/**
 * Verification OTP email for sign-up. Same orange+white+black theme as marketing/booking emails.
 */
export function buildVerificationOtpEmail(otp: string, name: string): string {
  const n = escapeHtml(name);
  const code = escapeHtml(otp);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #e8e8e8; color: ${BRAND.dark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #e8e8e8;">
    <tr>
      <td style="padding: 40px 20px 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 0; border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 8px 32px rgba(10,10,11,0.12);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${BRAND.white}; border: 1px solid rgba(0,0,0,0.06); border-bottom: none; border-radius: 16px 16px 0 0;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center; background: ${BRAND.dark};">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${BRAND.orange};">Verify your email</span>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: ${BRAND.white}; line-height: 1.3;">Torpedo Web</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0; height: 4px; background: ${BRAND.orange};"></td>
                </tr>
                <tr>
                  <td style="padding: 36px 32px; background: ${BRAND.white}; border-left: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06);">
                    <p style="margin: 0 0 20px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">Hi${n ? ` ${n}` : ''},</p>
                    <p style="margin: 0 0 24px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      Use this code to complete your sign-up. It expires in 10 minutes.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                      <tr>
                        <td style="background: ${BRAND.dark}; color: ${BRAND.white}; font-size: 28px; font-weight: 700; letter-spacing: 0.2em; padding: 16px 28px; border-radius: 8px;">
                          ${code}
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 14px; color: ${BRAND.gray}; line-height: 1.5;">
                      If you didn&apos;t request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: ${BRAND.light}; border: 1px solid rgba(0,0,0,0.06); border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 13px; color: ${BRAND.gray};">
                      Torpedo Web: growth infrastructure and AI-driven revenue systems.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: ${BRAND.orange}; border: 1px solid ${BRAND.orange}; border-top: 3px solid ${BRAND.orange}; border-radius: 0 0 16px 16px;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Email sent to the client: professional acknowledgment from Ubaid, Founder.
 * Confirms receipt, 24h response, reinforces positioning, thanks prospect, forward-looking close.
 */
/** Logo filename for email (PNG for broad client compatibility). */
const EMAIL_LOGO = 'email-logo.png';

function getEmailBaseUrl(): string {
  if (typeof process === 'undefined') return 'https://torpedoweb.org';
  const env = process.env as NodeJS.ProcessEnv;
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return 'https://torpedoweb.org';
}

export function buildClientConfirmationEmail(name: string): string {
  const n = escapeHtml(name);
  const baseUrlClean = getEmailBaseUrl();
  const logoUrl = `${baseUrlClean}/${EMAIL_LOGO}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your inquiry has been received</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #e8e8e8; color: ${BRAND.dark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #e8e8e8;">
    <tr>
      <td style="padding: 40px 20px 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 0; border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 8px 32px rgba(10,10,11,0.12);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${BRAND.white}; border: 1px solid rgba(0,0,0,0.06); border-bottom: none; border-radius: 16px 16px 0 0;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center; background: ${BRAND.dark};">
                    <a href="${baseUrlClean}" style="text-decoration: none; color: ${BRAND.white}; font-size: 18px; font-weight: 600; letter-spacing: 0.02em; display: inline-block;">
                      <span style="display: inline-flex; align-items: center; gap: 10px; white-space: nowrap;">
                        <img src="${logoUrl}" alt="Torpedo Web" width="40" height="40" style="display: inline-block; margin: 0; max-width: 40px; height: auto; border: 0; outline: none;" />
                        <span style="display: inline-block;">Torpedo Web</span>
                      </span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0; height: 4px; background: ${BRAND.orange};"></td>
                </tr>
                <tr>
                  <td style="padding: 36px 32px; background: ${BRAND.white}; border-left: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06);">
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      Hi${n ? ` ${n}` : ''},
                    </p>
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      Thank you for reaching out. We've received your inquiry and our team will review it and get back to you within 24 hours.
                    </p>
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      If you'd like to move faster, you can book a short free consultation to meet with us:
                    </p>
                    <p style="margin: 0 0 20px; text-align: center;">
                      <a href="${GOOGLE_CALENDAR_APPOINTMENT_URL}" style="display: inline-block; padding: 10px 18px; background: ${BRAND.orange}; color: ${BRAND.white}; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 600;">
                        Book a free consultation
                      </a>
                    </p>
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      Torpedo Web is a performance-driven digital engineering partner. We help founders build and scale custom infrastructure, high-performing sites, and systems that support revenue growth.
                    </p>
                    <p style="margin: 0; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      If there is any additional context or links you'd like to share before we talk, you can simply reply to this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 28px 32px; background: ${BRAND.light}; border: 1px solid rgba(0,0,0,0.06); border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${BRAND.dark};">Ubaid</p>
                    <p style="margin: 2px 0 0; font-size: 13px; color: ${BRAND.gray};">Founder, Torpedo Web</p>
                    <p style="margin: 12px 0 0; font-size: 13px;">
                      <a href="${baseUrlClean}" style="color: ${BRAND.orange}; text-decoration: none; font-weight: 500;">torpedoweb.org</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: ${BRAND.orange}; border: 1px solid ${BRAND.orange}; border-top: 3px solid ${BRAND.orange}; border-radius: 0 0 16px 16px;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
