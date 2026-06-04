'use client';

import Link from 'next/link';
import { GOOGLE_CALENDAR_APPOINTMENT_EMBED_URL, GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

export function BookingWidget() {
  const embedUrl =
    typeof process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL === 'string' &&
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL.length > 0
      ? process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL
      : GOOGLE_CALENDAR_APPOINTMENT_EMBED_URL;

  const openUrl = GOOGLE_CALENDAR_APPOINTMENT_URL;

  return (
    <div className="w-full" role="region" aria-label="Schedule a discovery call">
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-torpedo-gray">Book a time</p>
        <p className="mt-1 text-lg font-medium text-torpedo-dark">TorpedoWeb Discovery Call</p>
      </div>
      {/* Google Calendar Appointment Scheduling */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_8px_30px_-12px_rgba(10,10,11,0.1)]">
        <iframe
          title="TorpedoWeb Discovery Call: Google Calendar booking"
          src={embedUrl}
          width="100%"
          height={600}
          className="w-full border-0"
          frameBorder={0}
          loading="lazy"
          allow="fullscreen; geolocation; microphone; camera"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="mt-4 text-center text-sm text-torpedo-gray">
        Prefer a new window?{' '}
        <Link
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('cta_click', {
              cta_name: 'booking_widget_open_calendar',
              cta_location: 'booking_widget',
              destination: openUrl,
            })
          }
          className="font-medium text-torpedo-orangeDark underline decoration-torpedo-orange/40 underline-offset-2 transition-colors hover:text-torpedo-orange"
        >
          Open calendar in a new tab
        </Link>
        .
      </p>
    </div>
  );
}
