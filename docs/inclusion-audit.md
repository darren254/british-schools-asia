# Inclusion Audit — Are We Missing Any Schools?

A repeatable plan to audit each existing covered city against the FROZEN inclusion criteria and surface schools that should be added.

**Scope:** existing 11 cities only. No new-city expansion.

## The criteria (FROZEN, methodology v2 — see [`ranking-methodology.md`](ranking-methodology.md))

A school is included if **all four** are true:

1. **Curriculum** — Uses the English National Curriculum primary track (IB / IGCSE / A Level alongside is fine).
2. **Operating history** — Open more than 12 months as of the index date.
3. **Geography** — Located in a top-100 Asian commercial city.
4. **Top Year Fees ≥ USD 25,000** equivalent at the documented FX rate.

Anything failing one or more = excluded entirely (not listed at all). Fees-not-published is treated as failing the fee threshold (cannot verify).

## Per-city audit workflow

For each city, follow these six steps in order:

1. **List all candidates.** Search "British international school {city}" + "English National Curriculum {city}" + check the city's expat directory (e.g. ISC, Good Schools Guide, COBIS, FOBISIA member lists, BSO list). Don't filter yet — list every school that claims a British curriculum.
2. **Rule out the obvious misses.** Drop any school that's IB-only, American, or local-curriculum-with-British-section. We need ENC as the primary track.
3. **Check fee publication.** Visit each remaining school's website. Look for `/fees`, `/admissions/fees`, `/tuition`. If fees aren't published, the school is excluded — record it in the log as "excluded — no published fees".
4. **Check Year 3 fee in USD.** Convert published Year 3 / equivalent year-group fee to USD at current FX rates. If < USD 18,000, exclude. Record the number and decision.
5. **Check operating history.** Confirm the school had at least one full academic year before 2025–26. If newer, mark for inclusion as "opening soon" — listed without ranking.
6. **Cross-check against `schools.json`.** Anything passing 1–5 that's not already in the index = candidate to add. Capture all data per the school-profile schema.

## Data to capture for each candidate

If a school passes the audit, gather (in this order so the JSON is direct to write):

- `name` (official, with country/city qualifier in parentheses if needed)
- `slug` (lowercase, kebab-case)
- `city`, `citySlug`, `country`, `countrySlug`
- `type` (Day / Day & Boarding)
- `ageRange`, `yearRange`
- `curricula` (array — ENC + any IGCSE / A Level / IB Diploma)
- `founded`, `roll`
- `website`
- `feeSummary` (local currency one-liner), `feeSummaryUSD`
- `feeCurrency`, `year3Fee`, `year3FeeUSD`
- `fees[]` (array of `{yearGroup, annualFee, currency}`)
- `campus.address`, `campus.area`, `campus.context`
- 2–3 paragraph `overview` (per the copywriting framework — scannable, no slab)
- Hero image (sourced from Wikimedia Commons or the school directly, save to `/public/images/{school-slug}-campus.jpg`)

After insertion, the ranking re-sorts automatically based on `adjustedFeeScore`. Update `cityRank` and `asiaRank` for the affected city by re-running the sort.

## Audit log

Status legend: ⬜ not started · 🔍 in progress · ✅ audited (no additions) · ➕ audited (additions made)

| City | Current schools | Status | Candidates found | Outcome |
|---|---|---|---|---|
| Singapore | 4 | ⬜ | — | Look at: Stamford American, Marlborough — most likely IB-only, low expected yield |
| Hong Kong | 7 | ➕ | 3 added | Added YCIS HK, German Swiss, Wycombe Abbey HK. ESF secondary (Island/KGV/Sha Tin/SIS/WIS) excluded — IB MYP primary track, not ENC. ESF primaries (Bradbury, Beacon Hill, etc.) excluded — Year 3 fee $17,736 < threshold. AIS HK excluded — Australian/IB. |
| Bangkok | 8 | ➕ | 4 added | Added Bangkok Patana, St Andrews Bangkok, Denla British, Bromsgrove Thailand. Excluded: Dulwich Bangkok (opens 2026), Brighton Vibhavadi (opens 2025, no full year), St Andrews satellite campuses (Sathorn/Dusit fees < threshold), Charter/Heathfield/Garden Bkk/Aster (fees < threshold), AIS Bangkok (Australian/IB), Lycée Français (French), RIS Swiss (Swiss/German). |
| Kuala Lumpur | 3 | ⬜ | — | Look at: Marlborough College Malaysia (Iskandar), Epsom College (Bandar Enstek), Cempaka |
| Beijing | 2 | 🔍 | Paused | Audit started but paused at user request. Confirmed candidates to add when resumed: Dulwich Beijing (Year 3 $47,326 ✓), Harrow Beijing (Year 3 $44,879 ✓), and likely Yew Chung Beijing pending verification. |
| Shanghai | 7 | ➕ | 6 added | Added Dulwich Pudong, Dulwich Puxi, Harrow Shanghai, Wellington Shanghai, NAIS Pudong, BISS Puxi (all qualify; ENC + IGCSE + IB Diploma/A Level; Year 3 USD 46,759–50,110). Britannica retained at city #7. |
| Shenzhen | 1 | ⬜ | — | Look at: Nord Anglia Shenzhen, Shekou International, Merchiston International |
| Tokyo | 1 | ⬜ | — | Look at: Aoba-Japan (IB), Saint Maur (mostly American), British School Setagaya — likely no additions |
| Jakarta | 2 | ⬜ | — | Look at: Sekolah Pelita Harapan (mostly IB), JIS (American) — likely no additions |
| Hanoi | 1 | ⬜ | — | Look at: UNIS (IB), St. Paul American — BIS Hanoi may be the only ENC school |
| Ho Chi Minh City | 1 | ⬜ | — | Look at: ABC International, Saigon South International, ISHCMC (IB) — verify ENC status |

## Process per audit cycle

When you (or I) sit down to audit one city:

1. Open this doc → pick a `⬜` city
2. Mark it `🔍`
3. List candidates (step 1 of workflow)
4. Run criteria checks (steps 2–5)
5. Capture data for any qualifier (per the schema above)
6. Add to `schools.json`, source/save hero images, run `npm run build` to regenerate
7. Update `cityRank` / `asiaRank` if rank order shifted
8. Build, deploy, verify
9. Update this log: status → ✅ or ➕, fill in candidates found and outcome
10. Move to next city

## Priority order for auditing

Drive by where additions are most likely:

1. **Shanghai, Hong Kong, Bangkok** — likely missing premium schools (Wellington / Dulwich / Harrow networks have multiple campuses we don't cover)
2. **Beijing, Shenzhen** — also likely have premium-tier additions
3. **Kuala Lumpur, Singapore** — well-covered, low expected yield
4. **Vietnam (HCMC + Hanoi), Tokyo, Jakarta** — small markets, existing coverage probably complete

## Definition of done (per city)

- Every claimed British curriculum school in the city has been listed and checked against all 5 criteria
- Every excluded school has a one-line reason recorded in the log
- Every qualifying school is in `schools.json` with full data
- Hero image saved at `/public/images/{slug}-campus.jpg`
- Ranks re-sorted and updated
- Live site built and deployed
- Log row updated to ✅ (no additions) or ➕ (additions made), with candidate count
