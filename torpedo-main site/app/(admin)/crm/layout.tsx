import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { CRMLogin } from './CRMLogin';
import { CRMSignOut } from './CRMSignOut';
import { CRMNavLinks } from './CRMNavLinks';

export default async function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) {
    return <CRMLogin />;
  }
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <Link href="/crm" className="min-w-0 truncate text-base font-semibold text-[#0A0A0B] sm:text-lg hover:text-[#FF4F00] transition-colors">
            CRM · Torpedo Chat
          </Link>
          <nav className="flex min-h-[44px] items-center gap-1 text-sm sm:gap-2" aria-label="CRM navigation">
            <CRMNavLinks />
            <span className="mx-1 w-px self-stretch bg-gray-200" aria-hidden />
            <CRMSignOut />
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-4 sm:py-6">
        {children}
      </div>
    </div>
  );
}
