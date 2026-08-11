export type JourneyEntry = {
  period: string;
  title: string;
  org?: string;
  body: string;
};

// TODO(jordan): confirm wording on every entry below. These are drafted from
// the only dated fact in this repo — Wyn City, Apr 2022 – Present, recorded in
// instructions.md — plus the shipped projects in src/content/projects.ts.
// No client, achievement, or metric has been invented. Rewrite freely; if you
// have specific outcomes (revenue processed, users served, team size), those
// belong here and will read far stronger than the general framing.
export const journey: JourneyEntry[] = [
  {
    period: "Apr 2022 — Present",
    title: "Full-Stack Developer",
    org: "Wyn City",
    body: "Building and maintaining web products end to end — interface through API. Most of the work is commerce-shaped: catalogues, carts, checkout, and the admin tooling that keeps them running.",
  },
  {
    period: "2023 — 2024",
    title: "Commerce platforms, start to finish",
    body: "Shipped Kentaz and its admin dashboard, Christy Empire, and Ball & Boujee. Storefront, booking, inventory, order tracking, and analytics — each one live on its own domain rather than parked in a repo.",
  },
  {
    period: "Ongoing",
    title: "Sharpening the toolkit",
    body: "TypeScript everywhere, React Server Components where they earn their place, and a standing preference for shipping something small and correct over something large and provisional.",
  },
];
