"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element scrolls into view, then stops observing so
 * nothing re-animates on scroll-back. The visual result is entirely CSS —
 * this only flips the `data-revealed` attribute the stylesheet keys off.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (very old browsers, some test envs): show the
    // content rather than leaving it stuck at opacity 0. Deferred by a timeout
    // so this is not a synchronous setState inside the effect body, which
    // would cascade an extra render pass.
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setRevealed(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
