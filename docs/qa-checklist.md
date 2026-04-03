# QA Checklist

Every page must pass ALL checks below before being considered complete.

## 1. Brand compliance

- [ ] Typography matches docs/brand.md specifications
- [ ] Colour palette uses only approved brand colours
- [ ] Spacing follows Net-a-Porter-inspired rhythm (generous whitespace)
- [ ] No decorative borders, shadows, or rounded corners unless specified
- [ ] Utility ribbon present and styled correctly
- [ ] Header and footer match shared component spec

## 2. Content accuracy

- [ ] School name matches official school website exactly
- [ ] City and country are correct
- [ ] Fee data is current (within 12 months) and sourced
- [ ] Curriculum description is accurate (English National Curriculum confirmed)
- [ ] Year 3 fee meets USD 18,000 minimum threshold
- [ ] All factual claims have a verifiable source

## 3. Ranking integrity

- [ ] Base ranking uses fee data (highest fee = rank 1)
- [ ] Reputation modifiers applied per docs/ranking-methodology.md
- [ ] At least 3 independent non-school sources checked
- [ ] No source older than 36 months used for reputation scoring
- [ ] Adjustments documented with reasoning

## 4. SEO

- [ ] Page title follows template from docs/seo.md
- [ ] Meta description present, unique, under 160 chars
- [ ] H1 is unique and contains primary keyword
- [ ] Only one H1 per page
- [ ] Internal links present where relevant
- [ ] URL slug is clean and descriptive
- [ ] Structured data (JSON-LD) present for school profiles
- [ ] Canonical URL set

## 5. Images

- [ ] No images with text overlaid
- [ ] All images have descriptive alt text
- [ ] Images optimised (WebP, appropriate dimensions)
- [ ] Fallback/placeholder for missing images
- [ ] Flagged missing images logged for email to user
- [ ] No stock photos

## 6. Responsive design

- [ ] Page renders correctly at 320px, 768px, 1024px, 1440px
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Navigation works on mobile

## 7. Performance

- [ ] Lighthouse performance score > 90
- [ ] No render-blocking resources
- [ ] Images lazy-loaded below the fold
- [ ] Total page weight under 500KB (excluding images)

## 8. Accessibility

- [ ] Colour contrast meets WCAG AA (4.5:1 for text)
- [ ] All interactive elements keyboard-navigable
- [ ] ARIA labels on non-text interactive elements
- [ ] Skip-to-content link present

## 9. Technical

- [ ] Page builds without errors in Astro
- [ ] No console errors or warnings
- [ ] Deploys successfully to Cloudflare Pages
- [ ] All links resolve (no 404s)
- [ ] Tailwind CSS v4 classes only (no v3 syntax)

## 10. Process

- [ ] Page reviewed against this checklist before commit
- [ ] Any deviations from docs documented with reasoning
- [ ] Flagged issues logged (missing images, unverified data)
- [ ] Batch size kept small and reviewable
