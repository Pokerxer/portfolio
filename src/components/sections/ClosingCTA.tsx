import CTA from "@/components/ui/CTA";
import { site } from "@/content/site";

export default function ClosingCTA() {
  return (
    <section className="container-editorial py-20" aria-labelledby="closing-cta">
      <h2 id="closing-cta" className="type-title max-w-3xl text-fg">
        Have something that needs building?
      </h2>

      <p className="type-lead mt-6 max-w-xl text-muted">
        Freelance projects and full-time roles both welcome. Tell me what you
        are working on and I will reply.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <CTA href="/contact">Start a conversation</CTA>
        <a
          href={`mailto:${site.email}`}
          className="border-b border-transparent pb-1 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {site.email}
        </a>
      </div>
    </section>
  );
}
