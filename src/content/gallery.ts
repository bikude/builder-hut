/**
 * Gallery manifest.
 *
 * Photographs on the gym's Instagram and Facebook pages belong to A Builder Hut and are
 * covered by those platforms' terms, so they are not copied into this repo. Each entry
 * below points at branded placeholder artwork of the exact aspect ratio the real photo
 * should be, plus the public page the real photo should come from.
 *
 * To publish a real photo:
 *   1. Export it at roughly the `ratio` given below (the grid is masonry, so exact pixel
 *      dimensions do not matter — the ratio prevents layout shift).
 *   2. Save it to `public/images/gallery/<id>.jpg`.
 *   3. Set `src` to that path and `isPlaceholder` to false, and write a real `alt`.
 *
 * See public/images/ASSETS.md for the full checklist.
 */

export type GalleryRatio = 'portrait' | 'landscape' | 'square';

export type GalleryItem = {
  id: string;
  /** Sentence describing what the photo shows — becomes the alt text and lightbox caption. */
  alt: string;
  category: 'floor' | 'equipment' | 'combat' | 'recovery' | 'community';
  branchSlug: string;
  ratio: GalleryRatio;
  src: string;
  /** Public page the real photograph should be taken from. */
  sourceHint: string;
  isPlaceholder: boolean;
};

export const galleryCategories: Array<{ value: GalleryItem['category'] | 'all'; label: string }> = [
  { value: 'all', label: 'Everything' },
  { value: 'floor', label: 'Training floors' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'combat', label: 'Combat zone' },
  { value: 'recovery', label: 'Recovery & café' },
  { value: 'community', label: 'Members' },
];

const PLACEHOLDER: Record<GalleryRatio, string> = {
  portrait: '/images/gallery/placeholder-portrait.jpg',
  landscape: '/images/gallery/placeholder-landscape.jpg',
  square: '/images/gallery/placeholder-square.jpg',
};

function item(
  id: string,
  alt: string,
  category: GalleryItem['category'],
  branchSlug: string,
  ratio: GalleryRatio,
  sourceHint: string,
): GalleryItem {
  return { id, alt, category, branchSlug, ratio, src: PLACEHOLDER[ratio], sourceHint, isPlaceholder: true };
}

export const gallery: GalleryItem[] = [
  item('floor-batanagar-wide', 'The main training floor at Batanagar, looking down the free-weight room', 'floor', 'batanagar', 'landscape', 'facebook.com/builderhut22 — page photos'),
  item('rack-row', 'Squat racks and benches lined along the strength wall', 'equipment', 'batanagar', 'portrait', 'instagram.com/a_builder_hut — grid'),
  item('dumbbell-rack', 'Full dumbbell rack running the length of the floor', 'equipment', 'batanagar', 'square', 'instagram.com/a_builder_hut — grid'),
  item('cardio-deck', 'Treadmills and cross-trainers on the cardio deck', 'floor', 'chandannagar-club', 'landscape', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('jerai-club-line', 'Jerai Club Line plate-loaded machines at the Chandannagar club', 'equipment', 'chandannagar-club', 'portrait', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('combat-bags', 'Heavy bags hanging in the MMA training zone', 'combat', 'chandannagar-club', 'portrait', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('combat-mat', 'Matted floor space used for grappling and pad drills', 'combat', 'chandannagar-club', 'landscape', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('cafeteria', 'The healthy cafeteria counter inside the club', 'recovery', 'chandannagar-club', 'square', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('spa-room', 'Treatment room in the in-club salon and spa', 'recovery', 'chandannagar-club', 'portrait', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('gaming-lounge', 'The gaming lounge members use to cool down after training', 'recovery', 'chandannagar-club', 'landscape', 'facebook.com/p/A-Builder-Hut-20-100092604442538'),
  item('viva-kai-greene', 'Viva Kai Greene series machines on the 3.0 floor', 'equipment', 'budge-budge-3-0', 'portrait', 'facebook.com/p/A-Builder-Hut-30-Budge-Budge-61574711963786'),
  item('floor-3-0', 'The opened-up training floor at A Builder Hut 3.0, Shyampur', 'floor', 'budge-budge-3-0', 'landscape', 'facebook.com/p/A-Builder-Hut-30-Budge-Budge-61574711963786'),
  item('morning-session', 'Members training during an early morning session', 'community', 'budge-budge-3-0', 'square', 'instagram.com/a_builder_hut — grid'),
  item('night-session', 'The floor lit and staffed after midnight', 'community', 'batanagar', 'portrait', 'instagram.com/a_builder_hut — grid'),
  item('trainer-coaching', 'A trainer correcting a member’s deadlift setup', 'community', 'chandannagar-club', 'landscape', 'instagram.com/a_builder_hut — grid'),
  item('locker-room', 'Changing room and lockers', 'recovery', 'batanagar', 'square', 'facebook.com/builderhut22 — page photos'),
];

export const galleryIsPlaceholderOnly = gallery.every((entry) => entry.isPlaceholder);
