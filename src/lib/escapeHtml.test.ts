import { describe, expect, it } from "vitest";
import { escapeHtml } from "./escapeHtml";

describe("escapeHtml", () => {
  it("neutralises a script tag", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  it("escapes quotes and ampersands", () => {
    expect(escapeHtml(`"x" & 'y'`)).toBe("&quot;x&quot; &amp; &#39;y&#39;");
  });

  it("escapes the ampersand first so entities are not double-broken", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Hello Jordan")).toBe("Hello Jordan");
  });
});
