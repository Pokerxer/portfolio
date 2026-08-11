import CTA from "@/components/ui/CTA";
import Rule from "@/components/ui/Rule";
import { site } from "@/content/site";

// Left-aligned, not centered. Centering everything is what made the previous
// hero read as generic. No canvas, no typing effect, no glow.
export default function Hero() {
  return (
    <section className="container-editorial pb-16 pt-20 sm:pt-28">
      {site.availability.open ? (
        <p className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-2 w-2 rounded-full bg-accent"
          />
          <span className="type-eyebrow text-muted">
            {site.availability.label}
          </span>
        </p>
      ) : null}

      <h1 className="type-display mt-8 max-w-4xl text-fg">
        I build web products
        <br />
        that <span className="text-accent">ship</span>.
      </h1>

      <p className="type-lead mt-8 max-w-xl text-muted">
        {site.role} in {site.location}. Five products live in production —
        storefronts, booking flows, and the admin tooling that keeps them
        running.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <CTA href="/work">See the work</CTA>
        <CTA href="/contact" variant="secondary">
          Get in touch
        </CTA>
      </div>

      <Rule className="mt-20" />
    </section>
  );
}
