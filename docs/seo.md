# SEO System

## Core goals

- Rank for commercial school-discovery terms: "best British schools in Singapore", "British schools in Hong Kong".
- Rank for research terms: fees, rankings, comparisons, city-specific parent questions via Journal.
- Keep every important page within 3 clicks of homepage.

## Search architecture layers

1. Homepage: brand + broad Asia queries.
2. Country pages: "British schools in {country}".
3. City pages: primary commercial landing pages, e.g. "best British schools in Singapore".
4. School pages: entity pages for individual schools.
5. Journal pages: informational support, comparisons, fee guides, city guides, rankings, news.

## Page-by-page SEO roles

### Homepage
- Target: British schools in Asia, best British schools in Asia.
- One H1, short intro, ranked module, links to top cities/countries/Journal.
- Organisation schema, breadcrumbs.

### Country pages
- Target: British schools in {country}.
- Country-specific intro, links to cities, ranked schools, Journal links, FAQ.
- CollectionPage/ItemList schema.

### City pages (highest value)
- Target: best British schools in {city}, British schools in {city}, top British schools in {city}.
- Unique intro (not token-swapped), ranked list, market explanation, school links, Journal links, FAQ.
- Internal links to country page, rankings, related cities.

### School profile pages
- Target: school brand name queries, fee/review modifiers.
- Unique title/meta, quick facts, overview, editorial (if allowed), fee table, location, structured data.
- Links up to city/country, laterally to comparable schools.

### Journal hub and articles
- Target: informational search intent, topical authority support.
- Every article belongs to one cluster and links back to its pillar page.
- Every article links to relevant city/country/school pages.

## On-page standards (all templates)

- Unique title tag and meta description.
- One H1 only.
- Strong opening summary.
- One unique local/data block per page.
- FAQ only where genuinely useful.
- Tables for fee/rank comparisons.
- Clear entity naming.

## Internal linking rules

- Homepage links to top countries, cities, rankings, methodology, Journal pillars.
- Country pages link to city pages and country-relevant schools.
- City pages link to all school pages in that city + Journal pages.
- School pages link back to city/country + related schools.
- Journal articles link to at least one city/country/school page and one pillar.
- Pillars link down to clusters; clusters link back up.

## Technical SEO

- XML sitemap(s).
- Clean robots.txt.
- Canonical tags on every page.
- Open Graph / Twitter metadata.
- Breadcrumbs.
- Fast LCP (<2.5s), low CLS (<0.1), low INP (<200ms), TTFB (<800ms).
- AVIF/WebP images with dimensions set.
- Search Console setup.
- Schema markup on key templates.
- No accidental noindex on production.
- llms.txt at root.

## Schema plan

- Homepage: Organization.
- BreadcrumbList on major templates.
- Journal articles: Article/BlogPosting.
- Ranking pages: ItemList.
- FAQPage only where genuinely present.
- School pages: education/school entity schema.

## Programmatic SEO safeguards

- Do not publish pages with weak or missing data.
- Do not create city pages if no qualifying schools.
- Do not create token-swapped intros.
- Every page must have enough unique content to justify indexation.
- If a template does not pass quality threshold, noindex until fixed.

## Per-page SEO checklist

- [ ] Primary keyword mapped.
- [ ] Title and meta written.
- [ ] H1 set.
- [ ] Intro unique.
- [ ] Internal links added per rules above.
- [ ] Schema valid.
- [ ] Canonical set.
- [ ] Image alts added.
- [ ] Page included in sitemap.
- [ ] Index/noindex decision made.
- [ ] QA at mobile and desktop.
