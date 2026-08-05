#!/usr/bin/env python3
"""
A Builder Hut — media pipeline.

Turns the raw phone photos and videos supplied by the gym into web-ready assets in
`public/media/`, with semantic filenames that say what each asset IS rather than what
the camera called it.

Why each step exists
--------------------
* **Videos are re-encoded to H.264.** Three of the supplied clips are VP9 inside an MP4
  container. Chrome plays that; Safari does not, on any platform. Left alone, every
  iPhone visitor would get a black rectangle where the hero video should be.
* **Audio is stripped.** The hero and section videos loop silently, so the audio track is
  pure wasted bytes — and a muted autoplay video with an audio track is also more likely
  to be blocked by browser autoplay heuristics.
* **`faststart`** moves the MP4 index to the front of the file so playback can begin
  before the whole file has downloaded. Without it a 3 MB hero video shows nothing until
  it is fully transferred.
* **Posters are extracted** so `<video poster>` paints a real frame immediately. This is
  what the browser measures for Largest Contentful Paint — without it the hero LCP is
  whatever the video decoder eventually produces.
* **The long walkthrough is cut into three segments.** It contains a satellite zoom to the
  location, an interior walk, and a logo reveal. Those belong in three different places on
  the site, so they are cut once here rather than seeking in the browser.
* **Photos are capped at 2000px** and stripped of EXIF. `next/image` resizes down from the
  source, so anything larger is build-time cost with no visual gain, and phone EXIF
  carries GPS coordinates that should not ship to the public.

Requires: ffmpeg, ffprobe, Pillow.
Usage:    python3 tools/process-media.py /path/to/extracted/assets
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "media"

PHOTO_MAX_EDGE = 2000
PHOTO_QUALITY = 82


# ─────────────────────────────────────────────────────────────────────────────
# Asset map.
#
# Every entry is a deliberate decision about where an asset belongs, made by
# looking at the content of the file. `role` is what the site uses it for.
# ─────────────────────────────────────────────────────────────────────────────

PHOTOS: list[tuple[str, str, str, str]] = [
    # (source folder, source file, output path under public/media, role)
    ("A_BUILDER_HUT_", "IMG_20260805_123707.jpg", "branches/batanagar/floor-wide.jpg", "hero"),
    ("A_BUILDER_HUT_", "IMG_20260805_123734.jpg", "branches/batanagar/floor-cardio.jpg", "gallery"),
    ("A_BUILDER_HUT_", "IMG_20260805_123757.jpg", "branches/batanagar/signage-pillar.jpg", "gallery"),
    ("A_BUILDER_HUT_", "IMG_20260805_123847.jpg", "branches/batanagar/barbell-detail.jpg", "texture"),
    ("A_BUILDER_HUT_", "IMG_20260805_123914.jpg", "branches/batanagar/dumbbell-rack.jpg", "gallery"),
    ("A_BUILDER_HUT_", "IMG_20260805_123934.jpg", "branches/batanagar/reception-neon.jpg", "feature"),
    ("A_Builder_hut_Club", "IMG_20260805_142907.jpg", "branches/chandannagar-club/gaming-lounge.jpg", "feature"),
    ("A_Builder_hut_Club", "IMG_20260805_142935.jpg", "branches/chandannagar-club/floor-wide.jpg", "hero"),
    ("A_Builder_hut_Club", "IMG_20260805_143005.jpg", "branches/chandannagar-club/floor-cafe.jpg", "gallery"),
    ("A_Builder_hut_Club", "IMG_20260805_143027.jpg", "branches/chandannagar-club/floor-cardio.jpg", "gallery"),
    ("A_Builder_hut_Club", "IMG_20260805_143058.jpg", "branches/chandannagar-club/strength-floor.jpg", "gallery"),
    ("A_Builder_hut_Club", "IMG_20260805_143316_047.jpg", "branches/chandannagar-club/member-training.jpg", "feature"),
    ("A_Builder_hut_3", "IMG_20260805_141230.jpg", "branches/budge-budge-3-0/floor-wide.jpg", "hero"),
    ("A_Builder_hut_3", "IMG_20260805_141254.jpg", "branches/budge-budge-3-0/viva-dumbbells.jpg", "texture"),
    ("A_Builder_hut_3", "IMG_20260805_141402.jpg", "branches/budge-budge-3-0/reception.jpg", "gallery"),
    ("A_Builder_hut_3", "IMG_20260805_141430.jpg", "branches/budge-budge-3-0/floor-member.jpg", "gallery"),
    ("A_Builder_hut_3", "IMG_20260805_141452.jpg", "branches/budge-budge-3-0/cardio-fridge.jpg", "gallery"),
    ("A_Builder_hut_3", "IMG_20260805_141554_440.jpg", "branches/budge-budge-3-0/kids-programme.jpg", "poster"),
]

LOGOS: list[tuple[str, str]] = [
    ("IMG_20260805_124812.jpg", "brand/logo-batanagar"),
    ("IMG_20260805_143241.jpg", "brand/logo-club"),
    ("IMG_20260805_141834.jpg", "brand/logo-3-0"),
]

# Landscape clips. 1280x720, the widest usable rendition from the sources.
VIDEOS_LANDSCAPE: list[tuple[str, str, str, str | None, str | None]] = [
    # (folder, file, output stem, start, duration)  — start/duration None = whole clip
    ("A_BUILDER_HUT_", "4_6025108714149645164.mp4", "branches/batanagar/hero-walkthrough", "6", "18"),
    ("A_BUILDER_HUT_", "4_6025108714149645164.mp4", "shared/location-zoom", "0", "4.5"),
    ("A_BUILDER_HUT_", "4_6025108714149645164.mp4", "brand/logo-reveal", "38.5", "4.5"),
    ("A_Builder_hut_Club", "4_6024943353613781711.mp4", "branches/chandannagar-club/hero-rig", "0", "12"),
    ("A_Builder_hut_Club", "4_6025086406089509646.mp4", "branches/chandannagar-club/reel-shoulders", "0", "12"),
]

# Portrait clips — used in the vertical reel strip and on branch cards.
# Capped at REEL_MAX_SECONDS: these loop behind other content, so a long tail is weight
# nobody sees. reel-machines is 37s at source and would otherwise ship at 11 MB.
REEL_MAX_SECONDS = "12"
REEL_CRF = 30

VIDEOS_PORTRAIT: list[tuple[str, str, str]] = [
    ("A_BUILDER_HUT_", "2_5447389609442972834.mp4", "branches/batanagar/reel-floorwork"),
    ("A_BUILDER_HUT_", "4_6024711537048947466.mp4", "branches/batanagar/reel-machines"),
    ("A_Builder_hut_3", "2_5447389609442973036.mp4", "branches/budge-budge-3-0/reel-bench"),
    ("A_Builder_hut_3", "2_5447389609442973037.mp4", "branches/budge-budge-3-0/reel-pullup"),
    ("A_Builder_hut_3", "4_6025150371037448882.mp4", "branches/budge-budge-3-0/reel-treadmill"),
]


def run(cmd: list[str]) -> None:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd[:6])}…\n{result.stderr[-800:]}")


def process_photo(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    im = im.convert("RGB")  # also drops the EXIF block, including any GPS tags
    if max(im.size) > PHOTO_MAX_EDGE:
        im.thumbnail((PHOTO_MAX_EDGE, PHOTO_MAX_EDGE), Image.LANCZOS)
    im.save(dest, "JPEG", quality=PHOTO_QUALITY, optimize=True, progressive=True)
    print(f"  photo  {dest.relative_to(OUT)}  {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")


def process_video(src: Path, stem: Path, width: int, height: int, crf: int,
                  start: str | None = None, duration: str | None = None) -> None:
    stem.parent.mkdir(parents=True, exist_ok=True)
    mp4 = stem.with_suffix(".mp4")
    poster = stem.with_suffix(".jpg")

    cmd = ["ffmpeg", "-v", "error", "-y"]
    if start:
        cmd += ["-ss", start]
    cmd += ["-i", str(src)]
    if duration:
        cmd += ["-t", duration]
    cmd += [
        # Pad rather than crop when the aspect does not match, so nothing is cut off.
        "-vf", f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
               f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:color=black",
        "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
        "-crf", str(crf), "-preset", "slow",
        "-movflags", "+faststart",
        "-an",                      # silent loop — see module docstring
        str(mp4),
    ]
    run(cmd)

    # Poster from one second in: frame zero is often a fade-from-black.
    run(["ffmpeg", "-v", "error", "-y", "-ss", "1", "-i", str(mp4),
         "-frames:v", "1", "-q:v", "4", str(poster)])

    print(f"  video  {mp4.relative_to(OUT)}  {width}x{height}  {mp4.stat().st_size // 1024} KB  (+poster)")


def key_gold(src: Path) -> Image.Image:
    """
    Lift the gold emblem off its dark photographic background.

    The mark is bright and warm; the backdrop is a dark gym interior. Keying on
    luminance alone would take the background's warm highlights too, so brightness is
    multiplied by warmth (red minus blue) — which the gold has and grey concrete does not.
    """
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    warmth = r - b
    mask = np.clip((luminance - 65) / 95, 0, 1) * np.clip((warmth - 12) / 50, 0, 1)
    alpha = Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))  # soften the key edge
    rgba = im.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def trim_alpha(im: Image.Image, pad: int = 8) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        return im
    left, top, right, bottom = box
    return im.crop((max(0, left - pad), max(0, top - pad),
                    min(im.width, right + pad), min(im.height, bottom + pad)))


def process_brand(uploads: Path) -> None:
    """Transparent logos, plus the mascot sprite sliced into animatable layers."""
    (OUT / "brand").mkdir(parents=True, exist_ok=True)

    for filename, out_stem in LOGOS:
        src = uploads / filename
        if not src.exists():
            print(f"  skip   {filename} (not supplied)")
            continue
        keyed = key_gold(src)
        full = trim_alpha(keyed)
        full = full.resize((full.width * 2, full.height * 2), Image.LANCZOS)
        dest = OUT / f"{out_stem}.png"
        full.save(dest, "PNG", optimize=True)
        print(f"  logo   {dest.relative_to(OUT)}  {full.width}x{full.height}  {dest.stat().st_size // 1024} KB")

    # ── Mascot ───────────────────────────────────────────────────────────────
    # The emblem sits above the wordmark. Cropping to the figure alone gives the mark
    # used in the header and as the favicon source.
    src = uploads / LOGOS[0][0]
    if not src.exists():
        return
    keyed = key_gold(src)
    w, h = keyed.size
    emblem = trim_alpha(keyed.crop((0, int(h * 0.16), w, int(h * 0.53))))
    scale = 3
    emblem = emblem.resize((emblem.width * scale, emblem.height * scale), Image.LANCZOS)
    emblem.save(OUT / "brand/mascot.png", "PNG", optimize=True)
    print(f"  mascot brand/mascot.png  {emblem.width}x{emblem.height}")

    # The emblem is no longer sliced into animatable layers: the mascot is a rigged
    # procedural figure now, not a 2.5D sprite, so those slices were dead weight.


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    source = Path(sys.argv[1]).resolve()
    uploads = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else source

    if not shutil.which("ffmpeg"):
        print("ffmpeg is required and was not found on PATH.")
        return 1

    OUT.mkdir(parents=True, exist_ok=True)

    print("\nPhotos")
    for folder, filename, out_rel, _role in PHOTOS:
        src = source / folder / filename
        if src.exists():
            process_photo(src, OUT / out_rel)
        else:
            print(f"  skip   {folder}/{filename} (not supplied)")

    print("\nLandscape video")
    for folder, filename, stem, start, duration in VIDEOS_LANDSCAPE:
        src = source / folder / filename
        if src.exists():
            process_video(src, OUT / stem, 1280, 720, 25, start, duration)
        else:
            print(f"  skip   {folder}/{filename} (not supplied)")

    print("\nPortrait video")
    for folder, filename, stem in VIDEOS_PORTRAIT:
        src = source / folder / filename
        if src.exists():
            process_video(src, OUT / stem, 720, 1280, REEL_CRF, "0", REEL_MAX_SECONDS)
        else:
            print(f"  skip   {folder}/{filename} (not supplied)")

    print("\nBrand")
    process_brand(uploads)

    total = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    count = sum(1 for p in OUT.rglob("*") if p.is_file())
    print(f"\n{count} files, {total / 1048576:.1f} MB total in public/media/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
