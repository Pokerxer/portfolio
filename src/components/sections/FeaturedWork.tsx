import Link from "next/link";
import ProjectCard from "./ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredProjects } from "@/content/projects";

export default function FeaturedWork() {
  return (
    <section
      className="container-editorial py-20"
      aria-labelledby="featured-work"
    >
      <SectionHeading
        id="featured-work"
        eyebrow="Selected work"
        title="Three worth opening first."
      />

      <div className="mt-14">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <Link
        href="/work"
        className="group mt-8 inline-flex items-center gap-2 border-b border-fg pb-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
      >
        All work
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </section>
  );
}
