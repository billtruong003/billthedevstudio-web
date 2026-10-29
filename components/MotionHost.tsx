"use client";

import { animate } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isLite } from "@/lib/lite";

/** The site's page-wide motion, one listener each, mounted once in the Shell. Pages only mark elements:
 *  - `data-reveal` rises in when it scrolls into view (`--i` staggers siblings; the CSS does the moving);
 *  - `data-tilt` turns toward the mouse with a light on it;
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

  // tilt: a `data-tilt` element under the mouse turns toward it and a soft light follows (--tx/--ty -1..1, --gx/--gy 0..1)
  useEffect(() => {
    if (isLite() || !matchMedia("(hover: hover)").matches) return;
    let on: HTMLElement | null = null;
    let frame = 0;
    const move = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (on && on !== el) { on.classList.remove("is-tilting"); ["--tx", "--ty"].forEach((p) => on!.style.removeProperty(p)); }
      on = el;
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const gx = (e.clientX - r.left) / r.width, gy = (e.clientY - r.top) / r.height;
        el.classList.add("is-tilting");
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
