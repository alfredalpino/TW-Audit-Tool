import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect('/');
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-semibold text-[#0A0A0B]">Admin – Torpedo Chat</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/crm"
              className="text-[#0A0A0B] hover:text-[#FF4F00] hover:underline"
            >
              Inbox
            </Link>
            <Link
              href="/crm/leads"
              className="text-gray-600 hover:text-[#FF4F00] hover:underline"
            >
              Leads
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
