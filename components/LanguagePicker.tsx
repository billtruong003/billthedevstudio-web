"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { COPY, LANGUAGE_LIST } from "@/content/copy";
import type { Locale } from "@/lib/site";
import { Icon } from "./icons";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** The same page in another language: English at the root, Vietnamese under /vi/. */
function switchPath(pathname: string, to: Locale) {
  const bare = pathname.startsWith(BASE) ? pathname.slice(BASE.length) || "/" : pathname;
  const rest = bare.replace(/^\/vi(\/|$)/, "/");
  return BASE + (to === "en" ? rest : `/vi${rest === "/" ? "/" : rest}`);
}

/** Globe button in the header. A dropdown on a computer, a sheet from the bottom on a phone. */
export function LanguagePicker({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => root.current && !root.current.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onClick); };
  }, [open]);

  const choose = (code: Locale) => {
    try { localStorage.setItem("lang", code); } catch {}
    window.location.href = switchPath(pathname, code);
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.lang.title}: ${t.langName}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line2 px-3 text-[16px] font-black text-white hover:border-white/60"
      >
        <Icon name="globe" size={18} />
        <span className="hidden sm:inline">{t.langName}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <Icon name="down" size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 sm:hidden" aria-hidden="true" />
          <div
            role="listbox"
            aria-label={t.lang.title}
            className={clsx(
              "z-50 flex flex-col gap-1 border border-line bg-sheet p-4 shadow-2xl",
              "fixed inset-x-0 bottom-0 rounded-t-[26px] pb-6 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-[calc(100%+8px)] sm:w-[300px] sm:rounded-[20px] sm:pb-4",
            )}
          >
            <span className="mx-auto mb-2 block h-[5px] w-11 rounded-full bg-line3 sm:hidden" aria-hidden="true" />
            <b className="px-1 pb-2 text-[22px]">{t.lang.title}</b>
            {LANGUAGE_LIST.map((l) => {
              const on = l.code === locale;
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={on}
                  disabled={!l.ready}
                  onClick={() => choose(l.code as Locale)}
                  className="flex min-h-[50px] items-center gap-3 border-b border-line px-1 text-left text-white disabled:cursor-default disabled:opacity-45"
                >
                  <span className="flex min-w-0 flex-1 items-baseline gap-2.5">
                    <b className="text-[18px]">{l.native}</b>
                    <span className="text-[14px] text-muted">{l.ready ? l.english : `${l.english} · ${t.lang.soon}`}</span>
                  </span>
                  {on && <Icon name="check" className="text-amber" />}
                </button>
              );
            })}
            <p className="m-0 px-1 pt-2 text-[14px] text-muted">{t.lang.gamesNote}</p>
          </div>
        </>
      )}
    </div>
  );
}
