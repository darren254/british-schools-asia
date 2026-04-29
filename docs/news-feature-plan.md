# News Feature — Plan

A daily-automated news section: pulls Google News, scores, picks two stories, writes 500-word briefs, generates AI images, publishes to a `/news` page on the site.

---

## Goal & success criteria

**Goal:** without human intervention, every day publish two short, well-presented news briefs about international schools in Asia, each citing the original source and accompanied by an AI-generated image.

**Success looks like:**
- Two new posts on `/news` daily by 09:00 SGT
- Each post: headline + 500-word brief + AI image + source citation
- Visual template consistent across all posts (Net-a-Porter editorial chrome)
- Zero copyright issues (we rewrite, never republish)
- No duplicate stories within 7 days
- Total monthly cost < $10

---

## Architecture

```
┌──────────────────┐
│ GitHub Actions   │  daily at 09:00 SGT (01:00 UTC)
│   cron schedule  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ Pipeline (Node script in scripts/news-pipeline.mjs) │
│                                                     │
│   1. Fetch Google News RSS for query set            │
│   2. Filter last 24h                                │
│   3. Deduplicate vs. published-articles log         │
│   4. Score + pick top 2 distinct topics             │
│   5. Fetch each source article (Readability parse)  │
│   6. Claude API → write 500-word brief              │
│   7. DALL-E 3 / OpenAI Image API → generate image   │
│   8. Save:                                          │
│      - src/data/news/<slug>.json                    │
│      - public/images/news/<slug>.jpg                │
│      - research/news-seen.json (URL log)            │
│   9. git commit + push                              │
│  10. wrangler pages deploy (or Pages auto-build)    │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ /news (index) + /news/[slug] pages   │
│ Astro static-rendered                │
└──────────────────────────────────────┘
```

---

## Component design

### 1. News ingestion (Google News RSS)

Free, no API key required. Endpoint:

```
https://news.google.com/rss/search?q=QUERY&hl=en-US&gl=US&ceid=US:en
```

**Query set** (run for each, merge results):
- `"international school" Singapore`
- `"international school" "Hong Kong"`
- `"British school" Bangkok`
- `"international school" "Kuala Lumpur"`
- `"international school" Shanghai`
- `"international school" Beijing`
- `"international school" Jakarta`
- `"international school" Vietnam`
- `"international school" Asia`
- `"British curriculum" Asia`
- Specific school names (drawn from `schools.json`)

**Filter:** only items published within last 24 hours.

### 2. Selection matrix (pick top 2)

Score each candidate article on:

| Signal | Weight |
|---|---|
| Recency (decay over 24h: 1.0 → 0.5) | ×1 |
| Source reputation (tier-1 outlets bonus) | +3 |
| Mentions a school in our index by name | +5 |
| Mentions one of our covered cities | +2 |
| Length of original article (favour 300+ words) | +1 |
| Topic uniqueness vs. other candidates | +2 |
| **Negative signals** | |
| Press release / school self-PR | −5 |
| Adverts disguised as news | −5 |
| Already published (URL match) | rejected |
| Same topic as another picked article | rejected |

**Tie-breaker:** prefer regulatory/policy/finance over events/awards. Editorial weight to substance over PR.

**If fewer than 2 articles score positively:** publish 0 or 1, don't force.

### 3. Source article retrieval

For each picked article, fetch the URL with a Mozilla user agent. Parse with `@mozilla/readability` + `jsdom` to extract clean article text. Fallback to RSS description if paywalled.

### 4. Brief writing (Claude API)

**System prompt (locked):**

```
You are a journalist writing a brief for British Schools Asia, an editorial guide
to British curriculum schools in Asia. Tone: independent, factual, slightly dry,
in the voice of an editorial guide — never marketing.

Given a source article, produce:
- A short headline (under 80 chars, no clickbait)
- A 500-word brief summarising what happened, why it matters to international
  school families in Asia, and any direct implications.
- Cite the source publication and date once at the end as: "Source: <outlet>, <date>".
- Never copy more than 15 consecutive words from the source.
- Never make claims not present in the source.
- If the source is thin, write a shorter piece. Quality over length.
```

**User prompt** includes the parsed article text + outlet + date.

**Model:** Claude Sonnet 4.6 (good editorial voice, fast, cheap-ish).

### 5. Image generation

**Provider:** OpenAI DALL-E 3 via Images API.

**Style brief (locked, prepended to every prompt):**
```
Editorial photo or illustration in the style of a luxury international magazine
(Net-a-Porter / Vogue / FT Weekend). Black-and-white-friendly composition,
clean negative space at the bottom for headline overlay. No text in the image.
No school logos. No identifiable people.
```

**Per-article prompt:** built from headline + 1-line summary + relevant subject (e.g. "Hong Kong skyline at dusk", "British school classroom in Asia").

**Output:** 1024×1024 standard quality JPEG. Save to `public/images/news/<slug>.jpg`.

**Fallback:** if image API fails, use the relevant city hero (`<citySlug>-hero.jpg`) instead of failing the run.

### 6. Visual template

A Net-a-Porter-style card frame applied at render time (Astro CSS), not pre-baked into the image:

```
┌────────────────────────────────────────────┐
│  [tiny label] BRITISH SCHOOLS ASIA · NEWS  │
│                                            │
│  [Hero image — 16:9, full-bleed]           │
│                                            │
│  Headline (Cormorant Garamond, large)      │
│  ─────────────────                         │
│  Date · 4 min read                         │
│                                            │
│  Body text (Inter, 16px, max-w 2xl)…       │
│                                            │
│  Source: Outlet, Date                      │
│  [Read original →]                         │
└────────────────────────────────────────────┘
```

Reuses existing brand tokens in `src/styles/global.css`. New components: `NewsCard.astro` (for the index) and the `[slug].astro` template.

### 7. Data model

`src/data/news/<YYYY-MM-DD>-<slug>.json`:

```json
{
  "slug": "2026-04-29-singapore-fee-cap-debate",
  "publishedAt": "2026-04-29T01:00:00Z",
  "title": "Singapore international school fee growth slows in 2026",
  "deck": "After three years of double-digit increases, premium British schools have moderated 2026–27 fee uplifts.",
  "body": "[500-word brief markdown]",
  "imagePath": "/images/news/2026-04-29-singapore-fee-cap-debate.jpg",
  "imageAlt": "Aerial view of Marina Bay at sunset with school campus in foreground",
  "tags": ["singapore", "fees"],
  "source": {
    "outlet": "The Straits Times",
    "url": "https://...",
    "publishedAt": "2026-04-28T22:14:00Z"
  },
  "model": {
    "writer": "claude-sonnet-4-6",
    "imageGen": "dall-e-3",
    "promptVersion": "v1"
  }
}
```

`research/news-seen.json` — running log of source URLs we've already processed (for deduplication). Pruned monthly.

### 8. Site rendering

- `src/pages/news/index.astro` — chronological list of all articles, paginated if needed
- `src/pages/news/[slug].astro` — dynamic route from the JSON files using `getStaticPaths`
- Add **News** to global Header nav and Footer Explore column
- Add a "Latest from the News Desk" module on the homepage (optional)

### 9. Scheduling & deployment

**GitHub Actions** workflow at `.github/workflows/news-pipeline.yml`:

```yaml
name: Daily news pipeline
on:
  schedule:
    - cron: '0 1 * * *'  # 09:00 SGT
  workflow_dispatch:        # manual trigger
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: node scripts/news-pipeline.mjs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - name: Commit and push
        run: |
          git config user.email "news-bot@britishschoolsasia.com"
          git config user.name "News Bot"
          git add src/data/news public/images/news research/news-seen.json
          git diff --cached --quiet || git commit -m "news: $(date -u +%Y-%m-%d)"
          git push
      - name: Build and deploy
        run: |
          npm run build
          npx wrangler pages deploy ./dist --project-name=british-schools-asia --branch=main
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Secrets to add to the repo:**
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `CLOUDFLARE_API_TOKEN` (existing; reused)
- `CLOUDFLARE_ACCOUNT_ID` (existing)

### 10. Failure modes & monitoring

- **No qualifying articles** → emit summary log, publish nothing, exit 0
- **Source fetch fails** → skip that candidate, try next
- **Claude API error** → retry once with backoff, then skip article
- **Image gen error** → fall back to city hero image
- **Git push conflict** → action retries on a fresh checkout
- **Cloudflare deploy fails** → workflow fails visibly via GitHub email; site stays on previous good build

**Observability:** every run logs a JSON-line summary to `research/news-pipeline-runs.jsonl` for inspection.

**Manual override:** `workflow_dispatch` lets us run the pipeline ad-hoc; `news-seen.json` is editable to "force-republish" a topic.

### 11. Cost estimate (monthly)

| Item | Volume | Unit | Cost |
|---|---|---|---|
| Claude Sonnet 4.6 (writing) | ~5k tokens × 60 calls | $3 in / $15 out per 1M | ~$2 |
| DALL-E 3 1024×1024 standard | 60 images | $0.04 | $2.40 |
| GitHub Actions | ~5 min × 30 runs | free for public, free tier 2000m for private | $0 |
| Cloudflare Pages | unchanged | — | $0 |
| **Total** | | | **~$5/mo** |

### 12. Legal / editorial guardrails

- Source citation is mandatory and links to the original article
- No more than 15 consecutive words copied from the source (the prompt enforces this; we add a regex check too)
- Footer disclaimer on each news article: "AI-assisted news brief. Full article at the original source."
- Tag images visibly as `[Illustration]` if AI-generated, or use it without claim of being a photograph
- Dedupe within a 14-day window so the same story isn't recycled

### 13. Open decisions (need user input before building)

1. **Image style** — illustrative AI imagery (DALL-E with style guidance) **OR** templated stock-image-with-overlay (no per-article AI gen)? Plan above assumes the former; switching to the latter cuts cost to ~$2/mo and improves consistency, but loses uniqueness per piece.
2. **News frequency** — daily, weekday-only, or tri-weekly? Plan assumes daily. Weekdays-only halves the cost and avoids weekends-thin-pickings.
3. **Editorial tone** — fully neutral newswire, or slightly editorial / opinion-light? Plan assumes neutral.
4. **Cover sources** — should we include local-language outlets (Chinese / Thai etc.)? Plan currently English-only.
5. **Connect Pages to Git** — needed for cleaner CI deploy. Otherwise the workflow uses wrangler. Either works.
6. **Per-article auto-promote to homepage** — should the latest news article pin to the homepage's journal area? Plan currently no.
7. **GitHub Actions vs. Cloudflare Worker Cron** — Plan uses Actions (easier, articles in repo). Worker Cron alternative would write to KV/R2 and avoid git churn. Decision: Actions unless you want zero git churn.

### 14. Phased build plan

**Phase 1 — Static skeleton (no automation yet)**
- Add `News` to global nav and footer
- Create `src/pages/news/index.astro` and `src/pages/news/[slug].astro`
- Hand-write 1 sample article JSON to verify rendering
- Visual template + Net-a-Porter chrome
- Deploy

**Phase 2 — Pipeline script (local-only)**
- `scripts/news-pipeline.mjs` — fetches RSS, scores, picks 2, writes brief, generates image, saves files
- API keys in local `.env` for testing
- Run manually a few days, audit output
- Tune scoring weights based on actual hits

**Phase 3 — Deduplication + safety**
- `research/news-seen.json` log
- Topic-similarity check (simple keyword overlap)
- Copyright check (regex for >15 consecutive words from source)

**Phase 4 — Automation**
- GitHub Actions workflow
- Add secrets
- Test with `workflow_dispatch` manual trigger
- Then enable cron

**Phase 5 — Polish**
- Homepage news module (optional)
- Tag pages (`/news/tag/<slug>`)
- RSS feed (`/news.xml`)
- Email digest (much later)

---

## Confirm before I start

1. Image style: **AI-generated per article** vs. **templated overlay** — which?
2. Frequency: **daily** vs. **weekdays only**?
3. Tone: **neutral newswire** vs. **light editorial**?
4. **Connect Cloudflare Pages to Git?** (recommended; one-time UI step)

After those four are confirmed I'll start with Phase 1 (skeleton) and ship that first as a checkpoint before automation.
