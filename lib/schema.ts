// Structured data (schema.org JSON-LD) for search engines: one studio, one founder and one site, each
// with a stable @id so every page, the game at play.billthedevstudio.com and the portfolio at
// billthedev.com can point at the same entities instead of describing them again.
import type { Game } from "@/content/games";
import { STUDIO_FACEBOOK, STUDIO_TIKTOK, STUDIO_YOUTUBE } from "@/content/studio";
import { href, PLAY_URL, SITE, type Locale } from "./site";

export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;
/** The founder lives on his portfolio; the studio refers to him by this id. */
export const PERSON_ID = "https://www.billthedev.com/#person";

const LOGO = `${SITE.url}/img/brand/logo-512.png`;

export const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: "Bill The Dev Studio",
  url: `${SITE.url}/`,
  logo: { "@type": "ImageObject", url: LOGO, width: 512, height: 512 },
  email: SITE.email,
  description: "A one-man indie game studio in Ho Chi Minh City, Vietnam: free mobile and browser games, and Unity, web and AI work for clients.",
  foundingLocation: { "@type": "Place", name: "Ho Chi Minh City, Vietnam" },
  founder: { "@id": PERSON_ID },
  sameAs: [STUDIO_YOUTUBE, STUDIO_TIKTOK, STUDIO_FACEBOOK],
};

export const founder = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Bill Truong",
  alternateName: "Trương Ngọc Châu",
  jobTitle: "Founder",
  url: "https://www.billthedev.com/",
  worksFor: { "@id": ORG_ID },
  sameAs: ["https://www.linkedin.com/in/billtruong003/", "https://github.com/billtruong003"],
};

export const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  name: SITE.name,
  alternateName: "Bill The Dev Studio",
  url: `${SITE.url}/`,
  inLanguage: ["en", "vi"],
  publisher: { "@id": ORG_ID },
};

/** Home → … → this page, as Google's breadcrumb trail. */
export function breadcrumbs(locale: Locale, trail: [string, string][]) {
  const home = locale === "vi" ? "Trang chủ" : "Home";
  return {
    "@type": "BreadcrumbList",
    itemListElement: [[home, "/"] as [string, string], ...trail].map(([name, path], i) => ({
      "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${href(locale, path)}`,
    })),
  };
}

/** A game page: VideoGame plus the app type that lets Google show it as an app (no ratings claimed). */
export function videoGame(game: Game, locale: Locale, description: string) {
  const web = game.platform === "web";
  return {
    "@type": ["VideoGame", web ? "WebApplication" : "MobileApplication"],
    "@id": `${SITE.url}/games/${game.slug}/#game`,
    name: game.name,
    description,
    url: `${SITE.url}${href(locale, `/games/${game.slug}/`)}`,
    image: `${SITE.url}${game.keyArt}`,
    applicationCategory: "GameApplication",
    operatingSystem: web ? "Any (web browser)" : "Android",
    gamePlatform: web ? "Web browser" : "Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(web && game.playUrl ? { sameAs: [game.playUrl] } : {}),
    // a Play link only once the listing is public (closed testing has none)
    ...(!web && game.storeLive && game.playPackage ? { installUrl: PLAY_URL(game.playPackage) } : {}),
  };
}

/** One <script type="application/ld+json"> body: several nodes in one graph. */
export const graph = (...nodes: object[]) => JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
