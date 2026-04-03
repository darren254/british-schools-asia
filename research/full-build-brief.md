# Full Site Build Brief

## What exists now
- 23 schools in `src/data/schools.json` (4 Singapore + 19 new)
- 11 cities, 8 countries
- Existing pages: Singapore city, Singapore country, Tanglin Trust profile, Rankings, Journal hub, 1 journal article, Homepage, Methodology, About, Contact
- All school campus images downloaded in `public/images/`
- All city hero images downloaded in `public/images/`
- Shared components: Header, Footer, SchoolCard, CityCard, UtilityRibbon, JournalSubNav, BaseLayout

## What needs to be built

### 1. Dynamic school profile pages (19 new schools)
Use `[...slug].astro` or `[school].astro` pattern to generate from data.
Each school page URL: `/schools/{countrySlug}/{citySlug}/{slug}`

### 2. City pages (10 new cities)
Each city URL: `/cities/{citySlug}`
Cities: hong-kong, bangkok, kuala-lumpur, tokyo, shanghai, beijing, shenzhen, ho-chi-minh-city, hanoi, jakarta

### 3. Country pages (7 new countries)
Each country URL: `/countries/{countrySlug}`
Countries: hong-kong, thailand, malaysia, japan, china, vietnam, indonesia

### 4. Index pages
- `/cities` — grid of all city cards
- `/countries` — grid of all country cards

### 5. Update homepage
- Top 20 module must use the full 23-school dataset
- Browse by city must show all 11 cities
- Rankings link

### 6. Update rankings page
- Must show all 23 schools from data

### 7. Journal articles for new cities
One article per major city: Hong Kong, Bangkok, KL (minimum)

## City hero images mapping
- singapore: singapore-hero.jpg
- hong-kong: hong-kong-hero.jpg
- bangkok: bangkok-hero.jpg
- kuala-lumpur: kuala-lumpur-hero.jpg
- tokyo: tokyo-hero.jpg
- shanghai: shanghai-hero.jpg
- beijing: beijing-hero.jpg
- shenzhen: shenzhen-hero.jpg
- ho-chi-minh-city: ho-chi-minh-city-hero.jpg
- hanoi: hanoi-hero.jpg
- jakarta: jakarta-hero.jpg
