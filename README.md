# Jiu Jitsu Style Website

Digital media, lifestyle, and community platform for the global jiu-jitsu community. Rebuilding from a splash page into a full content-driven website.

## Tech Stack

- **Astro** — static site generation with React islands for interactive components
- **React** — client-side interactivity (mobile nav, forms, filters)
- **Tailwind CSS 4** — styling via `@tailwindcss/vite` plugin
- **TypeScript**
- **pnpm** — package manager

Future additions (not yet implemented):
- **Payload CMS** — content management, deployed separately on Railway
- **Medusa.js** — headless commerce (testing as Shopify alternative)
- **GoHighLevel** — form submissions (newsletter, contact, seminar request)

## Current State

Phase 1 scaffold is complete. All pages are stubbed with placeholder content and the full layout (header, footer, mobile nav) is functional.

### Pages Built
- `/` — Home (hero, placeholder sections for featured technique, events, articles, shop, mission, newsletter)
- `/about` — Our Story, Our Vision, Sponsors, Ambassadors
- `/events` — Event listings by type (JJS, Skull Games, community)
- `/events/request-seminar` — Seminar request form
- `/media` — Hub linking to techniques, lifestyle, podcast
- `/media/techniques` — Technique library (will have position + gi/no-gi filters)
- `/media/lifestyle` — Lifestyle video content
- `/media/podcast` — Podcast episodes
- `/store` — Gear, AI Journal, Supplements
- `/mission` — Mission statement, Skull Games partnership, 10% profit commitment
- `/contact` — Contact form
- `/articles` — Article listing

### What's Not Built Yet
- Newsletter form (GHL React island) — credentials are in `src/lib/constants.ts`
- Payload CMS integration (content is all static placeholder right now)
- Shopify store integration
- Article detail pages (`/articles/[slug]`)
- Technique filter, event calendar React islands
- reCAPTCHA provider

## Dev Commands

```bash
./scripts/start.sh    # Start dev server (port 4321)
./scripts/kill.sh     # Kill dev server
pnpm build            # Build static site to dist/
pnpm preview          # Preview built site
```

## Project Structure

```
src/
  layouts/BaseLayout.astro    — Root layout (SEO metadata, header, footer)
  pages/                      — File-based routing
  components/
    layout/                   — Header, Footer, MobileNav (React island)
    ui/                       — Reusable components (not yet populated)
    forms/                    — GHL form components (not yet built)
    home/                     — Home page sections (not yet built)
    shared/SocialLinks.astro  — Social media icon links
  lib/constants.ts            — Brand config, social URLs, GHL credentials, nav items
  styles/globals.css          — Tailwind + brand CSS variables
public/images/                — Logo, favicons, hero background
```

## Brand

- Dark theme: `#111` background, `#fff` text
- Accent red: `#c0272d` (CTAs and active states)
- System font stack
- Socials: Instagram @bjjstyle, Facebook /bjjstyle, X @JiuJitsuStyle

## Git Branches

- `master` — Old splash page (kept as fallback until new site goes live)
- `rebuild` — New Astro site (active development)

## Reference Docs

Planning documents live in `notes/new-website-build/` (gitignored):
- `start-here.md` — Project overview
- `Jiu Jitsu Style Web MVP.md` — MVP page structure and priorities
- `Jiu Jitsu Style Early Monetization Efforts.md` — Revenue strategy
