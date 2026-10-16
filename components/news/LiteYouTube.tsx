"use client";

import { useState } from "react";
import { YouTubeMark } from "../ui";

/** A YouTube video that loads nothing from YouTube until it is pressed (youtube-nocookie); the poster is our own image. */
export function LiteYouTube({ id, poster, caption, label }: { id: string; poster?: string; caption?: string; label?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="relative aspect-video overflow-hidden rounded-[22px] border border-line bg-black">
        {play ? (
          <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={label || caption || "Video"}
            allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlay(true)} aria-label={`Play: ${label || caption || "video"}`} className="group block h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {poster && <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 group-hover:opacity-100" />}
            <span className="absolute inset-0 flex items-center justify-center"><YouTubeMark width={68} /></span>
          </button>
        )}
      </div>
      {caption && <figcaption className="text-[15px] text-muted">{caption}</figcaption>}
    </figure>
  );
}
