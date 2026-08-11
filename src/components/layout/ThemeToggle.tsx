"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from the DOM, not localStorage: the pre-hydration script in
    // src/lib/theme.ts has already resolved storage vs. system preference, so
    // the attribute is the single source of truth by the time we mount.
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  const label = mounted
    ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
    : "Switch theme";

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the theme still applies for this page
      // view, it just will not persist. Not worth surfacing to the user.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="grid h-9 w-9 place-items-center border border-rule text-fg transition-colors hover:border-accent hover:text-accent"
    >
      {/* Before mount the icon is withheld to avoid a hydration mismatch, but
          the box keeps its size so the header never shifts. */}
      {mounted ? (
        theme === "dark" ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              strokeLinecap="round"
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            />
          </svg>
        )
      ) : (
        <span className="block h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
