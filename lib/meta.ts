import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import { href, SITE, type Locale } from "./site";

/** Title, description, canonical, language alternates and the share image for a page. */
/** `image`: the page's own share picture (a game's key art); the studio card otherwise. */
export function pageMeta(locale: Locale, path: string, title?: string, description?: string, image = "/img/brand/og.png"): Metadata {
  const t = COPY[locale].meta;
  const full = title ? `${title} · Bill The Dev` : t.title;
  return {
    metadataBase: new URL(SITE.url),
    title: full,
    description: description ?? t.description,
    alternates: { canonical: href(locale, path), languages: { en: href("en", path), vi: href("vi", path), "x-default": href("en", path) } },
    openGraph: { title: full, description: description ?? t.description, url: href(locale, path), siteName: "Bill The Dev", type: "website", images: [image] },
    icons: { icon: "/favicon.svg" },
  };
}
