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

    // Safety net: if the observer never reports — some webviews, privacy
    // extensions, and instrumented environments create one that silently never
    // fires — reveal anyway so content can't stay hidden. The timeout keeps
    // this off the effect body's synchronous path, which
    // react-hooks/set-state-in-effect forbids.
    const fallback = setTimeout(() => setRevealed(true), 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            clearTimeout(fallback);
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return { ref, revealed };
}
