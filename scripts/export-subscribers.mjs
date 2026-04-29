#!/usr/bin/env node
// Dump all email subscribers from the EMAIL_SUBSCRIBERS KV namespace to CSV.
//
// Usage:
//   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... node scripts/export-subscribers.mjs > subscribers.csv

import { execSync } from 'node:child_process';

const NS_BINDING = 'EMAIL_SUBSCRIBERS';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
}

function listKeys() {
  const out = run(`npx wrangler kv key list --binding=${NS_BINDING} --remote`);
  return JSON.parse(out);
}

function getValue(key) {
  const out = run(`npx wrangler kv key get "${key}" --binding=${NS_BINDING} --remote`);
  try {
    return JSON.parse(out);
  } catch {
    return { email: key, raw: out.trim() };
  }
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const keys = listKeys();
process.stderr.write(`Found ${keys.length} subscribers.\n`);
console.log(['email', 'subscribedAt', 'source', 'country', 'ip'].join(','));
for (const { name } of keys) {
  const v = getValue(name);
  console.log([v.email || name, v.subscribedAt, v.source, v.country, v.ip].map(csvEscape).join(','));
}
