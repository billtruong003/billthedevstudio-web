import clsx from "clsx";
import { asset, PLAY_URL, SITE } from "@/lib/site";
import { Fox } from "./Fox";
import { Icon } from "./icons";

export function Container({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("mx-auto w-full max-w-site px-4 sm:px-8 lg:px-10", className)} {...rest}>{children}</div>;
}

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("m-0 text-[15px] font-bold text-label", className)}>{children}</p>;
}

type ButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "amber" | "outline" | "dark"; size?: "md" | "lg"; icon?: boolean };

export function Button({ variant = "amber", size = "md", icon, className, children, ...rest }: ButtonProps) {
  return (
    <a
      className={clsx(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap no-underline transition-[transform,filter,border-color] duration-100 active:scale-[0.97]",
        size === "lg" ? "min-h-[54px] text-[18px]" : "min-h-[48px] text-[17px]",
        variant === "amber" && "on-amber rounded-full bg-amber px-7 font-black hover:brightness-105",
        variant === "outline" && "rounded-[10px] border-[1.5px] border-line3 px-5 font-bold text-white hover:border-amber hover:text-white",
        variant === "dark" && "rounded-full bg-ink px-6 font-bold text-white",
        className,
      )}
      {...rest}
    >
      {icon && <Icon name="play" size={14} stroke={0} className="fill-current" />}
      {children}
    </a>
  );
}

/** Stand-in drawn to the layout of Google's badge; swap for the official artwork before launch.
 *  While a game is still in closed testing its store page is a 404 for the public, so the badge says
 *  "coming soon" and opens an email to ask for a place in the test instead. */
export function PlayBadge({ pkg, live = false, name = "", height = 48, className }: { pkg: string; live?: boolean; name?: string; height?: number; className?: string }) {
  const logo = Math.round(height * 0.42);
  return (
    <a
      href={live ? PLAY_URL(pkg) : `mailto:${SITE.email}?subject=${encodeURIComponent(`${name} test`.trim())}`}
      aria-label={live ? "Get it on Google Play" : `${name} is coming soon to Google Play. Email the studio to join the test`}
      className={clsx("inline-flex flex-none items-center rounded-[10px] border border-[#A6A6A6] bg-black text-white no-underline", className)}
      style={{ height, gap: height * 0.18, padding: `0 ${height * 0.3}px 0 ${height * 0.24}px`, fontFamily: "system-ui, 'Segoe UI', sans-serif" }}
    >
      <svg width={logo} height={Math.round((logo * 29) / 26)} viewBox="0 0 26 29" aria-hidden="true">
        <polygon points="0,0 13,14.5 0,29" fill="#00C3FF" />
        <polygon points="0,0 18.5,10 13,14.5" fill="#00E676" />
        <polygon points="0,29 13,14.5 18.5,19" fill="#FF3A44" />
        <polygon points="18.5,10 26,14.5 18.5,19 13,14.5" fill="#FFD500" />
      </svg>
      <span className="flex flex-col text-left leading-none" style={{ gap: height * 0.04 }}>
        <span style={{ fontSize: Math.round(height * 0.17), letterSpacing: "0.06em" }}>{live ? "GET IT ON" : "COMING SOON TO"}</span>
        <span className="whitespace-nowrap font-medium" style={{ fontSize: Math.round(height * 0.36), letterSpacing: "-0.01em" }}>Google Play</span>
      </span>
    </a>
  );
}

export function YouTubeMark({ width = 34 }: { width?: number }) {
  return (
    <svg width={width} height={Math.round((width * 48) / 68)} viewBox="0 0 68 48" aria-hidden="true">
      <path d="M66.5 7.7c-.8-2.9-3-5.2-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4c-3 .8-5.2 3.1-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3c.8 2.9 3 5.2 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4c3-.8 5.2-3.1 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="#FF0000" />
      <path d="M27 34l18-10-18-10z" fill="#FFFFFF" />
    </svg>
  );
}

/** The fox on a dark disc with an amber ring: never on amber, where its ears and face disappear. */
export function FoxMedallion({ className, cutout = false }: { className?: string; cutout?: boolean }) {
  return (
    <div className={clsx("flex aspect-square items-center justify-center rounded-full border-[3px] border-amber bg-disc",
      cutout ? "shadow-[0_0_0_8px_rgb(var(--c-base)),0_0_0_18px_rgba(255,184,77,.12)]" : "shadow-[0_0_0_14px_rgba(255,184,77,.10),0_0_0_28px_rgba(255,184,77,.04)]", className)}>
      <Fox className="w-[68%]" />
    </div>
  );
}

/** A link in running copy: text colour, amber underline. */
export function TextLink({ className, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={clsx("font-bold text-white underline decoration-amber/60 underline-offset-4 hover:text-amber", className)} {...rest}>{children}</a>;
}

/** Section titles: one size per role. */
export const T = {
  hero: "m-0 font-black leading-[0.9] tracking-[-0.025em] text-[clamp(54px,7.8vw,128px)]",
  h1: "m-0 font-black leading-[0.95] tracking-[-0.02em] text-[clamp(44px,6vw,84px)]",
  h2: "m-0 font-black leading-none tracking-[-0.01em] text-[clamp(32px,4.6vw,60px)]",
  h3: "m-0 font-black leading-[1.05] text-[clamp(26px,2.6vw,32px)]",
  item: "m-0 font-black leading-[1.05] text-[28px]",
  lead: "m-0 text-[19px] leading-relaxed text-soft",
  body: "m-0 text-[17px] leading-relaxed text-soft",
  small: "m-0 text-[15px] leading-normal text-muted",
  meta: "text-[14px] font-bold text-faint",
};

export function Slogan({ className }: { className?: string }) {
  return <b className={className}>Shades on. <span className="text-amber">Ship it.</span></b>;
}
