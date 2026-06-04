'use client';

import React from 'react';
import Section from './ui/Section';
import { useContactInfo } from '@/components/ContactInfoContext';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonialsIN: Testimonial[] = [
  {
    quote: "We were losing leads due to a slow, outdated website. Within 3 weeks of launch, our inbound conversions improved by ~28% and bounce rate dropped significantly.",
    author: "Founder",
    role: "D2C Brand",
    company: "Mumbai"
  },
  {
    quote: "Most agencies focus on design. These guys fixed our entire funnel architecture. The site now loads under 2 seconds and actually converts traffic into revenue.",
    author: "Owner",
    role: "Local Service Business",
    company: "Delhi NCR"
  },
  {
    quote: "Clear communication, fast execution, and no unnecessary complexity. The backend automation alone saved us 10–12 hours per week.",
    author: "Co-Founder",
    role: "Startup",
    company: "Bangalore"
  },
  {
    quote: "We finally have a website that reflects our positioning. Clean, fast, and built for scale. It feels like an asset, not an expense.",
    author: "Founder",
    role: "Consulting Firm",
    company: "Hyderabad"
  }
];

const testimonialsUS: Testimonial[] = [
  {
    quote: "Our previous site looked good but didn’t convert. After the rebuild, demo bookings increased by ~35% within the first month.",
    author: "Founder",
    role: "SaaS Startup",
    company: "San Francisco"
  },
  {
    quote: "They approached the project like engineers, not designers. Everything from load speed to funnel flow was optimized for revenue.",
    author: "CEO",
    role: "Ecommerce Brand",
    company: "Austin"
  },
  {
    quote: "We cut page load time from 5.2s to under 2s. That alone had a measurable impact on paid ad performance.",
    author: "Growth Lead",
    role: "D2C Brand",
    company: "New York"
  },
  {
    quote: "Execution speed was the differentiator. What usually takes months was shipped in weeks without compromising quality.",
    author: "Co-Founder",
    role: "Tech Startup",
    company: "Seattle"
  },
  {
    quote: "The biggest win was clarity. Our messaging, structure, and UX now actually guide users to take action.",
    author: "Founder",
    role: "Consulting Firm",
    company: "Chicago"
  },
  {
    quote: "We finally have a scalable web system instead of a static website. It integrates seamlessly with our marketing stack.",
    author: "Head of Marketing",
    role: "B2B Company",
    company: "Los Angeles"
  }
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="tw-clay-card tw-clay-card--hover h-full p-5 md:p-8 flex flex-col">
      <div className="mb-4 md:mb-6 flex-1">
        <svg className="w-7 h-7 md:w-10 md:h-10 text-torpedo-orange mb-3 md:mb-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p className="text-sm sm:text-base md:text-lg text-torpedo-dark leading-relaxed font-light line-clamp-6 md:line-clamp-7">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
      <div className="border-t border-[var(--border)] pt-4 md:pt-6">
        <p className="font-bold text-torpedo-dark text-sm md:text-lg">
          {testimonial.author}
        </p>
        <p className="text-xs md:text-sm text-torpedo-gray">
          {testimonial.role} of {testimonial.company}
        </p>
      </div>
    </div>
  );
}

const QuoteCarousel: React.FC = () => {
  const { basePath } = useContactInfo();
  const [shouldLoopOnClient, setShouldLoopOnClient] = React.useState(false);
  const isIndianVariant = basePath === '/en-in';
  const testimonials = isIndianVariant ? testimonialsIN : testimonialsUS;
  const loopedTestimonials = shouldLoopOnClient ? [...testimonials, ...testimonials] : testimonials;

  React.useEffect(() => {
    setShouldLoopOnClient(true);
  }, []);

  return (
    <Section className="bg-[var(--bg-surface)] tw-texture-surface py-8 md:py-24 overflow-hidden" id="testimonials">
      <div className="mb-6 md:mb-12 text-center">
        <span className="text-torpedo-orange font-bold uppercase tracking-wider text-xs md:text-sm mb-1 md:mb-2 block">Testimonials</span>
        <h2 className="text-xl font-bold text-torpedo-dark sm:text-2xl md:text-5xl">
          What Our Clients Say
        </h2>
      </div>

      <div className="relative overflow-hidden" aria-roledescription="carousel" aria-label="Scrolling client testimonials">
        <div className="overflow-hidden">
          <div className="flex items-stretch gap-4 md:gap-8 w-max will-change-transform [backface-visibility:hidden] animate-[torpedo-marquee_58s_linear_infinite]">
            {loopedTestimonials.map((testimonial, index) => (
              <div key={`a-${index}`} className="flex-shrink-0 h-[300px] w-[min(240px,calc(100vw-3rem))] sm:h-[340px] sm:w-[300px] md:h-[390px] md:w-[400px]">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default QuoteCarousel;
