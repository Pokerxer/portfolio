"use client";

import { useId, useState } from "react";
import type { Project } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import Reveal from "@/components/ui/Reveal";

// Static class map. This is the direct fix for the old projects page, which
// built `bg-${project.accent}-500/10` at runtime — Tailwind v4 has no runtime
// class generation, so those badges compiled to nothing and rendered unstyled.
const filterClass = (active: boolean) =>
  active
    ? "border-accent bg-accent text-bg"
    : "border-rule text-muted hover:border-accent hover:text-fg";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const statusId = useId();

  const tags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

  const visible = selected
    ? projects.filter((p) => p.tags.includes(selected))
    : projects;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div
          role="group"
          aria-label="Filter projects by technology"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-pressed={selected === null}
            className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200 ${filterClass(
              selected === null
            )}`}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelected(tag === selected ? null : tag)}
              aria-pressed={tag === selected}
              className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-200 ${filterClass(
                tag === selected
              )}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Visible count: the filter does something you can see happen. */}
        <p
          className="ml-auto font-mono text-xs tracking-[0.14em] text-muted"
          aria-hidden="true"
        >
          {String(visible.length).padStart(2, "0")}/
          {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <p id={statusId} className="sr-only" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
        {selected ? `, filtered by ${selected}` : ""}
      </p>

      {/* Keyed on the filter so switching re-mounts the list: cards already
          in view re-reveal immediately with a stagger, the rest reveal on
          scroll. Same mechanism as first load — one code path, no special
          filter animation. */}
      <div
        key={selected ?? "all"}
        aria-describedby={statusId}
        className="mt-12"
      >
        {visible.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 70, 350)}>
            <ProjectCard project={project} />
          </Reveal>
        ))}

        {visible.length === 0 ? (
          <p className="border-t border-rule py-16 text-center font-mono text-sm text-muted">
            Nothing tagged “{selected}” yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
