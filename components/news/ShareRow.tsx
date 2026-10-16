"use client";

import { useState } from "react";
import { COPY } from "@/content/copy";
import type { Locale } from "@/lib/site";
import { Icon } from "../icons";

const PILL = "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-1 text-[15px] font-bold text-white underline decoration-amber/60 underline-offset-4 hover:text-amber";

/** Copy link, then the share pages of Facebook, LinkedIn and X. No share scripts are loaded. */
export function ShareRow({ url, title, locale }: { url: string; title: string; locale: Locale }) {
  const t = COPY[locale].news;
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  return (
    <span className="flex flex-wrap gap-x-3" aria-label={t.share}>
      <button type="button" className={PILL} aria-label={t.copy} onClick={async () => { try { await navigator.clipboard.writeText(url); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
        <Icon name="link" size={18} /><span className="hidden sm:inline">{copied ? t.copied : t.copy}</span>
      </button>
      <a className={PILL} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">Facebook</a>
      <a className={PILL} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">LinkedIn</a>
      <a className={PILL} href={`https://x.com/intent/post?url=${u}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">X</a>
    </span>
  );
}
