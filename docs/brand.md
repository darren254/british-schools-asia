# Brand System

Source of truth: Net-a-Porter's current site and editorial (PORTER) patterns. All branding and layout decisions must be derived from Net-a-Porter, not from generic component libraries or Tailwind UI kits.

## Mandatory pre-flight

Before any UI work, the build must explicitly summarise which Net-a-Porter design elements are being copied. If that line is not present, the output is invalid.

## Typography

- **Display / headings:** Cormorant Garamond (Google Fonts). Used for page titles, section headings, hero headlines. Mix of regular, italic, and bold weights.
- **Body / UI / labels:** Inter (Google Fonts). Used for body text, navigation, labels, metadata, buttons.
- **Heading style:** Large serif for headlines; uppercase letterspaced sans for category labels and section headers.
- **Body text size:** 15-16px.
- **Label style:** Uppercase, letterspaced, 11-12px, Inter.

## Colour palette

| Token | Value | Usage |
|---|---|---|
| Primary background | #FFFFFF | Page backgrounds |
| Primary text | #000000 | All body text, headings |
| Header/footer bg | #000000 | Global header, footer |
| Header/footer text | #FFFFFF | Nav text, footer text |
| Accent | None | No accent colour. Links are black with underline. |
| Borders/dividers | #000000 at 1px or #E5E5E5 for subtle | Section dividers, card separators |

No gradients. No coloured backgrounds except black. No blue/purple AI-style accents.

## Buttons

- **Primary:** Solid black fill (#000), white text (#FFF), rounded-pill shape, centred text.
- **Secondary (ghost):** Transparent fill, black or white 1px border, centred text. Used for CTAs on hero images.
- **Text link CTA:** Black text, underlined. Used for inline calls to action.

## Card style

- No border, no shadow, no border-radius.
- Image sits directly above text.
- Clean vertical rhythm: image, then name/label, then metadata.

## Section dividers

- Thin 1px black horizontal rules between major sections.
- Or pure whitespace (48-80px vertical gap).
- No decorative dividers, no coloured bars.

## Spacing

- Generous vertical whitespace between sections: 48-80px.
- Tight spacing within sections/cards: 8-16px.
- Consistent padding: 16px mobile, 24-32px desktop.

## Image treatment

- Full-bleed or edge-to-edge within container.
- No rounded corners on images.
- No overlays except slight darkening gradient for text legibility on hero images.
- Landscape aspect ratios: 16:9 or 3:2 for heroes, square or 4:3 for cards.

## 13 reusable components

Every page on BSA must be assembled from these components only:

### 1. Utility ribbon
Thin full-width black bar at top. White text, small caps/uppercase sans, 11-12px, centred. Single rotating message.

### 2. Global header
Sticky black bar. Centred wordmark "BRITISH SCHOOLS ASIA" in white (Inter, uppercase, letterspaced). Hamburger left, search right. Minimal.

### 3. Full-bleed hero module
Full-viewport-width image, edge-to-edge. Text overlaid bottom-left: serif headline (Cormorant Garamond), sans body line, ghost CTA button.

### 4. Horizontal card carousel
White background. Uppercase small label, large serif heading, body text, then horizontally scrollable rail of cards. Pagination dots. Solid black pill CTA button below.

### 5. Full-bleed editorial banner
Full-width image with text below (not overlaid). Serif headline, serif body line, underlined text-link CTA.

### 6. Duo promo module
Two equal-width cards side by side. Each: image top, serif headline, body text, underlined CTA. No borders, no shadows. Stacks on mobile.

### 7. Journal crossover module
Journal logo/wordmark, then featured article with image + headline + teaser + CTA link.

### 8. Editorial story card grid
Uppercase sans section label. Horizontally scrollable rail of article cards: square image, uppercase category label, headline in sans below.

### 9. Email capture module
Black background. White serif headline, body text, email input + "Sign Up" button. Social icons below.

### 10. Category listing grid
Centred serif page title, intro paragraph, thin rule, filter/sort bar, two-column card grid.

### 11. Detail page (school profile)
Hero image gallery. Below: name (serif H1), metadata, ranking. Expandable accordion sections. Breadcrumbs.

### 12. Editorial hub layout
Sub-nav below global header. Featured cover story module. Themed editorial clusters with large feature cards and smaller list items.

### 13. Editorial article page
Sub-nav. Full-bleed hero image with category label + large serif headline overlaid. Body text with inline images.

## Banned patterns

- No neumorphism, glassmorphism, or card shadows.
- No AI-blob illustrations.
- No Tailwind component-kit defaults.
- No coloured gradient backgrounds.
- No rounded image corners.
- No generic SaaS/startup aesthetics.
