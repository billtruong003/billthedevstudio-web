"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { isLite } from "@/lib/lite";
import { asset } from "@/lib/site";
import { Icon } from "./icons";

const EASE = [0.22, 1, 0.36, 1] as const;

/** True on a weak device (see lib/lite); stands in for framer-motion's useReducedMotion. */
export function useLite() {
  const [lite] = useState(isLite);
  return lite;
}

/** Fades and lifts its children in, once, when they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 16 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useLite();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "0px 0px -40px 0px" }} transition={{ duration: 0.45, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** The hero title: "Shades on." slides up, then "Ship it." lands like a stamp. */
export function HeroTitle({ lines, className, as: Tag = "h1" }: { lines: [string, string]; className?: string; as?: "h1" | "p" }) {
  return (
    <Tag className={className}>
      <span className="block overflow-hidden pb-[0.06em]"><span className="hero-up block">{lines[0]}</span></span>
      <span className="hero-stamp block text-amber">{lines[1]}</span>
    </Tag>
  );
}

/** The hero's hand of game screens follows the mouse anywhere on the page: the hand tilts in 3D and each card
 *  drifts by its own depth. Writes --mx/--my (-1..1) on the element; the CSS does the moving. */
export function HeroHand({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isLite() || !matchMedia("(hover: hover)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    addEventListener("pointermove", move);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} aria-hidden="true" className={className}>{children}</div>;
}

/** "Scroll for more", pinned to the bottom of the first screen at any size (on a phone the hero is taller than the
 *  screen, so it cannot sit at the end of the section); it goes away once the visitor starts scrolling. */
export function ScrollCue({ href, label }: { href: string; label: string }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const check = () => setGone(scrollY > 60);
    check();
    addEventListener("scroll", check, { passive: true });
    // links to a section of this page glide there: Chrome drops CSS smooth scrolling whenever the OS has its
    // animations off, so the page does it itself (only a weak device jumps)
    const glide = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href^='#']");
      const to = a && document.getElementById(a.getAttribute("href")!.slice(1));
      if (!to || isLite() || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href"));
      const top = to.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(to).scrollMarginTop);
      animate(scrollY, top, { duration: Math.min(1.1, 0.5 + Math.abs(top - scrollY) / 3000), ease: [0.65, 0, 0.35, 1], onUpdate: (y) => scrollTo({ top: y, behavior: "instant" }) });
    };
    addEventListener("click", glide);
    return () => { removeEventListener("scroll", check); removeEventListener("click", glide); };
  }, []);
  return (
    <a href={href} aria-hidden={gone || undefined} tabIndex={gone ? -1 : undefined} className={`hero-cue${gone ? " is-gone" : ""}`}>
      <span>{label}</span>
      <span className="hero-cue__ring"><Icon name="down" size={20} stroke={2.6} className="hero-cue__arrow" /></span>
    </a>
  );
}

const FAN = [
  { x: -36, y: 70, r: -14, w: "19%", z: 0 },
  { x: -16, y: 22, r: -7, w: "19%", z: 1 },
  { x: 0, y: 0, r: 0, w: "22%", z: 3 },
  { x: 16, y: 22, r: 7, w: "19%", z: 2 },
  { x: 36, y: 70, r: 14, w: "19%", z: 0 },
];

function FanCard({ src, i, progress, reduce }: { src: string; i: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; reduce: boolean | null }) {
  const f = FAN[i];
  const [lift, setLift] = useState(false);
  // as the hero scrolls away the hand spreads a little wider, like cards being fanned out
  const x = useTransform(progress, [0, 1], [0, f.x * 2.2]);
  const rotate = useTransform(progress, [0, 1], [f.r, f.r * 1.5]);
  return (
    <motion.div className="relative" onHoverStart={() => setLift(true)} onHoverEnd={() => setLift(false)}
      style={{ width: f.w, zIndex: lift ? 10 : f.z, marginLeft: i ? "-3%" : 0, x: reduce ? 0 : x, rotate: reduce ? f.r : rotate }}
      initial={reduce ? false : { y: 220, opacity: 0 }} animate={{ y: f.y, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.25 + Math.abs(i - 2) * 0.09 }}>
      <motion.img src={asset(src)} alt="" aria-hidden="true" draggable={false}
        className={`block aspect-[9/16] w-full rounded-[22px] border-[3px] object-cover shadow-[0_24px_50px_rgba(0,0,0,.6)] transition-[filter,border-color] duration-200 group-hover/fan:brightness-[.7] hover:!brightness-110 ${i === 2 || lift ? "border-amber" : "border-line"}`}
        animate={reduce ? undefined : lift ? { y: -36, scale: 1.08, rotate: -f.r * 0.8 } : { y: 0, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }} />
    </motion.div>
  );
}

/** Five gameplay screens dealt in from below, fanning out a little as the page scrolls. */
export function HeroFan({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useLite();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  return (
    <div ref={ref} className="group/fan mt-8 flex w-full max-w-[1100px] items-start justify-center" aria-hidden="true">
      {images.map((src, i) => <FanCard key={src} src={src} i={i} progress={progress} reduce={reduce} />)}
    </div>
  );
}

/** Counts a number like "130+" up from zero when it comes into view; text like "[N]" is shown as is. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useLite();
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = m ? Number(m[1]) : 0;
  const mv = useMotionValue(0);
  const [shown, setShown] = useState(value);
  useEffect(() => { if (m && !reduce && !seen) setShown(`${(0).toFixed((m[1].split(".")[1] ?? "").length)}${m[2]}`); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!m || reduce || !seen) return;
    const decimals = (m[1].split(".")[1] ?? "").length; // "2.5M+" counts as 0.0 … 2.5, not to 3
    const c = animate(mv, target, { duration: 1.2, ease: EASE, onUpdate: (v) => setShown(`${v.toFixed(decimals)}${m[2]}`) });
    return () => c.stop();
  }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  return <b ref={ref} className={className}>{shown}</b>;
}

const ICON_MOTION = [
  { opacity: [0, 1, 0.3, 1, 0.5, 1] },            // bolt: flickers on
  { scale: [1, 0.82, 1.08, 1] },                    // gamepad: a button press
  { rotate: [-50, 12, 0] },                         // gauge: the needle sweeps
  { y: [-10, 3, 0], opacity: [0, 1, 1] },           // layers: drop into a stack
];

/** A rule card for "How Bill The Dev works": flies in from its side, its connector draws to the fox, its icon does its move. */
export function RuleMotion({ i, side, children, icon }: { i: number; side: "L" | "R"; children: React.ReactNode; icon: React.ReactNode }) {
  const reduce = useLite();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const on = reduce || seen;
  const d = 0.15 + (i % 2) * 0.12;
  return (
    <motion.div ref={ref} className="relative flex h-full min-h-[168px] items-center gap-4 rounded-3xl border border-line bg-card px-6 py-[22px]"
      initial={reduce ? false : { opacity: 0, x: side === "L" ? -40 : 40 }} animate={on ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: d }}>
      <motion.span aria-hidden="true" className={`absolute top-1/2 hidden h-0.5 w-[26px] bg-amber xl:block ${side === "L" ? "-right-[26px] origin-left" : "-left-[26px] origin-right"}`}
        initial={reduce ? false : { scaleX: 0 }} animate={on ? { scaleX: 1 } : undefined} transition={{ duration: 0.4, delay: d + 0.45 }}>
        <span className={`absolute -top-[3px] block h-2 w-2 rounded-full bg-amber ${side === "L" ? "-right-1" : "-left-1"}`} />
      </motion.span>
      <motion.span className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full border-2 border-amber bg-disc text-amber"
        initial={false} animate={on && !reduce ? ICON_MOTION[i] : undefined} transition={{ duration: 0.8, delay: d + 0.35 }}>
        {icon}
      </motion.span>
      {children}
    </motion.div>
  );
}
