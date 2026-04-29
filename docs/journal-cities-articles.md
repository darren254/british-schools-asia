# Journal — "Best British Schools in {City}" Articles

A repeatable plan for producing one editorial guide per city covered, referencing our published rankings.

## Why these articles exist

- **Search demand**: "best british schools in {city}" is the highest-intent query parents type when they're 6–18 months from a move.
- **Authority**: each article anchors our ranking position with editorial reasoning, so the published rank doesn't sit alone as a number.
- **Cross-link fuel**: every article links to the city page, every school profile, methodology, and rankings — strengthening internal SEO across the site.

## Approach

**Use the existing Singapore article as the template.** It works: tight market intro, one paragraph per top-ranked school, fees-in-context section, parent-practical section, related links. Don't reinvent the structure; standardise it.

**One article per city, regardless of school count.** Cities with 1–2 schools still get an article — the framing shifts:
- 4+ schools → "Best British Schools in {City}" — ranking-led
- 2–3 schools → "Best British Schools in {City}" — comparative + market context
- 1 school → "British Schools in {City}" — single-school profile + market context + new entrants

**Reference the score, not the score's mechanics.** The methodology page now reads as "research team + industry experts + parent and community feedback". Articles must echo that voice: "ranked first by our research team", "leads the index", "our editorial team's assessment". Never expose internal mechanics (Year 3 fee in USD, adjusted fee score, penalty %) in article copy. Numbers cited must be visible school facts (fees, dates, student count, nationalities).

**Keep articles ~400–600 words.** Singapore is 414 words and reads tight. Don't pad. Three short body paragraphs after the lede + two short sub-sections is the ceiling.

## Standard article structure

Every article follows this skeleton (sections in order):

1. **Hero** — full-bleed city image, label "Cities", H1: "Best British Schools in {City}"
2. **Meta line** — "Published {Month Year} · {N} min read"
3. **Lede paragraph** — 2–3 sentences: how many schools we cover in {city}, fee range in local currency or USD, one-line market shape
4. **Ranked-school paragraphs** — one paragraph per school, in rank order, top 3 minimum (or all schools if fewer than 3). Each paragraph: link to profile, founding year, distinctive feature, fees signpost, student count
5. **Fees in context** — H2 sub-section: typical fee band, what's included/excluded, comparison to other Asian cities where useful
6. **What parents should know** — H2 sub-section: practical considerations (waitlists, post-16 pathway differences, location, language of instruction nuance, anything specific to that city's expat scene)
7. **Closing line** — CTA pointing to the city page and the rankings page
8. **Related** — three links: full rankings, city guide, methodology

## Voice & tone (per copywriting framework)

- "You" outnumbers "we" by 2:1
- No paragraph longer than 4 lines on screen
- Lead each ranked-school paragraph with the school's name, not "Founded in 1925, …"
- One specific number per paragraph (year, student count, fee, nationality count)
- No filler phrases ("It is worth noting that…", "Notably…", "In addition…")
- Cut every adverb that doesn't change the meaning

## Per-city research checklist

Before drafting each article, pull from `src/data/schools.json` for that city:

- City school count and rank order (`citySlug` filter, sort by `cityRank`)
- For each school: name, founded, roll, curricula, year3FeeUSD, feeSummary, distinctive feature from overview
- Fee range: lowest-rank school's lowest year-group fee → top-rank school's top year-group fee
- Notable post-16 pathway differences (A Level vs IB Diploma vs both)
- Anything in `school.campus.context` worth surfacing (location, facilities)

If anything you'd want to write isn't in the data, either pull it from the school's website (verify against published sources) or leave it out. **Never invent facts.**

## File and routing

- File: `src/pages/journal/best-british-schools-{citySlug}.astro`
- Route: `/journal/best-british-schools-{citySlug}/`
- Hero image: `/images/journal-{citySlug}.jpg` — 16:9, distinctive city shot, not the same as `/images/{citySlug}-hero.jpg` (which is used on the city card)
- Add a card to `src/pages/journal/index.astro` under the "Cities" cluster

## Hero image sourcing

- Wikimedia Commons (CC-licensed, direct download via thumb URL)
- Unsplash (use a known photo ID, set `?w=1600&q=80&fm=jpg`)
- Distinct from the city card image — should feel editorial, not catalogue
- Aspect ratio crop-friendly to 16:9

## Definition of done (per article)

- Lints/builds without error (`npm run build`)
- Word count 400–600
- All school links resolve to live profile pages
- Hero image present at `/images/journal-{citySlug}.jpg`
- Article card added to journal hub
- No exposed methodology mechanics
- Copy passes the copywriting framework's "Quick-Reference Editing Checklist"
- Deployed and live

---

## Article log

Status legend: ✅ live · 🟡 drafted, not live · ⬜ not started

| City | Country | Schools | Status | File | Notes |
|---|---|---|---|---|---|
| Singapore | Singapore | 4 | ✅ | `best-british-schools-singapore.astro` | Template article — reference for all others |
| Hong Kong | Hong Kong | 4 | ✅ | `best-british-schools-hong-kong.astro` | |
| Bangkok | Thailand | 4 | ✅ | `best-british-schools-bangkok.astro` | |
| Kuala Lumpur | Malaysia | 3 | ✅ | `best-british-schools-kuala-lumpur.astro` | |
| Beijing | China | 2 | ✅ | `best-british-schools-beijing.astro` | Both Nord Anglia campuses (Sanlitun, Shunyi) — framed as a location decision |
| Shanghai | China | 1 | ✅ | `best-british-schools-shanghai.astro` | Britannica single-school + IB-vs-British market context |
| Shenzhen | China | 1 | ✅ | `best-british-schools-shenzhen.astro` | Harrow Shenzhen — Asia fee leader, Qianhai location, rare mainland boarding |
| Tokyo | Japan | 1 | ✅ | `best-british-schools-tokyo.astro` | BST single-school — Azabudai/Showa dual campus + tight Tokyo expat school market |
| Jakarta | Indonesia | 2 | ✅ | `best-british-schools-jakarta.astro` | ISJ (rank #1, opened 2021) and BSJ (rank #2, established 1973) — challenger vs incumbent framing |
| Hanoi | Vietnam | 1 | ✅ | `best-british-schools-hanoi.astro` | BIS Hanoi single-school + Vinhomes Riverside vs West Lake commute |
| Ho Chi Minh City | Vietnam | 1 | ✅ | `best-british-schools-ho-chi-minh-city.astro` | BIS HCMC three-campus + District 2 An Phu + dual A-Level/IB pathway |

**Priority order for drafting** (by combined search volume × school count × strategic value):
1. Jakarta (2 schools, ISJ-related, recently launched school = newsworthy)
2. Beijing (2 schools, large expat market)
3. Shanghai (high search volume even with 1 school)
4. Tokyo (high search volume, premium market)
5. Hanoi
6. Ho Chi Minh City
7. Shenzhen (lowest priority — niche premium-only)

## How to use this plan

When starting a new article:

1. Open this file
2. Confirm city is `⬜` in the log
3. Read the standard structure section
4. Pull the city's schools from `schools.json` per the research checklist
5. Source a hero image and save to `/public/images/journal-{citySlug}.jpg`
6. Copy `best-british-schools-singapore.astro` as the starting template
7. Replace hero src, alt, H1, meta description, and body paragraphs
8. Add a card to `journal/index.astro`
9. Build, deploy, verify on live
10. Update the log row to ✅
