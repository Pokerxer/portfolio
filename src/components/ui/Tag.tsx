// Static classes only. Tailwind v4 has no runtime class generation, so an
// interpolated class name compiles to nothing.
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-rule px-2 py-1 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
