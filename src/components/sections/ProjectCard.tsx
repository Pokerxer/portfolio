import Image from "next/image";
import type { Project } from "@/content/projects";
import Tag from "@/components/ui/Tag";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="grid gap-8 border-t border-rule py-10 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} — screenshot`}
            width={1600}
            height={1000}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full border border-rule object-cover"
          />
        ) : (
          // Absence is detected from the unset field rather than an onError
          // handler, which would force this into a client component.
          <div
            aria-hidden="true"
            className="flex aspect-[16/10] w-full flex-col justify-between border border-rule bg-fg/[0.04] p-5"
          >
            <span className="font-mono text-xs text-muted">{project.index}</span>
            <span className="font-display text-6xl font-semibold leading-none tracking-tight text-fg/25">
              {project.title.charAt(0)}
            </span>
            <span className="block h-px w-12 bg-accent" />
          </div>
        )}
      </div>

      <div className="md:col-span-7">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-accent">{project.index}</span>
          <span className="font-mono text-xs text-muted">
            {project.year} · {project.role}
          </span>
        </div>

        <h3 className="type-heading mt-3 text-fg">{project.title}</h3>

        <p className="mt-3 max-w-prose text-muted">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-6">
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-fg pb-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
            >
              Live site
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
              <span className="sr-only"> — {project.title}</span>
            </a>
          ) : null}

          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-transparent pb-1 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Code
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
              <span className="sr-only"> — {project.title}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
