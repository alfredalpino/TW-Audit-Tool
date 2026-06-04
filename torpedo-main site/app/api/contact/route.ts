import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { CONTACT_RATE_LIMIT } from '@/lib/constants';
import { resend } from '@/lib/resend';
import { buildInternalContactEmail, buildClientConfirmationEmail, CLIENT_CONFIRMATION_SUBJECT } from '@/lib/email-templates';
import type { ContactPayload } from '@/types';

const INTERNAL_EMAIL = 'hello@torpedoweb.org';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('contact_submit', ip, CONTACT_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const [body, parseError] = await parseJsonBody<ContactPayload>(request);
  if (parseError) return parseError;

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
  const subject = typeof body.subject === 'string' ? body.subject.trim() : undefined;
  const messageBody = typeof body.body === 'string' ? body.body.trim() : '';

  if (!name || !email || !messageBody) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    );
  }

  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (resend && fromEmail) {
    try {
      const internalHtml = buildInternalContactEmail({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        body: messageBody,
      });

      const emailSubject = subject ? `Contact: ${subject} | ${name}` : `Contact: ${name}`;
      await resend.emails.send({
        from: fromEmail,
        to: INTERNAL_EMAIL,
        replyTo: email,
        subject: emailSubject,
        html: internalHtml,
      });

      const clientHtml = buildClientConfirmationEmail(name);
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: INTERNAL_EMAIL,
        subject: CLIENT_CONFIRMATION_SUBJECT,
        html: clientHtml,
      });
      if (error) {
        console.error('Resend customer acknowledgment failed:', error);
      }
    } catch (err) {
      console.error('Resend contact error:', err);
      return NextResponse.json(
        { error: 'Failed to send message. Try again later.' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: true },
    { status: 201 }
  );
}
