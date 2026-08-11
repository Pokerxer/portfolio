import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

// The CSS variable names are deliberately NOT `--font-display` / `--font-body` /
// `--font-mono`. Those belong to Tailwind v4's own theme-key namespace, where
// `--font-x` generates the `font-x` utility, so reusing them here would make the
// `@theme inline` block in globals.css self-referential. These `--jw-*` names are
// the raw next/font handles; globals.css maps them onto the theme keys.

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--jw-display",
});

export const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--jw-body",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--jw-mono",
});
