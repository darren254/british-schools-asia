# British Schools Asia — Master Plan

## Overview

**Brand:** British Schools Asia
**Domain:** britishschoolsasia.com
**Positioning:** A curated index of Asia's top British schools.
**Hero promise:** Find the top British schools in Asia.
**Tech stack:** Astro + Tailwind CSS v4 + Cloudflare Pages (ISJ stack only).
**Brand reference:** Net-a-Porter design language.

## Inclusion rules (FROZEN)

- British school = uses the English National Curriculum.
- Geography = top 100 commercial cities in Asia. A city is only included if it has at least one qualifying school.
- Fee threshold = Year 3 tuition of USD 18,000+ equivalent (internal benchmark only; never shown publicly).
- No exceptions. If a school does not meet the rule, it is not listed.
- Schools must have been open since 2025 or earlier (at least one full academic year). Opening-soon schools can be listed but NOT ranked.
- If a school does not publish fees, it is not included at all.

## Ranking system (FROZEN)

- Base ranking = fees (Year 3 fee in USD equivalent, used internally).
- Reputation = downward penalty only, not a positive scoring component.
- Penalty levels: 0% (no issues), 10% (credible repeated moderate concerns), 25% (serious well-supported concerns).
- Evidence window: last 36 months only. Older coverage is ignored.
- Minimum 3 independent non-school sources required to apply any penalty.
- Allowed sources: Reddit, Facebook parent groups, Quora, forums, press, school review sites, Google reviews (where available).
- Banned sources for reputation: school website copy, admissions pages, generic directory blurbs, promotional content.
- If fewer than 3 independent sources exist: no editorial score, no penalty, factual listing only.

## Homepage Top 20 logic (FROZEN)

1. Build global master ranking by Adjusted Fee Score (fee minus penalty).
2. Pass 1 — City Champions: take each city's highest-ranked school, sort by Adjusted Fee Score, take top 8 into the Top 20 pool.
3. Pass 2 — Global Fill: fill remaining 12 spots from the global master ranking, skipping schools already chosen in Pass 1.
4. Result: Top 20 is fee-driven but structurally diverse across cities.

## Public-facing rules

- Year 3 fee is internal only. Public fee display = summary number + expandable full fee table.
- Ranking mechanics (penalties, adjusted scores) are internal. Public methodology page explains approach at a high level.
- Schools with insufficient evidence: factual profile only, with note "Independent review not yet published" or "Insufficient verified data to publish a reputation score."
- Schools without a score are listed but excluded from the ranked list.

## Launch pages

- Homepage
- Rankings page (Asia-wide)
- Countries index
- Country pages
- Cities index
- City pages
- School profile pages
- Journal hub (editorial section)
- Journal article pages
- Methodology
- About
- Contact
- Privacy
- Terms

No compare tool. No shortlist feature.

## URL structure

- `/` — homepage
- `/rankings` — Asia-wide ranked list
- `/countries` — countries index
- `/countries/{country}` — country page
- `/cities` — cities index
- `/cities/{city}` — city page
- `/schools/{country}/{city}/{school}` — school profile
- `/journal` — editorial hub
- `/journal/{slug}` — article
- `/methodology`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

## Editorial section

- Public name: **Journal**
- Public categories: Rankings, Cities, Guides, News
- Internal categories: Rankings, Cities, Fees, Comparisons, Guides, Openings & Changes
- Split: 80% practical/search-driven, 20% editorial/opinion-led
- Topical authority: sitewide pillar clusters + repeatable per-city clusters

## Prototype scope

Before full build, produce one complete example of every page type:
- Homepage
- Rankings page
- Country page (Singapore)
- City page (Singapore)
- School profile (Tanglin Trust School, Singapore)
- Journal hub
- Journal article
- Methodology
- About
- Contact

Prototype must pass full QA checklist before full rollout begins.

## Quality control

- Every run must re-read PLAN.md and relevant docs before starting work.
- Every batch must echo the QA checklist and mark each item pass/fail.
- No silent downgrades: missing data = missing page or flagged gap, never filler.
- Small reviewable batches (5-10 schools or 1-2 cities per run).
- Frozen sections (marked FROZEN above) cannot be changed without explicit decision.

## Supporting docs

- `docs/brand.md` — components, tokens, fonts, Net-a-Porter reference
- `docs/seo.md` — SEO system
- `docs/ranking-methodology.md` — internal ranking rules
- `docs/page-types.md` — page templates and fields
- `docs/content-clusters.md` — Journal taxonomy and topic clusters
- `docs/images.md` — image sourcing, rules, QA
- `docs/style.md` — tone, copy rules
- `docs/prototype-scope.md` — prototype completion criteria
- `docs/build-workflow.md` — build phases and order
- `docs/qa-checklist.md` — per-page QA checklist
