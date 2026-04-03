# Image Rules

## Source priority by context

| Context | Best source | Fallback |
|---|---|---|
| School profile hero | School website (campus, aerial, entrance) | Google Maps / Street View |
| City page hero | Unsplash / Pexels (skyline, landmark) | AI-generated cityscape |
| Journal articles | Depends: city piece = Unsplash; school piece = school site; guide = stock/AI | Mix as needed |
| Homepage hero | Unsplash / Pexels (aspirational Asia image) | AI-generated |
| Rankings page | No hero needed | - |

## Hard rules (no exceptions)

- No images containing visible text.
- No images with logos (unless natural building signage in campus photo).
- No low-resolution images. Minimum 1200px wide for hero/banner; 600px wide for thumbnails.
- No obvious AI artefacts (melted hands, garbled text, uncanny faces).
- No generic clip-art or illustration-style images. Photography only.
- Consistent aspect ratios per component: hero = 16:9 or 3:2; cards = square or 4:3.
- Never reuse the same image on two different pages.

## School image sourcing process

1. Visit school website.
2. Look for: campus exterior, aerial/drone, main entrance, key facility, classroom.
3. Judge quality: high res? Free of text overlays? Professional? Representative?
4. If school site only has tiny thumbnails or branded marketing graphics, do not use.
5. Try secondary: Google Images, Google Maps street/aerial, school social media.
6. If genuinely no usable image after all sources: leave slot empty, flag in email to owner.

## Minimum image count per page type

| Page type | Minimum | Placement |
|---|---|---|
| Homepage | 3 | Hero, Journal teaser, city/editorial card |
| Rankings | 0 | Optional school thumbnails |
| Country page | 1 | Country hero/landmark |
| City page | 2 | City hero + supporting image |
| School profile | 1 min, 3 ideal | Hero + campus/facility shots |
| Journal hub | 1 per article card | Thumbnails |
| Journal article | 2 | Hero + inline image |
| Methodology/About | 0-1 | Optional |
| Contact | 0 | None |

## QA checklist for images

- [ ] Page meets minimum image count.
- [ ] No images contain text.
- [ ] No images contain logos (except natural signage).
- [ ] All images are on-topic.
- [ ] All images have alt text.
- [ ] All images have width/height attributes.
- [ ] Images served in AVIF/WebP where possible.
- [ ] Below-fold images are lazy-loaded.
- [ ] No image is reused from another page.

## Failure mode

- Cities: should never fail. Unsplash/Pexels cover all major Asian cities.
- Schools: if no usable image after checking website + Google Images + Maps + social: leave empty, show clean empty state (not broken icon), email owner with school name, city, and sources tried.
- Never substitute a random stock classroom photo. Intentional blank is better than fake.
