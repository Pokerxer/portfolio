export type Social = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
  description: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type Stat = {
  label: string;
  value: string;
  note?: string;
};

// TODO(jordan): replace with real client/outcome figures if you have them —
// clients served, users reached, orders processed. Concrete numbers would do
// more for the freelance half of the audience than anything else on this page.
// Every value below is derived only from facts already in this repo.
export const stats: Stat[] = [
  { label: "Building since", value: "2022", note: "Wyn City onwards" },
  { label: "Products shipped", value: "5", note: "All client-facing" },
  { label: "Live in production", value: "5", note: "Public URLs" },
];

export const site = {
  name: "Jordan Waldehz",
  initials: "JW",
  role: "Full-Stack JavaScript Developer",
  location: "Abuja, Nigeria",
  email: "jrwaldehzx@gmail.com",

  // TODO(jordan): set photo/cv once /public/jordan.jpg and
  // /public/jordan-waldehz-cv.pdf exist. While these are undefined the About
  // page renders a monogram panel and omits the CV button — by design, so the
  // site looks finished before any asset is added.
  photo: undefined as string | undefined,
  cv: undefined as string | undefined,

  availability: {
    open: true,
    label: "Available for freelance and full-time work",
  },

  // Twitter/X is deliberately absent: the only handle in the old source was the
  // bare placeholder https://twitter.com. Add it back when there is a real one.
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Pokerxer",
      icon: "github",
      description: "Code and side projects",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jordan-waldehz-385a7b240",
      icon: "linkedin",
      description: "Experience and background",
    },
    {
      label: "Email",
      href: "mailto:jrwaldehzx@gmail.com",
      icon: "email",
      description: "Fastest way to reach me",
    },
  ] satisfies Social[],

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  stats,
};
