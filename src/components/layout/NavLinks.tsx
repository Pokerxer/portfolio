"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

// A client component only because active-route marking needs usePathname.
// Kept as a leaf so SiteHeader itself stays a Server Component.
export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-5 sm:gap-7">
      {site.nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`type-eyebrow border-b pb-1 text-[0.6875rem] transition-colors sm:text-xs ${
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:border-accent hover:text-fg"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
