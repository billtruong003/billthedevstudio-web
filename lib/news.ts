import fs from "node:fs";
import path from "node:path";

// News stories are markdown files in content/news. Between plain paragraphs and "## " headings, a story can drop in
// ready-made blocks with a fence:
//
//   :::name argument
//   lines of content
//   :::
//
// A story follows the shape studio newsrooms use (Supercell, Rovio, Riot): the news in the first paragraph,
// short paragraphs, one hero (front matter `hero`: an image, or "youtube:<id>"), at most a quote or two from a
// named person, and a small "at a glance" list when there are dates and platforms. The page adds the rest itself:
// the byline, the games named in `games:`, the "About Bill The Dev" paragraph, press contact and more news.
// Blocks for the body: person, facts, image, video, gallery, game. Examples render at /news/blocks/.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: string; arg: string; lines: string[] };

export type Post = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  category: string;
  cover: string;
  tags: string[];
  games: string[];
  hero: string;
  draft: boolean;
  minutes: number;
  blocks: Block[];
};

const DIR = path.join(process.cwd(), "content", "news");

function frontmatter(src: string) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("news file without front matter");
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: m[2] };
}

const list = (v?: string) => (v || "").replace(/[\[\]"]/g, "").split(",").map((t) => t.trim()).filter(Boolean);

export function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.replace(/\r/g, "").split("\n");
  let para: string[] = [];
  const flush = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ") }); para = []; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = line.match(/^:::(\w+)\s*(.*)$/);
    if (fence) {
      flush();
      const inner: string[] = [];
      while (++i < lines.length && lines[i].trim() !== ":::") inner.push(lines[i]);
      blocks.push({ type: fence[1], arg: fence[2].trim(), lines: inner.filter((l) => l.trim()) });
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (!line.trim()) {
      flush();
    } else {
      para.push(line.trim());
    }
  }
  flush();
  return blocks;
}

/** Drafts show only in review builds (NEXT_PUBLIC_SHOW_DRAFTS=1, set by scripts/deploy-preview.sh). */
export function loadPosts({ drafts = process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1" } = {}): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => {
    const { meta, body } = frontmatter(fs.readFileSync(path.join(DIR, f), "utf8"));
    return {
      slug: f.replace(/\.md$/, ""),
      title: meta.title, dek: meta.dek, date: meta.date, category: meta.category, cover: meta.cover,
      tags: list(meta.tags), games: list(meta.games), hero: meta.hero || meta.cover,
      draft: meta.draft === "true",
      minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
      blocks: parseBlocks(body),
    };
  }).filter((p) => drafts || !p.draft).sort((a, b) => dated(b).localeCompare(dated(a)));
}

/** Stories without a real date yet ("[DATE]") sort after the dated ones. */
const dated = (p: Post) => (/^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : "0000");

export const postBySlug = (slug: string) => loadPosts().find((p) => p.slug === slug);

export const CATEGORIES = ["Announcements", "Games", "Partnerships", "Studio"];

/** Shown at /news/blocks/: every block, with the text that makes it. */
export const BLOCK_GUIDE = `## Text
Plain paragraphs, two to four sentences each. Links like [the press kit](/press/) and **bold** work inside them. Put the news itself in the first paragraph: who, what, when.

:::person Bill (Trương Ngọc Châu) | Founder, Bill The Dev
A quote from a named person, with their role. One or two per story at most, and only words they really said.
:::

:::facts
Platform: Android, on Google Play
Price: Free, with ads
Release: 12 November 2026
:::

:::image /img/games/slam-cards/table.jpg
A picture with a caption, when the hero is not enough.
:::

:::video U5scIFVhbkg /img/games/meh-merge/feature.jpg
A trailer inside the story (the poster is our own image).
:::

:::gallery
/img/games/nah-blocks/shot1.jpg
/img/games/nah-blocks/shot2.jpg
/img/games/nah-blocks/shot3.jpg
:::

:::game slam-cards
:::

## A team project
For work Bill did inside another studio's team: image | name | studio · platform | official link. Say what the team made and that Bill was part of it.

:::project /img/news/past/shmackle-week41.webp | Shmackle | CurlyBlue · VR on Meta Quest | https://www.meta.com/
Bill was part of the CurlyBlue team on the game's look and its updates.
:::
`;
