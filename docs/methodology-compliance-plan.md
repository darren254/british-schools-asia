# Methodology Compliance — Full Audit Plan

**Goal:** bring every school in the index into 100% compliance with [`docs/ranking-methodology.md`](ranking-methodology.md). Build a documented evidence log, apply penalties only on threshold-met evidence, and only publish editorials where the evidence floor is met.

**Note:** As of 2026-04-28 the methodology has been updated to v2 (see ranking-methodology.md change log). v1 evidence already collected (research/evidence-log.json with 37 schools) is reused; new positive-signal data is added on top. See [`methodology-v2-plan.md`](methodology-v2-plan.md) for the v2 transition plan and execution log.

## Current state (as of 2026-04-28)

| Item | Status |
|---|---|
| Schools in index | 37 |
| Schools with `reputationPenalty: 0` | 37 (all) |
| Schools with `hasEditorial: true` | 37 (all) — set in last batch |
| Documented evidence log | **None** |
| Documented currency-conversion log | **None** |

**Why this is a problem:** the methodology requires (a) per-school evidence review across seven source types, (b) the 3-source threshold before any penalty, and (c) **no editorial assessment without that 3-source floor**. We currently have editorials shipped without the underlying evidence review.

## Scope

37 schools × 7 source types = ~260 research checks, plus a final editorial rewrite or revert for each. Currency conversion log is separate but quick.

## Source types to check (per school)

Per the methodology (`docs/ranking-methodology.md`):

| # | Source type | Tool / approach |
|---|---|---|
| 1 | Reddit | Google `site:reddit.com {school name}` + WebFetch on top results |
| 2 | Facebook parent groups | **NOT accessible** — most are closed groups. **User help needed.** |
| 3 | Quora | Google `site:quora.com {school name}` + WebFetch |
| 4 | Forums | Google `site:expat.com {school name}` + variants for region-specific forums (Geoexpat for HK, Hut.com for KL, etc.) |
| 5 | Press / news | Google News + tier-1 press explicitly: Financial Times, Reuters, Bloomberg, BBC, The Times, Telegraph, Wall Street Journal, SCMP (HK), Straits Times (SG), Bangkok Post, Nikkei Asia, Jakarta Post, Vietnam News. Filter to last 36 months. **Tier-1 reporting on serious issues counts as strong evidence on its own — the NLCS FT story is the kind of signal we cannot miss.** |
| 6 | School review sites | International Schools Review (ISR — paywall, partial access), Good Schools Guide (where applicable), TheSchoolDay |
| 7 | Google reviews | Google Maps listing per school (often disabled for schools, but check) |

**Recency filter:** only consider content from 2023-04 onwards (last 36 months from today).

**Banned sources (cannot count toward threshold):** the school's own website, admissions pages, generic directory blurbs, marketing material, anything paid for or authored by the school.

## What I can do automatically

- ✅ Reddit (via Google → WebFetch)
- ✅ Quora (via Google → WebFetch)
- ✅ Press / news (via WebSearch on news domains)
- ✅ Public review sites (where not paywalled)
- ✅ Google reviews (via Maps URLs / search)
- ✅ English-language regional expat forums (Geoexpat, Asian Tigers KL, BangkokExpat, etc.)

## What I CAN'T do — user help needed

- ❌ **Closed Facebook parent groups** — many cities have closed groups (e.g. "Singapore Mums", "HK Expats Schools", "BKK School Mums"). I can't read these. **If you can scroll/search a few of these for any of the 37 schools and paste back relevant excerpts (with date + group name), I'll log them.**
- ❌ **Private/deleted Reddit threads** — occasionally hits on cached versions but most are unrecoverable
- ❌ **Local-language forums** — Chinese parent forums on Baidu, Thai parent forums in Thai script, Vietnamese parent forums. These need native-language search; I can do basic queries but quality is poor.
- ❌ **Word-of-mouth / your network** — if you've heard specific concerns about any of the 37 schools from your professional contacts (industry experts, school leaders, parents you know), share them and I'll log + treat them appropriately. Note that these would not count toward the 3-source threshold (since they're not "independent non-school" public sources) — but they can guide where to look more carefully.

## Files I'll create

```
research/evidence-log.json          ← per-school structured evidence log
research/currency-rates.json        ← documented FX rates with date
docs/methodology-compliance-log.md  ← human-readable progress tracker (this file's sibling)
```

## Per-school evidence log schema

```json
{
  "slug": "tanglin-trust-school",
  "name": "Tanglin Trust School",
  "researchDate": "2026-04-28",
  "researcher": "claude-opus-4-7",
  "sources": [
    {
      "type": "reddit",
      "status": "found",
      "url": "https://www.reddit.com/r/singapore/...",
      "date": "2024-11-12",
      "note": "Two-paragraph parent comment praising Tanglin academic standards",
      "assessment": "positive"
    },
    {
      "type": "facebook_parent_group",
      "status": "not_checked",
      "reason": "Group access requires user help"
    }
  ],
  "negativeSourcesIn36mo": 0,
  "moderateConcerns": false,
  "seriousConcerns": false,
  "penalty": 0,
  "penaltyReason": "No documented negative evidence meeting threshold",
  "hasEditorial": false,
  "editorialDecision": "Cannot publish — evidence floor not met"
}
```

`status` values: `found` / `not_found` / `inaccessible` / `not_checked` (with reason)
`assessment` values: `positive` / `neutral` / `mixed` / `negative`

## Cycle (per school)

1. **Currency** — confirm the school's local-currency Year 3 fee converts to USD at the documented rate; log conversion in `research/currency-rates.json`.
2. **Run all 7 source-type checks** — log each, including `not_found` results (no silent skipping).
3. **Apply the 3-source threshold:**
   - Count independent non-school sources within 36 months with negative or mixed assessment.
   - If < 3 → penalty 0%, `hasEditorial: false`, profile shows the placeholder note.
   - If ≥ 3 with moderate concerns → penalty 10%, editorial can be written **citing the documented sources**.
   - If ≥ 3 with serious concerns → penalty 25%, editorial cited.
4. **Update `schools.json`** — penalty, adjustedFeeScore, hasEditorial, editorial (rewritten only if threshold met).
5. **Re-rank** — adjustedFeeScore changes ripple through asiaRank + cityRank. Run the sort.
6. **Verify the placeholder note** renders correctly on profiles where editorial is removed.
7. **Update progress log** → ✅.

## Phasing

**Phase 0 — Infrastructure** (next step, ~30 min)
- Create the JSON evidence-log skeleton with 37 school stubs
- Create `research/currency-rates.json` with the rates I've already used
- Create `docs/methodology-compliance-log.md` as the human-readable tracker

**Phase 1 — Revert un-evidenced editorials** (immediately, ~15 min)
- Set `hasEditorial: false` on all 37 schools and clear the editorial field
- This restores methodology compliance immediately
- Editorials get re-added in Phase 2 only for schools that pass the threshold

**Phase 2 — Per-school research** (city-by-city, batch sizes 2–7 schools, ~30–90 min per city)
- Order: Singapore → Hong Kong → Bangkok → KL → Shanghai → Beijing → Shenzhen → Tokyo → Hanoi → HCMC → Jakarta
- Per school: 7 source checks, log everything, apply rules
- After each city: deploy any rank changes + republish editorials only for schools that qualified

**Phase 3 — Final pass + cleanup** (~30 min)
- Verify every school has a complete evidence log
- Verify every penalty is justified by the log
- Verify every editorial is cited to ≥3 logged sources
- Re-rank one final time
- Document the FX rates used

## Estimated timeline

- Phase 0: 30 min
- Phase 1: 15 min (immediate methodology compliance)
- Phase 2: 6–10 hours of focused research
- Phase 3: 30 min

The bulk of the time is Phase 2. I can pause at any city boundary; you can hand me Facebook-group screenshots or insider notes between cities and I'll incorporate them.

## What I'd like from you (in priority order)

1. **Approval to proceed** — confirm the plan and approve Phase 0 + 1 (the immediate revert).
2. **Facebook parent groups** — if you have access to Singapore Mums, HK Schools, BKK Expat Schools, KL International School Parents, or similar groups, scrolling them for any of the 37 schools and pasting back relevant excerpts (with date + group name) is the highest-impact help. I can give you a search-term checklist per school if useful.
3. **Insider observations** — anything you've personally heard from school heads, ex-staff, parents in your professional network. These don't count toward the threshold but they tell me where to dig.
4. **Local-language forums** — if you know specific Chinese / Thai / Vietnamese / Indonesian parent forums where any of these schools are discussed, names/URLs help.

## What you should NOT need to do

- Help me with Reddit / Quora / press / Google reviews / English forums / ISR — I can do those.
- Read every editorial I write — Phase 3 will hand you a summary delta to review.
