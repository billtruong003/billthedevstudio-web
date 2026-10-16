import type { Locale } from "./site";

/** "2026-10-16" as "16 Oct 2026" / "16 thg 10, 2026"; anything else (e.g. "[DATE]") as it is. */
export function formatDate(d: string, locale: Locale) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return new Date(d + "T00:00:00Z").toLocaleDateString(locale === "vi" ? "vi-VN" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
