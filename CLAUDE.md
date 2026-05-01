# Claude — operational notes for this repo

This file documents what access and abilities Claude has when working on this project, so future sessions don't have to re-discover it. Update it when something changes.

## Project

- **Site:** britishschoolsasia.com
- **Stack:** Astro static site + Tailwind v4 + Cloudflare Pages
- **Local path:** `/Users/darren/british-schools-asia`
- **Dev server:** `npm run dev` (port 4321 in config; preview tool maps it). Launch via `preview_start` with name `bsa-dev` (config in `.claude/launch.json`).

## GitHub

- **Repo:** `https://github.com/darren254/british-schools-asia`
- **CLI:** `gh` is installed and authed as `darren254`.
- **Token scopes:** `repo`, `workflow`, `read:org`, `gist`.
- **What Claude can do without asking:**
  - Read repo metadata, issues, PRs, releases (`gh repo view`, `gh issue list`, etc.)
  - Read/write Actions workflow files (`.github/workflows/*.yml`)
  - Push branches and open PRs
  - Add/update/delete Actions secrets (`gh secret set`, `gh secret list`, `gh secret delete`) — values can come from the user's `~/Documents/API Keys.txt` or be passed inline
  - Trigger workflow runs (`gh workflow run`)
  - View workflow logs (`gh run list`, `gh run view`)
- **What still needs user OK:**
  - Force-push to `main`, deleting branches the user might be working in, anything destructive

## Cloudflare

- **Account ID:** `1a2801b87f9672afbf53602cb74884c9` (Darren@schoolstrust.co.uk's account)
- **API token:** stored in `~/Documents/API Keys.txt` under "Cloudflare" — token starts `cfut_…`. Do not commit. Reference, don't paste.
- **Pages projects on this account:**
  - `british-schools-asia` — **no Git source connected** (deploy via `wrangler pages deploy dist` from GitHub Actions, not via Pages↔GitHub OAuth)
  - `international-schools-guide`, `isj-website-v4`, `isj-parent-map` — connected to GitHub (different projects, not this one)
- **What Claude can do via the Cloudflare API token:**
  - List Pages projects, deployments, build logs (REST API at `api.cloudflare.com/client/v4/accounts/<acct>/pages/...`)
  - Deploy via `npx wrangler pages deploy dist --project-name british-schools-asia` (token in env as `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`)
  - Read Pages KV namespaces (e.g. `EMAIL_SUBSCRIBERS` — see `wrangler.toml`)
- **What requires the Cloudflare dashboard (Claude cannot do via API):**
  - Connecting a Pages project to a GitHub repo via OAuth (we don't need this — we deploy via wrangler instead)
  - Custom domain SSL provisioning
  - Account-level billing and member management

## Anthropic API

- **Key:** stored in `~/Documents/API Keys.txt` under "Anthropic - Claude". Used by GitHub Actions cron jobs that need to call Claude programmatically (e.g. the `/news` daily pipeline).
- **In repo:** added as GitHub Actions secret `ANTHROPIC_API_KEY`. Never committed.
- **Local dev:** if a script needs the key, write it to `.env.local` (gitignored).

## Google AI Studio (Gemini)

- **Key:** stored in `~/Documents/API Keys.txt` under "Google → Google AI Studio". Used by the `/news` pipeline to convert source-article images into pop-art versions before publishing.
- **In repo:** added as GitHub Actions secret `GEMINI_API_KEY`. Never committed.
- **Model:** `gemini-3-pro-image-preview` (Nano Banana Pro — Gemini 3 Pro Image). Strong at full re-stylization. The older `gemini-2.5-flash-image` (Nano Banana) is weaker — only does light editing/filtering. Do not use it for stylization.
- **Billing:** paid tier required for image models. Free tier returns `limit: 0` for any image-gen request even with a valid key.
- **Cost:** ~$0.04 per image at Pro tier; ~2 images/day = ~$2.50/month.

## News pipeline — image flow

1. Claude (with web_search) picks 2 stories per day and returns each with a `sourceUrl`.
2. Pipeline fetches the source article HTML, extracts `og:image`, downloads it locally to `public/images/news/<slug>.<ext>`.
3. Pipeline sends that image to Gemini Nano Banana Pro with the prompt locked in `scripts/news-pipeline.mjs` (`WARHOL_PROMPT`).
4. Gemini returns a PNG; pipeline overwrites the local file as `<slug>.png`, deletes the original `.jpg`, updates the article JSON's `heroImage` to point to the `.png`.
5. If the source-image fetch fails, the article falls back to the kicker city's hero (e.g. `/images/hong-kong-hero.jpg`) — these stay as-is, not warholized, since they're shared with other pages.
6. If the Warhol step fails (rare — model returns text instead of image, or `MALFORMED_FUNCTION_CALL` for some images), the article keeps the original photographic source image.

`scripts/warholize-existing.mjs` is a one-off backfill script that walks every article in `src/data/news/` and warholizes its hero in place. Skips articles whose hero is a city-level fallback (so we don't repaint shared images). Idempotent — already-warholized PNGs are skipped unless `--force`.

## Deployment model

- **Daily news cron:** GitHub Actions runs at 01:00 UTC → pipeline writes new article JSONs to `src/data/news/` → commits to `main` → builds (`npm run build`) → `wrangler pages deploy dist` → live in ~30s.
- **Manual deploys:** same `wrangler pages deploy dist` from local machine works too.
- **No Cloudflare↔Git OAuth required.** All deploys go through wrangler with the API token.

## Conventions

- **Auto memory** for cross-project preferences lives at `~/.claude/projects/-Users-darren-Desktop-The-Guide/memory/`. Repo-specific operational notes (this file) live in the repo.
- **Methodology:** see `docs/ranking-methodology.md` (v2, frozen).
- **Evidence log:** `research/evidence-log.json` is the source of truth for ranking signals.
- **Don't run destructive ops** (force-push, hard-reset, delete branches, drop KV namespaces) without explicit user confirmation.
