import Image from "next/image";
import CTA from "@/components/ui/CTA";
import Parallax from "@/components/ui/Parallax";
import Rule from "@/components/ui/Rule";
import { site } from "@/content/site";
import { featuredProjects } from "@/content/projects";

// Three shots for the floating collage, taken from the featured projects'
// real screenshots. Purely decorative — the CTA below already links to /work,
// so the links are aria-hidden and untabbable.
const collage = featuredProjects.slice(0, 3);

// Left-aligned type, right-aligned proof. Centering everything is what made
// the previous hero read as generic; a blank right half is what made it read
// as unfinished. Entrance is pure CSS (see globals.css): the display lines
// rise out of clipping masks, the rows below fade up in step, the aurora
// drifts behind everything, and the whole scene parallaxes on scroll.
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="aurora" aria-hidden="true">
        {/* Blobs drift against scroll for depth; the grid stays put —
            structure shouldn't parallax, atmosphere should. */}
        <Parallax speed={0.15} className="absolute inset-0">
          <span className="aurora-blob aurora-a" />
          <span className="aurora-blob aurora-b" />
        </Parallax>
        <span className="hero-grid" />
      </div>

      <div className="container-editorial relative flex min-h-[calc(100svh-4rem)] flex-col pb-8 pt-16 sm:pt-20">
        <div className="my-auto grid items-center gap-14 py-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            {site.availability.open ? (
              <p
                className="flex items-center gap-3 fade-in-up"
                style={{ animationDelay: "0ms" }}
              >
                <span
                  aria-hidden="true"
                  className="dot-pulse block h-2 w-2 rounded-full bg-accent"
                />
                <span className="type-eyebrow text-muted">
                  {site.availability.label}
                </span>
              </p>
            ) : null}

            <h1 className="type-display mt-8 max-w-4xl text-fg">
              <span className="line-mask">
                <span className="line-inner">I build web products</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  that{" "}
                  <span className="underline-draw text-accent">ship</span>.
                </span>
              </span>
            </h1>

            <p
              className="type-lead mt-8 max-w-xl text-muted fade-in-up"
              style={{ animationDelay: "260ms" }}
            >
              {site.role} in {site.location}. Seven products live in
              production — storefronts, booking flows, and the admin tooling
              that keeps them running.
            </p>

            <div
              className="mt-10 flex flex-wrap gap-4 fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <CTA href="/work">See the work</CTA>
              <CTA href="/contact" variant="secondary">
                Get in touch
              </CTA>
            </div>
          </div>

          {/* md–lg: full-width band under the type. lg+: side column. */}
          <div className="hidden md:block lg:col-span-5" aria-hidden="true">
            {/* Parallax drifts the whole collage against scroll; the float
                and hover transforms live on inner nodes, so nothing fights. */}
            <Parallax
              speed={0.12}
              className="relative mx-auto h-[22rem] w-full max-w-2xl lg:h-[33rem] lg:max-w-none"
            >
              {collage.map((project, i) => (
                <div
                  key={project.slug}
                  className={`shot-wrap fade-in-up shot-${i + 1}`}
                  style={{ animationDelay: `${500 + i * 160}ms` }}
                >
                  <div
                    className="floater"
                    style={
                      {
                        "--float-delay": `${i * -2.3}s`,
                      } as React.CSSProperties
                    }
                  >
                    <a
                      href="/work"
                      tabIndex={-1}
                      className="shot"
                      style={
                        {
                          "--r": `${[3, -6, 2][i]}deg`,
                        } as React.CSSProperties
                      }
                    >
                      <Image
                        src={project.image ?? ""}
                        alt=""
                        width={1600}
                        height={1000}
                        priority={i === 0}
                        sizes="(min-width: 1024px) 26rem, (min-width: 768px) 42rem, 0px"
                        className="h-auto w-full"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </Parallax>
          </div>
        </div>

        <Rule className="mt-10" />

        <div
          className="mt-6 flex items-center gap-4 fade-in-up"
          style={{ animationDelay: "700ms" }}
        >
          <span className="scroll-line" aria-hidden="true">
            <span className="scroll-dot" />
          </span>
          <span className="type-eyebrow text-muted">Scroll</span>
        </div>
      </div>
    </section>
  );
}
