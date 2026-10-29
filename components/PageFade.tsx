"use client";

import { useState } from "react";

let shown = false;

/** Each page fades in when the visitor moves to it inside the site, not on the first load (the hero has its own
 *  entrance). Opacity only: a transform here would pin Lucy and the scroll cue, which are fixed, to this box. */
export function PageFade({ children }: { children: React.ReactNode }) {
  // only the browser counts pages: the static build renders every page in one process
  const [fade] = useState(() => { if (typeof window === "undefined") return false; const was = shown; shown = true; return was; });
  return <div className={fade ? "page-in" : undefined}>{children}</div>;
}
