/**
 * Generate an IndexNow key file for instant indexing.
 * Key: 8–128 chars, only a-z, A-Z, 0-9, hyphen (IndexNow spec).
 * Run from project root: node scripts/generate-indexnow-key.mjs
 *
 * Creates public/{key}.txt and prints the key for INDEXNOW_KEY in .env.local.
 */

import { randomBytes } from 'crypto';
import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';

function generateKey(length = 32) {
  const bytes = randomBytes(length);
  let key = '';
  for (let i = 0; i < length; i++) {
    key += CHARS[bytes[i] % CHARS.length];
  }
  return key;
}

const key = generateKey(32);
const keyFileName = `${key}.txt`;
const keyPath = join(publicDir, keyFileName);

if (!existsSync(publicDir)) {
  console.error('public/ directory not found. Run from project root.');
  process.exit(1);
}

writeFileSync(keyPath, key, 'utf8');
console.log(`Created ${keyPath}`);
console.log('');
console.log('Add to .env.local:');
console.log(`INDEXNOW_KEY=${key}`);
console.log(`INDEXNOW_KEY_FILE=${keyFileName}`);
console.log('');
console.log('Key file will be served at: https://torpedoweb.org/' + keyFileName);
