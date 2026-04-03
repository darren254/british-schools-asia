# Tech Stack

## Core framework

- **Astro** — Static site generator
- **Tailwind CSS v4** — Utility-first CSS (v4 only, no v3 syntax)
- **Cloudflare Pages** — Hosting and deployment

## Why this stack

Same stack used for the ISJ website. Astro generates fast static HTML. Tailwind v4 provides design utility classes. Cloudflare Pages gives global CDN deployment with zero config.

> **Important**: Only the tech stack is shared with ISJ. No code, content, design, or assets from ISJ should be used.

## Project structure

```
british-schools-asia/
├── docs/                  # All project documentation
├── src/
│   ├── components/        # Shared components (header, footer, ribbon, cards)
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages
│   │   ├── index.astro    # Homepage
│   │   ├── rankings.astro # Rankings page
│   │   ├── cities/        # City pages
│   │   ├── schools/       # School profile pages
│   │   └── journal/       # Journal hub + articles
│   ├── data/              # School data (JSON/YAML)
│   └── styles/            # Global styles, Tailwind config
├── public/                # Static assets (images, fonts)
├── astro.config.mjs
├── tailwind.config.js
├── package.json
└── README.md
```

## Key conventions

1. **Components first** — Build shared components before pages
2. **Data-driven** — School data stored in structured files, pages generated from data
3. **No JavaScript by default** — Astro ships zero JS unless explicitly needed
4. **Mobile-first** — All styles written mobile-first with Tailwind breakpoints

## Dependencies

- `astro` (latest stable)
- `@astrojs/tailwind`
- `tailwindcss` v4
- No other frameworks (no React, Vue, etc.) unless absolutely necessary

## Deployment

- Push to `main` triggers Cloudflare Pages build
- Build command: `astro build`
- Output directory: `dist/`
- Domain: britishschoolsasia.com
