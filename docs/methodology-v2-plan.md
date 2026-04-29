# Methodology v2 — Plan & Execution Log

Replacing the v1 ranking methodology (Year 3 fee × penalty) with v2 (Top Year Fees compressed, with positive signals + social/press penalties + country freedom bonus).

## Confirmed v2 ruleset

**Inclusion criteria (must meet all):**
- Open > 12 months
- English National Curriculum primary track
- Located in a top-100 Asian commercial city
- Top Year Fees ≥ USD 25,000

**Base score:** `(Top Year Fees in USD + 100,000) / 2`

**Penalties (multiplicative, downward):**
- Social media moderate (-10%): ≥3 independent non-school sources within 36 months citing recurring concerns about management, staff turnover, communication, parent dissatisfaction
- Social media bad (-20%): ≥3 sources within 36 months alleging safeguarding failures, severe regulatory issues, financial distress, governance crisis, mainstream-press-confirmed scandal
- Negative press (-10%): any tier-1 outlet (FT, Reuters, Bloomberg, SCMP, Straits Times, Bangkok Post, Nikkei Asia) within 18 months covering a school-specific issue

**Positive signals (additive bonuses):**
- Host country freedom from political interference (+10%): country-level signal applied uniformly per country
- Inspection in last 24 months (positive outcome) (+1%)
- BSO Accreditation current (+1%)
- A Level results published on school's own site (+1%)
- IGCSE results published on school's own site (+1%)

**Final score:** `Base × (1 + bonuses − penalties)`

**Sort by final score, descending → asiaRank and cityRank.**

**Public framing (unchanged):** "data and judgement based" / "research team and panel of industry experts" / "parent and community feedback". Internal mechanics never disclosed.

## Step-by-step execution log

Status: ⬜ pending · 🔍 in progress · ✅ done

### Phase A — Documentation & Schema

| # | Step | Status |
|---|---|---|
| A1 | Rewrite `docs/ranking-methodology.md` with v2 FROZEN ruleset (mark v1 superseded with date) | ✅ |
| A2 | Update `docs/inclusion-audit.md` to reflect new entry criteria (≥USD 25k Top Year + open >12 months + ENC primary + top-100 city) | ✅ |
| A3 | Update `docs/methodology-compliance-plan.md` and `methodology-compliance-log.md` to reference v2 | ✅ |
| A4 | Re-schema `research/evidence-log.json` to capture social_media_band (moderate/bad), press_18mo, host_country_freedom, inspection_24mo, bso_current, a_level_published, igcse_published | ✅ — v1 penalties carried forward strictly: 2 moderate (YCIS HK, DBIS), 0 bad |

### Phase B — Static / fast data

| # | Step | Status |
|---|---|---|
| B5 | Build per-country host-freedom table (Singapore, HK, Bangkok, KL, Tokyo, Hanoi, HCMC, Jakarta vs mainland China cities) | ✅ — China 10 schools (no bonus), 27 schools in other countries (+10%) |

### Phase C — Per-school research (37 schools)

| # | Step | Status |
|---|---|---|
| C6 | Re-classify existing social-media findings into 10% (moderate) / 20% (bad) per v2 definitions, using evidence-log.json (no fresh research — use what's already there) | ✅ — handled in A4: 2 moderate (YCIS HK, DBIS), 0 bad. Reviewed YCIS bullying/racism reports against the v2 "bad" criteria and concluded these are reputation/management concerns, not safeguarding-confirmed-by-mainstream-press level |
| C7 | Tier-1 press search per school (18-month window) — 37 quick searches | ✅ — 0 of 37 schools have tier-1 negative coverage within 18-month window. v1 historical hits (2016-2019 Harrow HK, NAIS HK, GSIS) outside window. Sanity sweep of generic Asia-British-school-controversy queries returned no school-specific tier-1 coverage. |
| C8 | BSO accreditation current status per school — check BSO list + each school's site | ✅ — 10 schools BSO-accredited per official gov.uk register, 27 not. Sources: Tanglin, Kellett, Harrow HK, NAIS HK, Britannica, Harrow Shanghai, Brighton BKK, Harrow BKK, St Andrews BKK, BIS HCMC. |
| C9 | Inspection in last 24 months per school — check each school's site / inspectorate | ✅ — 6 confirmed within 24 months: Tanglin (Nov 2025), Harrow HK (Mar 2025), Britannica SH (Feb 2025), Harrow SH (Apr 2024), St Andrews BKK (May 2024), BIS HCMC (Nov 2025). Others: outside window or unverifiable. |
| C10 | A Level results published on each school's own site — 37 yes/no checks | ✅ — 20 schools eligible (offers A Level + has first cohort). Excluded: IB-only schools, primary-only (BSB Sanlitun), and schools too young (Brighton SG, Wycombe Abbey HK, ISJ). Curricula corrected for 3 schools (BSB Shunyi, NAIS HK, BIS HCMC) where A Level was offered per overview but missing from JSON. |
| C11 | IGCSE results published on each school's own site — 37 yes/no checks | ✅ — 32 schools eligible. Excluded: BSB Sanlitun (primary only), Brighton SG (Year 10, first IGCSE 2027), ISJ (Year 8 currently), DBIS (lists "GCSE" not "IGCSE"), Nexus (only IGCSE listed but acquires it via IB MYP transition — left in). |

### Phase D — Compute & deploy

| # | Step | Status |
|---|---|---|
| D12 | Build compute script implementing the v2 formula and writing `finalScore`, `socialPenalty`, `pressPenalty`, `qualityBonus`, `countryFreedomBonus` to `schools.json` | ✅ |
| D13 | Apply entry-criteria filter: drop any school with Top Year Fees < USD 25,000 (or flag and exclude from index) | ✅ |
| D14 | Recompute `asiaRank` (1–N descending finalScore) and `cityRank` per city | ✅ |
| D15 | Regenerate school profile pages via `gen-school-pages.mjs` | ✅ |
| D16 | Build (`npm run build`) + deploy (wrangler) | ✅ |
| D17 | Final audit script: verify finalScore math, rank ordering, no missing fields, every penalty/bonus traceable to evidence log | ✅ |

### Phase E — Cleanup & verification

| # | Step | Status |
|---|---|---|
| E18 | Spot-check 4 journal articles (Singapore, HK, Bangkok, Shanghai) — fix any rank/fee references that no longer match | ✅ |
| E19 | Spot-check public `/methodology` page — confirm framing still aligns ("data and judgement based") | ✅ |
| E20 | Final commit summary in this log | ✅ — see summary below |

---

## Final summary (2026-04-28)

**Methodology v2 fully shipped and live.**

**Index size:** 37 → 35 schools (BST Tokyo and Bromsgrove Thailand excluded — Top Year Fees < USD 25k).

**Coverage:** Tokyo and Japan removed from city/country/journal coverage.

**Top 5 Asia (v2):**
1. Harrow International School Shanghai — 82,399 (+4%)
2. Tanglin Trust School (Singapore) — 81,706 (+14%)
3. Dulwich College Shanghai Pudong — 80,077 (+1%)
4. Dulwich College Shanghai Puxi — 80,077 (+1%)
5. Wellington College International Shanghai — 79,429 (+1%)

**Top of HK city ranking:**
1. Kellett School (was YCIS in v1)
2. Harrow International School Hong Kong
3. German Swiss International School

**Schools with documented penalties:** YCIS HK (-10% social media moderate), DBIS (-10% social media moderate). No schools triggered the press penalty.

**Schools with most positive signals:** Tanglin (BSO + inspection-24mo + A Level + IGCSE + country freedom = +14%), BIS HCMC (same combination = +14%), Harrow HK (same = +14%).

**All 7 final audits pass:** evidence-log integrity, finalScore math, entry threshold, asiaRank ordering, cityRank ordering, adjustments-match-evidence, Tokyo/Japan removed.

**Files updated:**
- `docs/ranking-methodology.md` (v1 → v2)
- `docs/inclusion-audit.md` (entry criteria)
- `docs/methodology-compliance-plan.md` and `methodology-compliance-log.md` (note v2 transition)
- `research/evidence-log.json` (re-schema, all 37 schools researched + 5 new positive signals applied)
- `src/data/schools.json` (35 schools, new fields: baseScore, qualityBonus, countryFreedomBonus, socialPenalty, pressPenalty, totalAdjustment, finalScore)
- 35 school .astro pages regenerated
- 3 journal articles updated (Bangkok — Bromsgrove removed; Shanghai — top of city now Harrow; HK — top of city now Kellett)
- Tokyo city page, Japan country page, Tokyo journal article deleted
- Cities index, countries index, homepage, journal index — Tokyo/Japan refs removed

**Public surface unchanged:** "data and judgement based" framing on `/methodology`. No mechanics exposed.

## Cycle

Per step: do it → update log row to ✅ → move to next.

Deploys happen at D16; everything before is local. After deploy, E18-E20 are quick verifications.
