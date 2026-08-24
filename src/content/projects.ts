export type Project = {
  slug: string;
  /** Mono display index, e.g. "01". Editorial numbering, not an identifier. */
  index: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  tags: string[];
  github?: string;
  demo?: string;
  /** Unset means no screenshot exists yet; consumers render a typographic
   *  placeholder rather than a broken image. */
  image?: string;
  featured: boolean;
  /** Reserved seam for future /work/<slug> case-study pages. Nothing reads it
   *  yet; typed as `never` so no one can populate it without widening the type
   *  deliberately. */
  caseStudy?: never;
};

// Newest first. Both DrinksHarbour entries share one monorepo
// (github.com/Pokerxer/DrinksHarbour): `client/apps/platform` is the
// marketplace + tenant storefronts, `client/apps/admin` is the back office.
export const projects: Project[] = [
  {
    slug: "drinksharbour",
    index: "01",
    title: "DrinksHarbour",
    summary:
      "Multi-tenant SaaS for the Nigerian beverage industry — a public marketplace where every subscribing business gets its own branded storefront, all selling from one shared catalogue.",
    year: "2026",
    role: "Full-stack",
    tags: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    github: "https://github.com/Pokerxer/DrinksHarbour",
    demo: "https://www.drinksharbour.com",
    image: "/work/drinksharbour.png",
    featured: true,
  },
  {
    slug: "drinksharbour-admin",
    index: "02",
    title: "DrinksHarbour Admin",
    summary:
      "The back office behind the marketplace — POS, inventory across warehouses, purchasing, sales orders, HR and appraisals, plus tenant administration for the whole platform.",
    year: "2026",
    role: "Full-stack",
    tags: ["Next.js", "TypeScript", "Admin", "Dashboard"],
    github: "https://github.com/Pokerxer/DrinksHarbour",
    demo: "https://admin.drinksharbour.com",
    image: "/work/drinksharbour-admin.png",
    featured: false,
  },
  {
    slug: "swiftpro",
    index: "03",
    title: "Swiftpro",
    summary:
      "A modern Next.js application with TypeScript, featuring a sleek UI and optimized performance for web applications.",
    year: "2024",
    role: "Design & build",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    github: "https://github.com/Pokerxer/swiftpro",
    demo: "https://swiftpro-bice.vercel.app",
    image: "/work/swiftpro.png",
    featured: true,
  },
  {
    slug: "kentaz",
    index: "04",
    title: "Kentaz",
    summary:
      "E-commerce and booking platform with modern UI, product catalog, shopping cart, checkout flow, and booking system.",
    year: "2024",
    role: "Full-stack",
    tags: ["Next.js", "TypeScript", "Redux", "Tailwind CSS"],
    github: "https://github.com/Pokerxer/kentaz-backend",
    demo: "https://www.kentazemporium.com",
    image: "/work/kentaz.png",
    featured: true,
  },
  {
    slug: "kentaz-admin",
    index: "05",
    title: "Kentaz Admin",
    summary:
      "Admin dashboard with inventory management, order tracking, customer management, and analytics.",
    year: "2024",
    role: "Full-stack",
    tags: ["Next.js", "TypeScript", "Admin", "Dashboard"],
    github: "https://github.com/Pokerxer/kentaz-backend",
    demo: "https://admin.kentazemporium.com",
    image: "/work/kentaz-admin.png",
    featured: false,
  },
  {
    slug: "christy-empire",
    index: "06",
    title: "Christy Empire",
    summary:
      "Modern e-commerce platform with responsive design and product catalog for fashion retail.",
    year: "2023",
    role: "Design & build",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "E-commerce"],
    github: "https://github.com/Pokerxer/Christy-empire",
    demo: "https://christy-empire.vercel.app",
    image: "/work/christy-empire.png",
    featured: false,
  },
  {
    slug: "ball-and-boujee",
    index: "07",
    title: "Ball & Boujee",
    summary:
      "Sports and lifestyle e-commerce platform bridging basketball culture with high fashion from Abuja.",
    year: "2023",
    role: "Design & build",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "E-commerce"],
    github: "https://github.com/Pokerxer/ballandboujee",
    demo: "https://ballandboujee.com",
    image: "/work/ball-and-boujee.png",
    featured: true,
  },
];

// `image` points at a live screenshot captured from each project's public URL
// (1600×1000 viewport). Re-capture if a project is redesigned: headless
// Chromium at that size against the `demo` URL. The typographic fallback in
// ProjectCard remains for any future project without a screenshot yet.
// DrinksHarbour notes: the marketplace shows an age gate + promo modal on a
// cold visit — dismiss both before capturing.

export const featuredProjects = projects.filter((project) => project.featured);
