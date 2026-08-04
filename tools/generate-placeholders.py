#!/usr/bin/env python3
"""
Generates the branded placeholder artwork that ships with this repo.

Why placeholders at all: A Builder Hut's own photographs, logo and Instagram posts are
the gym's copyright (and Instagram/Facebook terms forbid redistributing them), so they
are not bundled here. Every image below is original artwork drawn from the site's own
palette, sized exactly like the real asset it stands in for — so replacing one is a
same-name, same-dimensions drop-in with no layout shift.

Run it only if you want to regenerate the art:
    python3 tools/generate-placeholders.py

Requires Pillow (`pip install Pillow`). Not part of the build; the output is committed.
See public/images/ASSETS.md for what to replace each file with.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

INK = (8, 7, 10)
BLOOD = (225, 27, 34)
BULLION = (201, 162, 39)
GILT = (243, 218, 149)
CHALK = (245, 242, 237)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
MONO_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def radial_glow(size: tuple[int, int], center: tuple[float, float], radius: float, colour: tuple[int, int, int], strength: float) -> Image.Image:
    """A soft coloured bloom, built at 1/8 scale then upsampled — fast and smooth."""
    w, h = size
    small = Image.new("L", (w // 8, h // 8), 0)
    draw = ImageDraw.Draw(small)
    cx, cy = center[0] / 8, center[1] / 8
    r = radius / 8
    steps = 34
    for i in range(steps, 0, -1):
        factor = i / steps
        alpha = int(255 * strength * (1 - factor) ** 2)
        draw.ellipse([cx - r * factor, cy - r * factor, cx + r * factor, cy + r * factor], fill=alpha)
    small = small.filter(ImageFilter.GaussianBlur(radius=r / 6))
    mask = small.resize((w, h), Image.LANCZOS)
    layer = Image.new("RGB", (w, h), colour)
    out = Image.new("RGB", (w, h), INK)
    out.paste(layer, (0, 0), mask)
    return out


def base_canvas(w: int, h: int) -> Image.Image:
    canvas = Image.new("RGB", (w, h), INK)
    canvas = Image.blend(canvas, radial_glow((w, h), (w * 0.24, h * 0.22), max(w, h) * 0.75, BLOOD, 0.55), 0.85)
    canvas = Image.blend(canvas, radial_glow((w, h), (w * 0.82, h * 0.86), max(w, h) * 0.6, BULLION, 0.4), 0.5)
    return canvas


def draw_plate_rings(draw: ImageDraw.ImageDraw, cx: float, cy: float, radius: float) -> None:
    """Concentric rings — a bar loaded with plates, seen end-on."""
    for i, ratio in enumerate((1.0, 0.78, 0.56, 0.34)):
        r = radius * ratio
        colour = GILT if i == 0 else CHALK
        alpha_width = 3 if i == 0 else 2
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=colour + (0,), width=alpha_width)


def draw_roof(draw: ImageDraw.ImageDraw, cx: float, cy: float, span: float, colour) -> None:
    """The hut chevron from the logo."""
    draw.line([(cx - span, cy), (cx, cy - span * 0.55), (cx + span, cy)], fill=colour, width=4, joint="curve")


def add_noise(image: Image.Image, amount: int = 9) -> Image.Image:
    """Rolled-steel grain so flat gradients do not band on wide screens."""
    import random

    w, h = image.size
    noise = Image.new("L", (w // 2, h // 2))
    noise.putdata([random.randint(0, amount * 2) for _ in range(noise.width * noise.height)])
    noise = noise.resize((w, h), Image.BILINEAR)
    grain = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(image, Image.blend(image, grain, 0.5), 0.22)


def photo_placeholder(path: Path, title: str, subtitle: str, index: str, size=(1600, 1000)) -> None:
    w, h = size
    canvas = base_canvas(w, h)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Geometry
    draw.ellipse(
        [w * 0.62 - h * 0.42, h * 0.5 - h * 0.42, w * 0.62 + h * 0.42, h * 0.5 + h * 0.42],
        outline=BULLION + (70,),
        width=2,
    )
    draw.ellipse(
        [w * 0.62 - h * 0.3, h * 0.5 - h * 0.3, w * 0.62 + h * 0.3, h * 0.5 + h * 0.3],
        outline=CHALK + (35,),
        width=2,
    )
    draw_roof(draw, w * 0.62, h * 0.5 + h * 0.02, h * 0.2, GILT + (150,))
    draw.rectangle([w * 0.62 - h * 0.24, h * 0.53, w * 0.62 + h * 0.24, h * 0.53 + 8], fill=BLOOD + (190,))

    # Ghost index
    index_font = load_font(FONT_CANDIDATES, int(h * 0.5))
    draw.text((w * 0.05, h * 0.16), index, font=index_font, fill=CHALK + (18,))

    # Labels
    title_font = load_font(FONT_CANDIDATES, int(h * 0.075))
    sub_font = load_font(MONO_CANDIDATES, int(h * 0.028))
    draw.text((w * 0.06, h * 0.7), title.upper(), font=title_font, fill=CHALK + (235,))
    draw.text((w * 0.06, h * 0.7 + h * 0.09), subtitle.upper(), font=sub_font, fill=BULLION + (215,))

    # Self-documenting caption so nobody ships this by accident.
    caption_font = load_font(MONO_CANDIDATES, int(h * 0.022))
    caption = f"PLACEHOLDER ART — REPLACE WITH PHOTO AT {path.relative_to(PUBLIC).as_posix()}"
    draw.text((w * 0.06, h * 0.92), caption, font=caption_font, fill=CHALK + (110,))
    draw.line([(w * 0.06, h * 0.885), (w * 0.28, h * 0.885)], fill=BULLION + (200,), width=2)

    out = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    out = add_noise(out)
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"wrote {path.relative_to(ROOT)}  {w}x{h}")


def og_image(path: Path) -> None:
    w, h = 1200, 630
    canvas = base_canvas(w, h)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    draw_roof(draw, w * 0.5, h * 0.3, 110, GILT + (230,))
    draw.rectangle([w * 0.5 - 92, h * 0.33, w * 0.5 + 92, h * 0.33 + 12], fill=BLOOD + (255,))

    title_font = load_font(FONT_CANDIDATES, 78)
    sub_font = load_font(MONO_CANDIDATES, 24)
    small_font = load_font(MONO_CANDIDATES, 20)

    def centered(text, font, y, fill):
        box = draw.textbbox((0, 0), text, font=font)
        draw.text(((w - (box[2] - box[0])) / 2, y), text, font=font, fill=fill)

    centered("A BUILDER HUT", title_font, h * 0.45, CHALK + (255,))
    centered("PREMIUM 24×7 GYM · MAHESHTALA & BUDGE BUDGE", sub_font, h * 0.62, BULLION + (240,))
    centered("4.8 ★  ·  448 GOOGLE REVIEWS  ·  3 BRANCHES", small_font, h * 0.72, CHALK + (170,))

    out = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    out = add_noise(out)
    out.save(path, "JPEG", quality=90, optimize=True)
    print(f"wrote {path.relative_to(ROOT)}  {w}x{h}")


def apple_icon(path: Path) -> None:
    size = 180
    canvas = Image.new("RGBA", (size, size), INK + (255,))
    draw = ImageDraw.Draw(canvas)
    draw.line([(30, 96), (90, 52), (150, 96)], fill=BULLION + (255,), width=10, joint="curve")
    draw.rectangle([44, 112, 136, 124], fill=BLOOD + (255,))
    draw.rectangle([28, 100, 44, 136], fill=CHALK + (255,))
    draw.rectangle([136, 100, 152, 136], fill=CHALK + (255,))
    canvas.convert("RGB").save(path, "PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)}  {size}x{size}")


BRANCH_ART = [
    ("branches/batanagar.jpg", "A Builder Hut", "Batanagar · Maheshtala", "01"),
    ("branches/chandannagar-club.jpg", "A Builder Hut Club", "Chandannagar · Maheshtala", "02"),
    ("branches/budge-budge-3-0.jpg", "A Builder Hut 3.0", "Shyampur · Budge Budge", "03"),
]

# Gallery stand-ins. One per aspect ratio rather than one per photo: the masonry grid
# only needs the ratio to reserve the right box and avoid layout shift, and shipping
# three files instead of sixteen keeps the repo small. Every gallery entry in
# src/content/gallery.ts names the public page its real photo should come from.
GALLERY_ART = [
    ("gallery/placeholder-landscape.jpg", "Training Floor", "Replace · landscape 16:10", "L", (1600, 1000)),
    ("gallery/placeholder-portrait.jpg", "Equipment", "Replace · portrait 5:7", "P", (1000, 1400)),
    ("gallery/placeholder-square.jpg", "Members", "Replace · square 1:1", "S", (1200, 1200)),
]

if __name__ == "__main__":
    for rel, title, subtitle, index in BRANCH_ART:
        photo_placeholder(PUBLIC / "images" / rel, title, subtitle, index)
    for rel, title, subtitle, index, size in GALLERY_ART:
        photo_placeholder(PUBLIC / "images" / rel, title, subtitle, index, size=size)
    og_image(PUBLIC / "og.jpg")
    apple_icon(PUBLIC / "apple-icon.png")
    print("done")
