import Link from "next/link";
import { COPY } from "@/content/copy";
import { BLOCK_GUIDE, CATEGORIES, loadPosts, parseBlocks, type Post } from "@/lib/news";
import { asset, href, SITE, type Locale } from "@/lib/site";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Lucy } from "../Lucy";
import { Container, Kicker, T, TextLink } from "../ui";
import { BlockView, GameCard } from "./Blocks";
import { LiteYouTube } from "./LiteYouTube";
import { NewsList, PostMeta, PostTile, type PostCard } from "./NewsList";
import { ShareRow } from "./ShareRow";
import { breadcrumbs, founder, graph, organization, ORG_ID, PERSON_ID } from "@/lib/schema";

const card = (p: Post): PostCard => ({ slug: p.slug, title: p.title, dek: p.dek, date: p.date, category: p.category, cover: p.cover, minutes: p.minutes, draft: p.draft });

export function NewsIndexPage({ locale }: { locale: Locale }) {
  const t = COPY[locale].news;
  const posts = loadPosts();
  return (
    <>
      <Header locale={locale} />
      <main>
        <Container className="flex flex-col gap-3.5 pt-[clamp(40px,5vw,72px)]">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pb-4">
            <h1 className={T.h1}>{t.title}</h1>
            <p className="m-0 max-w-[46ch] text-[17px] leading-relaxed text-muted">{t.sub} <TextLink href={SITE.portfolio}>billthedev.com</TextLink>.</p>
          </div>
          <NewsList posts={posts.map(card)} categories={CATEGORIES} locale={locale} />
        </Container>
        <Container className="pb-24 pt-10">
          <p className="m-0 text-[17px] text-muted">{t.pressTitle} <Link href={href(locale, "/press/")} className="font-bold text-white underline decoration-amber/60 underline-offset-4">{COPY[locale].nav.press}</Link> · <TextLink href={`mailto:${SITE.email}`}>{SITE.email}</TextLink></p>
        </Container>
      </main>
      <Footer locale={locale} />
      <Lucy locale={locale} page="news" />
    </>
  );
}

/** A story, in the shape studio newsrooms use: category and date, headline, one-line standfirst, byline, one hero,
 *  a short body, then the games in the story, the "About Bill The Dev" paragraph with press contact, and more news. */
export function NewsArticlePage({ post, locale }: { post: Post; locale: Locale }) {
  const t = COPY[locale].news;
  const more = loadPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${SITE.url}${href(locale, `/news/${post.slug}/`)}`;
  const video = post.hero.startsWith("youtube:") ? post.hero.slice(8) : "";
  const jsonLd = {
    "@type": "NewsArticle", headline: post.title, description: post.dek,
    // dates in Vietnam time; a story is not edited after it is out, so modified = published
    ...(/^\d{4}-\d{2}-\d{2}$/.test(post.date) ? { datePublished: `${post.date}T09:00:00+07:00`, dateModified: `${post.date}T09:00:00+07:00` } : {}),
    image: [`${SITE.url}${post.cover}`],
    author: { "@type": "Person", "@id": PERSON_ID, name: founder.name, url: founder.url },
    publisher: { "@id": ORG_ID, "@type": "Organization", name: organization.name, logo: organization.logo }, mainEntityOfPage: url, inLanguage: "en",
  };
  const trail = breadcrumbs(locale, [[t.title, "/news/"], [post.title, `/news/${post.slug}/`]]);
  return (
    <>
      <Header locale={locale} />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(jsonLd, trail) }} />
        <article lang="en">
          <header className="mx-auto flex max-w-[760px] flex-col gap-[18px] px-4 pb-7 pt-8 sm:px-6">
            <span className="text-[14px] font-bold text-faint"><Link href={href(locale, "/news/")} className="text-faint no-underline hover:text-white">{t.back}</Link> / {t.cats[post.category] ?? post.category}</span>
            <h1 className="m-0 text-[clamp(38px,5vw,64px)] font-black leading-[1.0] tracking-[-0.015em]">{post.title}</h1>
            <p className="m-0 text-[21px] leading-snug text-soft">{post.dek}</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3.5">
              <span className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/img/brand/fox.svg")} alt="" className="h-10 w-10" />
                <span className="flex flex-col leading-tight"><b className="text-[15px]">Bill (Trương Ngọc Châu)</b><PostMeta p={card(post)} locale={locale} className="!text-[14px]" /></span>
              </span>
              <ShareRow url={url} title={post.title} locale={locale} />
            </div>
          </header>
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            {video ? (
              <LiteYouTube id={video} poster={asset(post.cover)} label={post.title} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(post.hero)} alt={post.title} className="aspect-video w-full rounded-2xl object-cover object-top" />
            )}
          </div>
          <div className="mx-auto flex max-w-[680px] flex-col gap-6 px-4 pb-4 pt-10 sm:px-6 [&_.wide]:-mx-4 sm:[&_.wide]:-mx-24">
            {post.blocks.map((b, i) => <BlockView key={i} b={b} locale={locale} />)}
          </div>
          <footer className="mx-auto flex max-w-[680px] flex-col gap-6 px-4 pb-8 pt-6 sm:px-6">
            {post.games.length > 0 && (
              <section aria-label={t.inStory} className="flex flex-col gap-3">
                <h2 className="m-0 text-[15px] font-bold text-faint">{t.inStory}</h2>
                {post.games.map((g) => <GameCard key={g} slug={g} locale={locale} />)}
              </section>
            )}
            <section aria-label={t.aboutTitle} className="flex flex-col gap-2 border-t border-line pt-6 text-[17px] leading-relaxed text-muted">
              <b className="text-[15px] text-faint">{t.aboutTitle}</b>
              <p className="m-0">{t.aboutText}</p>
              <p className="m-0">{t.pressLine} <TextLink href={`mailto:${SITE.email}`}>{SITE.email}</TextLink> · <Link href={href(locale, "/press/")} className="font-bold text-white underline decoration-amber/60 underline-offset-4">{COPY[locale].nav.press}</Link></p>
            </section>
          </footer>
        </article>
        {more.length > 0 && (
          <Container className="flex flex-col gap-5 pb-24 pt-10">
            <div className="flex items-end justify-between gap-3"><h2 className="m-0 text-[clamp(26px,3vw,34px)] font-black">{t.more}</h2><Link href={href(locale, "/news/")} className="text-[17px] font-bold text-white underline decoration-amber/60 underline-offset-4">{t.allNews}</Link></div>
            <div className="border-b border-line">{more.map((p) => <PostTile key={p.slug} p={card(p)} locale={locale} />)}</div>
          </Container>
        )}
      </main>
      <Footer locale={locale} />
      <Lucy locale={locale} page="news" />
    </>
  );
}

/** /news/blocks/: every block with the text that makes it, for whoever writes the next story. */
export function BlocksGuidePage({ locale }: { locale: Locale }) {
  const t = COPY[locale].news;
  const chunks = BLOCK_GUIDE.split(/\n(?=:::\w|## )/).map((c) => c.trim()).filter(Boolean);
  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto flex max-w-[1100px] flex-col gap-6 px-4 pb-24 pt-12 sm:px-6">
        <Kicker>{t.kicker}</Kicker>
        <h1 className={T.h1}>{t.blocksTitle}</h1>
        <p className="m-0 text-[19px] text-soft">{t.blocksSub}</p>
        {chunks.map((c, i) => (
          <section key={i} className="grid gap-5 border-t border-line pt-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
            <pre className="m-0 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-line bg-card p-4 text-[14px] leading-relaxed text-soft">{c}</pre>
            <div className="flex min-w-0 flex-col gap-4">{parseBlocks(c).map((b, j) => <BlockView key={j} b={b} locale={locale} />)}</div>
          </section>
        ))}
      </main>
      <Footer locale={locale} />
    </>
  );
}
