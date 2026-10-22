import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import { href, SITE, type Locale } from "./site";

/** Title, description, canonical, language alternates and the share image for a page. */
export function pageMeta(locale: Locale, path: string, title?: string, description?: string): Metadata {
  const t = COPY[locale].meta;
  const full = title ? `${title} · Bill The Dev` : t.title;
  return {
    metadataBase: new URL(SITE.url),
    title: full,
    description: description ?? t.description,
    alternates: { canonical: href(locale, path), languages: { en: href("en", path), vi: href("vi", path), "x-default": href("en", path) } },
    openGraph: { title: full, description: description ?? t.description, url: href(locale, path), siteName: "Bill The Dev", type: "website", images: ["/img/brand/og.png"] },
    icons: { icon: "/favicon.svg" },
  };
}
