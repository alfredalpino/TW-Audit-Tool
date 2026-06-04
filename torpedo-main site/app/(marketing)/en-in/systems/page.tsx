import type { Metadata } from 'next';
import { SystemsLanding } from '@/components/systems/SystemsLanding';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/systems', locale, 'systems');
}

export default function EnInSystemsPage() {
  return <SystemsLanding basePath="/en-in" />;
}
