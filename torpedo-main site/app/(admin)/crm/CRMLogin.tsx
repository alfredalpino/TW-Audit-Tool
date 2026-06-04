'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_EMAIL = 'admin@torpedoweb.org';

export function CRMLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message ?? 'Invalid email or password.');
        return;
      }
      if (data.user?.email?.toLowerCase().endsWith('@torpedoweb.org')) {
        router.refresh();
        return;
      }
      await supabase.auth.signOut();
      setError('Only @torpedoweb.org accounts can access the CRM.');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('Missing Supabase') || message.includes('Invalid NEXT_PUBLIC_SUPABASE')) {
        setError(message);
      } else if (message.includes('fetch') || message === 'Failed to fetch') {
        setError(
          'Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (Supabase Dashboard → Project Settings → API), then restart the dev server.'
        );
      } else {
        setError(message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-lg font-semibold text-[#0A0A0B]">CRM – Sign in</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Torpedo Web team only
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="crm-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="crm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#FF4F00] focus:outline-none focus:ring-1 focus:ring-[#FF4F00]"
              placeholder="admin@torpedoweb.org"
            />
          </div>
          <div>
            <label htmlFor="crm-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="crm-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#FF4F00] focus:outline-none focus:ring-1 focus:ring-[#FF4F00]"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#FF4F00] py-2 text-sm font-medium text-white hover:bg-[#E64800] disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
