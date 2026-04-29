#!/usr/bin/env node
/**
 * News pipeline — daily.
 *   1. Fetch RSS from a small set of trusted feeds
 *   2. Filter to plausibly-relevant items + dedup against seen.json
 *   3. Fetch source bodies for the survivors
 *   4. ONE Claude call: pick up to 2 stories + write briefs
 *   5. Save JSON files + update seen.json
 *
 * Env: ANTHROPIC_API_KEY (required), NEWS_DRY_RUN=1 (optional)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const DRY_RUN = process.env.NEWS_DRY_RUN === '1';

const FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', name: 'BBC News' },
  { url: 'https://www.scmp.com/rss/4/feed', name: 'South China Morning Post' },
  { url: 'https://www.scmp.com/rss/91/feed', name: 'South China Morning Post Education' },
  { url: 'https://www.straitstimes.com/news/singapore/rss.xml', name: 'The Straits Times' },
  { url: 'https://www.bangkokpost.com/rss/data/news.xml', name: 'Bangkok Post' },
  { url: 'https://e.vnexpress.net/rss/news.rss', name: 'VnExpress International' },
  { url: 'https://monitor.icef.com/feed/', name: 'ICEF Monitor' },
  { url: 'https://thepienews.com/feed/', name: 'The PIE News' },
];

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
  'Singapore': 'Singapore skyline',
  'Hong Kong': 'Hong Kong harbour',
  'Shanghai': 'Shanghai Pudong skyline',
  'Beijing': 'Beijing skyline',
  'Shenzhen': 'Shenzhen skyline',
  'Bangkok': 'Bangkok skyline',
  'Kuala Lumpur': 'Kuala Lumpur skyline',
  'Hanoi': 'Hanoi cityscape',
  'Ho Chi Minh City': 'Ho Chi Minh City skyline',
  'Jakarta': 'Jakarta skyline',
  'Asia': 'Asia',
};

const SEEN_FILE = join(repoRoot, 'research/news-seen.json');
const NEWS_DIR = join(repoRoot, 'src/data/news');
const DEFAULT_AUTHOR = 'marcus-chen';

// =================== HELPERS ===================

const today = () => new Date().toISOString().slice(0, 10);
const stripHtml = (s) => String(s||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const sha8 = (s) => createHash('sha1').update(s).digest('hex').slice(0, 10);

async function fetchRss(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BSA-NewsBot/1.0)' },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(xml);
    const rssItems = data?.rss?.channel?.item;
    const atomEntries = data?.feed?.entry;
    const items = rssItems ? (Array.isArray(rssItems) ? rssItems : [rssItems])
                : atomEntries ? (Array.isArray(atomEntries) ? atomEntries : [atomEntries])
                : [];
    return items.map(it => {
      const link = typeof it.link === 'string' ? it.link
                 : Array.isArray(it.link) ? (it.link[0]?.['@_href'] || it.link[0])
                 : it.link?.['@_href'] || '';
      return {
        title: stripHtml(it.title || ''),
        link,
        pubDate: it.pubDate || it.published || it.updated || '',
        description: stripHtml(it.description || it.summary || it['content:encoded'] || ''),
        source: feed.name,
      };
    }).filter(x => x.title && x.link);
  } catch (e) {
    console.error(`RSS ${feed.name} error: ${e.message}`);
    return [];
  }
}

// Cheap pre-filter: throw out items that obviously can't be K-12 schools in our cities.
// Generous — we'd rather pass too many to Claude than too few.
const EDU_HINTS = ['school','schools','pupil','pupils','student','students','tuition','curriculum','classroom','teacher','teachers','igcse','a-level','a level','a levels','a-levels','ib diploma','gcse','inspect','admission','enrol','enroll','kindergarten','primary','secondary','headmaster','headmistress','principal'];
const GEO_HINTS = ['singapore','hong kong','shanghai','beijing','shenzhen','bangkok','kuala lumpur','malaysia','thailand','hanoi','ho chi minh','vietnam','jakarta','indonesia','china','asia'];
const SCHOOL_NAMES = ['tanglin','kellett','harrow international','dulwich college','wellington college','shrewsbury international','brighton college bangkok','nord anglia','nais ','patana','denla british','st andrews international','bromsgrove international','wycombe abbey','ycis ','german swiss international','discovery bay international','british international school','bsb sanlitun','bsb shunyi','bskl ','british school kuala lumpur','british school jakarta','nexus international school','britannica international','garden international','alice smith school'];

function plausiblyRelevant(item) {
  const h = (item.title + ' ' + item.description).toLowerCase();
  if (SCHOOL_NAMES.some(s => h.includes(s))) return true;
  return EDU_HINTS.some(k => h.includes(k)) && GEO_HINTS.some(k => h.includes(k));
}

function isRecent(item, days = 3) {
  if (!item.pubDate) return true;
  const d = new Date(item.pubDate);
  if (isNaN(d.getTime())) return true;
  return d >= new Date(Date.now() - days * 86400e3);
}

async function fetchSource(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { ok: false, finalUrl: url, text: '' };
    const finalUrl = res.url || url;
    let html = await res.text();
    html = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
    const paras = [];
    const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = re.exec(html))) {
      const t = stripHtml(m[1]);
      if (t.length > 50) paras.push(t);
    }
    return { ok: true, finalUrl, text: paras.join('\n\n').slice(0, 4000) };
  } catch (e) {
    return { ok: false, finalUrl: url, text: '' };
  }
}

// =================== CLAUDE CALL ===================

async function callClaude(promptText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const systemPrompt = readFileSync(join(repoRoot, 'prompts/news-brief.md'), 'utf8');

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
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 8000,
          system: systemPrompt,
          messages: [{ role: 'user', content: promptText }],
        }),
        signal: AbortSignal.timeout(180000),
      });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`Claude API ${res.status}`);
        await new Promise(r => setTimeout(r, attempt * 2000));
        continue;
      }
      if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
      const data = await res.json();
      return data.content?.[0]?.text || '';
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 2000));
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
  throw new Error(`Could not parse JSON: ${text.slice(0, 300)}`);
}

// =================== MAIN ===================

async function main() {
  console.log(`[news] starting ${new Date().toISOString()}${DRY_RUN ? ' (DRY RUN)' : ''}`);

  // 1. Fetch RSS
  console.log(`[news] fetching ${FEEDS.length} feeds…`);
  const results = await Promise.all(FEEDS.map(async (f) => ({ feed: f, items: await fetchRss(f) })));
  let all = [];
  for (const r of results) {
    console.log(`  ${r.feed.name} → ${r.items.length}`);
    all.push(...r.items);
  }
  console.log(`[news] total: ${all.length} items`);

  // 2. Filter + dedup
  all = all.filter(isRecent).filter(plausiblyRelevant);
  console.log(`[news] plausibly relevant + recent: ${all.length}`);

  const seen = existsSync(SEEN_FILE) ? JSON.parse(readFileSync(SEEN_FILE, 'utf8')) : { version: 1, seen: [] };
  const seenUrls = new Set(seen.seen.map(s => s.url));
  all = all.filter(it => !seenUrls.has(it.link));
  console.log(`[news] after URL dedup: ${all.length}`);

  if (all.length === 0) {
    console.log('[news] nothing to consider — exiting');
    return;
  }

  // Cap at 30 candidates to keep prompt manageable
  const candidates = all.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0)).slice(0, 30);

  // 3. Fetch source bodies
  console.log(`[news] fetching ${candidates.length} source bodies…`);
  const enriched = await Promise.all(candidates.map(async (c, i) => {
    const src = await fetchSource(c.link);
    return { ...c, sourceText: src.text, finalUrl: src.finalUrl };
  }));

  // 4. Build prompt + call Claude
  const candidateList = enriched.map((c, i) =>
    `[${i}] ${c.title}\n     SOURCE: ${c.source}\n     URL: ${c.finalUrl}\n     RSS: ${c.description.slice(0, 200)}\n     BODY: ${(c.sourceText || '(could not fetch)').slice(0, 2500)}`
  ).join('\n\n---\n\n');

  const userMsg = `Today's candidate stories (${enriched.length} total). Pick up to 2 and write briefs per the rules in your system prompt.\n\n${candidateList}`;

  console.log(`[news] calling Claude (${userMsg.length} chars in user message)…`);
  const raw = await callClaude(userMsg);
  const out = extractJson(raw);
  if (!Array.isArray(out.articles)) throw new Error('Response missing articles[]');

  console.log(`[news] Claude returned ${out.articles.length} articles`);

  // 5. Save
  const date = today();
  if (!DRY_RUN && !existsSync(NEWS_DIR)) mkdirSync(NEWS_DIR, { recursive: true });

  const written = [];
  for (const a of out.articles) {
    const item = enriched[a.sourceIndex];
    if (!item) {
      console.error(`  bad sourceIndex: ${a.sourceIndex}`);
      continue;
    }
    const finalSlug = `${date}-${a.slug}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const record = {
      slug: finalSlug,
      kicker: a.kicker,
      headline: a.headline,
      dek: a.dek,
      author: DEFAULT_AUTHOR,
      date,
      heroImage: KICKER_TO_HERO[a.kicker] || '/images/homepage-hero.jpg',
      heroAlt: KICKER_TO_HERO_ALT[a.kicker] || '',
      heroCredit: '',
      body: a.body,
      sourceUrl: item.finalUrl || item.link,
      sourceName: item.source,
      tags: a.tags || [],
    };
    const path = join(NEWS_DIR, `${finalSlug}.json`);
    if (DRY_RUN) {
      console.log(`[dry] would write ${path}`);
      console.log(JSON.stringify(record, null, 2).slice(0, 500) + '…');
    } else {
      writeFileSync(path, JSON.stringify(record, null, 2) + '\n');
      console.log(`  wrote ${path}`);
    }
    written.push({ record, item });
  }

  // 6. Update seen — record both written AND considered-but-skipped
  for (const e of enriched) {
    const wasWritten = written.find(w => w.item.link === e.link);
    seen.seen.push({
      url: e.link,
      date,
      slug: wasWritten ? wasWritten.record.slug : null,
    });
  }
  // Trim to last 90 days
  const cutoff = new Date(Date.now() - 90 * 86400e3);
  seen.seen = seen.seen.filter(s => new Date(s.date) >= cutoff || s.slug);
  seen.lastUpdated = new Date().toISOString();
  if (!DRY_RUN) writeFileSync(SEEN_FILE, JSON.stringify(seen, null, 2) + '\n');

  console.log(`[news] done. ${written.length} articles written.`);
}

main().catch(e => {
  console.error('[news] FATAL:', e);
  process.exit(1);
});
