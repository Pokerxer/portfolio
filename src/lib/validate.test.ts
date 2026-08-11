import { describe, expect, it } from "vitest";
import { isValidEmail, validateContact } from "./validate";

describe("isValidEmail", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("jrwaldehzx@gmail.com")).toBe(true);
  });

  it.each(["", "no-at-sign", "a@b", "a@b.", "spaced @x.com"])(
    "rejects %j",
    (value) => {
      expect(isValidEmail(value)).toBe(false);
    }
  );
});

describe("validateContact", () => {
  const valid = { name: "Jordan", email: "a@b.com", message: "Hello there" };

  it("accepts a complete payload and trims it", () => {
    const result = validateContact({ ...valid, name: "  Jordan  " });
    expect(result).toEqual({ ok: true, data: valid });
  });

  it("rejects a missing field", () => {
    expect(
      validateContact({ name: "", email: "a@b.com", message: "hi" }).ok
    ).toBe(false);
  });

  it("rejects a whitespace-only field", () => {
    expect(validateContact({ ...valid, name: "   " }).ok).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(validateContact({ ...valid, email: "nope" }).ok).toBe(false);
  });

  it("rejects a non-object payload", () => {
    expect(validateContact(null).ok).toBe(false);
  });

  it("rejects an over-long message", () => {
    expect(validateContact({ ...valid, message: "x".repeat(5001) }).ok).toBe(
      false
    );
  });
});
