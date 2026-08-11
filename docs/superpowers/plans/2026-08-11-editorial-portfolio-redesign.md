# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as an editorial, light-primary, multi-page site that out-classes `fiza-hassan-portfolio.vercel.app` on craft, performance, SEO, and accessibility.

**Architecture:** Next.js App Router, Server Components by default. A typed content layer under `src/content/` is the single source of truth, consumed by presentational components under `src/components/`. Theme is a `data-theme` attribute on `<html>` set by an inline pre-hydration script; all color flows from CSS custom properties exposed to Tailwind v4 via `@theme inline`.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, Tailwind CSS v4, TypeScript 5, Resend 6.12.2, `next/font/google`, Vitest (added in Task 8).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-11-portfolio-redesign-design.md`. Read it before starting.
- Palette light: `bg #faf9f7`, `fg #111110`, `muted #6b6a66`, `rule #e0ded8`, `accent #d6421f`.
- Palette dark: `bg #0e0e0d`, `fg #f4f2ee`, `muted #8f8d86`, `rule #26251f`, `accent #ff6a45`.
- Fonts: Display = Bricolage Grotesque, Body = Inter, Mono = JetBrains Mono. All via `next/font/google`. Never via CSS `@import`.
- No gradients on text, no glow, no glassmorphism, no `backdrop-filter`, no particle canvas, no `cursor-none`.
- No GSAP, no Framer Motion, no animation library. CSS + one `IntersectionObserver` hook only.
- Every animation gated behind `@media (prefers-reduced-motion: reduce)`.
- Tailwind v4 has no runtime class generation. Never interpolate a class name (`bg-${x}-500`). Use static class maps.
- Server Components by default. `"use client"` only where named in this plan.
- Content max width `72rem`. Hairline rules are the primary structural device.
- Never invent a credential, client name, or metric. Draft copy uses only facts in the repo (see spec, "Prose and figures").
- Contact form must keep working in demo mode when `RESEND_API_KEY` is absent.

### Next.js 16 specifics — verified against the bundled docs

`AGENTS.md` requires reading `node_modules/next/dist/docs/` before writing code.
That was done; these are the findings that change what this plan must do.

- **`opengraph-image` props are now Promises.** Per
  `02-guides/upgrading/version-16.md:330-365`, the image-generating function
  receives `params` and `id` as promises in Next 16. Task 9's
  `opengraph-image.tsx` must be `export default async function Image()` and
  `await` them if used. Writing it synchronously is a Next 15 pattern and is
  now wrong.
- **`sitemap`'s `id` is now a Promise** (`version-16.md:367-396`) — only
  relevant if `generateSitemaps` is added. This plan's single static sitemap
  takes no params, so it is unaffected; do not add `generateSitemaps` without
  awaiting `id`.
- **Turbopack is the default bundler** (`version-16.md:114`). Do not add
  webpack config.
- **`next/font` confirmed:** the `variable` option is supported
  (`03-api-reference/02-components/font.md:95`), and variable fonts need no
  `weight`. Task 1's `fonts.ts` is correct as written.
- Async Request APIs are a breaking change in 16 (`version-16.md:294`). No task
  here reads `params`, `searchParams`, `cookies`, or `headers` in a page, so
  nothing is affected — but if a case-study route is added later, its `params`
  must be awaited.

### Correction to Task 1 Step 3 — the CSS as first written is circular

The `@theme inline` block in Task 1 Step 3 self-references
(`--color-bg: var(--color-bg)`), which does not resolve. Tailwind v4 needs
distinct source names — the pattern the existing `globals.css:14-21` already
uses correctly. **Use this instead:**

```css
:root {
  --paper: #faf9f7;
  --ink: #111110;
  --muted-ink: #6b6a66;
  --hairline: #e0ded8;
  --accent-ink: #d6421f;
}

[data-theme="dark"] {
  --paper: #0e0e0d;
  --ink: #f4f2ee;
  --muted-ink: #8f8d86;
  --hairline: #26251f;
  --accent-ink: #ff6a45;
}

@theme inline {
  --color-bg: var(--paper);
  --color-fg: var(--ink);
  --color-muted: var(--muted-ink);
  --color-rule: var(--hairline);
  --color-accent: var(--accent-ink);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
}
```

The `html`, `body`, `::selection`, `:focus-visible`, `.container-editorial`,
`.rule`, `.reveal`, and reduced-motion rules from Task 1 Step 3 are unchanged,
except that they must reference `var(--paper)`, `var(--ink)`, `var(--hairline)`,
and `var(--accent-ink)` rather than the `--color-*` names.

---

## File Structure

**Create:**

| Path | Responsibility |
|---|---|
| `src/lib/fonts.ts` | The three `next/font/google` loaders, exporting CSS variables. |
| `src/lib/theme.ts` | The inline pre-hydration theme script as a string constant. |
| `src/lib/useReveal.ts` | `"use client"` — `IntersectionObserver` reveal hook. |
| `src/lib/escapeHtml.ts` | HTML entity escaping for email interpolation. |
| `src/lib/validate.ts` | Email format + contact payload validation. |
| `src/content/site.ts` | Profile, socials, availability, stats, nav items. |
| `src/content/projects.ts` | `Project[]` and the `Project` type. |
| `src/content/journey.ts` | Timeline entries. |
| `src/content/stack.ts` | Grouped technologies. |
| `src/components/layout/SiteHeader.tsx` | Sticky header, nav, theme toggle. |
| `src/components/layout/SiteFooter.tsx` | Footer, socials, copyright. |
| `src/components/layout/ThemeToggle.tsx` | `"use client"` — light/dark switch. |
| `src/components/layout/SkipLink.tsx` | Skip-to-content link. |
| `src/components/ui/Rule.tsx` | Animated hairline rule. |
| `src/components/ui/SectionHeading.tsx` | Mono eyebrow + display heading. |
| `src/components/ui/Tag.tsx` | Technology tag pill. |
| `src/components/ui/CTA.tsx` | Primary/secondary link button. |
| `src/components/ui/StatBlock.tsx` | Single stat with mono figure. |
| `src/components/ui/Reveal.tsx` | `"use client"` — wraps children in reveal animation. |
| `src/components/sections/Hero.tsx` | Home hero. Replaces the old one entirely. |
| `src/components/sections/FeaturedWork.tsx` | Three featured projects on `/`. |
| `src/components/sections/StackStrip.tsx` | Condensed stack row. |
| `src/components/sections/JourneyTimeline.tsx` | About-page timeline. |
| `src/components/sections/ProjectCard.tsx` | One project, with image fallback. |
| `src/components/sections/ProjectGrid.tsx` | `"use client"` — grid + tech filter. |
| `src/components/sections/ContactForm.tsx` | `"use client"` — form with validation. |
| `src/components/sections/ClosingCTA.tsx` | Shared closing call-to-action. |
| `src/app/work/page.tsx` | `/work`. |
| `src/app/about/page.tsx` | `/about`. |
| `src/app/error.tsx` | Route error boundary. |
| `src/app/not-found.tsx` | 404. |
| `src/app/sitemap.ts` | Sitemap. |
| `src/app/robots.ts` | Robots. |
| `src/app/opengraph-image.tsx` | Typographic OG card. |
| `src/lib/escapeHtml.test.ts` | Vitest — escaping. |
| `src/lib/validate.test.ts` | Vitest — validation. |
| `vitest.config.ts` | Vitest config. |

**Modify:** `src/app/globals.css` (full rewrite), `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/contact/page.tsx`, `src/app/api/contact/route.ts`, `next.config.ts`, `package.json`, `.env.example`.

**Delete:** `src/components/Hero.tsx`, `src/app/projects/page.tsx`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`.

---

## Task 1: Design foundation — tokens, fonts, theme

**Files:**
- Create: `src/lib/fonts.ts`, `src/lib/theme.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `display`, `body`, `mono` font objects from `fonts.ts` each exposing `.variable`; `THEME_SCRIPT: string` and `THEME_STORAGE_KEY: string` from `theme.ts`. CSS vars `--color-bg|fg|muted|rule|accent`, font vars `--font-display|body|mono`, and utility classes `.rule`, `.reveal`, `.container-editorial`.

- [ ] **Step 1: Write `src/lib/fonts.ts`**

```ts
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
```

- [ ] **Step 2: Write `src/lib/theme.ts`**

Runs before paint, so there is no flash of the wrong theme. Must be injected
with `dangerouslySetInnerHTML` in `<head>`.

```ts
export const THEME_STORAGE_KEY = "jw-theme";

export const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("jw-theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", stored || system);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
```

- [ ] **Step 3: Rewrite `src/app/globals.css`**

Delete every rule in the current file — the glass, neon, glow, particle,
typing-cursor, and `cursor-none` styles are all obsolete. Replace with:

```css
@import "tailwindcss";

:root {
  --color-bg: #faf9f7;
  --color-fg: #111110;
  --color-muted: #6b6a66;
  --color-rule: #e0ded8;
  --color-accent: #d6421f;
}

[data-theme="dark"] {
  --color-bg: #0e0e0d;
  --color-fg: #f4f2ee;
  --color-muted: #8f8d86;
  --color-rule: #26251f;
  --color-accent: #ff6a45;
}

@theme inline {
  --color-bg: var(--color-bg);
  --color-fg: var(--color-fg);
  --color-muted: var(--color-muted);
  --color-rule: var(--color-rule);
  --color-accent: var(--color-accent);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
}

html {
  background: var(--color-bg);
  color: var(--color-fg);
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.container-editorial {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: 1.5rem;
}

/* Signature motion: hairline draws itself in. */
.rule {
  height: 1px;
  background: var(--color-rule);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
}
.rule[data-revealed="true"] { transform: scaleX(1); }

.reveal {
  opacity: 0;
  transform: translateY(1.25rem);
  transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal[data-revealed="true"] {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal, .rule { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Rewrite `src/app/layout.tsx`**

Attach the three font variables to `<html>`, inject `THEME_SCRIPT` in `<head>`,
and add `suppressHydrationWarning` to `<html>` because the script mutates
`data-theme` before hydration. Keep `metadata` for now; Task 9 expands it.

`SkipLink` / `SiteHeader` / `SiteFooter` arrive in Task 3 — render `{children}`
inside `<main id="main">` for now and wire the shell in Task 3.

- [ ] **Step 5: Verify the build compiles**

Run: `npm run build`
Expected: succeeds. Tailwind resolves `bg-bg`, `text-fg`, `text-muted`,
`border-rule`, `text-accent`, `font-display`, `font-mono`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/fonts.ts src/lib/theme.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: editorial design tokens, fonts, and theme bootstrap"
```

---

## Task 2: Typed content layer

**Files:**
- Create: `src/content/site.ts`, `src/content/projects.ts`, `src/content/journey.ts`, `src/content/stack.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Social = { label: string; href: string; icon: "github" | "linkedin" | "email" }`
  - `type NavItem = { label: string; href: string }`
  - `type Stat = { label: string; value: string; note?: string }`
  - `site: { name: string; initials: string; role: string; location: string; email: string; photo?: string; cv?: string; availability: { open: boolean; label: string }; socials: Social[]; nav: NavItem[]; stats: Stat[] }`
  - `type Project = { slug: string; index: string; title: string; summary: string; year: string; role: string; tags: string[]; github?: string; demo?: string; image?: string; featured: boolean; caseStudy?: never }`
  - `projects: Project[]`
  - `type JourneyEntry = { period: string; title: string; org?: string; body: string }`
  - `journey: JourneyEntry[]`
  - `stack: { group: string; items: string[] }[]`

- [ ] **Step 1: Write `src/content/projects.ts`**

Port the five real projects from the current `src/app/projects/page.tsx:6-67` —
Swiftpro, Kentaz, Kentaz Admin, Christy Empire, Ball & Boujee — keeping their
existing `title`, `description` (rename to `summary`), `tags`, `github`, and
`demo` values verbatim.

Drop "Real-Time Chat" per the spec: its `demo` is `"#"` and its `github` points
at the profile root.

Drop the `gradient` and `accent` fields — they existed only for the neon look,
and `accent` is what drove the broken dynamic class.

Add `slug`, `index` (`"01"`–`"05"`), `year`, `role`, `featured` (true for
Kentaz, Ball & Boujee, Swiftpro), and `image: "/work/<slug>.png"`. Declare
`caseStudy?: never` on the type as the documented seam for later case-study
pages.

- [ ] **Step 2: Write `src/content/site.ts`**

Real values only: name `Jordan Waldehz`, initials `JW`, email
`jrwaldehzx@gmail.com`, GitHub `https://github.com/Pokerxer`, LinkedIn
`https://www.linkedin.com/in/jordan-waldehz-385a7b240`.

**Omit Twitter/X** — the current entry is the bare placeholder
`https://twitter.com`.

Leave `photo` and `cv` unset; Task 7 depends on their absence driving fallbacks.

Stats exactly as pinned in the spec, with the drafted nature visible in code:

```ts
// TODO(jordan): replace with real client/outcome figures if you have them —
// clients served, users reached, orders processed. Concrete numbers would do
// more for the freelance audience than anything else on this page.
export const stats: Stat[] = [
  { label: "Building since", value: "2022" },
  { label: "Products shipped", value: "5" },
  { label: "Live in production", value: "5" },
];
```

- [ ] **Step 3: Write `src/content/journey.ts` and `src/content/stack.ts`**

Journey rests on the one hard fact available — Wyn City, Apr 2022 – Present
(`instructions.md`). Write two or three honest entries around it, each flagged
`// TODO(jordan): confirm wording`. Invent no clients, no achievements, no
metrics.

Stack groups, drawn from real `package.json` dependencies and project tags:
Core (TypeScript, JavaScript), Frontend (React, Next.js, Tailwind CSS, Redux),
Backend (Node.js), Tooling (Git, Vercel, Resend).

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/content
git commit -m "feat: typed content layer as single source of truth"
```

---

## Task 3: Layout shell

**Files:**
- Create: `src/components/layout/SkipLink.tsx`, `ThemeToggle.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `site` (Task 2); `THEME_STORAGE_KEY` (Task 1).
- Produces: `<SkipLink />`, `<ThemeToggle />`, `<SiteHeader />`, `<SiteFooter />` — all zero-prop.

- [ ] **Step 1: `SkipLink.tsx`** — Server Component. Anchor to `#main`, `sr-only` until `:focus-visible`, then pinned top-left with `bg-accent text-bg`.

- [ ] **Step 2: `ThemeToggle.tsx`** — `"use client"`. On mount, read the current theme from `document.documentElement.getAttribute("data-theme")` into state (never from `localStorage` directly — the Task 1 script already resolved system preference). On toggle, write both the attribute and `localStorage[THEME_STORAGE_KEY]`. Inline sun/moon SVGs. `aria-label` must state the action ("Switch to dark theme"). Render the icon only after mount, or accept a hydration mismatch — prefer mounting-gated rendering with a fixed-size placeholder so layout does not shift.

- [ ] **Step 3: `SiteHeader.tsx`** — sticky, `border-b border-rule`, `bg-bg/85`. Left: `site.initials` in the display face linking `/`. Right: `site.nav` in mono uppercase with an accent underline on hover, plus `<ThemeToggle />`.

  Active-route marking needs `usePathname`, which requires a client boundary.
  Keep it minimal: extract a small `"use client"` `NavLinks` child rather than
  making the whole header client. It sets `aria-current="page"` on the match.

  At three nav items no hamburger is needed; the row stays visible on mobile at
  a smaller mono size.

- [ ] **Step 4: `SiteFooter.tsx`** — Server Component. A top hairline, then three
  columns: wordmark + `site.role`, socials from `site.socials`, and the email.
  Bottom line: `© {new Date().getFullYear()} Jordan Waldehz`.

  Inline SVGs for GitHub and LinkedIn — copy the two **valid** paths from the
  current `src/app/contact/page.tsx:260` (GitHub) and `:265` (LinkedIn).
  **Do not copy the Twitter path at `:270`; its data is malformed.**

- [ ] **Step 5: Wire the shell into `src/app/layout.tsx`**

```tsx
<body>
  <SkipLink />
  <SiteHeader />
  <main id="main">{children}</main>
  <SiteFooter />
</body>
```

- [ ] **Step 6: Verify**

Run: `npm run build`, then `npm run dev`. Confirm the header renders, the toggle
flips both ways and survives a reload, there is no flash of the wrong theme, and
the first Tab press reveals the skip link.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout src/app/layout.tsx
git commit -m "feat: shared layout shell with theme toggle and skip link"
```

---

## Task 4: UI primitives and reveal hook

**Files:**
- Create: `src/lib/useReveal.ts`, `src/components/ui/Reveal.tsx`, `Rule.tsx`, `SectionHeading.tsx`, `Tag.tsx`, `CTA.tsx`, `StatBlock.tsx`

**Interfaces:**
- Consumes: `Stat` (Task 2); the `.reveal` / `.rule` classes (Task 1).
- Produces:
  - `useReveal<T extends HTMLElement>(): { ref: RefObject<T | null>; revealed: boolean }`
  - `<Reveal delay?: number>{children}</Reveal>`
  - `<Rule />`
  - `<SectionHeading eyebrow: string; title: string; id?: string />`
  - `<Tag>{label}</Tag>`
  - `<CTA href: string; variant?: "primary" | "secondary"; download?: boolean>{children}</CTA>`
  - `<StatBlock stat: Stat />`

- [ ] **Step 1: `useReveal.ts`** — `"use client"`. A single `IntersectionObserver` at `threshold: 0.15`, `rootMargin: "0px 0px -10% 0px"`, unobserving after the first intersection so nothing re-animates on scroll-back. Returns `{ ref, revealed }`.

- [ ] **Step 2: `Reveal.tsx`** — `"use client"`. Applies `className="reveal"`, `data-revealed={revealed}`, and `style={{ transitionDelay: delay }}`.

- [ ] **Step 3: `Rule.tsx`** — `"use client"`. `className="rule"` plus `data-revealed`. This is the signature motion.

- [ ] **Step 4: The four Server Components**
  - `SectionHeading`: mono uppercase tracked eyebrow in `text-accent`, then a `clamp()` display heading. Accepts `id` for anchoring.
  - `Tag`: mono `text-xs`, `border border-rule`, no fill. **Static classes only.**
  - `CTA`: `primary` → `bg-fg text-bg`; `secondary` → `border border-rule`. Both get an arrow that translates on hover. Uses `next/link` for internal `href`, a plain `<a>` when `download` is set.
  - `StatBlock`: large mono `value` above a mono uppercase `label`.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/useReveal.ts src/components/ui
git commit -m "feat: editorial UI primitives and scroll-reveal hook"
```

---

## Task 5: Work page

Built before the home page because `FeaturedWork` (Task 6) renders `ProjectCard`.

**Files:**
- Create: `src/components/sections/ProjectCard.tsx`, `ProjectGrid.tsx`, `src/app/work/page.tsx`
- Modify: `next.config.ts`
- Delete: `src/app/projects/page.tsx`

**Interfaces:**
- Consumes: `projects`, `Project` (Task 2); `Tag`, `Reveal`, `Rule`, `SectionHeading` (Task 4).
- Produces: `<ProjectCard project: Project; index: number />`, `<ProjectGrid projects: Project[] />`.

- [ ] **Step 1: `ProjectCard.tsx`** — Server Component. Mono index, display title, muted summary, `Tag` row, and Live / Code links. Image through `next/image` with `sizes="(max-width: 768px) 100vw, 50vw"`.

  **The image fallback is required.** When `project.image` is unset, render a
  typographic placeholder — mono index, the title's initial in the display face,
  an accent hairline, on a `bg-fg/[0.04]` panel at the same aspect ratio. Never
  a broken image. Detect absence from the field being unset, not via an
  `onError` handler, since that would force a client component.

- [ ] **Step 2: `ProjectGrid.tsx`** — `"use client"`, holding filter state. Tag list from `Array.from(new Set(projects.flatMap((p) => p.tags)))`.

  Filter buttons use a **static class map** — never interpolation:

```tsx
const filterClass = (active: boolean) =>
  active ? "border-accent text-accent" : "border-rule text-muted hover:text-fg";
```

  This is the direct fix for `projects/page.tsx:279`, where
  `bg-${project.accent}-500/10` compiled to nothing under Tailwind v4.

  Give the filter row `role="group"` with an `aria-label`, and `aria-pressed` on
  every button.

- [ ] **Step 3: `src/app/work/page.tsx`** — `SectionHeading`, `ProjectGrid`, `ClosingCTA` (Task 6; omit until then), and a `/work`-specific `metadata` export.

- [ ] **Step 4: Redirect the old route** — `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/projects", destination: "/work", permanent: true }];
  },
};

export default nextConfig;
```

- [ ] **Step 5: Delete the old page**

```bash
git rm src/app/projects/page.tsx
```

- [ ] **Step 6: Verify**

Run: `npm run build`, then `npm run dev`. Confirm `/projects` returns 308 to
`/work`, the filters narrow the list, `aria-pressed` tracks state, and cards
render typographic placeholders while `/public/work/` is still empty.

- [ ] **Step 7: Commit**

```bash
git add -A src/app/work src/app/projects src/components/sections next.config.ts
git commit -m "feat: /work page with working tech filter; redirect /projects"
```

---

## Task 6: Home page

**Files:**
- Create: `src/components/sections/Hero.tsx`, `FeaturedWork.tsx`, `StackStrip.tsx`, `ClosingCTA.tsx`
- Modify: `src/app/page.tsx`, `src/app/work/page.tsx`
- Delete: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `site`, `projects`, `stack` (Task 2); Task 4 primitives; `ProjectCard` (Task 5).
- Produces: `<Hero />`, `<FeaturedWork />`, `<StackStrip />`, `<ClosingCTA />` — all zero-prop.

- [ ] **Step 1: `Hero.tsx`** — Server Component. No canvas, no typing effect, no glow.

  Availability pill (accent dot + `site.availability.label`), then an oversized
  `clamp(2.75rem, 9vw, 7rem)` display headline across two or three lines with a
  single accent word, a `max-w-xl` muted standfirst, two `CTA`s, and a closing
  `Rule`.

  **Left-aligned, not centered.** The current hero centers everything, which is
  what makes it read as generic.

- [ ] **Step 2: Stats row** — in `page.tsx`, three `StatBlock`s from `site.stats`, hairline-separated, in a `grid-cols-3` that stacks below `sm`.

- [ ] **Step 3: `FeaturedWork.tsx`** — `SectionHeading eyebrow="Selected work"`, then `projects.filter((p) => p.featured)` as `ProjectCard`s in a rule-separated list rather than boxed cards. Closes with a text link to `/work`.

- [ ] **Step 4: `StackStrip.tsx`** — a flat mono row per `stack` group, items joined by `·`, muted.

- [ ] **Step 5: `ClosingCTA.tsx`** — one large display line, a `CTA` to `/contact`, and a mailto to `site.email`. Import it into `/work` as well, completing Task 5 Step 3.

- [ ] **Step 6: Rewrite `src/app/page.tsx`** — compose Hero → stats → FeaturedWork → StackStrip → ClosingCTA, each wrapped in `Reveal` with staggered `delay`, plus a `metadata` export.

- [ ] **Step 7: Delete the old hero**

```bash
git rm src/components/Hero.tsx
```

It holds the particle canvas, the fake cursor, and the typing effect. Confirm
nothing imports it: `grep -rn "components/Hero" src/` returns nothing.

- [ ] **Step 8: Verify**

Run: `npm run build`, then `npm run dev`. Check `/` at 375 / 768 / 1440 in both
themes. Confirm reveals fire once, and that forcing reduced-motion leaves all
content visible.

- [ ] **Step 9: Commit**

```bash
git add -A src/app/page.tsx src/app/work/page.tsx src/components/sections src/components/Hero.tsx
git commit -m "feat: editorial home page; remove particle-canvas hero"
```

---

## Task 7: About page

**Files:**
- Create: `src/components/sections/JourneyTimeline.tsx`, `src/app/about/page.tsx`
- Modify: `src/content/site.ts`

**Interfaces:**
- Consumes: `site`, `journey`, `stack` (Task 2); Task 4 primitives.
- Produces: `<JourneyTimeline />`.

- [ ] **Step 1: `JourneyTimeline.tsx`** — Server Component. A rule-separated vertical list: mono `period` in the left column, display `title` plus muted `body` in the right. Two columns at `md`, stacked below.

- [ ] **Step 2: `src/app/about/page.tsx`** — portrait via `next/image` (`site.photo`, `width={1200} height={1500}`, `priority`, `sizes="(max-width: 768px) 100vw, 40vw"`), bio at `max-w-prose`, `JourneyTimeline`, the full grouped `stack`, and a CV `CTA` with `download`.

  **Both assets need fallbacks, because neither exists yet.**
  - `site.photo` unset → render a monogram panel (`site.initials` in the display
    face on `bg-fg/[0.04]`, same aspect ratio).
  - `site.cv` unset → omit the button entirely rather than link to a 404.

  Add above both fields in `site.ts`:
  `// TODO(jordan): set photo/cv once /public/jordan.jpg and /public/jordan-waldehz-cv.pdf exist`

- [ ] **Step 3: Verify**

Run: `npm run build`, then `npm run dev`. Confirm `/about` renders cleanly with
**no** assets present — `/public` currently holds none — showing the monogram and
no CV button.

- [ ] **Step 4: Commit**

```bash
git add src/app/about src/components/sections/JourneyTimeline.tsx src/content/site.ts
git commit -m "feat: /about page with journey timeline and asset fallbacks"
```

---

## Task 8: Contact — hardened API, tested, plus the form

**Files:**
- Create: `src/lib/escapeHtml.ts`, `src/lib/validate.ts`, `src/lib/escapeHtml.test.ts`, `src/lib/validate.test.ts`, `vitest.config.ts`, `src/components/sections/ContactForm.tsx`
- Modify: `src/app/api/contact/route.ts`, `src/app/contact/page.tsx`, `package.json`

**Interfaces:**
- Consumes: `site` (Task 2); Task 4 primitives.
- Produces: `escapeHtml(input: string): string`; `isValidEmail(value: string): boolean`; `validateContact(payload: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string }`; `type ContactPayload = { name: string; email: string; message: string }`; `<ContactForm />`.

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 3: Write the failing tests**

`src/lib/escapeHtml.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { escapeHtml } from "./escapeHtml";

describe("escapeHtml", () => {
  it("neutralises a script tag", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  it("escapes quotes and ampersands", () => {
    expect(escapeHtml(`"x" & 'y'`)).toBe("&quot;x&quot; &amp; &#39;y&#39;");
  });

  it("escapes the ampersand first so entities are not double-broken", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Hello Jordan")).toBe("Hello Jordan");
  });
});
```

`src/lib/validate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isValidEmail, validateContact } from "./validate";

describe("isValidEmail", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("jrwaldehzx@gmail.com")).toBe(true);
  });

  it.each(["", "no-at-sign", "a@b", "a@b.", "spaced @x.com"])(
    "rejects %j",
    (value) => {
      expect(isValidEmail(value)).toBe(false);
    }
  );
});

describe("validateContact", () => {
  const valid = { name: "Jordan", email: "a@b.com", message: "Hello there" };

  it("accepts a complete payload and trims it", () => {
    const result = validateContact({ ...valid, name: "  Jordan  " });
    expect(result).toEqual({ ok: true, data: valid });
  });

  it("rejects a missing field", () => {
    expect(validateContact({ name: "", email: "a@b.com", message: "hi" }).ok).toBe(false);
  });

  it("rejects a whitespace-only field", () => {
    expect(validateContact({ ...valid, name: "   " }).ok).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(validateContact({ ...valid, email: "nope" }).ok).toBe(false);
  });

  it("rejects a non-object payload", () => {
    expect(validateContact(null).ok).toBe(false);
  });

  it("rejects an over-long message", () => {
    expect(validateContact({ ...valid, message: "x".repeat(5001) }).ok).toBe(false);
  });
});
```

- [ ] **Step 4: Run the tests and confirm they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./escapeHtml` and `./validate`.

- [ ] **Step 5: Implement `src/lib/escapeHtml.ts`**

```ts
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

The ampersand must be replaced first, or the entities emitted by the later
replacements get mangled. Step 3's third test pins that ordering.

- [ ] **Step 6: Implement `src/lib/validate.ts`**

```ts
export type ContactPayload = { name: string; email: string; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value);
}

export function validateContact(
  payload: unknown
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, message } = payload as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return { ok: false, error: "All fields are required." };
  }

  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return { ok: false, error: "All fields are required." };
  }
  if (!isValidEmail(trimmed.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (trimmed.message.length > 5000) {
    return { ok: false, error: "Message is too long (5000 characters max)." };
  }

  return { ok: true, data: trimmed };
}
```

- [ ] **Step 7: Run the tests and confirm they pass**

Run: `npm test`
Expected: PASS, every case.

- [ ] **Step 8: Harden `src/app/api/contact/route.ts`**

Replace the ad-hoc field check with `validateContact`, returning its `error`
string with status `400`.

Wrap **every** interpolated value in `escapeHtml`. Today `${name}`, `${email}`,
and `${message}` are dropped into the email HTML raw, so anyone can inject
markup into the inbox.

Restyle the email to the new palette — it still uses the
`#00f5ff → #7c3aed` neon gradient.

Keep the demo-mode branch (no `RESEND_API_KEY`) working exactly as it does now.

Add a best-effort per-IP limiter — 5 requests per 10 minutes, keyed on
`request.headers.get("x-forwarded-for")`, in a module-level `Map`, returning
`429` when tripped. Comment it honestly:

```ts
// Best-effort only: Fluid Compute reuses instances across requests but gives no
// shared state, so this limits a single warm instance, not the deployment.
// Vercel BotID or Firewall is the real control.
```

- [ ] **Step 9: `ContactForm.tsx`** — `"use client"`.

  A real `<label>` per field — the current inputs are placeholder-only
  (`contact/page.tsx:329-357`). Field-level error text linked by
  `aria-describedby`, `aria-invalid` when invalid, and a
  `role="status" aria-live="polite"` region for submit state.

  **No `alert()`** — that is the present failure path at
  `contact/page.tsx:139`. Render errors inline and preserve typed input so a
  failed submit never loses the message.

- [ ] **Step 10: Rewrite `src/app/contact/page.tsx`** — now a Server Component: `SectionHeading`, a direct-contact column from `site.socials` plus the email, `<ContactForm />`, and a `metadata` export. Drop the canvas, the blurred blobs, and the duplicated nav and footer.

- [ ] **Step 11: Verify**

Run: `npm test` → PASS. `npm run build` → clean. Then with `npm run dev`:

```bash
curl -s -X POST localhost:3000/api/contact -H 'content-type: application/json' \
  -d '{"name":"<script>x</script>","email":"a@b.com","message":"hi"}'
```

Expected: `200` in demo mode, and the logged HTML contains `&lt;script&gt;`,
never `<script>`. Then confirm a missing field and a malformed email each
return `400`.

- [ ] **Step 12: Commit**

```bash
git add -A src/lib src/components/sections/ContactForm.tsx src/app/contact src/app/api vitest.config.ts package.json package-lock.json
git commit -m "fix: escape and validate contact input; rebuild contact page

The email template interpolated name/email/message unescaped, allowing
HTML injection into the inbox. Adds escapeHtml + validateContact with
Vitest coverage, a best-effort rate limit, real form labels, aria-live
status, and removes the alert() failure path."
```

---

## Task 9: SEO, error boundaries, and metadata

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx`, `src/content/site.ts`, `.env.example`

**Interfaces:**
- Consumes: `site` (Task 2).
- Produces: `SITE_URL: string` exported from `src/content/site.ts`.

- [ ] **Step 1: Add `SITE_URL` to `src/content/site.ts`**

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jordanwaldehz.vercel.app";
```

Document `NEXT_PUBLIC_SITE_URL` in `.env.example`.

- [ ] **Step 2: `sitemap.ts` and `robots.ts`** — the sitemap lists `/`, `/work`, `/about`, `/contact` with `lastModified`. Robots allows all and points at `${SITE_URL}/sitemap.xml`.

- [ ] **Step 3: `opengraph-image.tsx`** — `ImageResponse` at 1200×630, exporting `size` and `contentType`. Paper background, ink name in large type, role beneath, accent rule. No external font fetch — the default face is fine and keeps the build offline-safe.

- [ ] **Step 4: `metadataBase`, title template, and JSON-LD in `layout.tsx`**

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jordan Waldehz — Full-Stack Engineer",
    template: "%s · Jordan Waldehz",
  },
  description:
    "Full-stack JavaScript engineer building commerce platforms and web products that ship. Next.js, TypeScript, React.",
  openGraph: { type: "website", siteName: "Jordan Waldehz", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};
```

Add a `Person` JSON-LD `<script type="application/ld+json">` carrying `name`,
`jobTitle`, `url`, `email`, and `sameAs` from `site.socials`.

This whole category is what the benchmark lacks — it ships
`<title>portfolio</title>`, no description, and no structured data.

- [ ] **Step 5: `error.tsx` and `not-found.tsx`** — `error.tsx` is `"use client"` with a `reset()` button; `not-found.tsx` links back to `/` and `/work`. Both use the editorial type scale.

- [ ] **Step 6: Verify**

Run: `npm run build`, then `npm run dev`. Confirm `/sitemap.xml`,
`/robots.txt`, and `/opengraph-image` each return 200, and that
`curl -s localhost:3000 | grep -o '<title>[^<]*</title>'` shows the real title
rather than a placeholder.

- [ ] **Step 7: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/opengraph-image.tsx src/app/error.tsx src/app/not-found.tsx src/app/layout.tsx src/content/site.ts .env.example
git commit -m "feat: sitemap, robots, OG image, JSON-LD, and error boundaries"
```

---

## Task 10: Cleanup, secret placeholder, and full verification

**Files:**
- Modify: `.env.example`, `README.md`
- Delete: `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`

- [ ] **Step 1: Replace the key in `.env.example`**

Set `RESEND_API_KEY=re_xxxxxxxxxxxx`. A real key must never sit in the file
whose whole purpose is to be shared.

**This does not rotate the exposed key** — only Jordan can, at
https://resend.com/dashboard/api-keys. Record that as a required manual step in
`README.md`.

- [ ] **Step 2: Delete the unused create-next-app SVGs**

```bash
git rm public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

Nothing imports them once Task 6 lands. Confirm:
`grep -rn "next.svg\|vercel.svg\|globe.svg\|window.svg\|file.svg" src/` returns
nothing.

- [ ] **Step 3: Document the asset slots in `README.md`**

The three exact paths and dimensions from the spec, plus which `site` fields to
set once each file exists:

| Drop in | Dimensions | Then set |
|---|---|---|
| `public/jordan.jpg` | ~1200×1500 | `site.photo = "/jordan.jpg"` |
| `public/jordan-waldehz-cv.pdf` | — | `site.cv = "/jordan-waldehz-cv.pdf"` |
| `public/work/<slug>.png` | ~1600×1000 | already wired via `project.image` |

- [ ] **Step 4: Full verification pass**

```bash
npm run lint && npm test && npm run build
```

All three clean. Then with `npm run dev`, walk `/`, `/work`, `/about`,
`/contact`, a 404, and `/projects` (must redirect) — each at 375 / 768 / 1440,
in light and dark, keyboard-only, and once with reduced-motion forced on.
Confirm no console errors and no layout shift on load.

- [ ] **Step 5: Confirm the old aesthetic is fully gone**

```bash
grep -rniE "neon|glass|particle|cursor-none|00f5ff|7c3aed|backdrop-blur|typing-cursor" src/ || echo "CLEAN"
```

Expected: `CLEAN`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: placeholder env key, drop unused assets, document asset slots"
```

---

## Self-Review

**Spec coverage.** Palette → T1. Typography → T1. Layout system → T1/T4. Motion
and reduced-motion → T1/T4. Four routes → T5/T6/T7/T8. `/projects` redirect →
T5. SEO layer → T9. Content model with the `caseStudy` seam → T2. Components →
T3/T4/T5/T6/T7/T8. Asset slots and fallbacks → T5 (screenshots), T7 (photo,
CV). "Real-Time Chat" removal → T2. Twitter drop → T2/T3. Contact error
handling → T8. Route error boundaries → T9. Theme flash prevention → T1.
Accessibility → T3 (skip link, focus, `aria-current`), T5 (`aria-pressed`), T8
(labels, `aria-live`). Vitest scope → T8. `.env.example` placeholder → T10.
Drafted stats and journey with visible TODOs → T2.

Every defect in the spec's table maps to a task: broken dynamic classes → T5;
malformed X/Twitter SVG → T3; placeholder Twitter link → T2; `cursor-none` →
T1; duplicated particle canvas → T1/T6; `@import` fonts → T1; `alert()` → T8;
unlabelled inputs → T8; unescaped email HTML → T8; committed-looking env key →
T10; duplicated nav and footer → T3; filler project → T2.

**Placeholder scan.** No "TBD", no "add appropriate error handling". The
`TODO(jordan)` markers in T2 and T7 are deliberate product artifacts flagging
copy the user must confirm — not unfinished plan steps.

**Type consistency.** `Project.image` is optional in T2 and its absence drives
the T5 fallback. `site.photo` / `site.cv` are declared in T2's `site` type and
populated in T7. `SITE_URL` is added to `site.ts` in T9, after T2 creates the
file. `escapeHtml` and `validateContact` signatures in T8 Step 5–6 match both
their Step 3 tests and the T8 Produces block. `Stat` is consumed by `StatBlock`
(T4) exactly as declared in T2. `THEME_STORAGE_KEY` is exported in T1 and
consumed in T3.

**Ordering note.** Task 5 (`/work`) precedes Task 6 (home) because
`FeaturedWork` renders `ProjectCard`. `ClosingCTA` is created in T6 and
retro-imported into `/work` at T6 Step 5, which T5 Step 3 flags.
