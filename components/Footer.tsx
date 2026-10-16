import Link from "next/link";
import { COPY } from "@/content/copy";
import { GAMES } from "@/content/games";
import { COLLAB, CONTACTS, STUDIO_YOUTUBE } from "@/content/studio";
import { asset, href, SITE, type Locale } from "@/lib/site";
import { Logo } from "./Header";
import { Container, Slogan } from "./ui";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col text-[15px]">
      <b className="mb-1 text-[14px] font-bold text-faint">{title}</b>
      {children}
    </div>
  );
}

const A = "inline-flex min-h-[40px] items-center text-soft no-underline hover:text-white";

export function Footer({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const home = href(locale);
  return (
    <footer className="border-t border-line bg-sheet">
      <Container className="grid grid-cols-2 gap-x-5 gap-y-7 pb-6 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Logo locale={locale} size={22} />
          <span className="text-[15px] leading-normal text-muted">{t.footer.tagline}, {t.footer.place}.</span>
          <Slogan className="text-[15px] font-bold text-muted" />
        </div>
        <Col title={t.footer.games}>{GAMES.map((g) => <Link key={g.slug} href={href(locale, `/games/${g.slug}/`)} className={A}>{g.name}</Link>)}</Col>
        <Col title={t.footer.studio}>
          <Link href={`${home}#services`} className={A}>{t.nav.services}</Link>
          <Link href={`${home}#studio`} className={A}>{t.footer.about}</Link>
          <a href={SITE.portfolio} className={A}>{t.footer.devlog}</a>
          <Link href={href(locale, "/press/")} className={A}>{t.nav.press}</Link>
          <a href={COLLAB.href} className={A}>Collab: {COLLAB.name}</a>
          <a href={STUDIO_YOUTUBE} className={A}>YouTube</a>
        </Col>
        <Col title={t.footer.contact}>{CONTACTS.map((c) => <a key={c.kind} href={c.href} className={A}>{c.name}</a>)}</Col>
        <Col title={t.footer.legal}><a href={asset("/privacy/")} className={A}>{t.footer.privacy}</a></Col>
      </Container>
      <Container><p className="m-0 pb-32 text-[14px] leading-relaxed text-faint sm:pb-10">{t.footer.note}</p></Container>
    </footer>
  );
}
