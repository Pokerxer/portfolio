import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import SocialIcon from "@/components/ui/SocialIcon";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Jordan Waldehz about freelance projects, full-time roles, or anything you need built.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container-editorial py-20">
      <SectionHeading eyebrow="Contact" title="Tell me what you are building." />

      <Reveal delay={80}>
        <p className="type-lead mt-6 max-w-prose text-muted">
          Freelance projects and full-time roles both welcome. I read everything
          and reply to anything with a real question in it.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-16 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <h2 className="type-eyebrow text-accent">Send a message</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={140} className="md:col-span-5">
          <h2 className="type-eyebrow text-accent">Or reach me directly</h2>

          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  {...(social.icon === "email"
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex items-center gap-4 py-5 transition-colors hover:text-accent"
                >
                  <SocialIcon icon={social.icon} className="h-5 w-5 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium">
                      {social.label}
                    </span>
                    <span className="block text-sm text-muted">
                      {social.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-auto transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 font-mono text-xs text-muted">
            Based in {site.location}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
