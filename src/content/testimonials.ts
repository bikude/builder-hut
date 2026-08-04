/**
 * Testimonials.
 *
 * Google reviews are the reviewers' own copyrighted words and Google's Terms of Service
 * do not permit scraping and re-publishing them. So the entries below are ILLUSTRATIVE
 * EXAMPLES written for this site (`isExample: true`), and every one of them renders with
 * an "example" marker in the UI.
 *
 * Two legitimate ways to show the real thing:
 *  1. Ask members for a testimonial directly, in writing. Set `isExample: false` and put
 *     their name and branch in. This is the fastest route and the quotes are yours to keep.
 *  2. Use the Google Places API `place_details` endpoint with your own API key and render
 *     the returned review objects with Google attribution, exactly as the API terms require.
 *     Place IDs for all three branches are already in `src/content/branches.ts`.
 *
 * The aggregate rating shown across the site (4.8 from 448 reviews) is factual and comes
 * from the public Google listings — that is a statistic, not copyrighted text.
 */

export type Testimonial = {
  id: string;
  /** Attributed name once real, or the persona label while it is an example. */
  name: string;
  role: string;
  branchSlug: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  isExample: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: 'shift-worker',
    name: 'Night-shift member',
    role: 'Trains 11pm–1am',
    branchSlug: 'batanagar',
    rating: 5,
    quote:
      'I finish my shift at half past ten and the floor is still open, still staffed, still cold. No other gym near Batanagar lets me train at that hour.',
    isExample: true,
  },
  {
    id: 'first-timer',
    name: 'First-time lifter',
    role: 'Six months in',
    branchSlug: 'chandannagar-club',
    rating: 5,
    quote:
      'I had never touched a barbell. The trainer spent my first week on form with an empty bar instead of pushing weight, and that is why I am still here.',
    isExample: true,
  },
  {
    id: 'weight-loss',
    name: 'Weight-loss member',
    role: 'Down 14 kg',
    branchSlug: 'chandannagar-club',
    rating: 5,
    quote:
      'The diet plan was rice, dal and fish — food my mother already cooks. That is the only reason I could follow it for nine months straight.',
    isExample: true,
  },
  {
    id: 'combat',
    name: 'MMA member',
    role: 'Striking and conditioning',
    branchSlug: 'chandannagar-club',
    rating: 5,
    quote:
      'Bags, mat space and a coach who actually corrects your stance. I lift on the main floor and drill in the combat zone on the same membership.',
    isExample: true,
  },
  {
    id: 'women-floor',
    name: 'Member at 3.0',
    role: 'Trains mornings',
    branchSlug: 'budge-budge-3-0',
    rating: 5,
    quote:
      'Clean, bright, and nobody crowds you. As a woman training alone in the morning, that is the thing I was actually worried about.',
    isExample: true,
  },
  {
    id: 'multi-branch',
    name: 'Multi-branch member',
    role: 'Two years with ABH',
    branchSlug: 'budge-budge-3-0',
    rating: 5,
    quote:
      'Work near Maheshtala, live near Budge Budge. One membership covers both floors, so there is no excuse left on either side of the day.',
    isExample: true,
  },
];

export const hasRealTestimonials = testimonials.some((testimonial) => !testimonial.isExample);
