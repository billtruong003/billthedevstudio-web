"use client";

import { animate } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isLite } from "@/lib/lite";

/** The site's page-wide motion, one listener each, mounted once in the Shell. Pages only mark elements:
 *  - `data-reveal` rises in when it scrolls into view (`--i` staggers siblings; the CSS does the moving);
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

  return null;
}
