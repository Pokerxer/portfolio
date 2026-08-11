import Link from "next/link";

const BASE =
  "group inline-flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors";

// Static class map. Never interpolate a Tailwind class name — v4 has no runtime
// class generation, so `border-${x}` compiles to nothing.
const VARIANTS = {
  primary: "bg-fg text-bg hover:bg-accent",
  secondary: "border border-rule text-fg hover:border-accent hover:text-accent",
} as const;

export default function CTA({
  href,
  children,
  variant = "primary",
  download = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  download?: boolean;
}) {
  const className = `${BASE} ${VARIANTS[variant]}`;

  const arrow = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );

  if (href.startsWith("/") && !download) {
    return (
      <Link href={href} className={className}>
        {children}
        {arrow}
      </Link>
    );
  }

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      className={className}
      {...(download ? { download: "" } : {})}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {arrow}
    </a>
  );
}
