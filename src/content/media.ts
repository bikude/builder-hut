/**
 * Media manifest.
 *
 * Every asset in `public/media/` is listed here with the job it does. Components read
 * from this file rather than hardcoding paths, so a photo can be swapped or upgraded in
 * one place and every surface that uses it follows.
 *
 * Produced by `tools/process-media.py` from the originals supplied by the gym. Re-run
 * that script after adding new footage; it re-encodes, trims, posters and renames.
 *
 * ── Known quality ceiling ───────────────────────────────────────────────────
 * Every interior photograph supplied is about 720px on its long edge — they have been
 * through messaging-app compression. That is enough for cards, tiles and split panels,
 * and NOT enough for a sharp full-bleed desktop background.
 *
 * The design works with that rather than against it: photographs are used inside
 * contained frames capped at their native width, and the full-bleed moments are carried
 * by video (720p source) and by the WebGL layer, which is resolution-independent.
 *
 * `nativeWidth` records the real ceiling for each photo. `Photo` components must not
 * request a rendered width larger than it — upscaling 720px across a 1920px viewport is
 * what makes a site look cheap.
 *
 * To lift the ceiling: ask the gym for the originals straight off the phone (typically
 * 3000–4000px), drop them into the source folder under the same names, and re-run the
 * pipeline. Nothing in the code needs to change.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type MediaRole =
  | 'hero' // full-bleed or near-full-bleed section background
  | 'feature' // a single storytelling image given real space
  | 'texture' // close-up detail, used behind or beside copy
  | 'gallery' // masonry tile
  | 'poster'; // an artwork the gym produced, shown as-is

export type Photo = {
  src: string;
  alt: string;
  role: MediaRole;
  branchSlug: string;
  /** True pixel width of the source. Never render wider than this. */
  nativeWidth: number;
  nativeHeight: number;
  /** Masonry aspect bucket. */
  ratio: 'portrait' | 'landscape' | 'square';
  /** Gallery filter category. */
  category: 'floor' | 'equipment' | 'lifestyle' | 'people' | 'brand';
};

export type Video = {
  src: string;
  poster: string;
  alt: string;
  branchSlug: string;
  orientation: 'landscape' | 'portrait';
  /** Roughly how long the trimmed loop runs, in seconds. */
  seconds: number;
  /** What this clip is for — drives where the site is allowed to place it. */
  use: 'hero' | 'section' | 'reel' | 'brand';
};

// ─────────────────────────────────────────────────────────────────────────────
// Brand
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transparent marks, keyed off the circular logo renders the gym supplied.
 * Each branch has its own lockup, and the site uses the matching one per branch.
 */
export const brand = {
  logo: {
    batanagar: '/media/brand/logo-batanagar.png',
    club: '/media/brand/logo-club.png',
    threeZero: '/media/brand/logo-3-0.png',
  },
  /**
   * The emblem alone — the winged lifter, without the wordmark.
   *
   * Used as the header mark and the favicon source. The mascot itself is no longer this
   * image: it is a rigged procedural figure in `src/components/three/mascot-rig.tsx`,
   * modelled on this artwork but free to move.
   */
  emblem: '/media/brand/mascot.png',
  /** Logo sting cut from the end of the walkthrough film — used by the preloader. */
  reveal: {
    src: '/media/brand/logo-reveal.mp4',
    poster: '/media/brand/logo-reveal.jpg',
  },
} as const;

/**
 * Satellite zoom to the gym, cut from the opening of the walkthrough film.
 * It belongs behind the branch finder, where the subject is literally location.
 */
export const locationFilm: Video = {
  src: '/media/shared/location-zoom.mp4',
  poster: '/media/shared/location-zoom.jpg',
  alt: 'Satellite view zooming in to A Builder Hut in Maheshtala',
  branchSlug: 'batanagar',
  orientation: 'landscape',
  seconds: 4.5,
  use: 'section',
};

// ─────────────────────────────────────────────────────────────────────────────
// Video
// ─────────────────────────────────────────────────────────────────────────────

export const videos: Video[] = [
  {
    src: '/media/branches/batanagar/hero-walkthrough.mp4',
    poster: '/media/branches/batanagar/hero-walkthrough.jpg',
    alt: 'Walking through the training floor at A Builder Hut, Batanagar',
    branchSlug: 'batanagar',
    orientation: 'landscape',
    seconds: 18,
    use: 'hero',
  },
  {
    src: '/media/branches/chandannagar-club/hero-rig.mp4',
    poster: '/media/branches/chandannagar-club/hero-rig.jpg',
    alt: 'The red plate-loaded strength floor at A Builder Hut Club',
    branchSlug: 'chandannagar-club',
    orientation: 'landscape',
    seconds: 12,
    use: 'hero',
  },
  {
    src: '/media/branches/chandannagar-club/reel-shoulders.mp4',
    poster: '/media/branches/chandannagar-club/reel-shoulders.jpg',
    alt: 'A member training shoulders at A Builder Hut Club',
    branchSlug: 'chandannagar-club',
    orientation: 'landscape',
    seconds: 12,
    use: 'section',
  },
  {
    src: '/media/branches/batanagar/reel-floorwork.mp4',
    poster: '/media/branches/batanagar/reel-floorwork.jpg',
    alt: 'Floor work during a session at Batanagar',
    branchSlug: 'batanagar',
    orientation: 'portrait',
    seconds: 12,
    use: 'reel',
  },
  {
    src: '/media/branches/batanagar/reel-machines.mp4',
    poster: '/media/branches/batanagar/reel-machines.jpg',
    alt: 'The machine floor at Batanagar',
    branchSlug: 'batanagar',
    orientation: 'portrait',
    seconds: 12,
    use: 'reel',
  },
  {
    src: '/media/branches/budge-budge-3-0/reel-bench.mp4',
    poster: '/media/branches/budge-budge-3-0/reel-bench.jpg',
    alt: 'A member benching at A Builder Hut 3.0',
    branchSlug: 'budge-budge-3-0',
    orientation: 'portrait',
    seconds: 11,
    use: 'reel',
  },
  {
    src: '/media/branches/budge-budge-3-0/reel-pullup.mp4',
    poster: '/media/branches/budge-budge-3-0/reel-pullup.jpg',
    alt: 'Pull-up work on the rig at A Builder Hut 3.0',
    branchSlug: 'budge-budge-3-0',
    orientation: 'portrait',
    seconds: 12,
    use: 'reel',
  },
  {
    src: '/media/branches/budge-budge-3-0/reel-treadmill.mp4',
    poster: '/media/branches/budge-budge-3-0/reel-treadmill.jpg',
    alt: 'Running on the cardio deck at A Builder Hut 3.0',
    branchSlug: 'budge-budge-3-0',
    orientation: 'portrait',
    seconds: 12,
    use: 'reel',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Photography
// ─────────────────────────────────────────────────────────────────────────────

const photo = (
  src: string,
  alt: string,
  role: MediaRole,
  branchSlug: string,
  category: Photo['category'],
  nativeWidth: number,
  nativeHeight: number,
): Photo => ({
  src,
  alt,
  role,
  branchSlug,
  category,
  nativeWidth,
  nativeHeight,
  ratio:
    nativeHeight / nativeWidth > 1.15 ? 'portrait' : nativeWidth / nativeHeight > 1.15 ? 'landscape' : 'square',
});

export const photos: Photo[] = [
  // ── Batanagar: the original hut. Geometric LED ceiling, dark and compact. ──
  photo('/media/branches/batanagar/floor-wide.jpg', 'The main training floor at Batanagar under its geometric LED ceiling', 'hero', 'batanagar', 'floor', 715, 545),
  photo('/media/branches/batanagar/floor-cardio.jpg', 'Cardio machines and benches on the wood floor at Batanagar', 'gallery', 'batanagar', 'floor', 720, 527),
  photo('/media/branches/batanagar/signage-pillar.jpg', 'Members training beside the A Builder Hut signage pillar', 'gallery', 'batanagar', 'people', 720, 502),
  photo('/media/branches/batanagar/barbell-detail.jpg', 'A loaded barbell resting under warm light', 'texture', 'batanagar', 'equipment', 720, 640),
  photo('/media/branches/batanagar/dumbbell-rack.jpg', 'The dumbbell rack at Batanagar', 'gallery', 'batanagar', 'equipment', 720, 593),
  photo('/media/branches/batanagar/reception-neon.jpg', 'Reception at Batanagar, with its moss wall and neon sign', 'feature', 'batanagar', 'brand', 720, 487),

  // ── The Club: the big one. Red plate-loaded machines, brick pillars, lifestyle zones. ──
  photo('/media/branches/chandannagar-club/floor-wide.jpg', 'Rows of red plate-loaded machines across the Club floor', 'hero', 'chandannagar-club', 'floor', 720, 543),
  photo('/media/branches/chandannagar-club/gaming-lounge.jpg', 'The gaming lounge at A Builder Hut Club', 'feature', 'chandannagar-club', 'lifestyle', 720, 535),
  photo('/media/branches/chandannagar-club/floor-cafe.jpg', 'The Club training floor, with the café counter beyond', 'gallery', 'chandannagar-club', 'lifestyle', 720, 532),
  photo('/media/branches/chandannagar-club/floor-cardio.jpg', 'Cardio bikes on the open wood floor at the Club', 'gallery', 'chandannagar-club', 'floor', 720, 537),
  photo('/media/branches/chandannagar-club/strength-floor.jpg', 'The strength floor at the Club', 'gallery', 'chandannagar-club', 'equipment', 720, 526),
  photo('/media/branches/chandannagar-club/member-training.jpg', 'A member training on the Club floor', 'feature', 'chandannagar-club', 'people', 941, 1254),

  // ── 3.0: the newest. Warm gold hex lighting, Viva equipment, wood throughout. ──
  photo('/media/branches/budge-budge-3-0/floor-wide.jpg', 'The training floor at A Builder Hut 3.0 under gold hex lighting', 'hero', 'budge-budge-3-0', 'floor', 720, 537),
  photo('/media/branches/budge-budge-3-0/viva-dumbbells.jpg', 'The Viva dumbbell rack at 3.0, backlit in gold', 'texture', 'budge-budge-3-0', 'equipment', 720, 531),
  photo('/media/branches/budge-budge-3-0/reception.jpg', 'Reception and entry at A Builder Hut 3.0', 'gallery', 'budge-budge-3-0', 'brand', 720, 526),
  photo('/media/branches/budge-budge-3-0/floor-member.jpg', 'A member on the 3.0 training floor', 'gallery', 'budge-budge-3-0', 'people', 720, 536),
  photo('/media/branches/budge-budge-3-0/cardio-fridge.jpg', 'Treadmills beside the refreshment fridge at 3.0', 'gallery', 'budge-budge-3-0', 'lifestyle', 720, 531),
  photo('/media/branches/budge-budge-3-0/kids-programme.jpg', 'A Builder Hut 3.0 kids fitness programme poster', 'poster', 'budge-budge-3-0', 'brand', 1122, 1402),
];

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export function photosFor(branchSlug: string): Photo[] {
  return photos.filter((entry) => entry.branchSlug === branchSlug);
}

export function videosFor(branchSlug: string): Video[] {
  return videos.filter((entry) => entry.branchSlug === branchSlug);
}

export function heroPhoto(branchSlug: string): Photo | undefined {
  return photos.find((entry) => entry.branchSlug === branchSlug && entry.role === 'hero');
}

export function heroVideo(branchSlug: string): Video | undefined {
  return videos.find((entry) => entry.branchSlug === branchSlug && entry.use === 'hero');
}

export const reels: Video[] = videos.filter((entry) => entry.use === 'reel');

/** Everything that belongs in the masonry grid — the poster artwork is excluded. */
export const galleryPhotos: Photo[] = photos.filter((entry) => entry.role !== 'poster');

/** Largest width any photo should ever be rendered at, for `sizes` calculations. */
export const PHOTO_CEILING = Math.max(...photos.map((entry) => entry.nativeWidth));
