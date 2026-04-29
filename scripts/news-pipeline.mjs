#!/usr/bin/env node
/**
 * News pipeline — daily.
 * One Claude call with web_search tool: Claude researches, picks up to 2 stories,
 * writes briefs. We save JSON, update seen.json, done.
 *
 * Env: ANTHROPIC_API_KEY (required), NEWS_DRY_RUN=1 (optional)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const DRY_RUN = process.env.NEWS_DRY_RUN === '1';

const SEEN_FILE = join(repoRoot, 'research/news-seen.json');
const NEWS_DIR = join(repoRoot, 'src/data/news');
const PROMPT_FILE = join(repoRoot, 'prompts/news-brief.md');
const DEFAULT_AUTHOR = 'marcus-chen';

const KICKER_TO_HERO = {
  'Singapore': '/images/singapore-hero.jpg',
  'Hong Kong': '/images/hong-kong-hero.jpg',
  'Shanghai': '/images/shanghai-hero.jpg',
  'Beijing': '/images/beijing-hero.jpg',
  'Shenzhen': '/images/shenzhen-hero.jpg',
  'Bangkok': '/images/bangkok-hero.jpg',
  'Kuala Lumpur': '/images/kuala-lumpur-hero.jpg',
  'Hanoi': '/images/hanoi-hero.jpg',
  'Ho Chi Minh City': '/images/ho-chi-minh-city-hero.jpg',
  'Jakarta': '/images/jakarta-hero.jpg',
  'Asia': '/images/homepage-hero.jpg',
};
const KICKER_TO_HERO_ALT = {
  'Singapore': 'Singapore skyline', 'Hong Kong': 'Hong Kong harbour',
  'Shanghai': 'Shanghai Pudong skyline', 'Beijing': 'Beijing skyline',
  'Shenzhen': 'Shenzhen skyline', 'Bangkok': 'Bangkok skyline',
  'Kuala Lumpur': 'Kuala Lumpur skyline', 'Hanoi': 'Hanoi cityscape',
  'Ho Chi Minh City': 'Ho Chi Minh City skyline', 'Jakarta': 'Jakarta skyline',
  'Asia': 'Asia',
};

const today = () => new Date().toISOString().slice(0, 10);

function loadRecentContext() {
  // Pass last 14 days of slugs + source URLs to Claude so it doesn't repeat.
  const seen = existsSync(SEEN_FILE)
    ? JSON.parse(readFileSync(SEEN_FILE, 'utf8'))
    : { version: 1, seen: [] };
  const cutoff = new Date(Date.now() - 14 * 86400e3);
  const recent = seen.seen.filter(s => new Date(s.date) >= cutoff);
  // Also list slugs from src/data/news/
  const newsFiles = existsSync(NEWS_DIR) ? readdirSync(NEWS_DIR).filter(f => f.endsWith('.json')) : [];
  const recentSlugs = newsFiles
    .map(f => JSON.parse(readFileSync(join(NEWS_DIR, f), 'utf8')))
    .filter(a => a.date && new Date(a.date) >= cutoff);
  return { seen, recent, recentSlugs };
}

async function callClaude(systemPrompt, userMsg) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 12000,
    system: systemPrompt,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }],
    messages: [{ role: 'user', content: userMsg }],
  };

  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(300000),
      });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`Claude API ${res.status}: ${await res.text()}`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }
      if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
      const data = await res.json();
      // Extract last text block (after any tool_use blocks)
      const textBlocks = (data.content || []).filter(b => b.type === 'text');
      const text = textBlocks.map(b => b.text).join('\n');
      // Log search activity for debugging
      const searches = (data.content || []).filter(b => b.type === 'server_tool_use' || b.type === 'web_search_tool_result');
      console.log(`  [claude] ${searches.length} tool events, stop_reason=${data.stop_reason}, usage=${JSON.stringify(data.usage)}`);
      return text;
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 3000));
    }
  }
  throw lastErr;
}

function extractJson(text) {
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try { return JSON.parse(cleaned); } catch {}
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    try { return JSON.parse(cleaned.slice(start, end + 1)); } catch {}
  }
  throw new Error(`Could not parse JSON: ${text.slice(0, 500)}`);
}

async function main() {
  console.log(`[news] starting ${new Date().toISOString()}${DRY_RUN ? ' (DRY)' : ''}`);

  const systemPrompt = readFileSync(PROMPT_FILE, 'utf8');
  const { seen, recent, recentSlugs } = loadRecentContext();

  const todayStr = today();
  const recentSlugList = recentSlugs.map(a => `- ${a.slug} (${a.date}, ${a.sourceName || '?'})`).join('\n') || '(none yet)';
  const recentUrlList = recent.map(s => `- ${s.url}`).slice(0, 50).join('\n') || '(none)';

  const userMsg = [
    `Today's date: ${todayStr}.`,
    ``,
    `Please research and write today's edition per your system prompt.`,
    ``,
    `Recently published slugs (last 14 days — DO NOT REPEAT THESE STORIES):`,
    recentSlugList,
    ``,
    `Recently considered source URLs (last 14 days — try to avoid these too):`,
    recentUrlList,
    ``,
    `Use the web_search tool to find current news. Search a few angles. Then return the JSON output specified in your system prompt — JSON only, no prose.`,
  ].join('\n');

  console.log(`[news] calling Claude with web_search…`);
  const raw = await callClaude(systemPrompt, userMsg);
  const out = extractJson(raw);
  if (!Array.isArray(out.articles)) throw new Error('Response missing articles[]');

  console.log(`[news] Claude returned ${out.articles.length} article(s)`);

  if (!DRY_RUN && !existsSync(NEWS_DIR)) mkdirSync(NEWS_DIR, { recursive: true });

  const written = [];
  for (const a of out.articles) {
    const finalSlug = `${todayStr}-${a.slug}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const record = {
      slug: finalSlug,
      kicker: a.kicker,
      headline: a.headline,
      dek: a.dek,
      author: DEFAULT_AUTHOR,
      date: todayStr,
      heroImage: KICKER_TO_HERO[a.kicker] || '/images/homepage-hero.jpg',
      heroAlt: KICKER_TO_HERO_ALT[a.kicker] || '',
      heroCredit: '',
      body: a.body,
      sourceUrl: a.sourceUrl,
      sourceName: a.sourceName,
      tags: a.tags || [],
    };
    const path = join(NEWS_DIR, `${finalSlug}.json`);
    if (DRY_RUN) {
      console.log(`[dry] would write ${path}`);
      console.log(JSON.stringify(record, null, 2).slice(0, 600) + '…');
    } else {
      writeFileSync(path, JSON.stringify(record, null, 2) + '\n');
      console.log(`  wrote ${path}`);
    }
    written.push(record);
  }

  // Update seen.json with the URLs we just published
  for (const r of written) {
    if (r.sourceUrl) seen.seen.push({ url: r.sourceUrl, date: todayStr, slug: r.slug });
  }
  // Trim to last 90 days
  const cutoff = new Date(Date.now() - 90 * 86400e3);
  seen.seen = seen.seen.filter(s => new Date(s.date) >= cutoff || s.slug);
  seen.lastUpdated = new Date().toISOString();
  if (!DRY_RUN) writeFileSync(SEEN_FILE, JSON.stringify(seen, null, 2) + '\n');

  console.log(`[news] done. ${written.length} article(s) written.`);
}

main().catch(e => {
  console.error('[news] FATAL:', e);
  process.exit(1);
});
