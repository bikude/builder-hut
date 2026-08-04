/**
 * The 12-week arc a new member is actually walked through.
 *
 * This exists instead of stock before/after photos. Real transformation photos need the
 * member's written consent and their real numbers — when you have both, add them to
 * `src/content/transformations.ts` (built in a later phase) and they will take priority
 * on the Transformations page. Until then this section sells the method, which is true,
 * rather than results that are not yours to show.
 */

export type ProgrammePhase = {
  weeks: string;
  title: string;
  focus: string;
  detail: string;
  markers: string[];
};

export const programme: ProgrammePhase[] = [
  {
    weeks: 'Week 1–2',
    title: 'Assessment & Form',
    focus: 'Learn the six movements before adding load.',
    detail:
      'Body composition, mobility screen and injury history on day one. Then squat, hinge, push, pull, carry and brace — coached with light weight until the pattern holds under fatigue.',
    markers: ['Baseline measurements', 'Movement screen', 'Empty-bar technique', 'Gym induction'],
  },
  {
    weeks: 'Week 3–6',
    title: 'Build the Base',
    focus: 'Consistency beats intensity. Four sessions a week, every week.',
    detail:
      'Your split settles into a rhythm and loads start climbing. Diet guidance moves from "eat enough protein" to specific portions built around the food already cooked at home.',
    markers: ['Progressive overload', 'Macro-matched diet', 'First strength PRs', 'Fortnightly check-in'],
  },
  {
    weeks: 'Week 7–9',
    title: 'Push the Ceiling',
    focus: 'Where weight loss or muscle gain becomes visible to other people.',
    detail:
      'Volume rises, conditioning gets specific to your goal, and the programme is rewritten around what your numbers have actually done — not what the template said they would do.',
    markers: ['Programme rewrite', 'Conditioning block', 'Measurements and photos', 'Plateau troubleshooting'],
  },
  {
    weeks: 'Week 10–12',
    title: 'Own It',
    focus: 'You should be able to run your own training by the end of this.',
    detail:
      'Peak the block, retest the baseline, and learn how to programme the next twelve weeks yourself. Members who reach here mostly renew — not because of a discount, but because it worked.',
    markers: ['Retest baseline', 'Strength peak', 'Next block planned', 'Self-sufficient training'],
  },
];

/** Short claims used on the results section. Each one is method, not a promised outcome. */
export const resultsPrinciples = [
  {
    title: 'Measured, not guessed',
    body: 'Weight, measurements and lift numbers are recorded at intake and re-tested on a schedule. If a block did not work, the data says so before the mirror does.',
  },
  {
    title: 'Food you already eat',
    body: 'Diet guidance is built from a Bengali kitchen — rice, dal, fish, eggs, seasonal vegetables — adjusted for your goal instead of replaced with imports.',
  },
  {
    title: 'Coached, not supervised',
    body: 'Certified trainers correct technique on the floor rather than counting your reps from the desk. Beginners get the most attention, deliberately.',
  },
];
