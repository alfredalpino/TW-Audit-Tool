/**
 * One-time script to create a test admin user in Supabase Auth.
 * Run from project root: npm run create-admin
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Requires portal tables (profiles) to exist — run the portal migration first if you use login/dashboard.
 *
 * Creates: admin@torpedoweb.org / UbaidAdmin (role: admin in profiles)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, 'utf8');
    for (const line of content.split('\n')) {
      const i = line.indexOf('=');
      if (i <= 0) continue;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
    break;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set in .env.local or env.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL = 'admin@torpedoweb.org';
const PASSWORD = 'UbaidAdmin';

async function main() {
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message?.includes('already been registered')) {
      console.log('User already exists. Updating profile to admin...');
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === EMAIL);
      if (existing) {
        await supabase.from('profiles').upsert({ id: existing.id, role: 'admin', updated_at: new Date().toISOString() });
        console.log('Profile set to admin. You can log in with:');
        console.log('  Email:    ', EMAIL);
        console.log('  Password: ', PASSWORD);
      }
      return;
    }
    console.error('Create user error:', createError.message);
    process.exit(1);
  }

  if (user?.user?.id) {
    await supabase.from('profiles').update({ role: 'admin', updated_at: new Date().toISOString() }).eq('id', user.user.id);
    console.log('Admin user created. Log in with:');
    console.log('  Email:    ', EMAIL);
    console.log('  Password: ', PASSWORD);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
