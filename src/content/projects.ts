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

export const projects: Project[] = [
  {
    slug: "swiftpro",
    index: "01",
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
    index: "02",
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
    index: "03",
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
    index: "04",
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
    index: "05",
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

// TODO(jordan): `year` and `role` are inferred, not recorded anywhere in the
// repo — correct them if any are wrong. Everything else (title, summary, tags,
// github, demo) is carried over verbatim from the previous project list.

export const featuredProjects = projects.filter((project) => project.featured);
