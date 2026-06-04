import React from 'react';
import Section from './ui/Section';

const Philosophy: React.FC = () => {
  return (
    <Section id="philosophy" className="bg-torpedo-orange text-white py-12 md:py-24 lg:py-28 flex items-center justify-center relative overflow-hidden">
      {/* Content */}
      <div className="max-w-5xl mx-auto text-center relative z-10 pointer-events-none px-2">
        <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          Web development stays. <br className="hidden md:block" />
          Automation leads.
          Systems define the brand.
        </p>
      </div>
    </Section>
  );
};

export default Philosophy;