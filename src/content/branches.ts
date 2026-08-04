/**
 * Branch records.
 *
 * Provenance — every factual field below was read from a public source on 2026-08-03:
 *  - name / address / coordinates / placeId / rating / reviewCount / hours → Google Maps
 *    Business Profiles.
 *  - phone → Google Business Profile (Batanagar) and the A Builder Hut 3.0 Facebook page.
 *  - equipment + positioning lines → the branches' own Facebook page descriptions.
 *
 * Anything the owner must confirm is marked OWNER ACTION (see README → Owner checklist). Ratings drift: re-check the
 * Google listing every quarter and update `rating`, `reviewCount` and `verifiedOn`.
 */

export type Branch = {
  slug: string;
  name: string;
  shortName: string;
  /** Ordinal shown in the UI — this is a real sequence (branch 1 opened first). */
  index: number;
  tagline: string;
  addressLines: string[];
  locality: string;
  region: string;
  postalCode: string;
  coordinates: { lat: number; lng: number };
  /** Google Place ID — gives directions links an exact destination, not a text search. */
  placeId: string;
  rating: number | null;
  reviewCount: number | null;
  verifiedOn: string;
  phone: string;
  phoneDisplay: string;
  openedYear: number | null;
  /** Every branch runs 24×7; kept per-branch so a future exception is a data edit. */
  alwaysOpen: boolean;
  areaSqft: number | null;
  stations: string | null;
  highlights: string[];
  equipment: string[];
  image: string;
  imageAlt: string;
  social: { instagram?: string; facebook?: string };
};

export const branches: Branch[] = [
  {
    slug: 'batanagar',
    name: 'A Builder Hut',
    shortName: 'Batanagar',
    index: 1,
    tagline: 'The original hut. Where the brand was forged.',
    addressLines: ['Budge Budge Trunk Road', 'Near Jagtala, Batanagar'],
    locality: 'Maheshtala, Kolkata',
    region: 'West Bengal',
    postalCode: '700141',
    coordinates: { lat: 22.4998413, lng: 88.2322966 },
    placeId: 'ChIJkzyazGx9AjoRaSJq07xBHQY',
    rating: 4.8,
    reviewCount: 274,
    verifiedOn: '2026-08-03',
    phone: '+918276903867',
    phoneDisplay: '+91 82769 03867',
    openedYear: 2022,
    alwaysOpen: true,
    areaSqft: null, // OWNER ACTION: confirm floor area for this branch.
    stations: null,
    highlights: [
      'Fully air-conditioned floor',
      'Free-weight and machine strength zones',
      'CrossFit and functional rig',
      'Certified trainers on shift',
      'Beginner-friendly induction',
    ],
    equipment: ['Plate-loaded strength', 'Cardio deck', 'Functional rig', 'Free weights to 50 kg'],
    image: '/images/branches/batanagar.jpg',
    imageAlt: 'A Builder Hut Batanagar training floor',
    social: {
      instagram: 'https://www.instagram.com/a_builder_hut/',
      facebook: 'https://www.facebook.com/builderhut22/',
    },
  },
  {
    slug: 'chandannagar-club',
    name: 'A Builder Hut Club',
    shortName: 'Chandannagar',
    index: 2,
    tagline: 'The flagship club — training, recovery and everything around it.',
    addressLines: ['Chandannagar, Budge Budge Trunk Road', 'Near Indian Chain Pvt Ltd', 'Opposite Maheshtala College'],
    locality: 'Maheshtala, Kolkata',
    region: 'West Bengal',
    postalCode: '700139',
    coordinates: { lat: 22.5013327, lng: 88.2363855 },
    placeId: 'ChIJo4gS_Hd9AjoRLJTNIfc246M',
    rating: 5.0,
    reviewCount: 8,
    verifiedOn: '2026-08-03',
    phone: '+918276903867',
    phoneDisplay: '+91 82769 03867',
    openedYear: null,
    alwaysOpen: true,
    areaSqft: 11000,
    stations: '65–70+ stations',
    highlights: [
      'Around 11,000 sq ft across the club',
      '65–70+ workout stations',
      'MMA and combat training zone',
      'Gaming zone and lounge',
      'Healthy cafeteria',
      'Salon and spa',
    ],
    equipment: ['Jerai Club Line', 'Full free-weight room', 'MMA bags and mat space', 'Cardio theatre'],
    image: '/images/branches/chandannagar-club.jpg',
    imageAlt: 'A Builder Hut Club Chandannagar strength floor',
    social: {
      instagram: 'https://www.instagram.com/a_builder_hut_2.0/',
      facebook: 'https://www.facebook.com/p/A-Builder-Hut-20-100092604442538/',
    },
  },
  {
    slug: 'budge-budge-3-0',
    name: 'A Builder Hut 3.0',
    shortName: 'Budge Budge',
    index: 3,
    tagline: 'The newest floor. Kai Greene series iron, women-friendly by design.',
    addressLines: ['Halder Para More', 'Shyampur, Budge Budge'],
    locality: 'Budge Budge, Kolkata',
    region: 'West Bengal',
    postalCode: '700137',
    coordinates: { lat: 22.4871837, lng: 88.1910005 },
    placeId: 'ChIJhYVfW5N9AjoRUM3jezyn-fs',
    rating: 4.7,
    reviewCount: 166,
    verifiedOn: '2026-08-03',
    phone: '+918981332647',
    phoneDisplay: '+91 89813 32647',
    openedYear: 2025,
    alwaysOpen: true,
    areaSqft: null, // OWNER ACTION: confirm floor area for this branch.
    stations: null,
    highlights: [
      'Viva Kai Greene series equipment',
      'Women-friendly floor and timings',
      'Hygiene-first housekeeping routine',
      'Expert trainers on every shift',
      'One membership works across all branches',
    ],
    equipment: ['Viva Kai Greene series', 'Strength and hypertrophy machines', 'Cardio deck', 'Stretch and mobility zone'],
    image: '/images/branches/budge-budge-3-0.jpg',
    imageAlt: 'A Builder Hut 3.0 Budge Budge training floor',
    social: {
      facebook: 'https://www.facebook.com/p/A-Builder-Hut-30-Budge-Budge-61574711963786/',
    },
  },
];

export function getBranch(slug: string): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

/** Full postal address on one line — used in cards, JSON-LD and the footer. */
export function formatAddress(branch: Branch): string {
  return [...branch.addressLines, branch.locality, `${branch.region} ${branch.postalCode}`].join(', ');
}

/** Deep link that opens turn-by-turn navigation to the exact listing, not a name search. */
export function directionsUrl(branch: Branch): string {
  const { lat, lng } = branch.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${branch.placeId}`;
}

/** Deep link to the Google listing itself — reviews, photos, opening hours. */
export function listingUrl(branch: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${branch.coordinates.lat},${branch.coordinates.lng}&query_place_id=${branch.placeId}`;
}

export const totalReviews = branches.reduce((sum, branch) => sum + (branch.reviewCount ?? 0), 0);

/** Review-weighted average across every branch, rounded to one decimal. */
export const averageRating =
  Math.round(
    (branches.reduce((sum, b) => sum + (b.rating ?? 0) * (b.reviewCount ?? 0), 0) / (totalReviews || 1)) * 10,
  ) / 10;
