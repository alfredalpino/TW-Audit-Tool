'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function CRMSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-[#0A0A0B] transition-colors touch-manipulation"
    >
      Sign out
    </button>
  );
}
