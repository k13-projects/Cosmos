#!/usr/bin/env bash
# Build web assets from the client-supplied brand library into public/.
#
# Source:  Cosmos Assets/   (gitignored, ~70MB, client design source)
# Output:  public/photos, public/menu/best-sellers, public/menu/plates,
#          public/menu/items, public/menu/cosmos-menu.{png,webp},
#          public/brand   (committed)
#
# Idempotent, safe to re-run. Requires macOS `sips`, `cwebp` (brew install
# webp) and python3 with Pillow.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/Cosmos Assets"
PUB="$ROOT/public"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [ ! -d "$SRC" ]; then
  echo "ERROR: brand asset library not found at:"
  echo "  $SRC"
  echo "It is gitignored by design, ask the owner for it."
  exit 1
fi
command -v cwebp >/dev/null || { echo "ERROR: cwebp not found. brew install webp"; exit 1; }
command -v sips >/dev/null || { echo "ERROR: sips not found (macOS only)."; exit 1; }
python3 -c "import PIL" 2>/dev/null || { echo "ERROR: python3 Pillow not found. pip3 install Pillow"; exit 1; }

mkdir -p "$PUB/photos" "$PUB/menu/best-sellers" "$PUB/menu/plates" "$PUB/menu/items" "$PUB/brand"

# --------------------------------------------------------------------------- #
# BAND CROPS (Lessons 19: "photo bands are crops, not slots")
#
# Each band in the blueprint has its own aspect AND its own framing, and two of
# the four sources are portrait. Letting `object-cover` pick the middle of a
# 1690x2533 portrait inside a 2.06 band showed the top of a bun and nothing
# else. So the crop is baked here instead: deterministic, reviewable, and the
# component only has to hold the aspect.
#
# The boxes below were registered against the blueprint render
# (Cosmos Assets/_derived/mockup, stitched, 1332 CSS px wide) by normalised
# cross-correlation over crop width and offset. Reported NCC in the handoff:
# hero 0.929, fries 0.885, phone 0.998.
#
# `cosmos 2-121.jpg` is the exception. The blueprint's chicken band was cut
# from a WIDER original than the file we hold: the sandwich is ~28% of the
# band's width there and ~41% of this file's width, so their crop runs about
# 380px past each edge of ours. We cannot reproduce it pixel for pixel. The box
# below reproduces its framing instead, at its exact aspect: the whole sandwich
# centred, a fries bowl cut at each edge, the plate rim just inside the bottom.
# The hot dog behind is outside what this file can show at 2.06.
#
# usage: crop_photo <src> <out-name> <left> <top> <right> <bottom> <max-width>
crop_photo() {
  local src="$SRC/PHOTOS/$1" out="$2"
  if [ ! -f "$src" ]; then
    echo "  ERROR: photo source not found: PHOTOS/$1" >&2
    exit 1
  fi
  python3 - "$src" "$TMP/band.png" "$3" "$4" "$5" "$6" "$7" <<'PY'
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
left, top, right, bottom, max_w = (int(v) for v in sys.argv[3:8])
im = Image.open(src).convert("RGB")
if right > im.width or bottom > im.height or left < 0 or top < 0:
    raise SystemExit(f"ERROR: crop box {(left, top, right, bottom)} outside {im.size} for {src}")
im = im.crop((left, top, right, bottom))
# Never upscale: a band that is softer than its box is a resolution note in the
# handoff, an invented one is a lie about the source.
if im.width > max_w:
    im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
im.save(out)
print(f"    crop {right - left}x{bottom - top} -> {im.width}x{im.height}, aspect {im.width / im.height:.4f}")
PY
  cwebp -q 86 -m 6 -quiet "$TMP/band.png" -o "$PUB/photos/$out.webp"
  echo "  photos/$out.webp"
}

echo "==> photos (band crops reproduce the blueprint's own framing)"
# Hero: stacked burgers under string lights. Blueprint aspect 1332:1051 = 1.2674
crop_photo "cosmos 1-84.jpg" hero 360 140 1885 1343 2000
# Fries bowls, top-down, band under Best Sellers. Blueprint 1332:618 = 2.1553
crop_photo "Chick fries,cosmos,truffle,monkey.jpg" band-fries 0 192 2048 1142 2000
# Chicken sandwich, band above Reviews. Blueprint 1332:647 = 2.0587
crop_photo "cosmos 2-121.jpg" band-chicken 0 1250 1690 2071 2000
# Phone photographing a burger, band above footer. Blueprint 1332:821 = 1.6224
crop_photo "cosmos 1-64.jpg" band-phone 0 615 1510 1546 2000

# Cosmos General.png is a CUTOUT, not a scene. Its alpha channel is the shape
# of the table's back edge, with the rearmost plates rising above it, because
# the blueprint lays it on the bottom of the purple pattern band and lets the
# pattern fill that wedge. Matting it onto a ground destroys the whole point, so
# it is exported WITH alpha and only resized. cwebp keeps the alpha channel.
#
# Lorena's `additional photo.png` (LORENA UPDATE 2026-09-02/) is the same
# cutout, same size (2528x1686) and same alpha bbox as PHOTOS/Cosmos
# General.png, verified by pixel diff: the two differ ONLY in a 470x230px
# patch at the bottom right, where Cosmos General.png carries a small sparkle
# artifact baked into the wood grain (looks like a watermark, not food) that
# additional photo.png does not have. That is a meaningful difference on a
# product photo, so the clean one wins.
GENERAL_SRC="$SRC/LORENA UPDATE 2026-09-02/additional photo.png"
if [ ! -f "$GENERAL_SRC" ]; then
  echo "  ERROR: photo source not found: LORENA UPDATE 2026-09-02/additional photo.png" >&2
  exit 1
fi
cp "$GENERAL_SRC" "$TMP/spread.png"
sips -Z 2000 "$TMP/spread.png" >/dev/null
cwebp -q 84 -alpha_q 100 -m 6 -quiet "$TMP/spread.png" -o "$PUB/photos/spread.webp"
rm -f "$PUB/photos/band-spread.webp" # superseded by the cutout above
echo "  photos/spread.webp"

# Trim a transparent PNG to its alpha bounding box (padded 4% each side) and
# cap the output width at 1200px. Keeps the cutout's own alpha intact.
trim_png() {
  local src="$1" out="$2" max_w="${3:-1200}"
  python3 - "$src" "$out" "$max_w" <<'PY'
import sys
from PIL import Image
src, out, max_w = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert("RGBA")
bbox = im.getchannel("A").getbbox()
if bbox is None:
    raise SystemExit(f"ERROR: {src} has no visible alpha content")
l, t, r, b = bbox
w, h = r - l, b - t
pad_x, pad_y = round(w * 0.04), round(h * 0.04)
l = max(0, l - pad_x)
t = max(0, t - pad_y)
r = min(im.width, r + pad_x)
b = min(im.height, b + pad_y)
im = im.crop((l, t, r, b))
if im.width > max_w:
    ratio = max_w / im.width
    im = im.resize((max_w, round(im.height * ratio)), Image.LANCZOS)
im.save(out)
PY
}

echo "==> best sellers (trimmed to alpha bbox, capped 1200w)"
declare -a BS=(
  "SPICY JAM.png:spicy-jam"
  "BLUE CHEESE.png:blue-cheese"
  "MONKEY FRIES.png:monkey-fries"
  "THE CHICKS.png:the-chicks"
  "COSMOS BURGER.png:cosmos-burger"
)
for pair in "${BS[@]}"; do
  f="${pair%%:*}"; out="${pair##*:}"
  src="$SRC/PHOTOS/Best Sellers/$f"
  if [ ! -f "$src" ]; then
    echo "  ERROR: best-seller source not found: PHOTOS/Best Sellers/$f" >&2
    exit 1
  fi
  trim_png "$src" "$PUB/menu/best-sellers/$out.png"
  echo "  menu/best-sellers/$out.png"
done

echo "==> plates (Burgers circle, trimmed to alpha bbox, capped 1200w)"
for i in 1 2 3 4 5 6; do
  src="$SRC/PHOTOS/Burgers circle/$i.png"
  if [ ! -f "$src" ]; then
    echo "  ERROR: plate source not found: PHOTOS/Burgers circle/$i.png" >&2
    exit 1
  fi
  trim_png "$src" "$PUB/menu/plates/$i.png"
  echo "  menu/plates/$i.png"
done

echo "==> menu items (Kazim, 2026-09-02: old-site product shots, one per menuPopup item)"
# Source: Cosmos Assets/OLD SITE MENU/<category>__<Item-Name>.webp|png, white-background
# product shots ~1000px wide, captured from burgerscosmos.com 2026-09-02. slug =
# lowercase of the <Item-Name> part (hyphens kept as the filename already words them),
# e.g. "burgers__BBQ-Burger.webp" -> "bbq-burger.webp". 640w q82, PNG sources go through
# sips first (same pattern as the pattern.png step below), webp sources are decoded with
# dwebp first since cwebp's own encoder does not read webp back in.
ITEMS_SRC="$SRC/OLD SITE MENU"
if [ ! -d "$ITEMS_SRC" ]; then
  echo "  ERROR: menu item source not found: OLD SITE MENU/" >&2
  exit 1
fi
command -v dwebp >/dev/null || { echo "ERROR: dwebp not found. brew install webp"; exit 1; }
ITEM_COUNT=0
for src in "$ITEMS_SRC"/*; do
  [ -f "$src" ] || continue
  base="$(basename "$src")"
  ext="${base##*.}"
  ext_lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
  slug="$(echo "${base#*__}" | sed -E "s/\.[^.]+$//" | tr '[:upper:]' '[:lower:]')"

  work="$TMP/item.png"
  if [ "$ext_lower" = "png" ]; then
    cp "$src" "$work"
  else
    dwebp -quiet "$src" -o "$work"
  fi
  sips -Z 640 "$work" >/dev/null
  cwebp -q 82 -quiet "$work" -o "$PUB/menu/items/$slug.webp"
  rm -f "$work"
  ITEM_COUNT=$((ITEM_COUNT + 1))
  echo "  menu/items/$slug.webp"
done
echo "  ($ITEM_COUNT item photos)"

echo "==> BBQ Burger photo (Lorena, BBQ UPDATED.png, 2026-09-02, replaces menu/items/bbq-burger.webp)"
# Trim to the alpha bbox first (a real cutout would have transparent padding
# to drop; this source's alpha channel is fully opaque edge to edge, so this
# is a documented no-op, not a skipped step) then flatten onto white to match
# every other item shot in menu/items, which are white-background product
# photos, not cutouts.
BBQ_SRC="$SRC/LORENA UPDATE 2026-09-02/BBQ UPDATED.png"
if [ ! -f "$BBQ_SRC" ]; then
  echo "  ERROR: photo source not found: LORENA UPDATE 2026-09-02/BBQ UPDATED.png" >&2
  exit 1
fi
python3 - "$BBQ_SRC" "$TMP/bbq.png" <<'PY'
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
bbox = im.getchannel("A").getbbox()
if bbox is None:
    raise SystemExit(f"ERROR: {src} has no visible alpha content")
im = im.crop(bbox)
bg = Image.new("RGB", im.size, (255, 255, 255))
bg.paste(im, mask=im.getchannel("A"))
bg.save(out)
PY
sips -Z 640 "$TMP/bbq.png" >/dev/null
cwebp -q 82 -quiet "$TMP/bbq.png" -o "$PUB/menu/items/bbq-burger.webp"
echo "  menu/items/bbq-burger.webp"

echo "==> printed menu (Lorena, COSMOS MENU.png, 2026-09-02, 2000w)"
# The menu pop-up's "View the printed menu" link opens this PNG in a new tab
# to be read or printed, so PNG is the actual link target (universal
# right-click save/print support). A webp copy sits alongside for a future
# inline thumbnail; nothing links to it today.
MENU_IMG_SRC="$SRC/LORENA UPDATE 2026-09-02/COSMOS MENU.png"
if [ ! -f "$MENU_IMG_SRC" ]; then
  echo "  ERROR: photo source not found: LORENA UPDATE 2026-09-02/COSMOS MENU.png" >&2
  exit 1
fi
cp "$MENU_IMG_SRC" "$TMP/menu.png"
sips -Z 2000 "$TMP/menu.png" >/dev/null
cp "$TMP/menu.png" "$PUB/menu/cosmos-menu.png"
cwebp -q 86 -m 6 -quiet "$TMP/menu.png" -o "$PUB/menu/cosmos-menu.webp"
echo "  menu/cosmos-menu.png"
echo "  menu/cosmos-menu.webp"

echo "==> brand"
LOGO_SRC="$SRC/LOGO & BRAND IDENTITY/COSMOS BURGER LOGO.svg"
if [ ! -f "$LOGO_SRC" ]; then
  echo "  ERROR: logo source not found: LOGO & BRAND IDENTITY/COSMOS BURGER LOGO.svg" >&2
  exit 1
fi
cp "$LOGO_SRC" "$PUB/brand/logo.svg"
echo "  brand/logo.svg"

PATTERN_SRC="$SRC/LOGO & BRAND IDENTITY/Background.png"
if [ ! -f "$PATTERN_SRC" ]; then
  echo "  ERROR: pattern source not found: LOGO & BRAND IDENTITY/Background.png" >&2
  exit 1
fi
cp "$PATTERN_SRC" "$TMP/pattern.png"
sips -Z 1400 "$TMP/pattern.png" >/dev/null
cp "$TMP/pattern.png" "$PUB/brand/pattern.png"
echo "  brand/pattern.png"

echo
echo "Done. $(find "$PUB/photos" "$PUB/menu" "$PUB/brand" -type f | wc -l | tr -d ' ') files in public/."
