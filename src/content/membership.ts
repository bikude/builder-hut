/**
 * Membership.
 *
 * There are no prices in this file, and that is deliberate.
 *
 * Rates at A Builder Hut move with the season, with the offer running at each branch, and
 * with what a member is actually joining for. A number published here would be wrong
 * within weeks, and a wrong number is worse for the gym than no number: it either
 * undersells the floor or turns away someone who would have joined at the real rate.
 *
 * So every tier below describes what you GET and how long it runs, and every action routes
 * to a person — call, WhatsApp, or walk into the nearest branch. Reception quotes the
 * current rate, which is the only rate that is ever correct.
 */

export type Plan = {
  slug: string;
  name: string;
  months: number;
  /** Short line under the name — the reason this tier exists. */
  positioning: string;
  perks: string[];
  featured: boolean;
  /** Pre-filled WhatsApp enquiry, so the member does not have to compose one. */
  enquiry: string;
};

export const plans: Plan[] = [
  {
    slug: 'monthly',
    name: 'Monthly',
    months: 1,
    positioning: 'Test the floor before you commit to a season.',
    perks: [
      'Access 24×7 at your home branch',
      'Fitness assessment on joining',
      'Trainer-led induction workout',
      'Locker and changing room',
    ],
    featured: false,
    enquiry: "Hi! I'd like to join A Builder Hut on a monthly membership. What's available?",
  },
  {
    slug: 'quarterly',
    name: 'Quarterly',
    months: 3,
    positioning: 'Long enough to see the first real change in the mirror.',
    perks: [
      'Everything in Monthly',
      'Access at all three branches',
      'Goal-based diet guidance',
      'Monthly body composition check',
    ],
    featured: false,
    enquiry: "Hi! I'd like to join A Builder Hut on a quarterly membership. What's available?",
  },
  {
    slug: 'half-yearly',
    name: 'Half Yearly',
    months: 6,
    positioning: 'The tier most members renew into. Habit territory.',
    perks: [
      'Everything in Quarterly',
      'Complimentary personal training block',
      'Programme rewritten every 8 weeks',
      'Priority slot booking',
    ],
    featured: true,
    enquiry: "Hi! I'd like to join A Builder Hut on a half-yearly membership. What's available?",
  },
  {
    slug: 'yearly',
    name: 'Yearly',
    months: 12,
    positioning: 'The longest commitment, and the only tier with a freeze.',
    perks: [
      'Everything in Half Yearly',
      'Extended personal training block',
      'Membership freeze up to 30 days',
      'Guest passes for family',
      'Invitations to member events',
    ],
    featured: false,
    enquiry: "Hi! I'd like to join A Builder Hut on a yearly membership. What's available?",
  },
];

export type PtPackage = {
  slug: string;
  name: string;
  sessions: string;
  summary: string;
  includes: string[];
  enquiry: string;
};

export const ptPackages: PtPackage[] = [
  {
    slug: 'pt-starter',
    name: 'Starter',
    sessions: '12 sessions / 1 month',
    summary: 'For a first-timer who wants form corrected before anything gets heavy.',
    includes: ['Movement screen', 'Technique coaching on every lift', 'Written 4-week programme', 'Weekly check-in'],
    enquiry: "Hi! I'd like to ask about the Starter personal training package.",
  },
  {
    slug: 'pt-transform',
    name: 'Transformation',
    sessions: '36 sessions / 3 months',
    summary: 'The block where weight loss or muscle gain actually shows up in photographs.',
    includes: [
      'Everything in Starter',
      'Macro-matched diet plan',
      'Fortnightly measurements and photos',
      'Progressive overload tracking',
      'WhatsApp support between sessions',
    ],
    enquiry: "Hi! I'd like to ask about the Transformation personal training package.",
  },
  {
    slug: 'pt-athlete',
    name: 'Athlete',
    sessions: '72 sessions / 6 months',
    summary: 'Strength, physique or combat goals that need a full training season.',
    includes: [
      'Everything in Transformation',
      'Periodised strength blocks',
      'MMA or conditioning specialisation',
      'Competition or event peaking',
      'Recovery and mobility protocol',
    ],
    enquiry: "Hi! I'd like to ask about the Athlete personal training package.",
  },
];

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  decimals?: number;
  /** Years and station counts read wrong with thousand separators. */
  plain?: boolean;
};

/** Headline numbers. Sourced from the Google listings and the branches' own pages. */
export const stats: Stat[] = [
  { value: 3, suffix: '', label: 'Branches', sub: 'Maheshtala & Budge Budge' },
  { value: 448, suffix: '+', label: 'Google reviews', sub: 'Across all branches' },
  { value: 4.8, suffix: '★', label: 'Average rating', sub: 'Verified Aug 2026', decimals: 1 },
  { value: 24, suffix: '×7', label: 'Open', sub: 'Every day of the year' },
  { value: 11000, suffix: ' sq ft', label: 'Club floor', sub: 'Chandannagar' },
  { value: 2022, suffix: '', label: 'Training since', sub: 'Batanagar, branch one', plain: true },
];
