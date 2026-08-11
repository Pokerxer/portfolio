"use client";

import { useReveal } from "@/lib/useReveal";

/** The signature motion: a hairline that draws itself in as its section enters. */
export default function Rule({ className = "" }: { className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role="presentation"
      className={`rule ${className}`}
      data-revealed={revealed}
    />
  );
}
