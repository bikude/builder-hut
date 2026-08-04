/**
 * Facility catalogue.
 *
 * `icon` is a key, not a component, so this file stays a plain data module that a
 * non-developer can edit safely. `src/components/common/facility-icon.tsx` maps each
 * key to its Lucide glyph — add a key there first, then use it here.
 *
 * `branches` lists the branch slugs where the facility is available. An empty array
 * means "every branch".
 */

export type FacilityIcon =
  | 'strength'
  | 'cardio'
  | 'functional'
  | 'crossfit'
  | 'mma'
  | 'gaming'
  | 'spa'
  | 'cafe'
  | 'locker'
  | 'trainer'
  | 'diet'
  | 'ac';

export type Facility = {
  slug: string;
  title: string;
  icon: FacilityIcon;
  summary: string;
  detail: string;
  branches: string[];
  /** Shown as a small mono label on the card — a real spec, not decoration. */
  spec?: string;
};

export const facilities: Facility[] = [
  {
    slug: 'strength-training',
    title: 'Strength Training',
    icon: 'strength',
    summary: 'Plate-loaded machines, racks and a full free-weight room.',
    detail:
      'Benches, squat racks, dumbbells and plate-loaded stations laid out so you can run a full push-pull-legs split without waiting on a single machine. Trainers will set your working weights on day one.',
    branches: [],
    spec: '65–70+ stations',
  },
  {
    slug: 'cardio',
    title: 'Cardio',
    icon: 'cardio',
    summary: 'Treadmills, cycles, cross-trainers and rowers.',
    detail:
      'A dedicated cardio deck for steady-state and interval work, with equipment spaced for airflow and screens in view. Ideal for fat-loss blocks and conditioning days.',
    branches: [],
    spec: 'Deck + intervals',
  },
  {
    slug: 'functional-training',
    title: 'Functional Training',
    icon: 'functional',
    summary: 'Kettlebells, ropes, sleds and open floor space.',
    detail:
      'Train movement, not just muscles. Carries, swings, sled pushes and mobility flows on open matted floor — the fastest route back to pain-free everyday strength.',
    branches: [],
    spec: 'Open floor',
  },
  {
    slug: 'crossfit',
    title: 'CrossFit',
    icon: 'crossfit',
    summary: 'Rig work, metcons and Olympic lift practice.',
    detail:
      'Scaled workouts of the day that any fitness level can attempt, coached in small groups. Expect barbell cycling, pull-up progressions and conditioning that finishes you honestly.',
    branches: [],
    spec: 'Coached WODs',
  },
  {
    slug: 'mma',
    title: 'MMA Training Zone',
    icon: 'mma',
    summary: 'Bags, mats and striking work in a dedicated combat area.',
    detail:
      'A separate zone for striking and grappling drills — heavy bags, pads and mat space. Beginners start with stance, guard and basic combinations before any contact work.',
    branches: ['chandannagar-club'],
    spec: 'Bags + mat space',
  },
  {
    slug: 'gaming-zone',
    title: 'Gaming Zone',
    icon: 'gaming',
    summary: 'Cool-down lounge for the minutes after your last set.',
    detail:
      'A lounge to decompress in once training is done — the reason members stay in the building instead of heading straight home, and the reason the community here actually knows each other.',
    branches: ['chandannagar-club'],
    spec: 'Members lounge',
  },
  {
    slug: 'spa',
    title: 'Salon & Spa',
    icon: 'spa',
    summary: 'Recovery and grooming without a second trip across town.',
    detail:
      'Recovery is training. Book the spa after a heavy leg session, or the salon before an event — both sit inside the club, so your whole routine happens under one roof.',
    branches: ['chandannagar-club'],
    spec: 'In-club',
  },
  {
    slug: 'healthy-cafe',
    title: 'Healthy Cafeteria',
    icon: 'cafe',
    summary: 'Post-workout food that matches the plan you were given.',
    detail:
      'Shakes, eggs, and high-protein plates priced for people who train daily, not for tourists. Ask the counter to match your macros to whatever your trainer wrote down.',
    branches: ['chandannagar-club'],
    spec: 'Protein-first menu',
  },
  {
    slug: 'lockers',
    title: 'Lockers & Changing',
    icon: 'locker',
    summary: 'Secure lockers, changing rooms and washrooms.',
    detail:
      'Come straight from work or the factory shift. Lockers, changing rooms and washrooms are maintained through the night as well as the day.',
    branches: [],
    spec: 'Day-use',
  },
  {
    slug: 'personal-training',
    title: 'Personal Training',
    icon: 'trainer',
    summary: 'Certified trainers, one-to-one, on your schedule.',
    detail:
      'A trainer assigned to you, a programme written for your body and your calendar, and a check-in that tracks whether it is working. Available at every branch.',
    branches: [],
    spec: '1-on-1',
  },
  {
    slug: 'diet-guidance',
    title: 'Diet Guidance',
    icon: 'diet',
    summary: 'Practical Bengali-kitchen nutrition, not imported meal plans.',
    detail:
      'A plan built from food your family already cooks — rice, dal, fish, eggs — adjusted for your goal. General guidance for healthy adults; if you have a medical condition, bring your doctor into the loop first.',
    branches: [],
    spec: 'Goal-based',
  },
  {
    slug: 'air-conditioned',
    title: 'Fully Air-Conditioned',
    icon: 'ac',
    summary: 'Climate-controlled floors through the Kolkata summer.',
    detail:
      'Every training floor is air-conditioned. In a city that sits above 35°C for months, that is the difference between finishing your session and cutting it short.',
    branches: [],
    spec: '24×7 AC',
  },
];

export function facilitiesForBranch(slug: string): Facility[] {
  return facilities.filter((facility) => facility.branches.length === 0 || facility.branches.includes(slug));
}
