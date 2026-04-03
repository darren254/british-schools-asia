# Prototype Scope

## Purpose

Build one complete example of every page type before full rollout. The prototype must pass the full QA checklist.

## Prototype city and school

- City: Singapore
- Country: Singapore
- School: Tanglin Trust School

## Pages to build

### 1. Homepage
- Hero with real image and copy
- Top 20 module (can use placeholder data for non-Singapore schools)
- Browse by city/country module
- Methodology teaser
- Journal crossover with at least one real article
- Email capture
- Footer

### 2. Rankings page
- Full ranked list (can use partial data for prototype)
- Intro text
- Methodology link

### 3. Country page (Singapore)
- Country intro (unique)
- Cities list
- Ranked schools
- Journal links

### 4. City page (Singapore)
- City hero image (from Unsplash/Pexels)
- Unique intro
- Ranked schools in Singapore
- Market context
- Journal links
- FAQ

### 5. School profile (Tanglin Trust School)
- Full quick facts panel with real data
- Asia rank and city rank
- Factual overview
- Editorial assessment (if 3+ sources found)
- Fee table (real fees from school website)
- Academics section
- Campus and location
- Related schools
- Visit school website link
- Sources/methodology note

### 6. Journal hub
- Sub-nav (Rankings, Cities, Guides, News)
- Featured article
- Themed clusters with at least one article each

### 7. Journal article
- One full article: "Best British Schools in Singapore"
- Full-bleed hero image
- Article body with inline images
- Links to school profiles and city page

### 8. Methodology
- Public-facing explanation
- No internal details

### 9. About
- What British Schools Asia is and who it is for

### 10. Contact
- Minimal contact page

## Completion criteria

Every prototype page must:
- [ ] Use correct brand components from docs/brand.md
- [ ] Follow Net-a-Porter design patterns (explicitly stated in build notes)
- [ ] Meet image requirements from docs/images.md
- [ ] Pass SEO checklist from docs/seo.md
- [ ] Pass full QA checklist from docs/qa-checklist.md
- [ ] Use real data where possible (Tanglin Trust, Singapore)
- [ ] Be implemented in Astro + Tailwind CSS v4
- [ ] Be deployable to Cloudflare Pages

## Build order

1. Design system / shared components (header, footer, utility ribbon, cards)
2. Homepage
3. Rankings page
4. City page (Singapore)
5. School profile (Tanglin Trust)
6. Journal hub
7. Journal article
8. Country page (Singapore)
9. Methodology / About / Contact
10. Review and refine
