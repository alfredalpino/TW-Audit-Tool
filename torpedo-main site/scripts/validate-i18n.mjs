#!/usr/bin/env node
/**
 * Validates i18n message files: required keys, missing namespaces, locale coverage.
 * Usage: node scripts/validate-i18n.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const messagesDir = path.join(root, 'lib/i18n/messages');

const REQUIRED_NAMESPACES = [
  'common',
  'nav',
  'footer',
  'seo',
  'cta',
  'home',
  'process',
  'services',
  'systems',
  'whatWeDo',
  'legal',
];
const LOCALE_DIRS = ['en-US', 'en-IN', 'es-MX', 'fr', 'de', 'fi', 'sv', 'it', 'tr', 'ru', 'ar', 'ja', 'zh-CN', 'zh-HK', 'ko'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const baseline = {};
for (const ns of REQUIRED_NAMESPACES) {
  baseline[ns] = flattenKeys(readJson(path.join(messagesDir, 'en-US', `${ns}.json`)));
}

let errors = 0;

for (const localeDir of LOCALE_DIRS) {
  for (const ns of REQUIRED_NAMESPACES) {
    const filePath = path.join(messagesDir, localeDir, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`MISSING: ${path.relative(root, filePath)}`);
      errors++;
      continue;
    }

    const data = readJson(filePath);
    const keys = flattenKeys(data);
    const missing = baseline[ns].filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !baseline[ns].includes(key));

    if (missing.length) {
      console.error(`MISSING KEYS in ${localeDir}/${ns}.json:`, missing.join(', '));
      errors += missing.length;
    }
    if (extra.length) {
      console.warn(`EXTRA KEYS in ${localeDir}/${ns}.json:`, extra.join(', '));
    }

    for (const value of Object.values(data)) {
      if (typeof value === 'string' && (value.includes('undefined') || value.trim() === '')) {
        console.error(`EMPTY/BROKEN string in ${localeDir}/${ns}.json`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\ni18n validation failed with ${errors} issue(s).`);
  process.exit(1);
}

console.log('i18n validation passed.');
