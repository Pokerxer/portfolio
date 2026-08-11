export type ContactPayload = { name: string; email: string; message: string };

// Deliberately permissive: one @, a dot in the domain, no whitespace. Full
// RFC 5322 matching is a well-known trap and rejects valid addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL.test(value);
}

export function validateContact(
  payload: unknown
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, message } = payload as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return { ok: false, error: "All fields are required." };
  }

  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return { ok: false, error: "All fields are required." };
  }
  if (!isValidEmail(trimmed.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (trimmed.message.length > 5000) {
    return { ok: false, error: "Message is too long (5000 characters max)." };
  }

  return { ok: true, data: trimmed };
}
