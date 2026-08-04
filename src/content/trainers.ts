/**
 * Training team.
 *
 * No trainer's name, photograph or certification is published on any public A Builder Hut
 * page, so inventing named people here would be fabrication. Instead this file describes
 * the ROLES the gym advertises ("certified trainers", "personal training", "MMA coaching")
 * without attributing them to individuals.
 *
 * OWNER ACTION: replace each entry's `name`, `credential` and `photo` with your real
 * staff once you have their permission, and set `isRole: false`. The UI drops the
 * "role, not a person" marker automatically at that point.
 */

export type Trainer = {
  slug: string;
  /** Real name once confirmed; a role label while `isRole` is true. */
  name: string;
  credential: string;
  specialisms: string[];
  branchSlugs: string[];
  bio: string;
  photo: string | null;
  isRole: boolean;
};

export const trainers: Trainer[] = [
  {
    slug: 'strength-coach',
    name: 'Strength Coach',
    credential: 'Certified personal trainer',
    specialisms: ['Barbell technique', 'Progressive overload', 'Muscle gain'],
    branchSlugs: ['batanagar', 'chandannagar-club', 'budge-budge-3-0'],
    bio: 'Runs beginners through squat, hinge, press and pull with an empty bar until the pattern holds, then writes the loading plan that takes them to their first real numbers.',
    photo: null,
    isRole: true,
  },
  {
    slug: 'fat-loss-coach',
    name: 'Fat-Loss Coach',
    credential: 'Certified personal trainer',
    specialisms: ['Weight loss', 'Conditioning', 'Diet guidance'],
    branchSlugs: ['batanagar', 'chandannagar-club', 'budge-budge-3-0'],
    bio: 'Pairs a training split with portions built from the food already cooked at home, and re-measures on a schedule so a stalled block gets caught in weeks rather than months.',
    photo: null,
    isRole: true,
  },
  {
    slug: 'mma-coach',
    name: 'MMA Coach',
    credential: 'Combat sports coaching',
    specialisms: ['Striking fundamentals', 'Pad work', 'Fight conditioning'],
    branchSlugs: ['chandannagar-club'],
    bio: 'Takes complete beginners through stance, guard and basic combinations in the club combat zone before any contact work, and conditions members who already compete.',
    photo: null,
    isRole: true,
  },
  {
    slug: 'functional-coach',
    name: 'Functional & Mobility Coach',
    credential: 'Certified personal trainer',
    specialisms: ['CrossFit-style metcons', 'Mobility', 'Return from injury'],
    branchSlugs: ['batanagar', 'chandannagar-club', 'budge-budge-3-0'],
    bio: 'Coaches carries, sled work and scaled workouts of the day, and handles members coming back from a desk-job back or an old sports injury.',
    photo: null,
    isRole: true,
  },
];

export const trainersAreRolesOnly = trainers.every((trainer) => trainer.isRole);

export function trainersForBranch(slug: string): Trainer[] {
  return trainers.filter((trainer) => trainer.branchSlugs.includes(slug));
}
