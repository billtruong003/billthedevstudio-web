import Link from "next/link";
import { COPY } from "@/content/copy";
import { GAMES } from "@/content/games";
import { COLLAB, CONTACTS, FOUNDER_PHOTO, SOCIAL } from "@/content/studio";
import { FollowRow } from "../Social";
import { asset, href, SITE, webp, type Locale } from "@/lib/site";
import { Fox } from "../Fox";
import { CountUp, HeroHand, HeroTitle, ScrollCue } from "../motion";
import { Button, Container, T, TextLink } from "../ui";
import { GameLink } from "./GameCard";

const game = (slug: string) => GAMES.find((g) => g.slug === slug)!;

/** One full screen under the sticky header: headline left, a hand of the five games' real screens right in an amber spotlight. */
export function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  // all five games, each on its first store screen, Nah Blocks in the middle of the hand
  const cards: [string, string][] = [
    [game("duck-drip").media[0], "hero-card hero-card--ll"],
    [game("meh-merge").media[0], "hero-card hero-card--l"],
    [game("nah-blocks").media[0], "hero-card hero-card--c"],
    [game("bruh-arrows").media[0], "hero-card hero-card--r"],
    [game("slam-cards").media[0], "hero-card hero-card--rr"],
  ];
  const live = GAMES.filter((g) => g.storeLive);
  return (
    <section className="relative isolate overflow-hidden">
      {/* wider than the rest of the page, so on a big screen the first view is filled edge to edge */}
      <div className="mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-[2240px] flex-wrap items-center gap-x-[clamp(40px,5vw,112px)] gap-y-10 px-4 py-[clamp(40px,6vw,88px)] sm:px-8 lg:px-10 2xl:px-20">
        <div className="flex min-w-0 flex-[1.3_1_440px] flex-col items-start gap-[22px]">
          {/* the page's heading says what the studio is (for search engines and screen readers); the slogan stays the big line */}
          <h1 className="m-0 text-[clamp(17px,.95vw,22px)] font-bold leading-normal text-label">{t.hero.intro}</h1>
          <HeroTitle as="p" lines={[t.slogan[0], t.slogan[1]]} className={`${T.hero} whitespace-nowrap`} />
          <p className={`${T.lead} hero-fade max-w-[34ch] min-[1800px]:text-[clamp(19px,1.1vw,26px)] [--delay:.9s]`}>{t.hero.lede}</p>
          <div className="hero-fade flex flex-wrap items-center gap-x-6 gap-y-3 [--delay:1.05s]">
            <Button href="#games" size="lg">{t.hero.games}</Button>
            <TextLink href="#services" className="text-[17px]">{t.hero.hireLink}</TextLink>
          </div>
          <FollowRow label={t.hero.follow} className="hero-fade -ml-1 -mt-1 [--delay:1.2s]" />
        </div>
        <div className="flex min-w-0 flex-[1_1_360px] flex-col items-center gap-8">
          <HeroHand className="hero-cards relative aspect-[5/4] w-full max-w-[1040px]">
            <div className="hero-glow" />
            {cards.map(([src, cls]) => (
              <span key={src} className={cls}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(webp(src, true))} alt="" width={360} height={640} draggable={false} />
              </span>
            ))}
          </HeroHand>
          <p className="hero-fade m-0 text-center text-[14px] font-extrabold uppercase tracking-[.06em] text-muted [--delay:1.3s]">
            {t.hero.onPlay}
            {live.map((g) => (
              <span key={g.slug}> · <GameLink slug={g.slug} locale={locale} className="text-text no-underline hover:text-amber">{g.name}</GameLink></span>
            ))}
          </p>
        </div>
      </div>
      <ScrollCue href="#games" label={t.hero.scroll} />
    </section>
  );
}

/** Flip Flop Slam plays today, so it leads; the three games in testing are a list, not a grid of equal cards. */
export function Games({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const slam = game("slam-cards");
  const testing = GAMES.filter((g) => g.platform === "android");
  return (
    <section id="games" className="scroll-mt-20">
      <Container className="flex flex-col gap-9 pb-[clamp(48px,6vw,96px)] pt-[clamp(40px,5vw,72px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className={T.h2}>{t.games.heading[0]}<br />{t.games.heading[1]}</h2>
          <p className="m-0 max-w-[40ch] text-[17px] leading-normal text-muted">{t.games.lede}</p>
        </div>
        <div className="flex flex-wrap items-start gap-x-12 gap-y-7">
          <article className="flex min-w-0 flex-[1.5_1_520px] flex-col gap-[18px]">
            <GameLink slug={slam.slug} locale={locale} className="block overflow-hidden rounded-2xl bg-[#F6EEDB]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(webp(slam.keyArt))} width={1024} height={500} loading="lazy" alt={`${slam.name} key art`} style={{ objectPosition: slam.keyArtPos }} className="aspect-video w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </GameLink>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-1.5">
                <span className="text-[14px] font-bold" style={{ color: slam.label }}>{slam.status[locale]}</span>
                <h3 className="m-0 text-[clamp(34px,3.6vw,46px)] font-black leading-none">
                  <GameLink slug={slam.slug} locale={locale} className="text-white no-underline hover:text-white">{slam.name}</GameLink>
                </h3>
                <p className={`${T.body} max-w-[46ch]`}>{slam.short[locale]}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href={slam.playUrl} className="inline-flex min-h-[52px] items-center rounded-full px-6 text-[18px] font-black text-white no-underline transition-transform active:scale-[0.97]" style={{ background: slam.accent }}>{t.games.play}</a>
                <GameLink slug={slam.slug} locale={locale} className="font-bold text-white underline decoration-amber/60 underline-offset-4">{t.games.details}</GameLink>
              </div>
            </div>
          </article>
          <div className="flex min-w-0 flex-[1_1_360px] flex-col">
            {testing.map((g) => (
              <GameLink key={g.slug} slug={g.slug} locale={locale} className="group flex items-center gap-[18px] border-t border-line py-[18px] text-white no-underline">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(webp(g.icon))} alt="" width={72} height={72} loading="lazy" className="h-[72px] w-[72px] flex-none rounded-[18px] transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <b className="text-[28px] font-black leading-[1.05] group-hover:text-amber">{g.name}</b>
                  <span className="text-[15px] text-muted">{g.genre[locale]} · Android</span>
                  <span className="text-[15px] text-soft">{g.tagline[locale]}</span>
                </span>
                <span className="flex-none text-[14px] font-bold text-label">{g.soon ? t.games.soon : g.storeLive ? t.games.live : t.games.testing}</span>
              </GameLink>
            ))}
            <p className="m-0 border-t border-line pt-[18px] text-[15px] leading-normal text-muted">{t.games.workbench}</p>
            <a href={COLLAB.href} className="mt-5 flex items-center gap-4 rounded-xl bg-card p-3 text-white no-underline hover:bg-raise hover:text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(webp(COLLAB.image))} width={96} height={56} loading="lazy" alt={COLLAB.name} className="h-14 w-24 flex-none rounded-lg object-cover" />
              <span className="flex min-w-0 flex-col"><b className="text-[17px]">{COLLAB.name} <span className="font-normal text-muted">· {t.games.collabBy}</span></b>
                <span className="text-[14px] leading-snug text-muted">{t.games.collabText}</span></span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The numbers as one line between two hairlines. */
export function Stats({ locale }: { locale: Locale }) {
  const stats = COPY[locale].stats;
  return (
    <section aria-label="In numbers">
      <Container>
        {/* four equal columns, number over label, all on one top line; 2 × 2 on phones */}
        <dl className="m-0 grid grid-cols-2 gap-y-8 border-y border-line py-[30px] md:grid-cols-4">
          {[0, 2, 1, 3].map((i, n) => (
            <div key={stats[i][1]} className={`flex flex-col gap-2.5 pr-4 ${n % 2 ? "pl-5 border-l border-line md:pl-6" : n ? "md:pl-6 md:border-l md:border-line" : ""}`}>
              <dt className="order-2 m-0 max-w-[22ch] text-[15px] leading-snug text-muted">{stats[i][1]}</dt>
              <dd className="order-1 m-0"><CountUp value={stats[i][0]} className="text-[clamp(40px,4.4vw,60px)] font-black leading-none" /></dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/** Four rules as words and sentences, split by hairlines: no icons in circles. */
export function Values({ locale }: { locale: Locale }) {
  const t = COPY[locale].values;
  return (
    <section aria-label={t.kicker}>
      <Container className="flex flex-wrap gap-x-16 gap-y-7 py-[clamp(64px,8vw,120px)]">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 self-start">
          <h2 className="m-0 text-[clamp(34px,3.8vw,50px)] font-black leading-none">{t.kicker}</h2>
          <p className="m-0 text-[17px] text-muted">{t.sub}</p>
          <Fox className="mt-3 h-24 w-24" />
        </div>
        <div className="min-w-0 flex-[2_1_520px]">
          {t.items.map(([word, text]) => (
            <div key={word} className="flex flex-wrap items-baseline gap-x-7 gap-y-1.5 border-t border-line py-[22px]">
              <b className="flex-[0_0_210px] text-[clamp(32px,3.4vw,44px)] font-black leading-none">{word}<span className="text-amber">.</span></b>
              <span className="min-w-0 flex-[1_1_280px] text-[17px] leading-relaxed text-soft">{text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** One main offer with a real picture, three short ones, then how a project runs as a timeline. */
export function Services({ locale }: { locale: Locale }) {
  const t = COPY[locale].services;
  const [main, ...rest] = t.items;
  return (
    <section id="services" className="scroll-mt-20 border-y border-line bg-sheet">
      <Container className="flex flex-col gap-10 py-[clamp(64px,8vw,112px)]">
        <div className="flex max-w-[760px] flex-col gap-4">
          <h2 className={T.h2}>{t.title}</h2>
          <p className={`${T.lead} max-w-[52ch]`}>{t.sub}</p>
        </div>
        <div className="flex flex-wrap items-start gap-x-14 gap-y-7">
          <article className="min-w-0 flex-[1.3_1_480px] overflow-hidden rounded-2xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(webp(game("meh-merge").keyArt))} width={1024} height={500} loading="lazy" alt="Meh Merge key art" className="aspect-[1024/500] w-full object-cover" />
            <div className="flex flex-col gap-3 px-[clamp(20px,3vw,32px)] pb-[30px] pt-[26px]">
              <span className="text-[14px] font-bold text-label">{t.mainLabel}</span>
              <h3 className="m-0 text-[clamp(32px,3.4vw,42px)] font-black leading-none">{main[0]}</h3>
              <p className={T.body}>{main[1]} {main[2].join(" · ")}.</p>
              <span className="text-[15px] text-muted">{t.built} {main[3]}</span>
            </div>
          </article>
          <div className="min-w-0 flex-[1_1_340px]">
            {rest.map(([title, pitch, , built]) => (
              <div key={title} className="flex flex-col gap-1.5 border-t border-line py-5">
                <h3 className={T.item}>{title}</h3>
                <p className={T.body}>{pitch}</p>
                <span className="text-[14px] text-muted">{t.built} {built}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[22px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className={T.item}>{t.howTitle}</h3>
            <Button href="#contact" variant="outline">{t.start}</Button>
          </div>
          <ol className="m-0 flex list-none flex-wrap gap-x-7 gap-y-6 p-0">
            {t.steps.map(([title, text], i) => (
              <li key={title} className={`flex min-w-0 flex-[1_1_200px] flex-col gap-1.5 border-t-2 pt-4 ${i === 0 ? "border-amber" : "border-line2"}`}>
                <span className="text-[15px] font-black text-faint">{locale === "vi" ? "Bước" : "Step"} {i + 1}</span>
                <b className="text-[17px] font-black">{title}</b>
                <span className="text-[15px] leading-normal text-muted">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/** Bill's real path as a dated list, next to his portrait. */
export function Studio({ locale }: { locale: Locale }) {
  const t = COPY[locale].studio;
  return (
    <section id="studio" className="scroll-mt-20">
      <Container className="flex flex-wrap items-start gap-x-16 gap-y-8 pb-[clamp(48px,6vw,88px)] pt-[clamp(64px,8vw,120px)]">
        <figure className="m-0 flex min-w-0 max-w-[340px] flex-[0_1_340px] flex-col gap-2.5">
          <div className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-2xl bg-raise">
            {FOUNDER_PHOTO
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={asset(FOUNDER_PHOTO)} alt={t.photo} className="h-full w-full object-cover object-top" />
              : <Fox className="mb-[30%] w-[34%]" />}
          </div>
          <figcaption className="text-[14px] text-faint">Trương Ngọc Châu · Bill</figcaption>
        </figure>
        <div className="flex min-w-0 flex-[1.4_1_460px] flex-col gap-[18px]">
          <h2 className={T.h2}>{t.title2[0]}<br />{t.title2[1]}</h2>
          <p className="m-0 max-w-[56ch] text-[18px] leading-relaxed text-soft">{t.body} {t.before}</p>
          <ul className="m-0 mt-2 list-none border-b border-line p-0">
            {t.jobs.map(([when, where, what]) => (
              <li key={where} className="flex flex-wrap gap-x-5 gap-y-0.5 border-t border-line py-3.5">
                <span className="flex-[0_0_96px] text-[15px] text-faint">{when}</span>
                <span className="min-w-0 flex-[1_1_260px] text-[17px] text-soft"><b className="text-white">{where}</b> · {what}</span>
              </li>
            ))}
          </ul>
          <TextLink href={SITE.portfolio} className="self-start text-[17px]">{t.full}</TextLink>
        </div>
      </Container>
    </section>
  );
}

export type LatestStory = { slug: string; title: string; dek: string; date: string };

/** The newest story, as one line. */
export function Latest({ locale, story }: { locale: Locale; story?: LatestStory }) {
  if (!story) return null;
  const t = COPY[locale].latest;
  return (
    <section aria-label={t.label}>
      <Container className="pb-[clamp(48px,6vw,88px)]">
        <Link href={href(locale, `/news/${story.slug}/`)} className="group flex flex-wrap items-baseline gap-x-7 gap-y-1.5 border-y border-line py-6 text-white no-underline hover:text-white">
          <span className="flex-[0_0_180px] text-[14px] font-bold text-faint">{t.label} · {story.date}</span>
          <span className="flex min-w-0 flex-[1_1_420px] flex-col gap-1"><b className="text-[28px] font-black leading-[1.1] group-hover:text-amber">{story.title}</b>
            <span className="text-[17px] text-muted">{story.dek}</span></span>
          <span className="flex-none text-[17px] font-bold underline decoration-amber/60 underline-offset-4">{t.read}</span>
        </Link>
      </Container>
    </section>
  );
}

export function Contact({ locale }: { locale: Locale }) {
  const t = COPY[locale].contact;
  const others = CONTACTS.filter((c) => c.kind !== "email" && c.kind !== "zalo");
  return (
    <section id="contact" className="scroll-mt-20">
      <Container className="flex flex-col gap-[22px] pb-[clamp(72px,9vw,128px)] pt-[clamp(40px,5vw,72px)]">
        <h2 className="m-0 text-[clamp(48px,7vw,96px)] font-black leading-[0.92] tracking-[-0.015em]">{t.title}<br /><span className="text-amber">{t.ship}</span></h2>
        <p className={`${T.lead} max-w-[48ch]`}>{t.sub}</p>
        <a href={CONTACTS[0].href} className="self-start text-[clamp(24px,3.4vw,44px)] font-bold leading-tight text-white underline decoration-amber decoration-[3px] underline-offset-8 [overflow-wrap:anywhere] hover:text-amber">{SITE.email}</a>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <Button href={CONTACTS[0].href} size="lg">{t.email}</Button>
          <Button href={CONTACTS[2].href} size="lg" variant="outline">{t.zalo}</Button>
        </div>
        <p className="m-0 text-[17px] leading-relaxed text-muted">
          {t.also}{" "}
          {others.map((c, i) => <span key={c.kind}>{i ? " · " : ""}<TextLink href={c.href}>{c.name}</TextLink></span>)}.{" "}
          {t.follow} {SOCIAL.slice(0, 3).map((s, i) => <span key={s.name}>{i ? " · " : ""}<TextLink href={s.href}>{s.name}</TextLink></span>)}.{" "}
          {t.pressLead} <TextLink href={href(locale, "/press/")}>{t.pressLink}</TextLink>.
        </p>
      </Container>
    </section>
  );
}
