import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ADMIN_EMAIL_DOMAIN } from '@/lib/constants';

// Candidate for Edge runtime once Supabase auth client supports Edge in this code path.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const email = data.user.email ?? '';
      if (email.toLowerCase().endsWith(ADMIN_EMAIL_DOMAIN)) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/`);
    }
  }
  return NextResponse.redirect(`${origin}/`);
}
