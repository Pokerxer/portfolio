import { site } from "@/content/site";
import SocialIcon from "@/components/ui/SocialIcon";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="container-editorial py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-muted">{site.role}</p>
            <p className="mt-1 text-sm text-muted">{site.location}</p>
          </div>

          <nav aria-label="Social">
            <h2 className="type-eyebrow text-muted">Elsewhere</h2>
            <ul className="mt-4 space-y-2">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...(social.icon === "email"
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <SocialIcon icon={social.icon} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="type-eyebrow text-muted">Start a conversation</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block break-words font-display text-lg tracking-tight transition-colors hover:text-accent"
            >
              {site.email}
            </a>
          </div>
        </div>

        <p className="mt-12 font-mono text-xs text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
