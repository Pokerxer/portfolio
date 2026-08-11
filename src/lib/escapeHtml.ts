/**
 * Entity-escapes a string for interpolation into HTML.
 *
 * The ampersand must be replaced first. Any other order re-processes the `&`
 * of entities emitted by the earlier replacements and mangles them — the third
 * case in escapeHtml.test.ts pins that ordering.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
