"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { COPY } from "@/content/copy";
import { GAMES, type Game } from "@/content/games";
import { asset, href, SITE, type Locale } from "@/lib/site";
import { Icon } from "../icons";
import { Button, PlayBadge, TextLink, YouTubeMark } from "../ui";
import { Lightbox } from "./Lightbox";

type Props = { game: Game; locale: Locale; mode: "modal" | "page"; onSelect?: (slug: string) => void; onClose?: () => void };

function Cta({ game, locale, height = 54, short }: { game: Game; locale: Locale; height?: number; short?: boolean }) {
  const t = COPY[locale];
  return game.playPackage
    ? <PlayBadge pkg={game.playPackage} live={game.storeLive} name={game.name} height={height} />
    : <a href={game.playUrl} className="inline-flex items-center rounded-full px-6 text-[18px] font-black text-white no-underline transition-transform active:scale-[0.97]" style={{ background: game.accent, minHeight: height }}>{short ? t.games.playShort : t.games.play}</a>;
}

const PlayMark = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="13" fill="#D63C6E" /><path d="M10.5 8.5v9l7-4.5z" fill="#fff" /></svg>
);

/** Trailer poster that only loads the video when pressed: YouTube (youtube-nocookie) or the site's own mp4. */
function Trailer({ game, label }: { game: Game; label: string }) {
  const [playing, setPlaying] = useState(false);
  const has = !!(game.trailer || game.trailerFile);
  return (
    <div className={`relative ${game.trailerFile ? "aspect-video" : "aspect-[1024/500]"} w-full overflow-hidden rounded-2xl bg-black`}>
      {playing && game.trailerFile ? (
        <video className="h-full w-full" src={asset(game.trailerFile)} poster={asset(game.keyArt)} controls autoPlay playsInline preload="none" title={`${game.name} trailer`} />
      ) : playing && game.trailer ? (
        <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${game.trailer}?autoplay=1&rel=0`} title={`${game.name} trailer`}
          allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => has && setPlaying(true)} aria-label={has ? `${label}: ${game.name}` : game.name} className="group block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(game.keyArt)} alt={`${game.name} key art`} style={{ objectPosition: game.keyArtPos }} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          {has && (
            <span className="absolute bottom-4 left-4 inline-flex min-h-[46px] items-center gap-2.5 rounded-full bg-[#141210]/85 pl-3 pr-4 text-[16px] font-bold text-white group-hover:bg-[#141210]">
              {game.trailer ? <YouTubeMark width={30} /> : <PlayMark />}{label}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export function GameSheetContent({ game, locale, mode, onSelect, onClose }: Props) {
  const t = COPY[locale];
  const rail = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = tabs.current, on = box?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (box && on) box.scrollLeft = on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2;
  }, [game.slug]);
  const [shot, setShot] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const others = GAMES.filter((g) => g.slug !== game.slug);
  const testing = !!game.playPackage && !game.storeLive;

  const copy = async () => {
    try { await navigator.clipboard.writeText(`${SITE.url}${href(locale, `/games/${game.slug}/`)}`); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const scroll = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: "smooth" });

  const tab = (g: Game) => {
    const on = g.slug === game.slug;
    const cls = clsx("inline-flex min-h-[44px] flex-none items-center gap-2 whitespace-nowrap rounded-[10px] border pl-[6px] pr-4 text-[15px] font-bold no-underline",
      on ? "border-white bg-white text-ink" : "border-line2 text-white hover:border-white/60");
    const inner = (<>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={asset(g.icon)} alt="" className="h-[30px] w-[30px] rounded-[8px] object-cover" />{g.name}</>);
    return <button key={g.slug} type="button" role="tab" aria-selected={on} onClick={() => onSelect?.(g.slug)} className={cls}>{inner}</button>;
  };
  const copyBtn = (
    <button type="button" onClick={copy} aria-label={t.sheet.copy} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-line3 px-3.5 text-[15px] font-bold text-white hover:border-amber">
      <Icon name="link" size={18} /><span className="hidden sm:inline">{copied ? t.sheet.copied : t.sheet.copy}</span>
    </button>
  );

  return (
    <div className="flex min-h-full flex-col">
      {mode === "modal" ? (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-sheet px-3 py-2.5 sm:px-5">
          <div ref={tabs} role="tablist" aria-label="Games" className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto">{GAMES.map(tab)}</div>
          <div className="flex flex-none items-center gap-2">
            {copyBtn}
            <button type="button" aria-label={t.sheet.close} onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-line3 text-white hover:border-amber"><Icon name="close" /></button>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-site items-center justify-between gap-3 px-4 pt-5 sm:px-8 lg:px-10">
          <span className="text-[14px] font-bold text-faint"><Link href={`${href(locale)}#games`} className="text-faint no-underline hover:text-white">{t.sheet.back}</Link> / {game.name}</span>
          {copyBtn}
        </div>
      )}

      <div className={clsx("flex flex-col gap-12 pb-10 pt-7", mode === "page" ? "mx-auto w-full max-w-site px-4 sm:px-8 lg:px-10" : "px-4 sm:px-8")}>
        <section className="flex flex-wrap items-center gap-x-14 gap-y-8">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(game.icon)} alt="" className="h-[clamp(72px,8vw,96px)] w-[clamp(72px,8vw,96px)] rounded-[24%] object-cover" />
            {mode === "page"
              ? <h1 className="m-0 text-[clamp(40px,5.4vw,76px)] font-black leading-[0.95] tracking-[-0.02em]">{game.name}</h1>
              : <h2 className="m-0 text-[clamp(36px,4.6vw,60px)] font-black leading-[0.95] tracking-[-0.02em]">{game.name}</h2>}
            <p className="m-0 text-[clamp(20px,2.2vw,24px)] font-black leading-tight" style={{ color: game.label }}>{game.tagline[locale]}</p>
            <p className="m-0 max-w-[44ch] text-[18px] leading-relaxed text-soft">{game.about[locale].join(" ")}</p>
            <div className="hidden flex-wrap items-center gap-x-5 gap-y-3 sm:flex">
              <Cta game={game} locale={locale} />
              {testing && <TextLink href={`mailto:${SITE.email}?subject=${encodeURIComponent(game.name + " test")}`}>{locale === "vi" ? "Email để tham gia thử nghiệm" : "Email to join the test"}</TextLink>}
            </div>
            <span className="text-[14px] font-bold text-faint">{game.status[locale]} · {game.playPackage ? t.sheet.priceAndroid : t.sheet.priceWeb}</span>
          </div>
          <div className="min-w-0 flex-[1.2_1_440px]"><Trailer game={game} label={t.sheet.trailer} /></div>
        </section>

        <section aria-label={t.sheet.screenshots} className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-[28px] font-black">{t.sheet.screenshots}</h2>
            <div className="hidden gap-2 sm:flex">
              <button type="button" aria-label={t.sheet.left} onClick={() => scroll(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-line3 text-white hover:border-amber"><Icon name="left" /></button>
              <button type="button" aria-label={t.sheet.right} onClick={() => scroll(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-line3 text-white hover:border-amber"><Icon name="right" /></button>
            </div>
          </div>
          <div ref={rail} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3.5 overflow-x-auto px-4 sm:-mx-8 sm:scroll-px-8 sm:px-8">
            {game.media.map((src, i) => (
              <button key={src} type="button" onClick={() => setShot(i)} aria-label={`${game.name} screenshot ${i + 1} of ${game.media.length}`}
                className={clsx("h-[clamp(300px,34vw,420px)] flex-none snap-start overflow-hidden rounded-[14px] bg-card", game.wide ? "aspect-video" : "aspect-[9/16]")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(src)} alt="" loading="lazy" className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 hover:scale-[1.03]" />
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-start gap-x-16 gap-y-8">
          <div className="flex min-w-0 flex-[1.6_1_460px] flex-col gap-3.5">
            <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-black leading-none">{locale === "vi" ? "Chơi thế nào" : "How it plays"}</h2>
            <ul className="m-0 list-none border-b border-line p-0">
              {game.features[locale].map(([title, text]) => (
                <li key={title} className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line py-[18px]">
                  <b className="flex-[0_0_200px] text-[22px] font-black leading-tight">{title}</b>
                  <span className="min-w-0 flex-[1_1_260px] text-[17px] leading-relaxed text-soft">{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside aria-label={t.sheet.info} className="flex min-w-0 flex-[1_1_300px] flex-col gap-2.5">
            <h2 className="m-0 text-[clamp(24px,2.4vw,30px)] font-black leading-none">{t.sheet.info}</h2>
            <dl className="m-0 border-b border-line">
              {game.info[locale].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-t border-line py-3"><dt className="flex-[0_0_110px] text-[15px] text-faint">{k}</dt><dd className="m-0 text-[15px] font-bold text-soft [overflow-wrap:anywhere]">{v}</dd></div>
              ))}
              {game.privacy && <div className="flex gap-4 border-t border-line py-3"><dt className="flex-[0_0_110px] text-[15px] text-faint">{t.sheet.privacy}</dt><dd className="m-0 text-[15px]"><TextLink href={asset(game.privacy)}>{t.sheet.privacyLink}</TextLink></dd></div>}
            </dl>
            <p className="m-0 text-[15px] text-muted">{t.sheet.help} <TextLink href={`mailto:${SITE.email}?subject=${encodeURIComponent(game.name)}`}>{t.sheet.helpLink}</TextLink></p>
          </aside>
        </section>

        <section aria-label={t.sheet.more} className="flex flex-col gap-2.5">
          <h2 className="m-0 text-[clamp(24px,2.4vw,30px)] font-black leading-none">{t.sheet.more}</h2>
          <div className="flex flex-wrap gap-x-10">
            {others.map((g) => {
              const inner = (<>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={asset(g.icon)} alt="" className="h-14 w-14 flex-none rounded-[14px] object-cover" />
                <span className="flex min-w-0 flex-col text-left"><b className="text-[20px] font-black leading-tight group-hover:text-amber">{g.name}</b><span className="text-[14px] text-muted">{g.genre[locale]}</span></span></>);
              const cls = "group flex min-w-0 flex-[1_1_240px] items-center gap-3.5 border-t border-line py-3.5 text-white no-underline hover:text-white";
              return mode === "modal"
                ? <button key={g.slug} type="button" onClick={() => onSelect?.(g.slug)} className={cls}>{inner}</button>
                : <Link key={g.slug} href={href(locale, `/games/${g.slug}/`)} className={cls}>{inner}</Link>;
            })}
          </div>
        </section>
      </div>

      {/* phones: the store button stays in reach (sticky, not fixed: fixed would ride along with the sheet's open animation) */}
      <div className="sticky bottom-0 z-20 mt-auto flex items-center justify-between gap-3 border-t border-line bg-ink px-4 pb-4 pt-3 sm:hidden">
        <span className="flex min-w-0 flex-col leading-tight"><b className="text-[17px]">{game.playPackage ? t.sheet.freeAndroid : game.name}</b><span className="text-[14px] text-muted">{game.playPackage ? t.sheet.adsIap : t.sheet.priceWeb}</span></span>
        <Cta game={game} locale={locale} height={52} short />
      </div>

      {shot !== null && (
        <Lightbox images={game.media} index={shot} wide={game.wide} name={game.name} onIndex={setShot} onClose={() => setShot(null)}
          labels={{ close: t.sheet.close, prev: t.sheet.prev, next: t.sheet.next }} />
      )}
    </div>
  );
}
