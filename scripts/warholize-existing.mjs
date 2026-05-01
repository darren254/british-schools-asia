#!/usr/bin/env node
/**
 * One-off: walk src/data/news/, find each article's hero image, send it
 * through Gemini Nano Banana Pro with the standard pop-art prompt, replace
 * the file in place, update the article JSON's heroImage path if needed.
 *
 * Already-warholized files (extension .png that lives in public/images/news/)
 * are skipped — re-run is idempotent unless --force is passed.
 *
 * Env: GEMINI_API_KEY required.
 * Usage: node scripts/warholize-existing.mjs [--force] [--dry]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const NEWS_DIR = join(repoRoot, 'src/data/news');
const IMG_DIR = join(repoRoot, 'public/images/news');

const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');

const PROMPT = 'give me a painting version of this image in the style of pop art. not a filter - a painting. Remove and logo or text overlay';
const MODEL = 'gemini-3-pro-image-preview';

async function warholize(buf, mime, label) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: PROMPT },
        { inlineData: { mimeType: mime, data: buf.toString('base64') } },
      ]}],
    }),
    signal: AbortSignal.timeout(240000),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    if (p.inlineData) return Buffer.from(p.inlineData.data, 'base64');
  }
  throw new Error('No image in response');
}

function mimeFor(ext) {
  ext = ext.toLowerCase().replace('.', '');
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'avif') return 'image/avif';
  return 'image/jpeg';
}

const files = readdirSync(NEWS_DIR).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} news articles.`);

let processed = 0, skipped = 0, failed = 0;

for (const f of files) {
  const path = join(NEWS_DIR, f);
  const article = JSON.parse(readFileSync(path, 'utf8'));
  const heroImage = article.heroImage || '';
  if (!heroImage.startsWith('/images/news/')) {
    console.log(`  skip ${f}: hero is not a news-specific image (${heroImage})`);
    skipped++;
    continue;
  }
  const imgFsPath = join(repoRoot, 'public', heroImage);
  if (!existsSync(imgFsPath)) {
    console.log(`  ! ${f}: hero file missing on disk: ${heroImage}`);
    failed++;
    continue;
  }
  const ext = extname(imgFsPath);
  const isAlreadyPng = ext.toLowerCase() === '.png';
  if (isAlreadyPng && !FORCE) {
    console.log(`  skip ${f}: already PNG (likely already warholized)`);
    skipped++;
    continue;
  }
  console.log(`  warholize ${f} → ${heroImage}`);
  if (DRY) { processed++; continue; }
  try {
    const inBuf = readFileSync(imgFsPath);
    const out = await warholize(inBuf, mimeFor(ext), f);
    // Always save as .png (Gemini returns PNG)
    const newFsPath = imgFsPath.replace(/\.(jpg|jpeg|webp|avif|gif)$/i, '.png');
    writeFileSync(newFsPath, out);
    if (newFsPath !== imgFsPath) {
      try { unlinkSync(imgFsPath); } catch {}
      // Update article JSON to point to new .png
      article.heroImage = heroImage.replace(/\.(jpg|jpeg|webp|avif|gif)$/i, '.png');
      writeFileSync(path, JSON.stringify(article, null, 2) + '\n');
      console.log(`    wrote ${newFsPath} (${out.length} bytes), updated JSON`);
    } else {
      console.log(`    wrote ${newFsPath} (${out.length} bytes), JSON unchanged`);
    }
    processed++;
  } catch (e) {
    console.log(`    FAIL: ${e.message}`);
    failed++;
  }
}

console.log(`\nDone. processed=${processed} skipped=${skipped} failed=${failed}`);
