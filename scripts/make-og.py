#!/usr/bin/env python3
"""Build app/opengraph-image.png, the 1200x630 social card.

The hero photograph, darkened toward the brand purple, with the Cosmos wordmark
in the brand yellow over it. Reproducible on purpose: the card is derived from
committed assets rather than hand-composed, so a new hero photo or a new logo
is one re-run away.

    python3 scripts/make-og.py

Inputs   public/photos/hero.webp, public/brand/logo.svg (path .st0)
Output   app/opengraph-image.png  (Next.js picks this up by file convention)
Requires python3 with Pillow. The SVG is rasterised through macOS `qlmanage`,
which is already a dependency of scripts/build-assets.sh.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
HERO = ROOT / "public" / "photos" / "hero.webp"
LOGO = ROOT / "public" / "brand" / "logo.svg"
OUT = ROOT / "app" / "opengraph-image.png"

W, H = 1200, 630
PURPLE = (117, 16, 128)
YELLOW = "#FAF00C"
LOGO_VIEW_BOX = "20 314 1042 452"  # ink bbox of .st0, see lib/logo.ts


def render_logo(width: int) -> Image.Image:
    """Rasterise the wordmark alone, in brand yellow, on transparency."""
    d = re.search(r'<path class="st0" d="([^"]+)"', LOGO.read_text()).group(1)
    height = round(width * 452 / 1042)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{LOGO_VIEW_BOX}" '
        f'width="{width}" height="{height}">'
        f'<path d="{d}" fill="{YELLOW}" fill-rule="evenodd"/></svg>'
    )
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "logo.svg"
        src.write_text(svg)
        subprocess.run(
            ["qlmanage", "-t", "-s", str(width), "-o", tmp, str(src)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        png = Path(tmp) / "logo.svg.png"
        if not png.exists():
            sys.exit("ERROR: qlmanage did not rasterise the logo")
        raw = Image.open(png).convert("RGBA")

    # qlmanage renders onto white. Rebuild the alpha from it: the artwork is a
    # single flat colour, so anything not white is ink.
    px = raw.load()
    for y in range(raw.height):
        for x in range(raw.width):
            r, g, b, _ = px[x, y]
            if r > 245 and g > 245 and b > 235:
                px[x, y] = (0, 0, 0, 0)
    return raw.resize((width, height), Image.LANCZOS)


def main() -> None:
    for path in (HERO, LOGO):
        if not path.exists():
            sys.exit(f"ERROR: missing {path.relative_to(ROOT)}; run scripts/build-assets.sh first")

    hero = Image.open(HERO).convert("RGB")
    # Cover-crop to 1200x630.
    scale = max(W / hero.width, H / hero.height)
    hero = hero.resize((round(hero.width * scale), round(hero.height * scale)), Image.LANCZOS)
    left = (hero.width - W) // 2
    top = (hero.height - H) // 2
    card = hero.crop((left, top, left + W, top + H)).convert("RGBA")

    # Purple veil, so the yellow wordmark holds contrast over the burgers.
    card.alpha_composite(Image.new("RGBA", (W, H), PURPLE + (140,)))

    logo = render_logo(760)
    card.alpha_composite(logo, ((W - logo.width) // 2, (H - logo.height) // 2))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    card.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"  {OUT.relative_to(ROOT)}  {W}x{H}")


if __name__ == "__main__":
    main()
