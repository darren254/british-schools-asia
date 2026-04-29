# Ranking Methodology v2 (INTERNAL ONLY)

**Effective:** 2026-04-28
**Supersedes:** v1 (Year 3 fee × penalty model — superseded)

This document is internal. It must never be published or shared publicly.

The public methodology page presents the ranking as "data and judgement based", with no exposure of formula, weights, bands, evidence log, or source mechanics.

---

## FROZEN RULES (v2)

The following rules cannot be changed without an explicit decision from the project owner.

## Inclusion criteria

A school is in the index if and only if all four are true:

- **Open > 12 months** as of the index date.
- **English National Curriculum primary track** — IB / IGCSE / A Level alongside ENC is fine; IB-PYP-only or non-British primary tracks are excluded.
- **Located in a top-100 Asian commercial city.**
- **Top Year Fees ≥ USD 25,000** equivalent at the documented FX rate.

A school missing any criterion is excluded entirely (not listed at all).

## Base score

```
Base Score = (Top Year Fees in USD + 100,000) / 2
```

Top Year Fees = the highest single year-group annual tuition in the school's published schedule, in USD at the documented rate.

The +100,000 / 2 transform compresses the fee distribution: a $25,000 school scores 62,500; a $60,000 school scores 80,000. Premium schools cluster near the top while lower-fee schools remain meaningfully above zero — quality signals can then move ranks materially.

## Adjustments

Final Score = Base Score × (1 + sum of bonuses − sum of penalties)

### Penalties (multiplicative, downward)

| # | Trigger | Penalty | Evidence threshold |
|---|---|---|---|
| 1 | Social media — moderate | −10% | ≥3 independent non-school sources within 36 months citing recurring concerns: management instability, staff turnover, parent dissatisfaction, communication failures |
| 2 | Social media — bad | −20% | ≥3 independent non-school sources within 36 months alleging safeguarding failures, severe regulatory issues, financial distress, governance crisis, or mainstream-press-confirmed scandal |
| 3 | Negative press | −10% | Any tier-1 outlet within 18 months reporting a school-specific issue (not generic sector reporting). Tier-1 = FT, Reuters, Bloomberg, SCMP, Straits Times, Bangkok Post, Nikkei Asia |

A school cannot receive both moderate and bad social media simultaneously — apply the most serious that applies.

Maximum combined penalty: 30% (bad social + press).

### Positive signals (additive bonuses)

| # | Signal | Bonus |
|---|---|---|
| 1 | Host country freedom from political interference in the curriculum (country-level flag) | +10% |
| 2 | Independent inspection within the last 24 months with positive outcome (BSO / ISI / equivalent) | +1% |
| 3 | BSO Accreditation current (school listed on the BSO register) | +1% |
| 4 | A Level results published on the school's own website | +1% |
| 5 | IGCSE results published on the school's own website | +1% |

Maximum combined bonus: 14%.

#### Host country freedom — country-level call

Applied uniformly per country. Country either qualifies for the +10% or it doesn't. Reviewed when relevant policy changes.

| Country | Freedom bonus | Reason |
|---|---|---|
| Singapore | +10% | No political constraints on ENC delivery |
| Hong Kong | +10% | International curriculum freedom retained as of 2026 |
| Thailand | +10% | No restrictions on ENC delivery |
| Malaysia | +10% | No restrictions on ENC delivery |
| Japan | +10% | No restrictions on ENC delivery |
| Vietnam | +10% | No material restrictions on international school curriculum |
| Indonesia | +10% | No material restrictions on international school curriculum |
| China (mainland) | 0 (excluded from bonus) | Restrictions on local-citizen enrolment, content of certain subjects, and admissions; widely considered a constraint on independent curriculum delivery |

## Final score and ranking

```
Final Score = Base Score × (1 + bonuses − penalties)
```

- All schools sorted globally by Final Score, descending → `asiaRank` (1 to N)
- Schools sorted within each city → `cityRank`

## Evidence requirements

### Source types to check (per school)

1. Reddit
2. Facebook parent groups (where accessible)
3. Quora
4. Forums (regional expat forums, ISR)
5. Press / news (Google News + tier-1 outlets explicitly)
6. School review sites (ISR, Glassdoor, Indeed, WhichSchoolAdvisor, GoodSchoolsGuide, ischooladvisor)
7. Google reviews (where available)

### Recency window

- Social media penalty evidence: last 36 months
- Press penalty evidence: last 18 months
- Inspection bonus: last 24 months

### Minimum evidence threshold

- Social media penalty (10% or 20%) requires ≥3 independent non-school sources
- Press penalty requires ≥1 tier-1 outlet
- Bonuses require objective verification (inspection report visible, BSO list lookup, school's own results page)

### Evidence log

Maintained in `research/evidence-log.json`. Per school: source-type checks, dates, URLs, assessments. No silent skipping — every source type must be marked (`found` / `not_found` / `inaccessible` / `not_checked` with reason).

## Public presentation

- Show Asia rank and city rank on every school profile.
- Show fee summary and expandable fee table.
- Public methodology page describes the system as **"data and judgement based"** without exposing the formula, weights, bands, or evidence log.
- Never label any number publicly as "Year 3 fee" or "adjusted fee score".

## Currency conversion

Documented in `research/currency-rates.json`. Updated when materially out of date (>5% drift on any major fee currency for >3 months).

## Legal guardrails

- Never make speculative allegations.
- Never repeat unverified accusations.
- Stick to summarising what multiple public sources say.
- Where in doubt, apply 0% penalty.
- Editorial assessments must cite the documented evidence; if evidence floor is not met, no editorial — show the placeholder note.

## Methodology versioning

Changes to this document require explicit project-owner approval. When changed:

- Bump version number
- Date the change
- Mark the previous version as superseded
- Re-run the full evidence + compute pipeline
- Document the rank deltas in the change log

### Change log

- **v2 — 2026-04-28** — replaced Year 3 fee × penalty model with `(Top Year Fees + 100,000) / 2 × (1 + bonuses − penalties)` formula. Added positive signals (host country freedom, inspection, BSO, A Level / IGCSE published). Raised entry threshold to USD 25,000 Top Year Fees. Reduced operating-history requirement from "since 2025 or earlier" to "open > 12 months".
- **v1 — 2026-04-03** — initial methodology: Year 3 USD as base, downward reputation penalty only (0/10/25%).
