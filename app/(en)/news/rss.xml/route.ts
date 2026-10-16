import { loadPosts } from "@/lib/news";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** RSS for the newsroom: published stories only. */
export function GET() {
  const items = loadPosts({ drafts: false }).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE.url}/news/${p.slug}/</link><guid>${SITE.url}/news/${p.slug}/</guid>` +
    `<pubDate>${new Date(p.date + "T00:00:00Z").toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.dek)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Bill The Dev · News</title><link>${SITE.url}/news/</link>` +
    `<description>News from Bill The Dev, a one-man game studio from Vietnam.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
