import React from 'react';
import Section from './ui/Section';

const WhoWeAre: React.FC = () => {
  return (
    <Section className="bg-[var(--bg-surface)] tw-texture-surface">
      <div className="grid min-w-0 grid-cols-1 items-start gap-8 md:gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="min-w-0 lg:col-span-4">
          <h2 className="mb-3 text-2xl font-bold text-torpedo-dark sm:text-3xl md:mb-4 md:text-4xl">
            Web Development and Growth Infrastructure Partner
          </h2>
          <div className="h-1 w-20 bg-torpedo-orange mb-4 md:mb-6"></div>
        </div>
        
        <div className="min-w-0 space-y-5 md:space-y-8 lg:col-span-8">
          <p className="text-lg md:text-2xl text-torpedo-dark font-light leading-relaxed">
            We're a growth infrastructure partner, not a generic web agency. We build revenue and operations systems: web, automation, and execution. Websites and apps are the foundation; automation scales them.
          </p>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            Retainers, system setup, and ongoing optimization for founders and operators who want systems that perform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 pt-6 md:pt-8 border-t border-[var(--border)]">
            <div>
              <h3 className="font-bold text-torpedo-dark mb-2">System-led, not project-led</h3>
              <p className="text-sm text-[var(--fg-secondary)]">Ongoing engagement. Setup plus optimization so your systems keep performing.</p>
            </div>
            <div>
              <h3 className="font-bold text-torpedo-dark mb-2">Outcome-focused</h3>
              <p className="text-sm text-[var(--fg-secondary)]">Outcomes: more leads, fewer missed follow-ups, less manual ops.</p>
            </div>
            <div>
              <h3 className="font-bold text-torpedo-dark mb-2">Transparent</h3>
              <p className="text-sm text-[var(--fg-secondary)]">Clear scope, honest timelines, conversations. No instant quotes.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WhoWeAre;