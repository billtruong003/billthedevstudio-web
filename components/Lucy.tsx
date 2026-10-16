"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "@/content/copy";
import { asset, SITE, type Locale } from "@/lib/site";
import { Icon } from "./icons";

type Msg = { from: "lucy" | "me"; text: string };
export type LucyPage = "home" | "game" | "news" | "press";

function sessionId() {
  try {
    let id = localStorage.getItem("lucy-sid");
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("lucy-sid", id); }
    return id;
  } catch { return "anon"; }
}

const seen = (key: string) => { try { return sessionStorage.getItem(key) === "1"; } catch { return false; } };
const mark = (key: string) => { try { sessionStorage.setItem(key, "1"); } catch { /* private mode */ } };

/** Lucy, the studio's guide. Closed: she peeks from the corner, with one line for the page you are on (once per visit).
 *  Open: a dialogue box like a visual novel, her pose follows the conversation (wave, think, explain).
 *  Her colours are her own (lavender and navy), not the studio amber. Answers come from the studio's Lucy service. */
export function Lucy({ locale, page = "home" }: { locale: Locale; page?: LucyPage }) {
  const t = COPY[locale].lucy;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "lucy", text: t.hello }]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState(true);
  const [tease, setTease] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // phones: she waits until the visitor is past the first screen, so she never covers the hero
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 639px)");
    const check = () => setShown(!narrow.matches || window.scrollY > window.innerHeight * 0.9);
    check();
    window.addEventListener("scroll", check, { passive: true });
    narrow.addEventListener("change", check);
    return () => { window.removeEventListener("scroll", check); narrow.removeEventListener("change", check); };
  }, []);

  // the line on the bubble: once per visit, 6 s after load, computers only
  useEffect(() => {
    if (seen("lucy-tease") || window.matchMedia("(max-width: 639px)").matches) return;
    const id = setTimeout(() => setTease(true), 6000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openIt = () => { setOpen(true); setTease(false); mark("lucy-tease"); };
  const hideTease = () => { setTease(false); mark("lucy-tease"); };

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setMsgs((m) => [...m, { from: "me", text: question }]);
    setQ("");
    setBusy(true);
    try {
      const r = await fetch(SITE.lucyApi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: question, sid: sessionId(), lang: locale }), signal: AbortSignal.timeout(30_000) });
      const data = r.ok ? await r.json() : null;
      setMsgs((m) => [...m, { from: "lucy", text: data?.answer || (r.status === 429 ? t.busy : t.error) }]);
    } catch {
      setMsgs((m) => [...m, { from: "lucy", text: t.error }]);
    } finally {
      setBusy(false);
    }
  };

  const last = msgs[msgs.length - 1];
  const lucyLine = [...msgs].reverse().find((m) => m.from === "lucy")!;
  const lastQuestion = [...msgs].reverse().find((m) => m.from === "me");
  const pose = busy ? "think" : msgs.length === 1 ? "wave" : last.from === "lucy" ? "explain" : "present";
  const history = msgs.slice(0, msgs.length - (last.from === "lucy" ? 1 : 0)).slice(1);

  return (
    <>
      {!open && (
        <div className={`fixed bottom-0 right-0 z-40 flex items-end transition-[opacity,transform] duration-300 ${shown ? "" : "pointer-events-none translate-y-6 opacity-0"}`}>
          {tease && (
            <div className="lucy-pop relative mb-[108px] mr-[-14px] max-w-[230px] rounded-[14px_14px_4px_14px] bg-white py-2.5 pl-3.5 pr-7 text-[14px] leading-snug text-[#1C1917] shadow-[0_10px_30px_rgb(var(--c-shadow)/.5)]">
              <button type="button" onClick={hideTease} aria-label={t.close} className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[#8A837C] hover:text-[#1C1917]"><Icon name="close" size={14} /></button>
              <b className="block text-[13px] tracking-[0.06em] text-[#5B48C9]">LUCY</b>
              <button type="button" onClick={openIt} className="text-left">{t.tease[page] ?? t.tease.home}</button>
            </div>
          )}
          <button type="button" onClick={openIt} aria-label={`${t.ask}, ${t.role}`} tabIndex={shown ? 0 : -1} className="group block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/img/lucy/lucy-wave.webp")} alt="" className="lucy-breathe -mb-3 block w-[104px] transition-transform duration-200 group-hover:-translate-y-1 sm:w-[140px]" />
          </button>
        </div>
      )}

      {open && (
        <section role="dialog" aria-label={`Lucy, ${t.ai}`}
          className="lucy-rise fixed inset-x-2 bottom-2 z-[65] h-[min(600px,86vh)] overflow-hidden rounded-[18px] border border-[#3D3766] bg-gradient-to-b from-lav-deep from-0% to-navy to-60% shadow-[0_30px_80px_rgb(var(--c-shadow)/.6)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:w-[440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={pose} src={asset(`/img/lucy/lucy-${pose}.webp`)} alt="" className="lucy-swap pointer-events-none absolute -right-5 -top-6 w-[230px] sm:-right-6 sm:-top-2 sm:w-[320px]" />
          <div className="absolute left-3 top-3.5 flex flex-col gap-0.5">
            <b className="text-[20px] font-black text-white">Lucy</b>
            <span className="text-[13px] text-[#CFC8FF]">{t.ai}</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-black/35 text-white hover:bg-black/50"><Icon name="close" size={18} /></button>

          {history.length > 0 && (
            <div ref={log} className="thin-scrollbar absolute left-3 top-[72px] flex max-h-[38%] w-[58%] flex-col gap-1.5 overflow-y-auto pr-1 text-[13px] leading-snug">
              {history.map((m, i) => (
                <span key={i} className={m.from === "me" ? "self-start rounded-lg bg-white/10 px-2.5 py-1.5 text-white" : "rounded-[8px_8px_8px_2px] bg-black/30 px-2.5 py-1.5 text-[#CFC8FF]"}>{m.text}</span>
              ))}
            </div>
          )}

          <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-2.5">
            <div className="relative min-h-[132px] rounded-xl border-2 border-lav bg-[#141210]/95 px-4 pb-4 pt-6" aria-live="polite">
              <span className="absolute -top-3.5 left-3.5 rounded-md bg-lav px-3 py-0.5 text-[14px] font-black tracking-[0.06em] text-[#1B1640]">LUCY</span>
              {busy ? (
                <>
                  {lastQuestion && <p className="m-0 text-[15px] text-[#CFC8FF]">{t.you} <b className="text-white">{lastQuestion.text}</b></p>}
                  <p className="m-0 mt-2.5 flex gap-1.5" aria-label={t.thinking}><span className="lucy-dot" /><span className="lucy-dot" /><span className="lucy-dot" /></p>
                </>
              ) : (
                <p key={msgs.length} className="lucy-type m-0 whitespace-pre-line text-[16px] leading-relaxed text-soft">{lucyLine.text}</p>
              )}
            </div>
            {msgs.length === 1 && !busy && (
              <div className="flex flex-wrap gap-2">
                {t.chips.map((c) => (
                  <button key={c} type="button" onClick={() => ask(c)} className="min-h-[40px] rounded-[10px] border border-lav/50 bg-white/[0.06] px-3 text-left text-[15px] font-bold text-white hover:border-lav">{c}</button>
                ))}
              </div>
            )}
            <form className="flex items-center gap-2 rounded-xl border border-[#4A4370] bg-black/35 py-1.5 pl-3.5 pr-1.5" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
              <label className="sr-only" htmlFor="lucy-q">{t.placeholder}</label>
              <input ref={input} id="lucy-q" value={q} onChange={(e) => setQ(e.target.value)} maxLength={400} placeholder={t.placeholder} autoComplete="off"
                className="min-h-[38px] min-w-0 flex-1 bg-transparent text-[16px] text-white placeholder:text-[#A39DC9] focus:outline-none" />
              <button type="submit" aria-label={t.send} disabled={busy} className="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-lav text-[#1B1640] disabled:opacity-60"><Icon name="arrow" size={18} /></button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
