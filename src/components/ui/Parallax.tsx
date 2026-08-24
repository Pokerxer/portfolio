"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll parallax: translates the wrapper against scroll direction by
 * `speed` × distance-from-viewport-center, so content drifts at its own rate
 * and the page gains depth. Transform-only, updated in rAF, measured against
 * a document-space base captured before any transform is applied (avoids the
 * feedback loop of re-reading a transformed rect). No-ops entirely under
 * reduced motion.
 */
export default function Parallax({
  children,
  speed = 0.1,
  className = "",
}: {
  children: React.ReactNode;
  /** 0.1 ≈ drifts at 10% of scroll speed. Keep small; large values expose clipped edges. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let baseTop = 0;
    let height = 0;

    const measure = () => {
      // Called with the transform zeroed so the rect is document-true.
      node.style.transform = "";
      const rect = node.getBoundingClientRect();
      baseTop = rect.top + window.scrollY;
      height = rect.height;
    };

    const update = () => {
      raf = 0;
      const delta =
        (baseTop + height / 2 - (window.scrollY + window.innerHeight / 2)) *
        -speed;
      node.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
