export type StackGroup = {
  group: string;
  items: string[];
};

// Drawn from real package.json dependencies and the tags on shipped projects.
// Nothing here is aspirational.
export const stack: StackGroup[] = [
  {
    group: "Core",
    items: ["TypeScript", "JavaScript"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Redux"],
  },
  {
    group: "Backend",
    items: ["Node.js", "REST APIs"],
  },
  {
    group: "Tooling",
    items: ["Git", "Vercel", "Resend"],
  },
];
