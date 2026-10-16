import Link from "next/link";
import { COPY } from "@/content/copy";
import { GAMES } from "@/content/games";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container, FoxMedallion } from "@/components/ui";
import { href } from "@/lib/site";

export default function NotFound() {
  const t = COPY.en.notFound;
  return (
    <>
      <Header locale="en" />
      <main><Container className="flex flex-col items-center gap-6 py-24 text-center">
        <FoxMedallion className="w-40" />
        <h1 className="m-0 text-[clamp(36px,5vw,56px)] font-black leading-none">{t.title}</h1>
        <p className="m-0 text-[19px] text-soft">{t.body}</p>
        <div className="flex flex-wrap justify-center gap-3">{GAMES.map((g) => <Link key={g.slug} href={href("en", `/games/${g.slug}/`)} className="inline-flex min-h-[48px] items-center rounded-full border border-line px-5 font-black text-white no-underline">{g.name}</Link>)}</div>
        <Link href="/" className="text-[18px] font-black">{t.home}</Link>
      </Container></main>
      <Footer locale="en" />
    </>
  );
}
