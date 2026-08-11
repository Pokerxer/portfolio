"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";
import ProjectCard from "./ProjectCard";

// Static class map. This is the direct fix for the old projects page, which
// built `bg-${project.accent}-500/10` at runtime — Tailwind v4 has no runtime
// class generation, so those badges compiled to nothing and rendered unstyled.
const filterClass = (active: boolean) =>
  active
    ? "border-accent text-accent"
    : "border-rule text-muted hover:border-accent hover:text-fg";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const tags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

  const visible = selected
    ? projects.filter((p) => p.tags.includes(selected))
    : projects;

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by technology"
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          onClick={() => setSelected(null)}
          aria-pressed={selected === null}
          className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${filterClass(
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
            className={`border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${filterClass(
              tag === selected
            )}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
        {selected ? `, filtered by ${selected}` : ""}
      </p>

      <div className="mt-12">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
