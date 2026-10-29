"use client";

import { animate } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isLite } from "@/lib/lite";

/** The site's page-wide motion, one listener each, mounted once in the Shell. Pages only mark elements:
 *  - `data-reveal` rises in when it scrolls into view (`--i` staggers siblings; the CSS does the moving);
 *  - `data-tilt` turns toward the mouse with a light on it, and `data-magnet` (the amber buttons) leans after it;
 *  - `--sy` on <html> is how far the first screen has scrolled away (0..1), for the hero's parallax, and
 *    `.scrolled` is on once the page has moved at all, for the header;
 *  - links to `#section` glide there (Chrome drops CSS smooth scrolling whenever the OS has its animations off).
 *  A weak device (`.lite`, see lib/lite) gets none of it. */
export function MotionHost() {
  const path = usePathname();

  // reveals: rescanned on every page, since a client navigation brings new elements
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    if (isLite() || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    if (isLite()) return;
    const glide = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href^='#']");
      const to = a && document.getElementById(a.getAttribute("href")!.slice(1));
      if (!to || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href"));
      const top = to.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(to).scrollMarginTop);
      animate(scrollY, top, { duration: Math.min(1.1, 0.5 + Math.abs(top - scrollY) / 3000), ease: [0.65, 0, 0.35, 1], onUpdate: (y) => scrollTo({ top: y, behavior: "instant" }) });
    };
    addEventListener("click", glide);
    return () => removeEventListener("click", glide);
  }, []);

  useEffect(() => {
    if (isLite()) return;
    const root = document.documentElement;
    let frame = 0, last = -1;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sy = Math.round(Math.min(scrollY / innerHeight, 1) * 1000) / 1000;
        if (sy !== last) root.style.setProperty("--sy", String((last = sy)));
        root.classList.toggle("scrolled", scrollY > 8);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  // the `data-tilt` or `data-magnet` element under the mouse learns where it is on it (--tx/--ty -1..1, --gx/--gy 0..1)
  // and gets .is-on; the CSS turns a tilt toward the mouse and pulls a magnet after it
  useEffect(() => {
    if (isLite() || !matchMedia("(hover: hover)").matches) return;
    let on: HTMLElement | null = null;
    let frame = 0;
    const move = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.<HTMLElement>("[data-tilt], [data-magnet]") ?? null;
      if (on && on !== el) { on.classList.remove("is-on"); ["--tx", "--ty"].forEach((p) => on!.style.removeProperty(p)); }
      on = el;
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const gx = (e.clientX - r.left) / r.width, gy = (e.clientY - r.top) / r.height;
        el.classList.add("is-on");
        el.style.setProperty("--gx", gx.toFixed(3));
        el.style.setProperty("--gy", gy.toFixed(3));
        el.style.setProperty("--tx", (gx * 2 - 1).toFixed(3));
        el.style.setProperty("--ty", (gy * 2 - 1).toFixed(3));
      });
    };
    addEventListener("pointermove", move, { passive: true });
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(frame); };
  }, []);

  return null;
}
