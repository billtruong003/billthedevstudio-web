"use client";

import { motion, useInView } from "framer-motion";
import { useLite } from "./motion";
import { useEffect, useId, useRef, useState } from "react";

// The fox mark as parts, so the shades can do the slogan: they drop on when the fox comes into view
// ("Shades on."), then a glint crosses the lenses now and then. Nothing pulses.
const HEAD = "M120 206 Q100 192 74 168 Q46 146 28 120 Q40 112 46 106 L54 30 Q56 22 64 28 L104 72 Q120 66 136 72 L176 28 Q184 22 186 30 L194 106 Q200 112 212 120 Q194 146 166 168 Q140 192 120 206 Z";
const EARS = "M62 44 L66 88 L94 74 Z M178 44 L174 88 L146 74 Z";
const MUZZLE = "M28 120 Q56 126 78 128 Q100 140 120 160 Q140 140 162 128 Q184 126 212 120 Q194 146 166 168 Q140 192 120 206 Q100 192 74 168 Q46 146 28 120 Z";
const NOSE = "M110 196 Q120 188 130 196 Q126 206 120 208 Q114 206 110 196 Z";
const SHADES = "M46 106 H108 Q114 106 116 112 H124 Q126 106 132 106 H194 Q198 106 197 112 L190 138 Q187 148 176 148 H142 Q133 148 131 140 L127 122 H113 L109 140 Q107 148 98 148 H64 Q53 148 50 138 L43 112 Q42 106 46 106 Z";
const SHINE = "M70 112 L82 112 L66 144 L56 144 Z M88 112 L94 112 L80 144 L74 144 Z M152 112 L164 112 L148 144 L138 144 Z M170 112 L176 112 L162 144 L156 144 Z";

export function Fox({ className, label = "The Bill The Dev fox, in shades" }: { className?: string; label?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useLite();
  const clip = useId().replace(/:/g, "");
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!reduce && !seen) setArmed(true); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const on = !armed || seen;
  return (
    <svg ref={ref} viewBox="0 0 240 240" role="img" aria-label={label} className={className}>
      <path d={HEAD} fill="#FFB84D" />
      <path d={EARS} fill="#E8892A" />
      <path d={MUZZLE} fill="#FFF4E2" />
      <path d={NOSE} fill="#141414" />
      <motion.g initial={false} animate={on ? { y: 0, rotate: 0, opacity: 1 } : { y: -70, rotate: -8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 16, delay: reduce ? 0 : 0.15 }} style={{ originX: "120px", originY: "126px" }}>
        <path d={SHADES} fill="#141414" />
        <path d={SHINE} fill="#FFB84D" opacity={0.9} />
        <clipPath id={clip}><path d={SHADES} /></clipPath>
        {!reduce && (
          <g clipPath={`url(#${clip})`}>
            <rect x="-60" y="96" width="34" height="64" fill="#FFFFFF" opacity="0.55" transform="skewX(-20)" className="fox-glint" />
          </g>
        )}
      </motion.g>
    </svg>
  );
}
