import Link from "next/link";
import ProjectCard from "./ProjectCard";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredProjects } from "@/content/projects";

// Cards reveal individually as each enters the viewport — one shared reveal
// for the whole section meant every card animated together the moment the
// first one peeked in.
export default function FeaturedWork() {
  return (
    <section
      className="container-editorial py-20"
      aria-labelledby="featured-work"
    >
      <Reveal>
        <SectionHeading
          id="featured-work"
          eyebrow="Selected work"
          title="Four worth opening first."
        />
      </Reveal>

      <div className="mt-14">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 90, 180)}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <Link
          href="/work"
          className="group mt-8 inline-flex items-center gap-2 border-b border-fg pb-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
        >
          All work
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
