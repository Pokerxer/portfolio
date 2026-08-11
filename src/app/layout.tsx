import type { Metadata } from "next";
import { body, display, mono } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jordan Waldehz | Full-Stack Developer",
  description:
    "Full-Stack JavaScript Developer creating performant, accessible, and beautiful web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: THEME_SCRIPT sets data-theme before React
    // hydrates, so the server and client markup differ on <html> by design.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
