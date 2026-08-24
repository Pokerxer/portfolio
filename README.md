# Jordan Waldehz — Portfolio

An editorial, light-primary portfolio built with Next.js 16 (App Router),
React 19, Tailwind CSS v4, and TypeScript.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your real values
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest — contact input escaping and validation |

## Required manual step: rotate the Resend key

`.env.example` previously contained a real-looking Resend API key. It was
**never committed** (`.gitignore` covers `.env*`, and `git ls-files` confirms it
was never tracked), so there is no public leak — but the value did sit on disk
in the file whose entire purpose is to be shared.

The on-disk value is now the placeholder `re_xxxxxxxxxxxx`.

**Rotating the old key still has to be done by hand**, at
https://resend.com/dashboard/api-keys. That requires a dashboard login and
cannot be automated from this repo. Revoke the old key and issue a new one, then
put the new value in `.env.local` (local) and in the Vercel project's
environment variables (deployed).

## Assets

Project screenshots are captured from each live site and committed to
`public/work/`. The About-page portrait is still a slot waiting on a real
photo — the monogram panel renders until then, by design.

| File | Status | Notes |
|---|---|---|
| `public/work/<slug>.png` | **Done** — all 5 present | 1600×1000 headless-Chromium captures of each project's `demo` URL. Re-capture after any project redesign. |
| `public/jordan.jpg` | **Missing** — monogram fallback shows | Drop in ~1200×1500 portrait, set `site.photo = "/jordan.jpg"` in `src/content/site.ts`. |
| `public/jordan-waldehz-cv.pdf` | **Missing** — CV button hidden | Drop in, set `site.cv = "/jordan-waldehz-cv.pdf"` in `src/content/site.ts`. |

Project slugs: `drinksharbour`, `drinksharbour-admin`, `swiftpro`, `kentaz`,
`kentaz-admin`, `christy-empire`, `ball-and-boujee`. Both DrinksHarbour entries
share one monorepo (`Pokerxer/DrinksHarbour`); its marketplace screenshot
required dismissing an age gate and a promo modal before capture.

## Content

All copy and data live in typed modules under `src/content/` — there is no CMS
and no hardcoded content in components.

| File | Holds |
|---|---|
| `site.ts` | Name, role, location, email, socials, nav, availability, stats, `SITE_URL` |
| `projects.ts` | The `Project[]` shown on `/` and `/work` |
| `journey.ts` | About-page timeline |
| `stack.ts` | Grouped technologies |

Several entries carry `TODO(jordan)` markers. Those flag drafted copy and
figures grounded only in facts already present in this repo — the stats, the
journey wording, and each project's inferred `year` and `role`. Replace them
with real numbers where you have them; nothing there is invented, but nothing
there is verified either.

## Architecture notes

- **Theme.** `data-theme` on `<html>`, set by an inline pre-hydration script
  (`src/lib/theme.ts`) so there is no flash of the wrong theme. Colors are CSS
  custom properties exposed to Tailwind through `@theme inline`.
- **Fonts.** Bricolage Grotesque, Inter, and JetBrains Mono via
  `next/font/google`. Their CSS variables are named `--jw-*` rather than
  `--font-*` to avoid colliding with Tailwind v4's own `--font-*` theme keys,
  which would make the `@theme inline` mapping self-referential.
- **Motion.** CSS transitions and keyframes driven by one
  `IntersectionObserver` hook. No animation library. The hero is a
  full-viewport scene: drifting aurora fields over a drafting grid, a floating
  collage of the featured project screenshots, line-mask type entrance, a
  self-drawing underline on "ship.", and a scroll cue. `Parallax` (rAF,
  transform-only) drifts the aurora and collage against scroll. Route changes
  fade through `RouteFade`; the stack band is two counter-scrolling marquee
  rows; nav links get sliding underlines; stats count up on reveal. Scroll
  reveals, filter re-entry staggers, and hover media zooms are all in
  `globals.css`. Everything is gated behind
  `@media (prefers-reduced-motion: reduce)`.
- **Rendering.** Server Components by default. `"use client"` only on
  `ThemeToggle`, `NavLinks`, `ProjectGrid`, `ContactForm`, `Reveal`, `Rule`,
  and `error.tsx`.
- **Contact API.** `src/app/api/contact/route.ts` validates with
  `src/lib/validate.ts`, escapes every interpolated value with
  `src/lib/escapeHtml.ts`, and applies a best-effort per-IP rate limit. That
  limit is per warm instance, not per deployment — Vercel BotID or Firewall is
  the real control.
