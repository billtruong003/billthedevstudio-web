import { SITE } from "@/lib/site";

export const EXPERIENCE = ["Gameloft", "CurlyBlue (Shmackle VR)", "FPT IS (akaVerse)", "Golden Sea Studio", "GEM Corporation"];

export type ContactKind = "email" | "linkedin" | "zalo" | "messenger" | "discord" | "telegram";
export const CONTACTS: { kind: ContactKind; name: string; value: string; href: string }[] = [
  { kind: "email", name: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { kind: "linkedin", name: "LinkedIn", value: "Bill Truong", href: "https://www.linkedin.com/in/billtruong003/" },
  { kind: "zalo", name: "Zalo", value: "Scan or tap to chat", href: "https://zaloapp.com/qr/p/t1vxrtzv2eyt" },
  { kind: "messenger", name: "Messenger", value: "Bill The Dev Studio", href: "https://m.me/billthedevstudio" },
  { kind: "discord", name: "Discord", value: "Message Bill", href: "https://discord.com/users/350863712208289792" },
  { kind: "telegram", name: "Telegram", value: "@billtruong4603", href: "https://t.me/billtruong4603" },
];

export const COLLAB = { name: "Spirit Story", image: "/img/collab/spirit-story.jpg", href: "https://www.billthedev.com/arcade/?game=spirit-war" };

/** The studio's own channel: game trailers. Bill's personal channels are told about by Lucy, not linked here. */
export const STUDIO_YOUTUBE = "https://www.youtube.com/@billthedevgames";

/** The studio's own accounts (never Bill's personal Facebook or Instagram). */
export const STUDIO_FACEBOOK = "https://www.facebook.com/billthedevstudio";
export const STUDIO_TIKTOK = "https://www.tiktok.com/@billthedevstudio";

export const SOCIAL = [
  { name: "Facebook", href: STUDIO_FACEBOOK },
  { name: "YouTube", href: STUDIO_YOUTUBE },
  { name: "TikTok", href: STUDIO_TIKTOK },
  { name: "GitHub", href: "https://github.com/billtruong003" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/billtruong003/" },
];

/** A photo of Bill for the studio section and the press kit, e.g. "/img/brand/bill.jpg". Empty: the fox stands in. */
export const FOUNDER_PHOTO = "/img/brand/bill-portrait.webp";
