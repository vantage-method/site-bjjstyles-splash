# Jiu Jitsu Style Website

## Overview
Jiu Jitsu Style is a digital media, lifestyle, and community platform for the global jiu-jitsu community. Built with **Astro** (SSG + React islands) and **Payload CMS** (coming Phase 2).

## Tech Stack
- **Framework**: Astro (static site generation with island architecture)
- **Interactive Components**: React (client:load islands)
- **Styling**: Tailwind CSS 4 (via @tailwindcss/vite plugin)
- **CMS**: Payload CMS (Phase 2 — deployed separately on Railway)
- **Forms**: GoHighLevel API for newsletter, contact, and seminar forms
- **Store**: Medusa.js headless commerce (Phase 3 — testing as Shopify alternative)
- **Package Manager**: pnpm

## Commands
```bash
pnpm dev        # Start dev server
pnpm build      # Build static site to dist/
pnpm preview    # Preview built site locally
```

## Project Structure
```
src/
  layouts/        BaseLayout.astro (root layout with head, header, footer)
  pages/          Astro pages (file-based routing)
  components/
    layout/       Header, Footer, MobileNav (React island)
    ui/           Reusable UI components (Button, Card, etc.)
    forms/        GHL form React islands (newsletter, contact, seminar)
    home/         Home page section components
    media/        TechniqueFilter React island
    events/       EventCalendar React island
    shared/       SocialLinks, RecaptchaProvider
  lib/
    constants.ts  Brand config, social URLs, GHL credentials, nav items
    ghl.ts        GoHighLevel form submission helpers
    payload.ts    Payload CMS API client (Phase 2)
    medusa.ts     Medusa.js store API client (Phase 3)
  styles/
    globals.css   Tailwind import + brand CSS variables
  content/        Static markdown content
public/
  images/         Logo, favicons, hero background
```

## Brand Design
- **Dark theme**: Background #111, text #fff
- **Accent red**: #c0272d (CTAs and active states only)
- **Typography**: System font stack
- Brand tokens defined in `src/styles/globals.css` under `@theme inline`

## GoHighLevel Form Integration (CRITICAL)
All forms submit to GHL. The newsletter form is the most important — it must always work.

- **Endpoint**: `https://backend.leadconnectorhq.com/forms/submit`
- **Newsletter Form ID**: `pBmsDcAtabDnU4kh6X14`
- **Location ID**: `tVGdeIuZuaSz68wIoKXS`
- **reCAPTCHA v3 site key**: `6LeDBFwpAAAAAJe8ux9-imrqZ2ueRsEtdiWoDDpX`
- **Payload format**: FormData with `formData` (JSON string) + `captchaV3` (token)

Constants live in `src/lib/constants.ts` under the `GHL` export.

## Navigation
Home, About, Events, Media, Store, Mission, Contact — defined in `src/lib/constants.ts`.

## Social Media
- Instagram: @bjjstyle
- Facebook: /bjjstyle
- X: @JiuJitsuStyle
