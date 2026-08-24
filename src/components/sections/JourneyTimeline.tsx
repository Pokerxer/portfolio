import { journey } from "@/content/journey";
import Reveal from "@/components/ui/Reveal";

export default function JourneyTimeline() {
  return (
    <ol className="mt-12 divide-y divide-rule border-y border-rule">
      {journey.map((entry, i) => (
        <li
          key={`${entry.period}-${entry.title}`}
          className="py-8"
        >
          {/* The reveal wraps content *inside* the li so the list keeps
              nothing but li children. Stagger steps per entry. */}
          <Reveal delay={Math.min(i * 80, 240)}>
            <div className="grid gap-3 md:grid-cols-12 md:gap-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted md:col-span-4">
                {entry.period}
              </p>

              <div className="md:col-span-8">
                <h3 className="type-heading text-fg">
                  {entry.title}
                  {entry.org ? (
                    <span className="text-accent"> · {entry.org}</span>
                  ) : null}
                </h3>
                <p className="mt-3 max-w-prose text-muted">{entry.body}</p>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
