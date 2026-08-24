import { stack } from "@/content/stack";

// Two counter-scrolling rows instead of one ticker — the offset makes the
// band read as one object with depth. The sequence renders twice per row for
// a seamless -50% loop; every copy except the first is aria-hidden so
// assistive tech reads the list exactly once.
function Sequence({
  hidden = false,
  reverse = false,
}: {
  hidden?: boolean;
  reverse?: boolean;
}) {
  const groups = reverse ? [...stack].reverse() : stack;

  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center${hidden ? " marquee-dup" : ""}`}
    >
      {groups.map((group) =>
        group.items.map((item) => (
          <li
            key={`${group.group}-${item}`}
            className="flex items-center font-mono text-sm text-fg/80"
          >
            <span className="whitespace-nowrap px-6 py-3">{item}</span>
            <span aria-hidden="true" className="text-accent">
              ✳
            </span>
          </li>
        ))
      )}
    </ul>
  );
}

export default function StackStrip() {
  return (
    <section
      className="container-editorial py-16"
      aria-labelledby="stack-strip"
    >
      <h2 id="stack-strip" className="type-eyebrow text-accent">
        Built with
      </h2>

      <div
        className="marquee marquee-mask mt-8 border-y border-rule"
        tabIndex={0}
        role="group"
        aria-label="Technologies I work with. Animation pauses on focus."
      >
        <div className="marquee-track">
          <Sequence />
          <Sequence hidden />
        </div>
        {/* Decorative counter-row: hidden from AT entirely, and removed
            under reduced motion (see .marquee-alt in globals.css). */}
        <div className="marquee-track marquee-reverse marquee-alt border-t border-rule">
          <Sequence reverse hidden />
          <Sequence reverse hidden />
        </div>
      </div>
    </section>
  );
}
