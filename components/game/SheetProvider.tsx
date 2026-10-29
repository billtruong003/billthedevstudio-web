"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLite } from "../motion";
import { gameBySlug } from "@/content/games";
import { href, type Locale } from "@/lib/site";
import { GameSheetContent } from "./GameSheetContent";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
type Open = (slug: string, from?: DOMRect) => void;
const Ctx = createContext<Open>(() => {});
export const useOpenGame = () => useContext(Ctx);

/** The game sheet over the home page. Its address is the game's own page (/games/<slug>/), so it can be shared;
 *  X, Esc and Back close it and leave the home page where it was. */
export function SheetProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const pushed = useRef(false);
  const back = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const reduce = useLite();
  const url = (s: string) => `${BASE}${href(locale, `/games/${s}/`)}`;

  const open = useCallback((s: string) => {
    if (!pushed.current) back.current = document.activeElement as HTMLElement | null;
    if (pushed.current) history.replaceState({ sheet: s }, "", url(s));
    else { history.pushState({ sheet: s }, "", url(s)); pushed.current = true; }
    setSlug(s);
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    if (pushed.current) history.back();
    else setSlug(null);
  }, []);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state && e.state.sheet) as string | undefined;
      pushed.current = !!s;
      setSlug(s ?? null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = slug ? "hidden" : "";
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !document.querySelector("[data-lightbox]") && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, close]);

  const game = slug ? gameBySlug(slug) : undefined;
  useEffect(() => {
    if (!game) { back.current?.focus({ preventScroll: true }); return; }
    const title = document.title;
    document.title = `${game.name} · Bill The Dev`;
    dialog.current?.scrollTo({ top: 0 });
    dialog.current?.focus({ preventScroll: true });
    return () => { document.title = title; };
  }, [game]);
  return (
    <Ctx.Provider value={open}>
      {children}
      <AnimatePresence>
        {game && (
          <motion.div key="sheet" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 sm:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={(e) => e.target === e.currentTarget && close()}>
            <motion.div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={game.name}
              className="thin-scrollbar h-full w-full overflow-y-auto overscroll-contain bg-sheet outline-none sm:h-auto sm:max-h-full sm:max-w-[1000px] sm:rounded-[28px] sm:border sm:border-line"
              initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: 16 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
              <GameSheetContent key={game.slug} game={game} locale={locale} mode="modal" onSelect={open} onClose={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
