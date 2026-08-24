import Link from "next/link";
import { site } from "@/content/site";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="header-in sticky top-0 z-40 border-b border-rule bg-bg/80 backdrop-blur-md">
      <div className="container-editorial flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-fg transition-colors hover:text-accent"
        >
          {site.initials}
          <span className="sr-only"> — {site.name}, home</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
          <NavLinks />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
