import React from 'react';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { MarkdownProse } from '@/components/MarkdownProse';
import { BackToHomeLinkSm } from '@/components/BackToHomeLink';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/dmca', locale, 'dmca');
}

function getDmcaContent(): string {
  const filePath = path.join(process.cwd(), 'public', 'dmca.md');
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

export default function EnInDmcaPage() {
  const content = getDmcaContent();

  return (
    <main id="main-content" className="flex flex-col w-full pt-20 min-h-screen">
      <article className="container mx-auto px-6 md:px-12 max-w-3xl pt-12 md:pt-16 pb-20 md:pb-24">
        <BackToHomeLinkSm />
        {content ? (
          <MarkdownProse content={content} />
        ) : (
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-torpedo-dark tracking-tight mb-3">
              DMCA Policy
            </h1>
            <p className="text-torpedo-gray">Content unavailable.</p>
          </header>
        )}
      </article>
    </main>
  );
}
