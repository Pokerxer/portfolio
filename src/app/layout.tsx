import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jordan Waldehz | Full-Stack Developer",
  description: "Full-Stack JavaScript Developer creating performant, accessible, and beautiful web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen flex flex-col bg-[#0a0a0f] text-white">
        {children}
      </body>
    </html>
  );
}