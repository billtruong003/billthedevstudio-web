"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { COPY } from "@/content/copy";
import { asset, href, SITE, type Locale } from "@/lib/site";
import { Icon } from "./icons";
import { LanguagePicker } from "./LanguagePicker";
import { Container } from "./ui";

export function Logo({ locale, size }: { locale: Locale; size?: number }) {
  return (
    <Link href={href(locale)} className="flex flex-none items-center gap-2.5 whitespace-nowrap text-[20px] font-black text-white no-underline hover:text-white sm:text-[22px]" style={size ? { fontSize: size } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/img/brand/fox.svg")} alt="" className="h-8 w-8 sm:h-9 sm:w-9" />
      <span>Bill <span className="text-faint">The</span> <span className="text-amber">Dev</span><span className="ml-1.5 hidden align-baseline text-[10px] font-bold uppercase tracking-[0.16em] text-muted min-[420px]:inline">studio</span></span>
    </Link>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const home = href(locale);
  const [menu, setMenu] = useState(false);
  const links: [string, string, string, boolean][] = [
    [t.nav.games, `${home}#games`, t.menuHints.games, false],
    [t.nav.services, `${home}#services`, t.menuHints.services, false],
    [t.nav.studio, `${home}#studio`, t.menuHints.studio, false],
    [t.nav.contact, `${home}#contact`, t.menuHints.contact, false],
    [t.nav.news, href(locale, "/news/"), t.menuHints.news, false],
    [t.nav.press, href(locale, "/press/"), t.menuHints.press, false],
  ];

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header className="sticky top-0 z-[45] border-b border-line bg-ink">
      <Container className="flex min-h-[72px] items-center justify-between gap-3">
        <Logo locale={locale} />
        <nav aria-label="Main" className="flex items-center gap-2 text-[15px] font-bold sm:gap-6">
          <span className="hidden items-center gap-7 lg:flex">
            {[links[0], links[1], links[2], links[4]].map(([label, to, , ext]) =>
              ext ? <a key={label} href={to} className="text-soft no-underline hover:text-white">{label}</a>
                  : <Link key={label} href={to} className="text-soft no-underline hover:text-white">{label}</Link>)}
          </span>
          <LanguagePicker locale={locale} />
          <Link href={`${home}#contact`} className="hidden min-h-[42px] items-center rounded-[10px] border-[1.5px] border-line3 px-4 font-bold text-white no-underline hover:border-amber hover:text-white lg:inline-flex">{t.nav.hire}</Link>
          <button type="button" aria-label={t.nav.menu} aria-expanded={menu} onClick={() => setMenu(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-line3 text-white lg:hidden">
            <Icon name="menu" />
          </button>
        </nav>
      </Container>

      {/* the menu goes to <body>: the header's backdrop blur would otherwise pin a fixed child to the header itself */}
      {menu && createPortal(
        <div role="dialog" aria-modal="true" aria-label={t.nav.menu} className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink lg:hidden">
          <div className="flex min-h-[72px] items-center justify-between border-b border-line px-4">
            <Logo locale={locale} size={20} />
            <div className="flex items-center gap-2">
              <LanguagePicker locale={locale} />
              <button type="button" aria-label={t.nav.close} onClick={() => setMenu(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border-[1.5px] border-line3 text-white">
                <Icon name="close" />
              </button>
            </div>
          </div>
          <nav aria-label="Menu" className="flex flex-col border-b border-line px-4 pt-2">
            {links.map(([label, to, hint, ext]) => {
              const inner = (
                <>
                  <b className="text-[28px] font-black leading-tight">{label}</b>
                  <span className="text-right text-[14px] text-faint">{hint}</span>
                </>
              );
              const cls = "flex min-h-[66px] items-baseline justify-between gap-3 border-t border-line py-4 text-white no-underline first:border-t-0 hover:text-white";
              return ext ? <a key={label} href={to} className={cls}>{inner}</a>
                         : <Link key={label} href={to} className={cls} onClick={() => setMenu(false)}>{inner}</Link>;
            })}
          </nav>
          <div className="flex flex-col gap-3 px-4 py-5">
            <Link href={`${home}#contact`} onClick={() => setMenu(false)} className="flex min-h-[54px] items-center justify-center rounded-full bg-amber text-[19px] font-black no-underline on-amber">{t.nav.hire}</Link>
          </div>
          <p className="m-0 pb-6 text-center text-[14px] text-faint">{SITE.email} · Zalo · Discord</p>
        </div>
      , document.body)}
    </header>
  );
}
