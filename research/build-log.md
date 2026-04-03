# Build Log — British Schools Asia Site Pages

**Date:** 2026-04-03  
**Build result:** ✅ 54 pages built in 2.76s, zero errors

---

## Summary

Built all remaining pages for the British Schools Asia site. Total page count went from ~7 existing pages to 54 pages.

## Files Created

### School Profile Pages (22 new, 1 existing)

All follow the tanglin-trust-school.astro pattern. Fee tables adapted for two data formats:
- Format A (Tanglin): `{ year, tuition, buildingFund, total }` — 4-column table
- Format B (all others): `{ yearGroup, annualFee, currency }` — 2-column table

| Path | School |
|------|--------|
| `schools/china/shenzhen/harrow-international-school-shenzhen.astro` | Harrow International School Shenzhen |
| `schools/china/beijing/british-school-beijing-sanlitun.astro` | The British School of Beijing, Sanlitun |
| `schools/china/beijing/british-school-beijing-shunyi.astro` | The British School of Beijing, Shunyi |
| `schools/china/shanghai/britannica-international-school-shanghai.astro` | Britannica International School Shanghai |
| `schools/singapore/singapore/brighton-college-singapore.astro` | Brighton College (Singapore) |
| `schools/singapore/singapore/nexus-international-school.astro` | Nexus International School |
| `schools/singapore/singapore/dulwich-college-singapore.astro` | Dulwich College (Singapore) |
| `schools/vietnam/hanoi/british-international-school-hanoi.astro` | British International School Hanoi |
| `schools/vietnam/ho-chi-minh-city/british-international-school-ho-chi-minh-city.astro` | BIS Ho Chi Minh City |
| `schools/hong-kong/hong-kong/kellett-school.astro` | Kellett School |
| `schools/hong-kong/hong-kong/harrow-international-school-hong-kong.astro` | Harrow International School Hong Kong |
| `schools/hong-kong/hong-kong/nord-anglia-international-school-hong-kong.astro` | Nord Anglia International School HK |
| `schools/hong-kong/hong-kong/discovery-bay-international-school.astro` | Discovery Bay International School |
| `schools/thailand/bangkok/shrewsbury-international-school-bangkok.astro` | Shrewsbury International School Bangkok |
| `schools/thailand/bangkok/wellington-college-international-school-bangkok.astro` | Wellington College Bangkok |
| `schools/thailand/bangkok/brighton-college-bangkok.astro` | Brighton College Bangkok |
| `schools/thailand/bangkok/harrow-international-school-bangkok.astro` | Harrow International School Bangkok |
| `schools/indonesia/jakarta/british-school-jakarta.astro` | British School Jakarta |
| `schools/malaysia/kuala-lumpur/alice-smith-school.astro` | Alice Smith School |
| `schools/malaysia/kuala-lumpur/garden-international-school.astro` | Garden International School |
| `schools/malaysia/kuala-lumpur/british-international-school-kuala-lumpur.astro` | BISKL |
| `schools/japan/tokyo/the-british-school-in-tokyo.astro` | The British School in Tokyo |

### City Pages (10 new, 1 existing)

| Path | City |
|------|------|
| `cities/hong-kong.astro` | Hong Kong |
| `cities/bangkok.astro` | Bangkok |
| `cities/kuala-lumpur.astro` | Kuala Lumpur |
| `cities/tokyo.astro` | Tokyo |
| `cities/shanghai.astro` | Shanghai |
| `cities/beijing.astro` | Beijing |
| `cities/shenzhen.astro` | Shenzhen |
| `cities/ho-chi-minh-city.astro` | Ho Chi Minh City |
| `cities/hanoi.astro` | Hanoi |
| `cities/jakarta.astro` | Jakarta |

Each has unique intro content (not token-swapped), market context, FAQs, and ranked school grid.

### Country Pages (7 new, 1 existing)

| Path | Country | Cities |
|------|---------|--------|
| `countries/hong-kong.astro` | Hong Kong | Hong Kong |
| `countries/thailand.astro` | Thailand | Bangkok |
| `countries/malaysia.astro` | Malaysia | Kuala Lumpur |
| `countries/japan.astro` | Japan | Tokyo |
| `countries/china.astro` | China | Beijing, Shanghai, Shenzhen |
| `countries/vietnam.astro` | Vietnam | Hanoi, Ho Chi Minh City |
| `countries/indonesia.astro` | Indonesia | Jakarta |

### Index Pages (2 new)

| Path | Content |
|------|---------|
| `cities/index.astro` | Grid of all 11 city cards with school counts |
| `countries/index.astro` | Grid of all 8 country cards with school counts |

### Journal Articles (3 new)

| Path | Article |
|------|---------|
| `journal/best-british-schools-hong-kong.astro` | Best British Schools in Hong Kong |
| `journal/best-british-schools-bangkok.astro` | Best British Schools in Bangkok |
| `journal/best-british-schools-kuala-lumpur.astro` | Best British Schools in Kuala Lumpur |

### Updated Pages (3)

| Path | Changes |
|------|---------|
| `index.astro` | Top 20 schools (city champions first), all 11 cities |
| `journal/index.astro` | Added 3 new article cards to Cities cluster |
| `rankings.astro` | No changes needed — already data-driven, renders all 23 |

## Key Decisions

1. **Fee table format:** Detected two data formats in schools.json and generated appropriate table structures for each. Schools with `{yearGroup, annualFee}` get a simpler 2-column table; Tanglin's `{year, tuition, buildingFund, total}` format gets the full 4-column table.

2. **Top 20 logic:** Homepage uses city champions first (one per city = 11 schools), then fills remaining 9 slots from global rank order. Displayed sorted by asiaRank.

3. **Generator script:** `scripts/gen-school-pages.mjs` generates all school profile pages from schools.json. Can be re-run to regenerate if data changes.

4. **No existing files modified** except: `index.astro` (homepage) and `journal/index.astro`.

5. **No components modified.** All new pages use existing Header, Footer, SchoolCard, CityCard, BaseLayout, JournalSubNav components as-is.

## Build Output

```
54 page(s) built in 2.76s
Complete!
```
