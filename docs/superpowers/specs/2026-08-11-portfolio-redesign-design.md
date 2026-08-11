# Portfolio Redesign — Design Spec

**Date:** 2026-08-11
**Owner:** Jordan Waldehz
**Status:** Approved

## Goal

Rebuild the portfolio at `/Users/mac/portfolio` so it decisively out-classes
`https://fiza-hassan-portfolio.vercel.app/` — the benchmark the user supplied.

The site serves two audiences roughly equally: hiring managers evaluating a
full-stack engineer, and prospective freelance clients evaluating a builder.

## Benchmark analysis

The reference site was reverse-engineered from its production bundle
(`assets/index-DoXvNPTF.js`, `assets/index-3F0XXxa0.css`) because it is a
client-only Vite SPA and serves no meaningful HTML.

### Where it is strong

- Restrained warm-monochrome palette: `#2e2e2e` background, `#3a3a3a` surface,
  `#b0b0b0` muted text, white accent. Reads as deliberate, not templated.
- Three-face type system: Comfortaa (logo), Space Grotesk (headings),
  DM Sans (body).
- Single-page scroll narrative: Home → About (with a "MY JOURNEY" timeline) →
  Built With (stack) → Demo (an interactive "AI Studio") → Work (12 projects) →
  Contact.
- Real photograph served with `srcset`, and a downloadable CV.
- Honest, specific voice: "Self-taught. Client-tested. Still learning, on purpose."

### Where it is weak — our openings

- **No SSR at all.** Client-only SPA. Served HTML is 559 bytes.
- **`<title>portfolio</title>`**, no meta description, no Open Graph, no
  structured data, no sitemap. Its search presence is close to nil.
- ~510KB of JavaScript, inflated by GSAP + ScrollTrigger + Framer Motion.
- Project entries are one-sentence cards. There is no depth behind any of them.

## Baseline: current state of our site

Next.js 16.2.4, React 19.2.4, Tailwind v4, Resend 6.12.2.

Three routes exist (`/`, `/projects`, `/contact`) but `/` renders only `Hero`.
The About, Skills, Experience, and Contact sections specified in the repo's own
`instructions.md` were never built.

### Defects confirmed by reading the source

| Location | Defect |
|---|---|
| `projects/page.tsx:279` | `bg-${project.accent}-500/10` — Tailwind v4 has no runtime class generation, so these badges render unstyled. |
| `Hero.tsx:423`, `contact/page.tsx:270` | X/Twitter `<path>` data is malformed (mixed coordinate spaces). |
| `Hero.tsx:16`, `contact/page.tsx:158` | Social link points at the bare `https://twitter.com` placeholder. |
| `Hero.tsx:245` + `globals.css:31-54` | `cursor-none` plus a canvas-painted fake cursor — hides the real pointer. |
| `Hero.tsx`, `projects/page.tsx`, `contact/page.tsx` | The particle canvas (150 / 80 / 70 particles) is duplicated three times, runs an O(n²) neighbour loop every frame, and has no `prefers-reduced-motion` guard. |
| `globals.css:1` | Fonts load via CSS `@import`, which is render-blocking. |
| `contact/page.tsx:139` | Failure path calls `alert()`. |
| `contact/page.tsx:329-357` | Inputs are placeholder-only, with no `<label>`. |
| `api/contact/route.ts` | `${name}` and `${message}` are interpolated into the email HTML unescaped; no email-format validation; no rate limiting. |
| `.env.example:3` | Contains a live-looking Resend key rather than a placeholder. |
| Nav / footer | Copy-pasted across three page files. |
| `projects/page.tsx:59-66` | "Real-Time Chat" has `demo: "#"` and a GitHub link pointing at the profile root. |

### Security note — out of our control

`.env.example` holds a real-looking Resend key. It is **not** in git history
(`.gitignore` covers `.env*`; `git ls-files` confirms it was never tracked), so
there has been no public leak. The user must rotate it in the Resend dashboard;
this spec only covers replacing the on-disk value with a placeholder.

## Decisions

Four decisions were settled with the user before this spec was written.

1. **Aesthetic: editorial / high-contrast.** Abandon the neon-cyberpunk
   direction in `instructions.md`. That look is the most templated style in
   developer portfolios and reads as machine-generated. This supersedes the
   design-style section of `instructions.md`.
2. **Structure: multi-page (option B).** Separate `/`, `/work`, `/about`,
   `/contact` routes.
   *Trade-off accepted by the user:* the rejected option A added
   statically-generated `/work/<slug>` case studies, which would have been the
   single strongest differentiator against the benchmark's shallow project
   cards. Choosing B means the site competes on craft rather than depth. The
   content model below is therefore shaped so case studies are a purely
   additive change later, requiring no refactor.
3. **Palette: light-primary with a dark-mode toggle.**
4. **Assets: the user has a photo, a CV PDF, and project screenshots.** All are
   designed as real slots with graceful fallbacks; none exist in `/public` yet.

## Design language

### Color

One accent. No gradients, no glow, no glassmorphism.

| Token | Light (default) | Dark |
|---|---|---|
| `bg` | `#faf9f7` | `#0e0e0d` |
| `fg` | `#111110` | `#f4f2ee` |
| `muted` | `#6b6a66` | `#8f8d86` |
| `rule` | `#e0ded8` | `#26251f` |
| `accent` | `#d6421f` | `#ff6a45` |

Vermilion is the classic editorial accent, is legible on both grounds, and is
far from the cyan/violet that saturates this category.

Defined as CSS custom properties under `:root` and `[data-theme="dark"]`, then
exposed to Tailwind v4 through `@theme inline` — matching the pattern already
in `globals.css`.

### Typography

Three faces, all self-hosted through `next/font/google` to eliminate the
render-blocking `@import` and layout shift.

- **Display:** Bricolage Grotesque (variable) — headings and the hero
- **Body:** Inter — prose and UI
- **Mono:** JetBrains Mono — indices (`01`, `02`), tags, metadata

Type scale uses `clamp()` with deliberately large jumps between display and
body sizes. That contrast is what makes the layout read as editorial.

### Layout

A 12-column grid, max content width 72rem. Visible hairline rules are the
primary organizing device rather than cards and borders. Items are numbered in
mono. Vertical rhythm is generous.

### Motion

CSS transitions driven by a single `IntersectionObserver` hook. No GSAP, no
Framer Motion — avoiding the dependency weight that inflates the benchmark.

The particle canvas and `cursor-none` are deleted outright.

One signature move: a hairline rule that draws itself in as a section enters.

All of it sits behind `@media (prefers-reduced-motion: reduce)`, which disables
transforms and transitions entirely.

## Architecture

### Routes

| Route | Contents |
|---|---|
| `/` | Hero, availability badge, three proof stats, three featured projects, stack strip, closing CTA |
| `/work` | All projects with screenshots and a working technology filter |
| `/about` | Photo, bio, journey timeline, stack in depth, CV download |
| `/contact` | Form plus direct links |

`/projects` is replaced by `/work`; it keeps a permanent redirect in
`next.config.ts` so existing links survive.

### SEO layer

The benchmark has none of this, so it is where the largest structural gap opens.

- `metadata` exported per route, with distinct titles and descriptions
- `app/sitemap.ts` and `app/robots.ts`
- `app/opengraph-image.tsx` generating a typographic OG card
- `Person` JSON-LD injected in the root layout

### Content model

One typed source of truth, replacing hardcoded page data and copy-pasted nav.

```
src/content/site.ts       profile, socials, availability, stats
src/content/projects.ts   Project[]
src/content/journey.ts    timeline entries
src/content/stack.ts      grouped technologies
```

`Project` carries an optional `caseStudy?` field that nothing reads yet. That
is the seam for adding `/work/<slug>` pages later without touching consumers.

### Components

```
src/components/layout/    SiteHeader, SiteFooter, ThemeToggle, SkipLink
src/components/ui/        Rule, SectionHeading, Tag, CTA, StatBlock
src/components/sections/  Hero, FeaturedWork, ProjectGrid, ProjectCard,
                          StackStrip, JourneyTimeline, ContactForm
src/lib/                  useReveal, theme bootstrap script
```

Each file has one purpose. Server Components by default; `"use client"` only on
`ThemeToggle`, `ContactForm`, the technology filter, and `useReveal` consumers.

### Assets

| Path | Spec |
|---|---|
| `/public/jordan.jpg` | ~1200×1500 portrait, served via `next/image` |
| `/public/jordan-waldehz-cv.pdf` | CV download |
| `/public/work/<slug>.png` | ~1600×1000, one per project |

Every slot has a fallback. A missing screenshot renders a typographic
placeholder — mono index, project initial, accent rule — never a broken image.
A missing photo renders a monogram block. A missing CV hides its button. The
site therefore looks complete before any asset is added.

Screenshots must be supplied by the user; the Chrome extension is not connected
to this session, so they cannot be captured here.

### Content changes

"Real-Time Chat" is removed. Five genuinely shipped products present better
than six with one visible gap. The Twitter/X link is dropped unless the user
supplies a real handle.

### Prose and figures — drafted, then corrected

Bio, journey entries, and stat figures are not yet known. Resolution: they are
written as **drafted copy grounded only in facts already in the repo**, clearly
flagged in the code for the user to correct. Nothing is invented that implies a
credential, client, or metric that has not been stated.

Known facts available to draw on: name Jordan Waldehz; full-stack JavaScript
developer; Wyn City, Apr 2022 – Present (`instructions.md`); five shipped
products with live URLs (`projects/page.tsx`); GitHub `Pokerxer`; LinkedIn
`jordan-waldehz-385a7b240`; email `jrwaldehzx@gmail.com`.

The three proof stats on `/` are therefore drafted as:

| Stat | Value | Basis |
|---|---|---|
| Building since | 2022 | Wyn City start date |
| Products shipped | 5 | Live URLs in the current project list |
| Live in production | 5 | Same, all five resolve to public sites |

If the user supplies real figures — clients served, users reached, revenue
processed — these are replaced. Concrete outcome numbers would materially
strengthen the freelance half of the audience, and their absence is the main
remaining content weakness relative to the benchmark's client-tested framing.

## Error handling

- **Contact form:** field-level validation messages, an `aria-live` region for
  submit status, input preserved on failure, inline error state replacing
  `alert()`.
- **Contact API:** required-field check (already present), email-format
  validation, HTML escaping of all interpolated values, and a best-effort
  per-IP rate limit. Documented limitation: Fluid Compute reuses instances
  across requests, so in-memory limiting is partial — Vercel BotID or Firewall
  is the real control. Demo mode (no API key) is preserved.
- **Routes:** `app/error.tsx` and `app/not-found.tsx`.
- **Theme:** an inline pre-hydration script reads the stored preference and sets
  `data-theme` before first paint, so there is no flash of the wrong theme. It
  honours `prefers-color-scheme` when no choice is stored.

## Accessibility

Skip link to main content. Visible `focus-visible` rings on every interactive
element. Semantic landmarks (`header`, `main`, `nav`, `footer`). Real `<label>`
elements on all form fields. The decorative pointer and canvas are gone.
`prefers-reduced-motion` fully respected. Contrast verified against WCAG AA in
both themes.

## Verification

- `npm run build` passes clean.
- `npm run lint` passes clean.
- Manual pass over all four routes at 375 / 768 / 1440, in both themes,
  keyboard-only, and with reduced-motion enabled.
- Vitest covering the contact route's HTML escaping and email validation — the
  only logic in the project with genuine branching worth pinning. A broader
  test scaffold is disproportionate for a portfolio and is deliberately out of
  scope.

## Out of scope

- `/work/<slug>` case-study pages (option A; the content model leaves room).
- An interactive demo section equivalent to the benchmark's "AI Studio".
- A CMS. Content stays in typed TypeScript modules.
- Rotating the Resend key — requires the user's dashboard login.
- Capturing project screenshots — requires a connected browser.
