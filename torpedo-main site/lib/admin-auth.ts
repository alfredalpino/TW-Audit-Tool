import { createClient } from '@/lib/supabase/server';
import { ROLES, ADMIN_EMAIL_DOMAIN } from '@/lib/constants';

const ADMIN_ROLES = ROLES.filter((r) => r === 'admin' || r === 'team');

export async function requireAdmin(): Promise<{ userId: string; role: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!error && profile?.role) {
      const role = profile.role as string;
      if (ADMIN_ROLES.includes(role as 'admin' | 'team')) {
        return { userId: user.id, role };
      }
    }
    // If profiles table missing or no admin/team role, fall through to email fallback
  } catch {
    // profiles table may not exist (e.g. after remove_old_login_system migration)
  }

  // Fallback: allow admin for logged-in @torpedoweb.org users (same as auth callback)
  const email = (user.email ?? '').toLowerCase();
  if (email.endsWith(ADMIN_EMAIL_DOMAIN)) {
    return { userId: user.id, role: 'admin' };
  }

  return null;
}
