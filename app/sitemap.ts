import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { GAMES } from "@/content/games";
import { loadPosts } from "@/lib/news";
import { href, LOCALES, SITE } from "@/lib/site";

export const dynamic = "force-static";

const url = (p: string) => `${SITE.url}${p}`;

// The privacy pages are plain HTML in public/privacy/<name>/ (one language each), so they are listed
// from the folder rather than from the app's routes. A page marked noindex (a game's policy, kept out of
// search on purpose) stays out of the sitemap too: listing it sends Google two opposite signals.
function privacyPages(): string[] {
  const dir = path.join(process.cwd(), "public", "privacy");
  const names = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => {
    const file = path.join(dir, d.name, "index.html");
    return d.isDirectory() && fs.existsSync(file) && !/<meta name="robots" content="[^"]*noindex/.test(fs.readFileSync(file, "utf8"));
  });
  return ["/privacy/", ...names.map((d) => `/privacy/${d.name}/`)];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const built = new Date();
  const pages: { path: string; modified: Date }[] = [
    ...["/", "/games/", "/about/", "/contact/", "/press/", "/news/", ...GAMES.map((g) => `/games/${g.slug}/`)].map((p) => ({ path: p, modified: built })),
    ...loadPosts({ drafts: false }).map((p) => ({ path: `/news/${p.slug}/`, modified: new Date(p.date) })),
  ];
  // every page in both languages, each naming its other language and x-default (English)
  const localized = LOCALES.flatMap((l) => pages.map(({ path: p, modified }) => ({
    url: url(href(l, p)),
    lastModified: modified,
    alternates: { languages: { en: url(href("en", p)), vi: url(href("vi", p)), "x-default": url(href("en", p)) } },
  })));
  return [...localized, ...privacyPages().map((p) => ({ url: url(p), lastModified: built }))];
}
