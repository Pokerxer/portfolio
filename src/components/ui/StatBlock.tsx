"use client";

import { useEffect, useState } from "react";
import type { Stat } from "@/content/site";
import { useReveal } from "@/lib/useReveal";

const NUMERIC = /^\d+$/;

export default function StatBlock({ stat }: { stat: Stat }) {
  // The block owns its reveal so the count-up can start the moment the fade
  // begins, instead of waiting on a parent's observer timing.
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const target = NUMERIC.test(stat.value) ? Number.parseInt(stat.value, 10) : null;
  const [display, setDisplay] = useState(() =>
    target === null ? stat.value : "0"
  );

  useEffect(() => {
    if (target === null || !revealed) return;

    // Everything runs inside rAF callbacks — setState in the effect body
    // itself is a cascading-render smell the react-hooks lint forbids.
    if (typeof requestAnimationFrame === "undefined") {
      const timer = setTimeout(() => setDisplay(stat.value), 0);
      return () => clearTimeout(timer);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 1100;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(String(Math.round(eased * target)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, target, stat.value]);

  return (
    <div ref={ref} className="reveal" data-revealed={revealed}>
      <span aria-hidden="true" className="mb-5 block h-px w-8 bg-accent" />
      <p className="font-mono text-4xl font-medium tracking-tight text-fg sm:text-5xl">
        {display}
      </p>
      <p className="type-eyebrow mt-3 text-muted">{stat.label}</p>
      {stat.note ? (
        <p className="mt-1 font-mono text-xs text-muted/80">{stat.note}</p>
      ) : null}
    </div>
  );
}
