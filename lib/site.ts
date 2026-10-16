export const SITE = {
  url: "https://billthedevstudio.com",
  name: "Bill The Dev",
  email: "truongbill003@gmail.com",
  portfolio: "https://www.billthedev.com",
  lucyApi: "https://api.billthedevstudio.com/lucy/chat",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** A file in /public, with the base path the site is served under. */
export const asset = (path: string) => (/^https?:\/\//.test(path) ? path : `${BASE}${path}`);

export type Locale = "en" | "vi";
export const LOCALES: Locale[] = ["en", "vi"];

/** A page address for a locale: English at the root, the rest under /<locale>/. */
export const href = (locale: Locale, path = "/") => (locale === "en" ? path : `/${locale}${path === "/" ? "/" : path}`);

export const PLAY_URL = (pkg: string) => `https://play.google.com/store/apps/details?id=${pkg}`;
export const YOUTUBE_URL = (id: string) => `https://www.youtube.com/watch?v=${id}`;
