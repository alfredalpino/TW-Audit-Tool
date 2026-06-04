'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CRMNavLinks() {
  const pathname = usePathname();
  const base = '/crm';

  const linkClass = (path: string) =>
    `rounded-lg px-3 py-2 font-medium transition-colors touch-manipulation ${
      pathname === path
        ? 'bg-[#FF4F00]/10 text-[#FF4F00]'
        : 'text-gray-600 hover:bg-[#FF4F00]/10 hover:text-[#FF4F00]'
    }`;

  return (
    <>
      <Link href={base} className={linkClass(base)}>
        Inbox
      </Link>
      <Link href={`${base}/leads`} className={linkClass(`${base}/leads`)}>
        Leads
      </Link>
    </>
  );
}
