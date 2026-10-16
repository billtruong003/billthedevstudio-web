import Link from "next/link";
import { Fragment } from "react";
import { COPY } from "@/content/copy";
import { gameBySlug } from "@/content/games";
import type { Block } from "@/lib/news";
import { asset, href, SITE, type Locale } from "@/lib/site";
import { Icon } from "../icons";
import { Button, FoxMedallion, PlayBadge } from "../ui";
import { LiteYouTube } from "./LiteYouTube";

/** Inline text: [label](url) links and **bold**. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) return link[2].startsWith("/") ? <Link key={i} href={link[2]}>{link[1]}</Link> : <a key={i} href={link[2]}>{link[1]}</a>;
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <b key={i} className="text-white">{bold[1]}</b>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

const split = (line: string) => line.split("|").map((s) => s.trim());

export function GameCard({ slug, locale }: { slug: string; locale: Locale }) {
  const g = gameBySlug(slug);
  if (!g) return null;
  const t = COPY[locale];
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-line py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(g.icon)} alt="" className="h-20 w-20 flex-none rounded-[22px] object-cover" />
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-0.5">
        <span className="text-[14px] font-bold" style={{ color: g.label }}>{g.genre[locale]} · {g.platform === "web" ? "Web" : "Android"}</span>
        <b className="text-[22px] font-black leading-tight">{g.name}</b>
        <span className="text-[16px] text-muted">{g.tagline[locale]}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {g.playPackage ? <PlayBadge pkg={g.playPackage} live={g.storeLive} name={g.name} height={46} /> : <Button href={g.playUrl} icon style={{ background: g.accent, color: g.onAccent }}>{t.games.play}</Button>}
        <Link href={href(locale, `/games/${g.slug}/`)} className="inline-flex min-h-[46px] items-center px-2 text-[16px] font-bold text-white underline decoration-amber/60 underline-offset-4">{t.games.details}</Link>
      </div>
    </div>
  );
}

function Cta({ arg, locale }: { arg: string; locale: Locale }) {
  const t = COPY[locale];
  const [kind, slug] = arg.split(/\s+/);
  if (kind === "play" && slug) return <GameCard slug={slug} locale={locale} />;
  const press = kind === "press";
  return (
    <div className="flex flex-wrap items-center justify-between gap-5 rounded-[26px] border border-line bg-card p-[clamp(22px,3vw,32px)]">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1">
        <b className="text-[clamp(24px,2.6vw,30px)] leading-tight">{press ? t.news.ctaPressTitle : t.news.ctaHireTitle}</b>
        <span className="text-[17px] font-normal text-soft">{press ? t.news.ctaPressText : t.news.ctaHireText}</span>
      </div>
      {press
        ? <Link href={href(locale, "/press/")} className="inline-flex min-h-[52px] items-center rounded-full bg-amber px-6 text-[17px] font-black no-underline on-amber">{t.nav.press}</Link>
        : <a href={`mailto:${SITE.email}`} className="inline-flex min-h-[52px] items-center rounded-full bg-amber px-6 text-[17px] font-black no-underline on-amber">{t.contact.email}</a>}
    </div>
  );
}

/** One block of a story. Unknown block names render nothing, so a typo never breaks a page. */
export function BlockView({ b, locale }: { b: Block; locale: Locale }) {
  const lines = "lines" in b ? b.lines : [];
  const arg = "arg" in b ? b.arg : "";
  switch (b.type) {
    case "p":
      return <p className="m-0 text-[19px] leading-[1.7] text-soft"><Inline text={(b as { text: string }).text} /></p>;
    case "h2":
      return <h2 className="m-0 mt-4 text-[clamp(26px,3vw,30px)] font-black leading-tight">{(b as { text: string }).text}</h2>;
    case "lead":
      return <p className="m-0 text-[clamp(21px,2.4vw,24px)] font-normal leading-snug text-white"><Inline text={lines.join(" ")} /></p>;
    case "quote":
      return (
        <figure className="my-2 flex items-center gap-5 rounded-3xl border border-line bg-card p-6">
          <FoxMedallion className="w-[84px] flex-none" />
          <blockquote className="m-0 text-[clamp(22px,3vw,30px)] font-black leading-tight">{lines.join(" ")}</blockquote>
        </figure>
      );
    case "person": {
      const [name, role] = split(arg);
      return (
        <figure className="my-3 flex flex-col gap-3">
          <span aria-hidden="true" className="h-8 text-[72px] font-black leading-none text-amber">“</span>
          <blockquote className="m-0 text-[clamp(24px,2.8vw,30px)] font-black leading-tight text-white">{lines.join(" ")}</blockquote>
          <figcaption className="text-[15px] text-muted"><b className="text-soft">{name}</b>{role ? `, ${role}` : ""}</figcaption>
        </figure>
      );
    }
    case "project": {
      // a team project Bill worked on: image | name | studio and platform | link (optional); the lines say what he did
      const [img, name, where, link] = split(arg);
      const title = link ? <a href={link} className="text-white no-underline hover:text-amber">{name}</a> : name;
      return (
        <article className="wide flex flex-wrap items-start gap-x-7 gap-y-4 border-t border-line pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img && <img src={asset(img)} alt={name} loading="lazy" className="aspect-[16/10] w-full min-w-0 max-w-[320px] flex-[1_1_240px] rounded-xl object-cover" />}
          <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1.5">
            <h3 className="m-0 text-[24px] font-black leading-tight">{title}</h3>
            {where && <p className="m-0 text-[14px] font-bold text-label">{where}</p>}
            <p className="m-0 text-[17px] leading-relaxed text-soft"><Inline text={lines.join(" ")} /></p>
          </div>
        </article>
      );
    }
    case "game":
      return <GameCard slug={arg} locale={locale} />;
    case "games":
      return <div className="flex flex-col gap-3">{arg.split(",").map((s) => <GameCard key={s} slug={s.trim()} locale={locale} />)}</div>;
    case "video":
    {
      const [id, poster] = arg.split(/\s+/);
      return <LiteYouTube id={id} poster={poster ? asset(poster) : undefined} caption={lines.join(" ")} />;
    }
    case "image":
      return (
        <figure className="m-0 flex flex-col gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(arg)} alt={lines.join(" ")} loading="lazy" className="w-full rounded-[22px] border border-line" />
          {lines.length > 0 && <figcaption className="text-[15px] text-muted">{lines.join(" ")}</figcaption>}
        </figure>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {lines.map((src) => <img key={src} src={asset(src.trim())} alt="" loading="lazy" className="aspect-[9/16] w-full rounded-[18px] border border-line object-cover" />)}
        </div>
      );
    case "facts":
      return (
        <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 rounded-[22px] border border-line bg-card p-6 text-[17px]">
          {lines.map((l) => { const [k, ...v] = l.split(":"); return <Fragment key={l}><dt className="text-muted">{k.trim()}</dt><dd className="m-0 font-bold">{v.join(":").trim()}</dd></Fragment>; })}
        </dl>
      );
    case "stats":
      return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          {lines.map((l) => { const [v, label] = split(l); return <div key={l} className="rounded-[20px] border border-line bg-card p-5"><b className="block text-[clamp(34px,4vw,46px)] leading-none">{v}</b><span className="text-[16px] text-muted">{label}</span></div>; })}
        </div>
      );
    case "steps":
      return (
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {lines.map((l, i) => { const [title, text] = split(l); return (
            <li key={l} className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 border-line3 text-[19px] font-black text-white">{i + 1}</span>
              <span className="flex flex-col gap-0.5"><b className="text-[20px]">{title}</b>{text && <span className="text-[17px] leading-snug text-muted">{text}</span>}</span>
            </li>); })}
        </ol>
      );
    case "note":
      return (
        <aside className="flex items-start gap-3 rounded-[20px] border border-amber/50 bg-amber/10 p-5 text-[17px] leading-relaxed text-soft">
          <Icon name="bolt" className="mt-0.5 flex-none text-amber" /><span><Inline text={lines.join(" ")} /></span>
        </aside>
      );
    case "cta":
      return <Cta arg={arg} locale={locale} />;
    default:
      return null;
  }
}
