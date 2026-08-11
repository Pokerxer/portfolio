"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // Next 16.2 added unstable_retry and documents it as the preferred recovery
  // action: unlike reset(), it re-fetches before re-rendering. reset() only
  // clears the error state without refetching.
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-editorial py-28">
      <p className="type-eyebrow text-accent">Something broke</p>

      <h1 className="type-display mt-6 max-w-3xl text-fg">
        That did not
        <br />
        go to plan.
      </h1>

      <p className="type-lead mt-8 max-w-xl text-muted">
        An unexpected error stopped this page from rendering. Trying again often
        clears it.
      </p>

      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-10 inline-flex items-center gap-2 bg-fg px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent"
      >
        Try again
      </button>
    </section>
  );
}
