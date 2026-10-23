"""WebP copies of the game images, sized for where the site shows them (run after adding or changing an image).

The JPG/PNG originals stay: they are what link previews (og:image) and the search engines' structured data point at.
The pages show the .webp next to each one (lib/site.ts `webp()`):
  icon.*            -> icon.webp      192 px (shown at 72-96 px)
  feature.jpg       -> feature.webp   at most 1024 px wide
  shot*, cover, ... -> <name>.webp    same size, and <name>-sm.webp 360 px wide for the small home-page hero cards
Plus the Spirit Story thumbnail and L.U.C.Y's corner bubble.

    python scripts/images.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "img"
QUALITY = 80


def save(src: Path, dst: Path, width: int | None = None) -> None:
    im = Image.open(src)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=QUALITY, method=6)
    print(f"{dst.relative_to(ROOT)}  {im.width}x{im.height}  {src.stat().st_size // 1024} -> {dst.stat().st_size // 1024} KiB")


for game in sorted((ROOT / "games").iterdir()):
    for src in sorted(game.glob("*")):
        if src.suffix.lower() not in (".jpg", ".jpeg", ".png") or src.stem.endswith("-sm"):
            continue
        if src.stem == "icon":
            save(src, src.with_suffix(".webp"), 192)
        elif src.stem == "feature":
            save(src, src.with_suffix(".webp"), 1024)
        else:
            save(src, src.with_suffix(".webp"))
            save(src, src.with_name(src.stem + "-sm.webp"), 360)

save(ROOT / "collab" / "spirit-story.jpg", ROOT / "collab" / "spirit-story.webp", 240)
save(ROOT / "lucy" / "lucy-wave.webp", ROOT / "lucy" / "lucy-wave-sm.webp", 280)
