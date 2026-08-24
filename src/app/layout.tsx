import type { Metadata } from "next";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import SkipLink from "@/components/layout/SkipLink";
import RouteFade from "@/components/ui/RouteFade";
import { SITE_URL, site } from "@/content/site";
import { body, display, mono } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jordan Waldehz — Full-Stack Engineer",
    template: "%s · Jordan Waldehz",
  },
  description:
    "Full-stack JavaScript engineer building commerce platforms and web products that ship. Next.js, TypeScript, React.",
  openGraph: { type: "website", siteName: "Jordan Waldehz", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: SITE_URL,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: site.location },
  sameAs: site.socials
    .filter((social) => social.href.startsWith("http"))
    .map((social) => social.href),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-bg text-fg">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1">
          <RouteFade>{children}</RouteFade>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
