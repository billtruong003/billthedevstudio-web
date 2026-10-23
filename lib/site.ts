export const SITE = {
  url: "https://billthedevstudio.com",
  name: "Bill The Dev",
  email: "bill@billthedevstudio.com",
  portfolio: "https://www.billthedev.com",
  lucyApi: "https://api.billthedevstudio.com/lucy/chat",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** A file in /public, with the base path the site is served under. */
export const asset = (path: string) => (/^https?:\/\//.test(path) ? path : `${BASE}${path}`);
/** The WebP copy scripts/images.py makes next to a game JPG/PNG, sized for the page (`small`: the 360 px one).
 *  The originals stay for og:image and structured data. */
export const webp = (path: string, small = false) => path.replace(/\.(png|jpe?g)$/i, `${small ? "-sm" : ""}.webp`);

export type Locale = "en" | "vi";
export const LOCALES: Locale[] = ["en", "vi"];

/** A page address for a locale: English at the root, the rest under /<locale>/. */
export const href = (locale: Locale, path = "/") => (locale === "en" ? path : `/${locale}${path === "/" ? "/" : path}`);

export const PLAY_URL = (pkg: string) => `https://play.google.com/store/apps/details?id=${pkg}`;
export const YOUTUBE_URL = (id: string) => `https://www.youtube.com/watch?v=${id}`;
