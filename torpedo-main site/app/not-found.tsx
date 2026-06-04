import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="max-w-md w-full text-center">
        <p className="text-torpedo-orange font-bold text-sm uppercase tracking-widest mb-2">
          Error 404
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-torpedo-dark tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-torpedo-gray text-base md:text-lg leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button href="/" variant="light-secondary">
          Back to home
        </Button>
      </div>
    </main>
  );
}
