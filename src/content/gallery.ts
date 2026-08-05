/**
 * Gallery.
 *
 * This used to hold placeholder entries with notes about where the real photos should
 * come from. The gym has now supplied them, so the gallery is derived directly from the
 * media manifest — one source of truth, and adding a photo to `media.ts` puts it in the
 * gallery automatically.
 *
 * The poster artwork is excluded: it is a printed campaign rather than a photograph of
 * the gym, and it has its own home on the kids programme section.
 */

import { galleryPhotos, type Photo } from '@/content/media';

export type GalleryRatio = Photo['ratio'];
export type GalleryCategory = Photo['category'];

export type GalleryItem = {
  id: string;
  alt: string;
  category: GalleryCategory;
  branchSlug: string;
  ratio: GalleryRatio;
  src: string;
  /** True pixel width of the source — the grid must not render wider than this. */
  nativeWidth: number;
  isPlaceholder: false;
};

export const galleryCategories: Array<{ value: GalleryCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Everything' },
  { value: 'floor', label: 'Training floors' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'people', label: 'Members' },
  { value: 'lifestyle', label: 'Lounge & café' },
  { value: 'brand', label: 'The huts' },
];

export const gallery: GalleryItem[] = galleryPhotos.map((entry) => ({
  id: `${entry.branchSlug}-${entry.src.split('/').pop()!.replace('.jpg', '')}`,
  alt: entry.alt,
  category: entry.category,
  branchSlug: entry.branchSlug,
  ratio: entry.ratio,
  src: entry.src,
  nativeWidth: entry.nativeWidth,
  isPlaceholder: false,
}));

/** The gallery page reads this to decide whether to show its "placeholders" banner. */
export const galleryIsPlaceholderOnly = false;
