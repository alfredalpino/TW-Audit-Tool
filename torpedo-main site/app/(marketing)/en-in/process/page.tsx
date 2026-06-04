import type { Metadata } from 'next';
import { ProcessPageContent } from '@/components/ProcessPageContent';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/process', locale, 'process');
}

export default function EnInProcessPage() {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col">
      <ProcessPageContent />
    </main>
  );
}
