#!/usr/bin/env node
/**
 * One-off: walk src/data/news/, ask Claude to add a single natural inline
 * citation+link to each article body that doesn't already have one.
 *
 * The link wraps a natural attribution phrase ("according to X", "the X reported",
 * a direct quote attributed to X) and points to the article's sourceUrl.
 *
 * Idempotent: skips articles that already contain `<a href=` in their body.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const NEWS_DIR = join(repoRoot, 'src/data/news');

const SYSTEM = `You are a copy editor. Your only job is to add ONE inline citation/link to a news article body.

Rules:
- Modify exactly ONE existing paragraph to weave in a natural citation phrase referencing the source outlet (e.g. "according to <a href=\\"URL\\">The Nation Thailand</a>", "the <a href=\\"URL\\">South China Morning Post reported</a>"...).
- Use the source URL provided. Use the source name provided.
- The citation must read naturally as part of the prose, not bolted on.
- Do not invent new facts. Do not add new paragraphs. Do not modify any other paragraph.
- Do not use em dashes anywhere.
- Return only the modified body array as valid JSON. Do not include any explanation.

Output schema:
{
  "body": [ { "type": "paragraph"|"heading"|"image", ... }, ... ]
}`;

async function callClaude(userMsg) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const start = cleaned.indexOf('{'), end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) return JSON.parse(cleaned.slice(start, end + 1));
  throw new Error('Could not parse JSON: ' + text.slice(0, 200));
}

const files = readdirSync(NEWS_DIR).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} articles.`);

for (const f of files) {
  const path = join(NEWS_DIR, f);
  const article = JSON.parse(readFileSync(path, 'utf8'));

  // Skip if no source URL/name
  if (!article.sourceUrl || !article.sourceName) {
    console.log(`  skip ${f}: no sourceUrl/sourceName`);
    continue;
  }

  // Skip if already has an inline link
  const bodyText = JSON.stringify(article.body);
  if (bodyText.includes('<a href=')) {
    console.log(`  skip ${f}: already has inline citation`);
    continue;
  }

  console.log(`  citing ${f}…`);
  try {
    const userMsg = [
      `Source URL: ${article.sourceUrl}`,
      `Source name: ${article.sourceName}`,
      ``,
      `Current body:`,
      JSON.stringify(article.body, null, 2),
    ].join('\n');
    const out = await callClaude(userMsg);
    if (!Array.isArray(out.body)) throw new Error('No body array in response');
    article.body = out.body;
    writeFileSync(path, JSON.stringify(article, null, 2) + '\n');
    console.log(`    updated`);
  } catch (e) {
    console.log(`    FAIL: ${e.message}`);
  }
}

console.log('Done.');
