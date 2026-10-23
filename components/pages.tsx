import { COPY } from "@/content/copy";
import { GAMES, type Game } from "@/content/games";
import { CONTACTS, FOUNDER_PHOTO, SOCIAL, STUDIO_YOUTUBE } from "@/content/studio";
import { asset, href, SITE, webp, YOUTUBE_URL, type Locale } from "@/lib/site";
import { Footer } from "./Footer";
import { GameSheetContent } from "./game/GameSheetContent";
import { SheetProvider } from "./game/SheetProvider";
import { Header } from "./Header";
import { Contact, Games, Hero, Latest, Services, Stats, Studio, Values } from "./home/Sections";
import { ORG_ID, SITE_ID } from "@/lib/schema";
import { loadPosts } from "@/lib/news";
import { formatDate } from "@/lib/date";
import { Lucy } from "./Lucy";
import { breadcrumbs, founder, graph, organization, trailer, videoGame, website } from "@/lib/schema";

/** When the trailers went up (the first trailer, 16/10/2026); a later one only moves this forward. */
const TRAILER_DATE = "2026-10-16T09:00:00+07:00";

/** Structured data for search engines (lib/schema.ts). */
const JsonLd = ({ nodes }: { nodes: object[] }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(...nodes) }} />;
import { Button, Container, FoxMedallion, T, TextLink, YouTubeMark } from "./ui";

type Asset = { label: string; src: string; bg: string; fit: string; file: string };

/** One row of downloadable artwork in the press kit: a preview on its intended background, a name, and the file link. */
function AssetGroup({ title, items }: { title: string; items: Asset[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="m-0 text-[22px] font-black">{title}</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-4">
        {items.map((a) => (
          <a key={a.src} href={asset(a.src)} download className="group flex flex-col gap-2 text-white no-underline hover:text-white">
            <span className={`flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl ${a.bg} ring-amber/60 group-hover:ring-2`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(a.src)} alt={`${title}: ${a.label}`} loading="lazy" className={a.fit} />
            </span>
            <span className="flex items-baseline justify-between gap-2"><b className="text-[15px]">{a.label}</b><span className="text-[14px] font-bold text-label">{a.file} ↓</span></span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const top = loadPosts({ drafts: false })[0];
  const story = top && { slug: top.slug, title: top.title, dek: top.dek, date: formatDate(top.date, locale) };
  return (
    <SheetProvider locale={locale}>
      <Header locale={locale} />
      <main>
        <JsonLd nodes={[website, organization, founder]} />
        <Hero locale={locale} />
        <Games locale={locale} />
        <Stats locale={locale} />
        <Values locale={locale} />
        <Services locale={locale} />
        <Studio locale={locale} />
        <Latest locale={locale} story={story} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
      <Lucy locale={locale} />
    </SheetProvider>
  );
}

/** A page of its own for what the home page shows as a section (games, the studio, contact): its own
 *  address and heading for search engines, the same section below. */
function SectionPage({ locale, page, path, schemaType, children }: { locale: Locale; page: "games" | "about" | "contact"; path: string; schemaType: string; children: React.ReactNode }) {
  const t = COPY[locale].pages[page];
  const url = `${SITE.url}${href(locale, path)}`;
  return (
    <SheetProvider locale={locale}>
      <Header locale={locale} />
      <main>
        <JsonLd nodes={[
          { "@type": schemaType, "@id": `${url}#page`, url, name: t.title, description: t.meta, inLanguage: locale, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID } },
          breadcrumbs(locale, [[t.title, path]]),
        ]} />
        <Container className="flex flex-col gap-3.5 pt-[clamp(40px,5vw,72px)]">
          <h1 className={T.h1}>{t.title}</h1>
          <p className={`${T.lead} max-w-[60ch]`}>{t.lede}</p>
        </Container>
        {children}
      </main>
      <Footer locale={locale} />
      <Lucy locale={locale} />
    </SheetProvider>
  );
}

export const GamesPage = ({ locale }: { locale: Locale }) => (
  <SectionPage locale={locale} page="games" path="/games/" schemaType="CollectionPage"><Games locale={locale} /></SectionPage>
);
export const AboutPage = ({ locale }: { locale: Locale }) => (
  <SectionPage locale={locale} page="about" path="/about/" schemaType="AboutPage"><Studio locale={locale} /><Values locale={locale} /></SectionPage>
);
export const ContactPage = ({ locale }: { locale: Locale }) => (
  <SectionPage locale={locale} page="contact" path="/contact/" schemaType="ContactPage"><Contact locale={locale} /></SectionPage>
);

export function GamePage({ game, locale }: { game: Game; locale: Locale }) {
  return (
    <>
      <Header locale={locale} />
      <main>
        <JsonLd nodes={[
          videoGame(game, locale, game.short[locale]),
          breadcrumbs(locale, [[COPY[locale].pages.games.title, "/games/"], [game.name, `/games/${game.slug}/`]]),
          ...[trailer(game, locale, TRAILER_DATE)].filter((v) => v !== null),
        ]} />
        <GameSheetContent game={game} locale={locale} mode="page" />
      </main>
      <Footer locale={locale} />
      <Lucy locale={locale} page="game" />
    </>
  );
}

export function PressPage({ locale }: { locale: Locale }) {
  const t = COPY[locale].press;
  const files = (g: Game): [string, string][] => [
    ...(g.trailer ? [[t.trailer, YOUTUBE_URL(g.trailer)] as [string, string]] : []),
    [t.icons, asset(g.platform === "android" ? `/press/${g.slug}-icon.png` : `/press/${g.slug}-icon.jpg`)],
    [t.shots, `mailto:${SITE.email}?subject=${encodeURIComponent(g.name + " screenshots")}`],
  ];
  return (
    <>
      <Header locale={locale} />
      <main>
        <JsonLd nodes={[breadcrumbs(locale, [[t.kicker, "/press/"]])]} />
        <Container className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 pb-10 pt-[clamp(40px,5vw,72px)]">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-3.5">
            <h1 className={T.h1}>{t.kicker}</h1>
            <p className={`${T.lead} max-w-[44ch]`}>{t.sub}</p>
          </div>
          <Button href={`mailto:${SITE.email}?subject=Press%20materials`} size="lg">{t.all}</Button>
        </Container>
        <Container className="flex flex-wrap items-start gap-x-16 gap-y-8 pb-16">
          <dl className="m-0 min-w-0 flex-[1_1_360px] border-b border-line">
            {t.factRows.map(([k, v]) => (
              <div key={k} className="flex flex-wrap gap-x-6 gap-y-0.5 border-t border-line py-3">
                <dt className="flex-[0_0_140px] text-[15px] text-faint">{k}</dt>
                <dd className="m-0 min-w-0 flex-[1_1_220px] text-[16px] font-bold text-soft [overflow-wrap:anywhere]">{v}</dd>
              </div>
            ))}
            <div className="flex flex-wrap gap-x-6 gap-y-0.5 border-t border-line py-3">
              <dt className="flex-[0_0_140px] text-[15px] text-faint">Social</dt>
              <dd className="m-0 text-[16px]">{SOCIAL.map((x, i) => <span key={x.name}>{i ? " · " : ""}<TextLink href={x.href}>{x.name}</TextLink></span>)}</dd>
            </div>
          </dl>
          <div className="flex min-w-0 flex-[1.3_1_420px] flex-col gap-4">
            <h2 className={T.h3}>{t.about}</h2>
            <p className={T.body}>{t.aboutText}</p>
            <h2 className={`${T.h3} mt-2`}>{t.history}</h2>
            <p className={T.body}>{t.historyText}</p>
            <h2 className={`${T.h3} mt-2`}>{t.founder}</h2>
            <div className="flex items-center gap-[18px]">
              {FOUNDER_PHOTO
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={asset(FOUNDER_PHOTO)} alt="Bill (Trương Ngọc Châu), founder of Bill The Dev" className="h-24 w-24 flex-none rounded-2xl bg-raise object-cover object-top" />
                : <FoxMedallion className="w-24 flex-none" />}
              <p className={T.body}>{t.founderText} <TextLink href={SITE.portfolio}>billthedev.com</TextLink></p>
            </div>
          </div>
        </Container>
        <Container className="flex flex-col gap-6 pb-16">
          <h2 className={T.h2}>{t.logos}</h2>
          <AssetGroup title={t.studioLogos} items={[
            { label: t.logoDark, src: "/press/studio-logo-dark.png", bg: "bg-[#0D0C0B]", fit: "w-[86%]", file: "PNG" },
            { label: t.logoLight, src: "/press/studio-logo-light.png", bg: "bg-paper", fit: "w-[86%]", file: "PNG" },
            { label: t.markColour, src: "/press/fox-mark.svg", bg: "bg-[#0D0C0B]", fit: "w-[38%]", file: "SVG" },
            { label: t.markWhite, src: "/press/fox-mark-white.svg", bg: "bg-line", fit: "w-[38%]", file: "SVG" },
            { label: t.markBlack, src: "/press/fox-mark-black.svg", bg: "bg-paper", fit: "w-[38%]", file: "SVG" },
          ]} />
          <AssetGroup title={t.icons} items={GAMES.map((g) => (
            { label: g.name, src: g.platform === "android" ? `/press/${g.slug}-icon.png` : `/press/${g.slug}-icon.jpg`, bg: "bg-card", fit: "w-[42%] rounded-[22%]", file: g.platform === "android" ? "PNG 1024" : "JPG 256" }))} />
        </Container>
        <Container className="flex flex-col gap-3 pb-24">
          <h2 className={T.h2}>{t.games}</h2>
          <div className="mt-2 border-b border-line">
            {GAMES.map((g) => (
              <div key={g.slug} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(webp(g.icon))} alt="" className="h-14 w-14 flex-none rounded-[14px]" />
                <span className="flex min-w-0 flex-[1_1_180px] flex-col"><b className="text-[22px] font-black leading-tight">{g.name}</b><span className="text-[14px] text-muted">{g.genre[locale]} · {g.platform === "web" ? "Web" : "Android"}</span></span>
                <span className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">{files(g).map(([label, to]) => <TextLink key={label} href={to}>{label}</TextLink>)}</span>
              </div>
            ))}
          </div>
          <p className="m-0 mt-4 text-[17px] text-muted">
            <TextLink href={STUDIO_YOUTUBE} className="inline-flex items-center gap-2"><YouTubeMark width={26} />{t.youtube}</TextLink>
            {" · "}{t.need} <TextLink href={CONTACTS[0].href}>{t.needSub}</TextLink>
          </p>
        </Container>
      </main>
      <Footer locale={locale} />
      <Lucy locale={locale} page="press" />
    </>
  );
}
