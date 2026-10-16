"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
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
// asks about the form or about sending, not a message for Bill: never copied into the message box
const DRAFTLESS = /form|mở|đâu|where|open|(gửi|send|email|mail).{0,24}(lời nhắn|tin|message|mail|email|cho (sếp )?bill|him)|^(ok|okay|vậy|thế)\b/i;

// an email, a phone number (7+ digits) or a Zalo/Telegram/Facebook handle; anything else cannot be answered
const CONTACT = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$|(\d[\s.-]?){7,}|zalo|telegram|t\.me\/|@\w{3,}|fb\.com|facebook\.com/i;

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
  const reduce = useReducedMotion();
  // "Send to Bill": opens when the visitor wants to reach him (the service says so), or from the link under the chat
  const [form, setForm] = useState<"closed" | "open" | "sending" | "sent" | "failed" | "limited" | "badContact">("closed");
  // the live form state for callbacks: ask() resolves after renders its closure never saw
  const formNow = useRef(form);
  formNow.current = form;
  const sending = useRef(false); // a second click lands before the re-render: one request only
  const contactField = useRef<HTMLInputElement>(null);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const [lead, setLead] = useState({ name: "", contact: "", message: "" });
  const talk = useAnimationControls();

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
    // reopened with the form up: the cursor goes back where the visitor left off
    const field = formNow.current === "closed" ? input.current : lead.contact.trim() ? messageField.current : contactField.current;
    field?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const openForm = (draft?: string) => {
    const f = formNow.current;
    if (f === "sending") return;
    setLead((l) => ({ ...l, message: (f === "sent" || f === "limited" ? "" : l.message) || draft || "" }));
    setForm("open");
  };

  // the form takes focus when it opens: the contact if it is empty, else the message
  useEffect(() => {
    if (form !== "open") return;
    (lead.contact.trim() ? messageField : contactField).current?.focus({ preventScroll: true });
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

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
      // what Lucy says and what the page shows match: she points at the form, the form opens (again, from any state).
      // The question becomes the draft only when it carries a real message, not "mở form đi".
      if (data?.handoff) openForm(question.length >= 30 && !DRAFTLESS.test(question) ? question : undefined);
    } catch {
      setMsgs((m) => [...m, { from: "lucy", text: t.error }]);
    } finally {
      setBusy(false);
    }
  };

  const sendLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.contact.trim() || !lead.message.trim() || sending.current) return;
    if (!CONTACT.test(lead.contact.trim())) { setForm("badContact"); contactField.current?.focus(); return; }
    sending.current = true;
    setForm("sending");
    try {
      const r = await fetch(SITE.lucyApi.replace(/\/chat$/, "/lead"), { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, sid: sessionId(), lang: locale, page }), signal: AbortSignal.timeout(20_000) });
      setForm(r.ok ? "sent" : r.status === 429 ? "limited" : r.status === 400 ? "badContact" : "failed");
    } catch { setForm("failed"); }
    sending.current = false;
  };

  const last = msgs[msgs.length - 1];
  const lucyLine = [...msgs].reverse().find((m) => m.from === "lucy")!;
  const lastQuestion = [...msgs].reverse().find((m) => m.from === "me");
  const pose = busy || form === "sending" ? "think" : form === "sent" ? "wave" : form === "open" ? "present" : msgs.length === 1 ? "wave" : last.from === "lucy" ? "explain" : "present";
  const history = form !== "closed" ? msgs.slice(1) : msgs.slice(0, msgs.length - (last.from === "lucy" ? 1 : 0)).slice(1);

  // while her answer wipes in she bobs a few times, quick then settling, so it reads as talking
  useEffect(() => {
    if (!open || reduce || busy || msgs.length < 2 || last.from !== "lucy") return;
    talk.start({ y: [0, -5, 0, -4, 0, -2.5, 0], transition: { duration: 0.95, ease: "easeInOut", times: [0, 0.14, 0.3, 0.46, 0.62, 0.8, 1] } });
  }, [msgs.length, busy, open]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <span className="lucy-sway block origin-bottom transition-transform duration-300 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-2 group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/img/lucy/lucy-wave.webp")} alt="" className="lucy-breathe -mb-3 block w-[104px] origin-bottom sm:w-[140px]" />
            </span>
          </button>
        </div>
      )}

      {open && (
        <motion.section role="dialog" aria-label={`Lucy, ${t.ai}`}
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }} style={{ transformOrigin: "100% 100%" }}
          className="fixed inset-x-2 bottom-2 z-[65] h-[min(600px,86dvh)] overflow-hidden rounded-[18px] border border-[#3D3766] bg-gradient-to-b from-lav-deep from-0% to-navy to-60% shadow-[0_30px_80px_rgb(var(--c-shadow)/.6)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:w-[440px]">
          {/* Lucy: rises in a beat after the panel; idles (breath + sway on different clocks); tilts while thinking;
              each new pose dips and springs back over the old one, which lifts away; bobs while she talks */}
          <motion.div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-6 w-[230px] sm:-right-6 sm:-top-2 sm:w-[320px]"
            initial={reduce ? false : { y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.08 }}>
            <motion.div animate={talk}>
              <div className={busy ? "lucy-think" : "lucy-idle"}>
                <div className="lucy-breathe-soft relative aspect-square origin-bottom">
                  <AnimatePresence initial={false}>
                    <motion.img key={pose} src={asset(`/img/lucy/lucy-${pose}.webp`)} alt="" className="absolute inset-0 h-full w-full origin-bottom"
                      initial={reduce ? false : { opacity: 0, y: 12, scaleY: 0.96, scaleX: 1.03 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1, transition: { type: "spring", stiffness: 520, damping: 17, opacity: { duration: 0.12 } } }}
                      exit={reduce ? undefined : { opacity: 0, y: -6, scale: 1.015, transition: { duration: 0.18, ease: "easeOut" } }} />
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <div className="absolute left-3 top-3.5 flex flex-col gap-0.5">
            <b className="text-[20px] font-black text-white">Lucy</b>
            <span className="text-[13px] text-[#CFC8FF]">{t.ai}</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-black/35 text-white hover:bg-black/50"><Icon name="close" size={18} /></button>

          {history.length > 0 && (
            <div ref={log} className={`thin-scrollbar absolute left-3 top-[72px] flex w-[58%] ${form !== "closed" ? "max-h-[calc(100%-430px)] min-h-[64px]" : "max-h-[38%]"} flex-col gap-1.5 overflow-y-auto pr-1 text-[13px] leading-snug`}>
              {history.map((m, i) => (
                <span key={i} className={m.from === "me" ? "self-start rounded-lg bg-white/10 px-2.5 py-1.5 text-white" : "rounded-[8px_8px_8px_2px] bg-black/30 px-2.5 py-1.5 text-[#CFC8FF]"}>{m.text}</span>
              ))}
            </div>
          )}

          {form !== "closed" ? (
            <form onSubmit={sendLead} className="lucy-rise absolute inset-x-2.5 bottom-2.5 flex flex-col gap-2 rounded-xl border-2 border-lav bg-[#141210]/95 px-3.5 pb-3.5 pt-6">
              <span className="absolute -top-3.5 left-3.5 rounded-md bg-lav px-3 py-0.5 text-[14px] font-black tracking-[0.06em] text-[#1B1640]">{t.leave.title}</span>
              {form === "sent" || form === "limited" ? (
                <p className="lucy-type m-0 py-2 text-[16px] leading-relaxed text-soft" aria-live="polite">
                  {form === "sent" ? <>{t.leave.sent} <b className="text-white">{lead.contact}</b>.</> : t.leave.limited}
                </p>
              ) : (
                <>
                  <label className="sr-only" htmlFor="lead-name">{t.leave.name}</label>
                  <input id="lead-name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} maxLength={80} placeholder={t.leave.name} autoComplete="name"
                    className="min-h-[42px] rounded-lg border border-[#4A4370] bg-black/35 px-3 text-[16px] text-white placeholder:text-[#A39DC9] focus:border-lav focus:outline-none" />
                  <label className="sr-only" htmlFor="lead-contact">{t.leave.contact}</label>
                  <input id="lead-contact" ref={contactField} aria-invalid={form === "badContact"} required value={lead.contact} onChange={(e) => setLead({ ...lead, contact: e.target.value })} maxLength={120} placeholder={t.leave.contact} autoComplete="email"
                    className="min-h-[42px] rounded-lg border border-[#4A4370] bg-black/35 px-3 text-[16px] text-white placeholder:text-[#A39DC9] focus:border-lav focus:outline-none" />
                  <label className="sr-only" htmlFor="lead-message">{t.leave.message}</label>
                  <textarea id="lead-message" ref={messageField} required value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} maxLength={1500} rows={3} placeholder={t.leave.message}
                    className="resize-none rounded-lg border border-[#4A4370] bg-black/35 px-3 py-2 text-[16px] text-white placeholder:text-[#A39DC9] focus:border-lav focus:outline-none" />
                  {(form === "failed" || form === "badContact") && <p className="m-0 text-[14px] text-[#FFB4A8]" role="alert">{form === "failed" ? t.leave.failed : t.leave.badContact}</p>}
                  <p className="m-0 text-[12px] leading-snug text-[#A39DC9]">{t.leave.note}</p>
                </>
              )}
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => { setForm("closed"); requestAnimationFrame(() => input.current?.focus({ preventScroll: true })); }} className="min-h-[40px] text-[14px] font-bold text-[#CFC8FF] underline underline-offset-4">{t.leave.back}</button>
                {form === "sent" ? (
                  <button type="button" onClick={() => openForm()} className="inline-flex min-h-[42px] items-center rounded-[10px] border border-lav px-4 text-[15px] font-black text-white">{t.leave.another}</button>
                ) : form !== "limited" && (
                  <button type="submit" disabled={form === "sending"} className="inline-flex min-h-[42px] items-center rounded-[10px] bg-lav px-4 text-[15px] font-black text-[#1B1640] disabled:opacity-60">
                    {form === "sending" ? t.leave.sending : t.leave.send}
                  </button>
                )}
              </div>
            </form>
          ) : (
          <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-2.5">
            <div className="relative min-h-[132px] rounded-xl border-2 border-lav bg-[#141210]/95 px-4 pb-4 pt-6" aria-live="polite">
              <span className="absolute -top-3.5 left-3.5 rounded-md bg-lav px-3 py-0.5 text-[14px] font-black tracking-[0.06em] text-[#1B1640]">LUCY</span>
              {busy ? (
                <>
                  {lastQuestion && <p className="m-0 text-[15px] text-[#CFC8FF]">{t.you} <b className="text-white">{lastQuestion.text}</b></p>}
                  <p className="m-0 mt-2.5 flex gap-1.5" aria-label={t.thinking}><span className="lucy-dot" /><span className="lucy-dot" /><span className="lucy-dot" /></p>
                </>
              ) : (
                <p key={msgs.length} className="lucy-type thin-scrollbar m-0 max-h-[min(220px,34dvh)] overflow-y-auto whitespace-pre-line pr-1 text-[16px] leading-relaxed text-soft">{lucyLine.text}</p>
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
            {msgs.length > 1 && (
              <button type="button" onClick={() => openForm()} className="-mt-1 self-start text-[14px] font-bold text-[#CFC8FF] underline decoration-lav/60 underline-offset-4 hover:text-white">{t.leave.open}</button>
            )}
          </div>
          )}
        </motion.section>
      )}
    </>
  );
}
