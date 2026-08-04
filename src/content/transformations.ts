/**
 * Member transformations.
 *
 * This list is EMPTY on purpose, and that is the correct state until you have consent.
 *
 * Before/after photos of members are personal data. Publishing them without written,
 * specific permission is both an ethical problem and, under India's DPDP Act 2023, a
 * legal one. Stock "results" photos bought from a library are worse — they are a lie
 * about your own gym, and members recognise them.
 *
 * While this array is empty the Transformations page shows the 12-week method from
 * `src/content/programme.ts` instead, which is entirely true. Add your first real entry
 * and the page switches to leading with it automatically — no code change needed.
 *
 * OWNER ACTION for each entry:
 *   1. Get written consent (a WhatsApp message saying "yes, you may publish my photos
 *      and numbers on the website" is enough — keep it).
 *   2. Save the photos to `public/images/transformations/<slug>-before.jpg` and
 *      `-after.jpg`, shot in the same light, same pose, same distance.
 *   3. Use real numbers. Never round a 7 kg loss up to 10.
 */

export type Transformation = {
  slug: string;
  /** First name, or an initial if the member prefers. Never publish a full name without asking. */
  name: string;
  branchSlug: string;
  goal: 'weight-loss' | 'muscle-gain' | 'strength' | 'recomposition';
  durationWeeks: number;
  /** Short factual summary, e.g. "82 kg → 71 kg". */
  headline: string;
  /** The member's own words, quoted with permission. */
  quote: string;
  beforeImage: string;
  afterImage: string;
  /** Proof that consent exists. Not rendered — it is a record for you. */
  consentRecordedOn: string;
};

export const transformations: Transformation[] = [];

export const hasTransformations = transformations.length > 0;

export const goalLabels: Record<Transformation['goal'], string> = {
  'weight-loss': 'Weight loss',
  'muscle-gain': 'Muscle gain',
  strength: 'Strength',
  recomposition: 'Recomposition',
};
