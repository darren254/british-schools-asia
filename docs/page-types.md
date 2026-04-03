# Page Types and Templates

## Homepage

URL: `/`
Sections (in order):
1. Utility ribbon
2. Global header
3. Full-bleed hero: "Find the top British schools in Asia" + subline + ghost CTA
4. Top 20 ranked schools carousel (city-champion + global-fill logic)
5. Browse by city / country module
6. Why this index / methodology teaser
7. Journal crossover module with featured articles
8. Selected cities duo promo
9. Email capture
10. Footer

## Rankings page

URL: `/rankings`
Sections:
1. Header
2. Page title: "Asia's Top British Schools"
3. Intro paragraph
4. Full ranked list (all scored schools)
5. Methodology link
6. Footer

## Countries index

URL: `/countries`
Sections:
1. Header
2. Page title
3. Grid of country cards with school count per country
4. Footer

## Country page

URL: `/countries/{country}`
Sections:
1. Header
2. Country name as H1
3. Country intro (unique)
4. Cities in this country
5. Ranked schools in this country
6. Related Journal articles
7. FAQ (if useful)
8. Footer

## Cities index

URL: `/cities`
Sections:
1. Header
2. Page title
3. Grid of city cards with school count per city
4. Footer

## City page

URL: `/cities/{city}`
Sections:
1. Header
2. City hero image
3. City name as H1
4. City intro (unique, not token-swapped)
5. Ranked schools in this city (listing grid)
6. City market context
7. Related Journal articles
8. FAQ
9. Internal links to country, related cities
10. Footer

## School profile page

URL: `/schools/{country}/{city}/{school}`

### Quick facts panel
- School name
- City, country
- Type: day / day & boarding / boarding
- Age range / year range
- Curricula (English National Curriculum, IGCSE, A levels, IB if applicable)
- Year founded (if public)
- Approximate roll (if available)
- Fee summary: "Fees from {currency}{X} per year"
- Website link

### Ranking
- Asia rank
- City rank

### Overview
- 1-2 paragraph factual overview (always present, always neutral)

### Editorial assessment
- Only shown when 3+ independent non-school sources within 36 months exist
- Short editorial paragraph
- Reputation summary
- If insufficient evidence: "Independent review not yet published" note

### Fees
- Summary line
- Expandable fee table by year group (where available)
- Notes on capital fees, one-off charges

### Academics and outcomes
- Exam pathways
- Head of school (if public)
- Results (if available later)

### Campus and location
- Campus address
- Area/neighbourhood
- Short location context

### Waitlist note
- Only if clear recent independent evidence of ongoing waitlists
- One sentence maximum
- Most schools will not have this

### Related
- Other top schools in this city
- Related Journal articles

### Footer elements
- Subtle link: "Visit school website"
- Sources/methodology note
- Breadcrumbs

## Journal hub

URL: `/journal`
Sections:
1. Header
2. Sub-nav: Rankings, Cities, Guides, News
3. Journal wordmark
4. Featured article (large)
5. Themed clusters: Latest Rankings, City Guides, Parent Guides, News
6. Each cluster: mix of large feature cards and smaller list items
7. Footer

## Journal article

URL: `/journal/{slug}`
Sections:
1. Header
2. Sub-nav
3. Full-bleed hero image with category label + headline overlaid
4. Article body with inline images
5. Links to related school/city/country pages
6. Related articles
7. Footer

## Methodology

URL: `/methodology`
Public-facing, high-level explanation of how schools are selected and ranked. No internal details.

## About

URL: `/about`
Brief explanation of British Schools Asia, its purpose, and who it is for.

## Contact

URL: `/contact`
Minimal contact information.

## Privacy / Terms

URLs: `/privacy`, `/terms`
Standard legal pages.
