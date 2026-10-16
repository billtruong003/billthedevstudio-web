import type { MetadataRoute } from "next";
import { GAMES } from "@/content/games";
import { loadPosts } from "@/lib/news";
import { href, LOCALES, SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/press/", "/news/", ...GAMES.map((g) => `/games/${g.slug}/`), ...loadPosts({ drafts: false }).map((p) => `/news/${p.slug}/`)];
  return LOCALES.flatMap((l) => paths.map((p) => ({ url: `${SITE.url}${href(l, p)}`, changeFrequency: "monthly" as const })));
}
