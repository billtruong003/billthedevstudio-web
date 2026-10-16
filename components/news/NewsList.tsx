"use client";

import Link from "next/link";
import { useState } from "react";
import { COPY } from "@/content/copy";
import { asset, href, type Locale } from "@/lib/site";
import { Reveal } from "../motion";

export type PostCard = { slug: string; title: string; dek: string; date: string; category: string; cover: string; minutes: number; draft: boolean };

export function PostMeta({ p, locale, className = "" }: { p: PostCard; locale: Locale; className?: string }) {
  const t = COPY[locale].news;
  return (
    <span className={`text-[14px] ${className}`}>
      <b className="font-bold text-label">{t.cats[p.category] ?? p.category}</b>
      <span className="font-bold text-faint"> · {formatDate(p.date, locale)} · {p.minutes} {t.min}</span>
      {p.draft && <span className="ml-2 rounded-full border border-muted/50 px-2 py-0.5 text-[12px] font-bold text-muted">{t.draft}</span>}
    </span>
  );
}

export { formatDate } from "@/lib/date";
import { formatDate } from "@/lib/date";

export function PostTile({ p, locale }: { p: PostCard; locale: Locale }) {
  return (
    <Link href={href(locale, `/news/${p.slug}/`)} className="group flex flex-wrap items-baseline gap-x-7 gap-y-1.5 border-t border-line py-[22px] text-white no-underline hover:text-white">
      <span className="flex-[0_0_200px]"><PostMeta p={p} locale={locale} /></span>
      <span className="flex min-w-0 flex-[1_1_420px] flex-col gap-1"><b className="text-[24px] font-black leading-[1.15] group-hover:text-amber">{p.title}</b>
        <span className="text-[17px] leading-normal text-muted">{p.dek}</span></span>
    </Link>
  );
}

/** Category chips over the list; filtering happens in the page, the list itself is static HTML. */
export function NewsList({ posts, categories, locale }: { posts: PostCard[]; categories: string[]; locale: Locale }) {
  const t = COPY[locale].news;
  const [cat, setCat] = useState<string | null>(null);
  const used = categories.filter((c) => posts.some((p) => p.category === c));
  const shown = cat ? posts.filter((p) => p.category === cat) : posts;
  const [top, ...rest] = shown;
  const chip = (label: string, value: string | null) => (
    <button key={label} type="button" aria-pressed={cat === value} onClick={() => setCat(value)}
      className={`inline-flex min-h-[40px] flex-none items-center rounded-[10px] border-[1.5px] px-3.5 text-[15px] font-bold ${cat === value ? "border-white bg-white text-ink" : "border-line2 text-white hover:border-white/60"}`}>
      {label}
    </button>
  );
  return (
    <>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {used.length > 1 ? <nav aria-label="Categories" className="flex max-w-full gap-2 overflow-x-auto [scrollbar-width:none]">{[chip(t.all, null), ...used.map((c) => chip(t.cats[c] ?? c, c))]}</nav> : <span />}
        <a href={asset("/news/rss.xml")} className="inline-flex min-h-[44px] items-center text-[15px] font-bold text-muted underline decoration-amber/60 underline-offset-4">{t.rss}</a>
      </div>
      {top && (
        <Reveal className="mt-7">
          <Link href={href(locale, `/news/${top.slug}/`)} className="group flex flex-wrap items-center gap-x-12 gap-y-6 text-white no-underline hover:text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(top.cover)} alt="" className="aspect-video w-full min-w-0 flex-[1.4_1_480px] rounded-2xl object-cover object-top" />
            <span className="flex min-w-0 flex-[1_1_340px] flex-col gap-3">
              <PostMeta p={top} locale={locale} />
              <b className="text-[clamp(30px,3.4vw,44px)] font-black leading-[1.02] group-hover:text-amber">{top.title}</b>
              <span className="text-[19px] leading-relaxed text-soft">{top.dek}</span>
              <span className="text-[17px] font-bold text-white underline decoration-amber/60 underline-offset-4">{t.read}</span>
            </span>
          </Link>
        </Reveal>
      )}
      {rest.length > 0 && (
        <div className="mt-12 border-b border-line">
          {rest.map((p) => <PostTile key={p.slug} p={p} locale={locale} />)}
        </div>
      )}
    </>
  );
}
