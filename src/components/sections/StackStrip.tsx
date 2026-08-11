import { stack } from "@/content/stack";

export default function StackStrip() {
  return (
    <section className="container-editorial py-16" aria-labelledby="stack-strip">
      <h2 id="stack-strip" className="type-eyebrow text-accent">
        Built with
      </h2>

      <dl className="mt-8 divide-y divide-rule border-y border-rule">
        {stack.map((group) => (
          <div
            key={group.group}
            className="grid gap-2 py-4 sm:grid-cols-4 sm:gap-6"
          >
            <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {group.group}
            </dt>
            <dd className="font-mono text-sm text-fg sm:col-span-3">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
