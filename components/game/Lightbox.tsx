"use client";

import { useEffect, useRef } from "react";
import { asset, webp } from "@/lib/site";
import { Icon } from "../icons";

type Props = { images: string[]; index: number; wide?: boolean; name: string; labels: { close: string; prev: string; next: string }; onIndex: (i: number) => void; onClose: () => void };

/** Full-size screenshots: arrows, Esc, and a swipe on phones. */
export function Lightbox({ images, index, wide, name, labels, onIndex, onClose }: Props) {
  const startX = useRef<number | null>(null);
  const n = images.length;
  const go = (d: number) => onIndex((index + d + n) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  return (
    <div data-lightbox role="dialog" aria-modal="true" aria-label={`${name} screenshot ${index + 1} of ${n}`} className="fixed inset-0 z-[70] flex flex-col bg-black/95 px-3 pb-5 pt-2 sm:px-6"
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}>
      <div className="flex min-h-[56px] items-center justify-between">
        <span className="pl-1 text-[18px] font-black">{index + 1} / {n}</span>
        <button type="button" aria-label={labels.close} onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#5A5A62] text-white"><Icon name="close" /></button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-6">
        <button type="button" aria-label={labels.prev} onClick={() => go(-1)} className="hidden h-14 w-14 flex-none items-center justify-center rounded-full border border-[#5A5A62] text-white sm:inline-flex"><Icon name="left" /></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(webp(images[index]))} alt={`${name} screenshot ${index + 1}`} className={wide ? "max-h-full max-w-full rounded-[18px] object-contain" : "h-full max-h-[860px] max-w-full rounded-[18px] object-contain"} />
        <button type="button" aria-label={labels.next} onClick={() => go(1)} className="hidden h-14 w-14 flex-none items-center justify-center rounded-full border border-[#5A5A62] text-white sm:inline-flex"><Icon name="right" /></button>
      </div>
      <div className="flex items-center justify-center gap-1.5 pt-4">
        {images.map((_, i) => (
          <button key={i} type="button" aria-label={`${i + 1}`} onClick={() => onIndex(i)} className="flex h-8 items-center px-0.5">
            <span className={i === index ? "block h-2 w-6 rounded-full bg-white" : "block h-2 w-2 rounded-full bg-line3"} />
          </button>
        ))}
      </div>
    </div>
  );
}
