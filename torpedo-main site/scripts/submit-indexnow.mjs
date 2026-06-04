/**
 * Submit URLs to IndexNow for instant indexing.
 * Run from project root. Uses .env.local for INDEXNOW_KEY and INDEXNOW_KEY_FILE if calling API directly.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs https://torpedoweb.org/blog/new-post
 *
 * With no args, submits core pages + all blog URLs from sitemap (fetches sitemap.xml from local or env SITE_URL).
 * With args, submits the given URLs (must be full URLs on torpedoweb.org).
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    const content = readFileSync(p, 'utf8');
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://torpedoweb.org';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_KEY_FILE = process.env.INDEXNOW_KEY_FILE;
const INDEXNOW_API_SECRET = process.env.INDEXNOW_API_SECRET;
const INDEXNOW_API_URL = process.env.INDEXNOW_API_URL ?? `${SITE_URL}/api/indexnow`;

const CORE_URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/services`,
  `${SITE_URL}/blog`,
  `${SITE_URL}/plans`,
  `${SITE_URL}/en-in/portfolio`,
  `${SITE_URL}/process`,
  `${SITE_URL}/blog/best-web-development-framework`,
];

async function getUrlsFromSitemap() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const res = await fetch(sitemapUrl);
  if (!res.ok) return CORE_URLS;
  const text = await res.text();
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(text))) urls.push(m[1].trim());
  return urls.length ? urls : CORE_URLS;
}

async function submitViaApi(urls) {
  const headers = { 'Content-Type': 'application/json' };
  if (INDEXNOW_API_SECRET) headers['Authorization'] = `Bearer ${INDEXNOW_API_SECRET}`;
  const res = await fetch(INDEXNOW_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ urls }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const hint =
      res.status === 401
        ? 'Unauthorized. If your domain redirects (e.g. non-www to www), set INDEXNOW_API_URL to the final host to avoid auth header loss on redirect.'
        : '';
    throw new Error([data.error || res.statusText || res.status, hint].filter(Boolean).join(' '));
  }
  return data;
}

async function submitDirect(urls) {
  if (!INDEXNOW_KEY || !INDEXNOW_KEY_FILE) {
    throw new Error('INDEXNOW_KEY and INDEXNOW_KEY_FILE required in .env.local for direct submission');
  }
  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY_FILE}`;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'torpedoweb.org',
      key: INDEXNOW_KEY,
      keyLocation,
      urlList: urls,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  return { submitted: urls.length, urls };
}

async function main() {
  let urls = process.argv.slice(2).filter(Boolean);
  if (urls.length === 0) {
    urls = await getUrlsFromSitemap();
  } else {
    urls = urls.map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`));
  }

  if (urls.length === 0) {
    console.error('No URLs to submit.');
    process.exit(1);
  }

  console.log('Submitting', urls.length, 'URL(s) to IndexNow...');
  try {
    let result;
    if (INDEXNOW_API_SECRET) {
      result = await submitViaApi(urls);
    } else {
      result = await submitDirect(urls);
    }
    console.log('Done:', result.submitted ?? result.urls?.length ?? urls.length, 'submitted');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

main();
