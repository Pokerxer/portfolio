export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2 focus-visible:font-mono focus-visible:text-xs focus-visible:uppercase focus-visible:tracking-[0.18em] focus-visible:text-bg"
    >
      Skip to content
    </a>
  );
}
