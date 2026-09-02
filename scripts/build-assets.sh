#!/usr/bin/env bash
# Build web assets from the client-supplied brand library into public/.
#
# Source:  Cosmos Assets/   (gitignored, ~70MB, client design source)
# Output:  public/photos, public/menu/best-sellers, public/menu/plates,
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

mkdir -p "$PUB/photos" "$PUB/menu/best-sellers" "$PUB/menu/plates" "$PUB/brand"

# jpeg/png -> webp at a capped width. usage: photo <src> <out-name> <max-width> <quality>
photo() {
  local src="$SRC/PHOTOS/$1" out="$2" w="$3" q="${4:-84}"
  if [ ! -f "$src" ]; then
    echo "  ERROR: photo source not found: PHOTOS/$1" >&2
    exit 1
  fi
  cp "$src" "$TMP/w.src"
  sips -Z "$w" "$TMP/w.src" >/dev/null
  cwebp -q "$q" -m 6 -quiet "$TMP/w.src" -o "$PUB/photos/$out.webp"
  echo "  photos/$out.webp"
}

echo "==> photos"
# Hero: stacked burgers under string lights
photo "cosmos 1-84.jpg" hero 2048
# Fries bowls, top-down, band under Best Sellers
photo "Chick fries,cosmos,truffle,monkey.jpg" band-fries 2048
# Chicken sandwich hero, band above Reviews
photo "cosmos 2-121.jpg" band-chicken 2048
# Phone photographing a burger, band above footer
photo "cosmos 1-64.jpg" band-phone 2048

# Cosmos General.png has alpha (a spread of plates), flatten onto the cream
# ground before encoding so it doesn't render with a transparent hole where a
# photo band expects an opaque image.
GENERAL_SRC="$SRC/PHOTOS/Cosmos General.png"
if [ ! -f "$GENERAL_SRC" ]; then
  echo "  ERROR: photo source not found: PHOTOS/Cosmos General.png" >&2
  exit 1
fi
python3 - "$GENERAL_SRC" "$TMP/general-flat.png" <<'PY'
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
bg = Image.new("RGBA", im.size, "#FFF2E1")
bg.alpha_composite(im)
bg.convert("RGB").save(out)
PY
sips -Z 2048 "$TMP/general-flat.png" >/dev/null
cwebp -q 84 -m 6 -quiet "$TMP/general-flat.png" -o "$PUB/photos/band-spread.webp"
echo "  photos/band-spread.webp"

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
