"use client";

import { useId, useState } from "react";
import { isValidEmail } from "@/lib/validate";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "failed"; message: string };

const FIELD_CLASS =
  "mt-2 w-full border border-rule bg-transparent px-3 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus-visible:border-accent";

export default function ContactForm() {
  const id = useId();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(values.email.trim()))
      next.email = "That does not look like a valid email address.";
    if (!values.message.trim()) next.message = "Please enter a message.";
    else if (values.message.trim().length > 5000)
      next.message = "Message is too long (5000 characters max).";
    return next;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "failed", message: "Please fix the fields above." });
      return;
    }

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Errors render inline and typed input is preserved, so a failed
        // submit never costs the sender their message.
        setStatus({
          kind: "failed",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        kind: "sent",
        message: data.message ?? "Message sent. I will get back to you.",
      });
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        kind: "failed",
        message:
          "Could not reach the server. Check your connection and try again.",
      });
    }
  };

  const field = (name: keyof Errors) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setValues((prev) => ({ ...prev, [name]: event.target.value })),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      <div>
        <label
          htmlFor={`${id}-name`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
        >
          Name
        </label>
        <input {...field("name")} type="text" className={FIELD_CLASS} />
        {errors.name ? (
          <p id={`${id}-name-error`} className="mt-2 text-sm text-accent">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <label
          htmlFor={`${id}-email`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
        >
          Email
        </label>
        <input {...field("email")} type="email" className={FIELD_CLASS} />
        {errors.email ? (
          <p id={`${id}-email-error`} className="mt-2 text-sm text-accent">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <label
          htmlFor={`${id}-message`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
        >
          Message
        </label>
        <textarea {...field("message")} rows={6} className={FIELD_CLASS} />
        {errors.message ? (
          <p id={`${id}-message-error`} className="mt-2 text-sm text-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="mt-8 inline-flex items-center gap-2 bg-fg px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.5rem] text-sm ${
          status.kind === "failed" ? "text-accent" : "text-muted"
        }`}
      >
        {status.kind === "sent" || status.kind === "failed"
          ? status.message
          : ""}
      </p>
    </form>
  );
}
