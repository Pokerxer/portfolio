import type { Metadata } from "next";
import ClosingCTA from "@/components/sections/ClosingCTA";
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
    <>
      <section className="container-editorial py-20">
        <SectionHeading
          eyebrow="Selected work"
          title="Seven products, all live in production."
        />

        <p className="type-lead mt-6 max-w-prose text-muted">
          Storefronts, booking flows, and the admin tooling behind them. Every
          entry below has a public URL you can open right now.
        </p>

        <div className="mt-14">
          <ProjectGrid projects={projects} />
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
