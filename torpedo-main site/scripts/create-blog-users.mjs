/**
 * One-time script to create the two blog system users (admin + team) in Supabase Auth.
 *
 * SECURITY: Passwords must NOT be in this file. Set them in .env.local (gitignored):
 *   BLOG_ADMIN_PASSWORD=your_admin_password
 *   BLOG_TEAM_PASSWORD=your_team_password
 *
 * Run from project root:
 *   node scripts/create-blog-users.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env or .env.local.
 * Requires: profiles table (portal migration) and blog_posts migration.
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
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.BLOG_ADMIN_EMAIL || 'admin@torpedoweb.org';
const adminPassword = process.env.BLOG_ADMIN_PASSWORD;
const teamEmail = process.env.BLOG_TEAM_EMAIL || 'team@torpedoweb.org';
const teamPassword = process.env.BLOG_TEAM_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set in .env.local or .env');
  process.exit(1);
}

if (!adminPassword || !teamPassword) {
  console.error('Missing BLOG_ADMIN_PASSWORD or BLOG_TEAM_PASSWORD.');
  console.error('Set them in .env or .env.local, then run: node scripts/create-blog-users.mjs');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
  { email: adminEmail, password: adminPassword, role: 'admin' },
  { email: teamEmail, password: teamPassword, role: 'team' },
];

async function ensureUser({ email, password, role }) {
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message?.includes('already been registered')) {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === email);
      if (existing) {
        await supabase.from('profiles').upsert({
          id: existing.id,
          role,
          updated_at: new Date().toISOString(),
        });
        const { error: updateErr } = await supabase.auth.admin.updateUserById(existing.id, { password });
        if (updateErr) {
          console.warn(`  ${email} – profile set to ${role}, but password update failed: ${updateErr.message}`);
        } else {
          console.log(`  ${email} – already existed, profile set to ${role}, password updated`);
        }
      }
      return;
    }
    throw new Error(`${email}: ${createError.message}`);
  }

  if (user?.user?.id) {
    await supabase.from('profiles').upsert({
      id: user.user.id,
      role,
      updated_at: new Date().toISOString(),
    });
    console.log(`  ${email} – created with role ${role}`);
  }
}

async function main() {
  console.log('Creating blog users...');
  for (const u of USERS) {
    await ensureUser(u);
  }
  console.log('Done. You can log in at /login.');
  console.log('Remove BLOG_ADMIN_PASSWORD and BLOG_TEAM_PASSWORD from .env.local after running this once.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
