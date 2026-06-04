import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase config. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (from Supabase Dashboard → Project Settings → API).'
    );
  }
  if (!supabaseUrl.includes('.supabase.co') || supabaseUrl.includes('xxx')) {
    throw new Error(
      'Invalid NEXT_PUBLIC_SUPABASE_URL. Use your project URL from Supabase Dashboard → Project Settings → API (e.g. https://xxxxx.supabase.co).'
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
