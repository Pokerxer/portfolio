import type { Metadata } from "next";
import ClosingCTA from "@/components/sections/ClosingCTA";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Hero from "@/components/sections/Hero";
import StackStrip from "@/components/sections/StackStrip";
import Reveal from "@/components/ui/Reveal";
import StatBlock from "@/components/ui/StatBlock";
import { site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />

      <section className="container-editorial py-10" aria-label="Track record">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {site.stats.map((stat) => (
              <StatBlock key={stat.label} stat={stat} />
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal delay={80}>
        <FeaturedWork />
      </Reveal>

      <Reveal delay={120}>
        <StackStrip />
      </Reveal>

      <Reveal delay={160}>
        <ClosingCTA />
      </Reveal>
    </>
  );
}
