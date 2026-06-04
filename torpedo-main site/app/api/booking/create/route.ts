import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';
import { createServiceClient } from '@/lib/supabase/service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { BOOKING_RATE_LIMIT } from '@/lib/constants';
import { resend } from '@/lib/resend';
import { buildInternalBookingEmail, buildClientConfirmationEmail, CLIENT_CONFIRMATION_SUBJECT } from '@/lib/email-templates';
import type { BookingPayload } from '@/types';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('booking_create', ip, BOOKING_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const [body, parseError] = await parseJsonBody<BookingPayload>(request);
  if (parseError) return parseError;

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const project_type = typeof body.project_type === 'string' ? body.project_type.trim() : '';
  const source =
    typeof body.source === 'string' && body.source.trim()
      ? body.source.trim().slice(0, 64)
      : 'web';
  if (!name || !email || !project_type) {
    return NextResponse.json(
      { error: 'Name, email, and project type are required.' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      name,
      email,
      project_type,
      timeline: body.timeline ?? null,
      business_info: body.business_info ?? null,
      description: body.description ?? null,
      scheduled_at: body.scheduled_at ?? null,
      source,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Failed to save booking.' },
      { status: 500 }
    );
  }

  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (resend && fromEmail) {
    try {
      const notifyEmail = (process.env.BOOKING_REPLY_TO ?? fromEmail).trim().toLowerCase();
      const clientEmail = email.trim().toLowerCase();
      const isSameRecipient = notifyEmail === clientEmail;

      const internalHtml = buildInternalBookingEmail({
        name,
        email,
        project_type,
        timeline: body.timeline ?? null,
        business_info: body.business_info ?? null,
        description: body.description ?? null,
        scheduled_at: body.scheduled_at ?? null,
      });

      if (!isSameRecipient) {
        await resend.emails.send({
          from: fromEmail,
          to: notifyEmail,
          replyTo: email,
          subject: `New booking: ${name} | ${project_type}`,
          html: internalHtml,
        });
      }

      const clientHtml = buildClientConfirmationEmail(name);
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: notifyEmail,
        subject: CLIENT_CONFIRMATION_SUBJECT,
        html: clientHtml,
      });
      if (error) {
        console.error('Resend customer email failed:', error);
      }
    } catch (err) {
      console.error('Resend error:', err);
    }
  }

  return NextResponse.json(
    { id: booking?.id, success: true },
    { status: 201 }
  );
}
