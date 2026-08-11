import type { Metadata } from "next";
import ProjectGrid from "@/components/sections/ProjectGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Commerce platforms, admin dashboards, and web products built with Next.js, TypeScript, and React — each one live in production.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="container-editorial py-20">
      <SectionHeading
        eyebrow="Selected work"
        title="Five products, all live in production."
      />

      <p className="type-lead mt-6 max-w-prose text-muted">
        Storefronts, booking flows, and the admin tooling behind them. Every
        entry below has a public URL you can open right now.
      </p>

      <div className="mt-14">
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
