import type { Metadata } from "next";
import Image from "next/image";
import ClosingCTA from "@/components/sections/ClosingCTA";
import JourneyTimeline from "@/components/sections/JourneyTimeline";
import CTA from "@/components/ui/CTA";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { stack } from "@/content/stack";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jordan Waldehz — full-stack JavaScript developer. Building commerce platforms and web products since 2022, from storefront through admin tooling.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="container-editorial py-20">
        <SectionHeading
          eyebrow="About"
          title="Self-taught, production-tested, still building."
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-5">
            {site.photo ? (
              <Image
                src={site.photo}
                alt={`${site.name}, ${site.role}`}
                width={1200}
                height={1500}
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="w-full border border-rule object-cover"
              />
            ) : (
              // No photo in /public yet. A monogram panel keeps the page
              // composed rather than leaving a hole or a broken image.
              <div
                aria-hidden="true"
                className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-6 border border-rule bg-fg/[0.04]"
              >
                <span className="font-display text-7xl font-semibold tracking-tight text-fg/20">
                  {site.initials}
                </span>
                <span className="block h-px w-12 bg-accent" />
              </div>
            )}
          </Reveal>

          <Reveal delay={100} className="md:col-span-7">
            <div className="max-w-prose space-y-5 text-muted">
              <p className="type-lead text-fg">
                I&rsquo;m {site.name}, a {site.role.toLowerCase()} based in{" "}
                {site.location}.
              </p>
              <p>
                Most of what I build is commerce-shaped: product catalogues,
                carts, checkout, booking flows, and the admin tooling that keeps
                them running once real orders start arriving. I work across the
                whole thing — interface through API — which usually means fewer
                handoffs and fewer things lost between them.
              </p>
              <p>
                My bias is toward shipping something small and correct over
                something large and provisional. Every project on this site has
                a public URL, because a live product is the only portfolio entry
                that proves anything.
              </p>
            </div>

            {/* No CV in /public yet, so the button is omitted rather than
                pointed at a 404. */}
            {site.cv ? (
              <div className="mt-8">
                <CTA href={site.cv} variant="secondary" download>
                  Download CV
                </CTA>
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="container-editorial py-10" aria-labelledby="journey">
        <h2 id="journey" className="type-eyebrow text-accent">
          Journey
        </h2>
        <JourneyTimeline />
      </section>

      <section className="container-editorial py-16" aria-labelledby="toolkit">
        <h2 id="toolkit" className="type-eyebrow text-accent">
          Toolkit
        </h2>

        <dl className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((group, i) => (
            <Reveal key={group.group} delay={Math.min(i * 80, 240)}>
              <dt className="border-b border-rule pb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {group.group}
              </dt>
              <dd>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <ClosingCTA />
    </>
  );
}
