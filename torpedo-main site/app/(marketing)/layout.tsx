import { ClientLayout } from '@/components/ClientLayout';
import { getRequestLocale, getServerMessages } from '@/lib/i18n/server';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const messages = await getServerMessages(locale);

  return (
    <ClientLayout initialLocale={locale} initialMessages={messages}>
      {children}
    </ClientLayout>
  );
}
