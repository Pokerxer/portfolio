import type { Stat } from "@/content/site";

export default function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div>
      <p className="font-mono text-4xl font-medium tracking-tight text-fg sm:text-5xl">
        {stat.value}
      </p>
      <p className="type-eyebrow mt-3 text-muted">{stat.label}</p>
      {stat.note ? (
        <p className="mt-1 font-mono text-xs text-muted/80">{stat.note}</p>
      ) : null}
    </div>
  );
}
