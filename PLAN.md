# British Schools Asia — Master Plan

## Overview

**Brand:** British Schools Asia
**Domain:** britishschoolsasia.com
**Positioning:** A curated index of Asia's top British schools.
**Hero promise:** Find the top British schools in Asia.
**Tech stack:** Astro + Tailwind CSS v4 + Cloudflare Pages (ISJ stack only).
**Brand reference:** Net-a-Porter design language.

## Inclusion rules (FROZEN — methodology v2, 2026-04-28)

- British school = uses the English National Curriculum (primary track).
- Geography = top 100 commercial cities in Asia. A city is only included if it has at least one qualifying school.
- Fee threshold = **Top Year Fees of USD 25,000+** equivalent.
- School must have been open more than 12 months.
- If a school does not publish fees, it is not included at all.
- No exceptions. If a school does not meet the rule, it is not listed.

## Ranking system (FROZEN — methodology v2, 2026-04-28)

See `docs/ranking-methodology.md` for the full ruleset. Summary:

- **Base score:** `Top Year Fees in USD + 500,000` (heavy fee compression — quality signals dominate).
- **Penalties (multiplicative):** social media moderate (-10%), social media bad (-20%), tier-1 negative press (-10%).
- **Positive signals (additive):** host country freedom (+10%), inspection in last 24mo (+1%), BSO accreditation (+1%), A Level results published (+1%), IGCSE results published (+1%).
- **Final score:** `Base × (1 + bonuses − penalties)`. Sort descending → asiaRank and cityRank.
- **Public framing:** "data and judgement based" / "research team and panel of industry experts". Internal mechanics never disclosed.
- v1 methodology (Year 3 fee × penalty) is superseded; do not reference.

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
