import { siFacebook, siGithub, siLinkedin, siTiktok, siYoutube } from "simple-icons";
import { SOCIAL } from "@/content/studio";

/** Brand marks from simple-icons (CC0), keyed by the names in SOCIAL. */
const MARK: Record<string, string> = {
  Facebook: siFacebook.path, YouTube: siYoutube.path, TikTok: siTiktok.path, GitHub: siGithub.path, LinkedIn: siLinkedin.path,
};

export function BrandMark({ name, size = 22 }: { name: string; size?: number }) {
  const d = MARK[name];
  return d ? <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d={d} /></svg> : null;
}

/** "Follow us on" + the studio's channels as plain marks (no circles), each a 44px tap target. */
export function FollowRow({ label, only = ["Facebook", "YouTube", "TikTok"], className = "" }: { label: string; only?: string[]; className?: string }) {
  const items = SOCIAL.filter((s) => only.includes(s.name));
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="mr-1.5 text-[15px] font-bold text-faint">{label}</span>
      {items.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener" aria-label={s.name} title={s.name}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] text-soft transition-colors hover:bg-white/[0.06] hover:text-white">
          <BrandMark name={s.name} />
        </a>
      ))}
    </div>
  );
}
