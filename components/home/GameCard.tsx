"use client";

import { COPY } from "@/content/copy";
import type { Game } from "@/content/games";
import { asset, href, webp, type Locale } from "@/lib/site";
import { useOpenGame } from "../game/SheetProvider";
import { Icon } from "../icons";
import { PlayBadge } from "../ui";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** A link to the game's page that opens the sheet over the home page instead (new tab / no JS still get the page). */
export function GameLink({ slug, locale, className, children, ...rest }: { slug: string; locale: Locale } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const open = useOpenGame();
  return (
    <a
      href={`${BASE}${href(locale, `/games/${slug}/`)}`}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(slug, (e.currentTarget.closest("article") ?? e.currentTarget).getBoundingClientRect());
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function GameCard({ game, locale }: { game: Game; locale: Locale }) {
  const t = COPY[locale];
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-card transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-line3">
      <GameLink slug={game.slug} locale={locale} aria-label={`${game.name}: ${t.games.details}`} data-tilt className="block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(webp(game.keyArt))} loading="lazy" alt={`${game.name} key art`} className="aspect-[1024/500] w-full object-cover" />
      </GameLink>
      <div className="flex flex-1 flex-col gap-2 px-[22px] pb-[22px] pt-5">
        <p className="m-0 text-[14px] font-extrabold uppercase tracking-[0.12em]" style={{ color: game.label }}>{game.genre[locale]} · {game.platform === "web" ? "Web" : "Android"}</p>
        <h3 className="m-0 text-[30px] font-extrabold leading-[1.1]"><GameLink slug={game.slug} locale={locale} className="text-white no-underline">{game.name}</GameLink></h3>
        <p className="m-0 mb-3 flex-1 text-[18px] leading-snug text-muted">{game.short[locale]}</p>
        <div className="flex flex-wrap gap-2.5">
          {game.playPackage ? <PlayBadge pkg={game.playPackage} live={game.storeLive} name={game.name} height={48} />
            : <a href={game.playUrl} className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-[17px] font-extrabold no-underline" style={{ background: game.accent, color: game.onAccent }}><Icon name="play" size={14} stroke={0} className="fill-current" />{t.games.play}</a>}
          <GameLink slug={game.slug} locale={locale} className="inline-flex min-h-[48px] items-center rounded-full border-2 border-white px-6 text-[17px] font-extrabold text-white no-underline hover:bg-white/10">{t.games.details}</GameLink>
        </div>
      </div>
    </article>
  );
}
