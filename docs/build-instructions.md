# Build Instructions

Step-by-step instructions for the AI agent building this site.

## Prerequisites

Before writing any code, read ALL documentation in the `docs/` folder:

1. `PLAN.md` — Overall project plan
2. `brand.md` — Brand identity and design language
3. `style.md` — CSS/Tailwind implementation details
4. `tech-stack.md` — Framework and tooling
5. `page-types.md` — Every page type and its structure
6. `seo.md` — SEO requirements
7. `ranking-methodology.md` — How schools are ranked
8. `images.md` — Image sourcing and handling
9. `content-clusters.md` — Content strategy
10. `prototype-scope.md` — What to build first
11. `qa-checklist.md` — Quality checks for every page

## Build order

Follow this exact sequence:

### Phase 1: Foundation

1. Initialise Astro project with Tailwind CSS v4
2. Set up project structure per `tech-stack.md`
3. Configure Cloudflare Pages deployment
4. Create global styles (typography, colours, spacing)

### Phase 2: Shared components

5. Build utility ribbon component
6. Build header/navigation component
7. Build footer component
8. Build school card component
9. Build city card component

### Phase 3: Prototype pages (Singapore + Tanglin Trust)

10. Create homepage prototype
11. Create rankings page prototype
12. Create Singapore city page
13. Create Tanglin Trust school profile
14. Create journal hub page
15. Create one journal article
16. Create minimal contact page

### Phase 4: Review

17. Run every prototype page through `qa-checklist.md`
18. Fix all issues found
19. Deploy prototype to Cloudflare Pages
20. Flag any issues for user review

## Critical rules

- **Re-read docs frequently** — Before each new component or page, re-read the relevant doc
- **Small batches** — Commit after each component or page, not in bulk
- **No silent downgrades** — If you can't implement something as specified, stop and document why
- **No ISJ code** — Only the tech stack is shared; build everything from scratch
- **Prototype first** — Do not build the full site until prototypes are approved
- **Real data** — Use actual Tanglin Trust and Singapore data, not placeholder text
- **Image handling** — Try hard to source images; if unavailable, leave blank and flag for email to user
- **Year 3 fees** — Internal benchmark only; does not appear on profile pages
- **Schools without published fees** — Do not include them
