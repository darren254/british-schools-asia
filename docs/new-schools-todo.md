# New Schools — To-Do List

Outstanding items to bring the 13 schools added in the inclusion audit (Shanghai +6, Hong Kong +3, Bangkok +4) up to the same depth as the original 24.

## The 13 schools

**Shanghai** — Dulwich Pudong, Dulwich Puxi, Harrow Shanghai, Wellington Shanghai, NAIS Pudong, BISS Puxi
**Hong Kong** — YCIS HK, German Swiss, Wycombe Abbey HK
**Bangkok** — Bangkok Patana, St Andrews Bangkok, Denla British, Bromsgrove Thailand

---

## 1. Campus images (highest priority)

Every new school is currently using its city hero (Shanghai/HK/Bangkok skyline) as a placeholder. Visually they're indistinguishable on cards and profiles. Replace each with a real campus shot.

| Slug | Current state | Need |
|---|---|---|
| `dulwich-shanghai-pudong-campus.jpg` | shanghai-hero placeholder | Aerial or front-of-house shot of the Jinqiao campus |
| `dulwich-shanghai-puxi-campus.jpg` | shanghai-hero placeholder | Maqiao campus shot |
| `harrow-shanghai-campus.jpg` | shanghai-hero placeholder | Waigaoqiao campus shot |
| `wellington-shanghai-campus.jpg` | shanghai-hero placeholder | Qiantan campus shot (the riverside building is distinctive) |
| `nais-shanghai-pudong-campus.jpg` | shanghai-hero placeholder | Kangqiao campus shot |
| `biss-puxi-campus.jpg` | shanghai-hero placeholder | Huacao campus shot |
| `ycis-hk-campus.jpg` | hong-kong-hero placeholder | Kowloon Tong campus |
| `gsis-campus.jpg` | hong-kong-hero placeholder | The Peak (Guildford Road) main campus |
| `wycombe-abbey-hk-campus.jpg` | hong-kong-hero placeholder | Aberdeen campus |
| `bangkok-patana-campus.jpg` | bangkok-hero placeholder | La Salle Road campus |
| `st-andrews-bangkok-campus.jpg` | bangkok-hero placeholder | Sukhumvit primary or secondary campus |
| `denla-british-campus.jpg` | bangkok-hero placeholder | Nonthaburi campus |
| `bromsgrove-thailand-campus.jpg` | bangkok-hero placeholder | Windsor Park main campus |

**Source options:** school's own website (with permission, or hot-link to public marketing image), Wikimedia Commons, or paid stock for the city if no good campus shot exists.

## 2. Fee data verification

All fees were sourced from international-schools-guide.com in USD. Local-currency figures were back-calculated using a single FX rate. Need to:

- [ ] Cross-check each school's published fee schedule on its own website
- [ ] Replace back-calculated local-currency figures with the school's actual published numbers (CNY for Shanghai, HKD for HK, THB for Bangkok)
- [ ] Confirm the fee year (2025–26 vs 2026–27) is correct in `feeSummary` and overview prose
- [ ] Add capital levies, debentures, application/enrolment fees as separate fields where significant (currently only mentioned in prose for some)

## 3. Address completeness

Some addresses are partial. Need full street + postcode for parity with existing schools.

| School | Current address | Needs |
|---|---|---|
| Dulwich Puxi | "Maqiao, Minhang District" | Full street address |
| Harrow Shanghai | "Waigaoqiao Free Trade Zone" | Full street address |
| NAIS Pudong | "Kangqiao, Pudong New District" | Full street address |
| BISS Puxi | "Huacao Town, Minhang District" | Full street address |
| YCIS HK | "Three campuses in Kowloon Tong" | List each campus address |
| Wycombe Abbey HK | "Aberdeen, Hong Kong Island" | Full street + building |
| Denla British | "Nonthaburi Province, Greater Bangkok" | Full street address |

## 4. Overview depth

Each new school has a 2–3 paragraph overview. Acceptable but light vs the original 24 which often have specific facility details, leadership, accreditations.

For each, consider adding:
- [ ] Named head/principal where notable (e.g. ISI inspectors, NPQH-qualified)
- [ ] Specific facilities (sports halls, theatres, swimming pools, sizes)
- [ ] Recent academic results (IB average, A Level distribution) — keep generic per the methodology framing
- [ ] Accreditations beyond ENC (CIS, COBIS, FOBISIA, BSO, ISI status)
- [ ] Distinctive programmes (Wellington's house system, Dulwich's bilingual, YCIS's co-teaching model, Patana's heritage)

## 5. Editorial reviews

None of the 13 have `hasEditorial: true`. Currently only Tanglin has an editorial. Either:

- [ ] Leave editorial off for now (consistent with most of the index)
- [ ] OR write editorials for the city #1 ranked schools so each city has at least one editorial: Dulwich Pudong, YCIS HK (already #1 HK), Shrewsbury Bangkok (existing #1)

If editorials are written, follow the methodology framing — "research team and panel of industry experts" + "parent and community feedback" — never expose mechanics.

## 6. Journal article updates

The existing city journal articles still describe the pre-audit state.

| Article | Needs updating because |
|---|---|
| `best-british-schools-shanghai.astro` | Currently describes Shanghai as "one school in the index". Now 7. Full rewrite needed. |
| `best-british-schools-hong-kong.astro` | Pre-existing article, but doesn't mention YCIS, German Swiss, or Wycombe Abbey. |
| `best-british-schools-bangkok.astro` | Pre-existing article, but doesn't mention Patana, St Andrews, Denla, Bromsgrove. |

Each rewrite should follow the standard 8-section template in [docs/journal-cities-articles.md](journal-cities-articles.md).

## 7. Year-3 fee verification

The "Year 3" position in our ranking is taken from each school's relevant year-group bracket. For schools with banded fees, we used the bracket containing Year 3 (e.g. "Years 1–6" or "Years 3–6"). Need to confirm:

- [ ] Each school's actual Year 3 fee matches the bracket figure used (some schools price each year separately)
- [ ] No school has been over- or under-ranked due to a banding mismatch

## 8. Sources / citations

`sources: []` is empty for all 13. The original 24 also have empty sources arrays in many cases, so this is consistent — but if we ever want to surface source links on profiles or in the methodology, we'd populate from:

- [ ] School's published fee schedule URL
- [ ] School's curriculum / about page URL
- [ ] international-schools-guide.com listing
- [ ] Wikipedia page where one exists

## 9. Roll figures

Each school's `roll` is "approximately". For parity with the original index, leave as-is unless there's a verified up-to-date enrolment number.

## 10. Optional: opening-soon schools to add

Two qualifying-but-too-new schools were excluded by the operating-history criterion. They could be added as `hasEditorial: false`, with a flag to exclude from rankings:

- **Dulwich College International School Bangkok** — opens August 2026
- **Brighton College Bangkok Vibhavadi** — opened September 2025 (no full year by April 2026)

Adding either would require a small change: a `rankExcluded: true` flag on the school, plus updates to `index.astro` (Top-20 logic), `rankings.astro`, and city-page rank lists to filter.

---

## Suggested priority order

1. **Campus images** (highest visual impact, currently 13 placeholder duplicates)
2. **Journal article updates** for Shanghai (the article is now factually wrong), Hong Kong, Bangkok
3. **Address completeness** (quick win, supports legitimacy)
4. **Fee verification + local-currency accuracy** (data integrity)
5. **Overview depth** (incremental improvement)
6. Optional: editorial reviews, opening-soon schools, sources, logos
