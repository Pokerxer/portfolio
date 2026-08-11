import CTA from "@/components/ui/CTA";

export default function NotFound() {
  return (
    <section className="container-editorial py-28">
      <p className="type-eyebrow text-accent">Error 404</p>

      <h1 className="type-display mt-6 max-w-3xl text-fg">
        That page
        <br />
        does not exist.
      </h1>

      <p className="type-lead mt-8 max-w-xl text-muted">
        The link may be out of date, or the page may have moved. The work is
        still where you left it.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <CTA href="/">Back home</CTA>
        <CTA href="/work" variant="secondary">
          See the work
        </CTA>
      </div>
    </section>
  );
}
