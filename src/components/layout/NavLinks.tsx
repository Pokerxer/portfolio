"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

// A client component only because active-route marking needs usePathname.
// Kept as a leaf so SiteHeader itself stays a Server Component.
//
// Active/hover state is an underline that scales in from the left
// (::after via Tailwind's after: utilities) rather than a border color swap —
// the slide reads as motion, the border swap read as a flicker.
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
              className={`type-eyebrow relative pb-1 text-[0.6875rem] transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out sm:text-xs ${
                active
                  ? "text-accent after:scale-x-100"
                  : "text-muted after:scale-x-0 hover:text-fg hover:after:scale-x-100"
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
