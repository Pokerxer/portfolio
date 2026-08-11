export default function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="type-eyebrow text-accent">{eyebrow}</p>
      <h2 id={id} className="type-title mt-4 text-fg">
        {title}
      </h2>
    </div>
  );
}
