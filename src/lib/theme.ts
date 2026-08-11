export const THEME_STORAGE_KEY = "jw-theme";

export type Theme = "light" | "dark";

/**
 * Injected into <head> with dangerouslySetInnerHTML so it runs before first
 * paint. Without it the document renders in the default theme and then snaps to
 * the stored one, which is the flash this exists to prevent.
 *
 * The storage key is written literally rather than interpolated so the script
 * stays a plain constant with no template-injection surface.
 */
export const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("jw-theme");
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute(
      "data-theme",
      stored === "light" || stored === "dark" ? stored : system
    );
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
