'use client';

import React from 'react';
import Section from './ui/Section';
import Calendar from 'lucide-react/dist/esm/icons/calendar.js';
import Button from './ui/Button';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

const Contact: React.FC = () => {
  return (
    <Section id="start" className="bg-[var(--bg-surface)] tw-texture-surface">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 md:mb-12">
          <h2 className="mb-4 text-2xl font-bold text-torpedo-dark sm:mb-6 sm:text-3xl md:text-4xl lg:text-6xl">
            Start with a Web Development Strategy Call
          </h2>
          <p className="text-torpedo-gray text-base md:text-xl max-w-2xl mx-auto">
            Not a quote request. A conversation. We map goals, bottlenecks, and where automation helps. Audits and discovery on request.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            href={GOOGLE_CALENDAR_APPOINTMENT_URL}
            variant="light-brand"
            size="lg"
            className="w-full px-6 py-4 text-lg sm:w-auto sm:px-10 sm:py-6 sm:text-xl md:px-16 md:py-8 md:text-2xl"
            onClick={() =>
              trackEvent('cta_click', {
                cta_name: 'contact_discovery_call',
                cta_location: 'contact_section',
                destination: GOOGLE_CALENDAR_APPOINTMENT_URL,
              })
            }
          >
            <Calendar className="w-6 h-6 md:w-8 md:h-8" aria-hidden />
            Book a Discovery Call
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
