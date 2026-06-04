import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, className = '', id, noPadding = false }) => {
  return (
    <section
      id={id}
      className={`relative w-full min-w-0 max-w-full overflow-x-clip ${noPadding ? '' : 'py-12 md:py-24 lg:py-32'} ${className}`}
    >
      <div className="container mx-auto min-w-0 max-w-7xl px-4 sm:px-6 md:px-12">
        {children}
      </div>
    </section>
  );
};

export default Section;