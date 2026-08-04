/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  PRICING — READ BEFORE YOU PUBLISH
 * ══════════════════════════════════════════════════════════════════════════════
 *  No public source lists A Builder Hut's current rates, so the figures below are
 *  INDICATIVE PLACEHOLDERS shaped to the local market. Replace every `price` and
 *  `strikePrice` with the real number from reception, then set
 *  `PRICING_CONFIRMED = true`.
 *
 *  While `PRICING_CONFIRMED` is false the membership UI adds a short line telling
 *  visitors to call for today's rate — so a wrong number never goes out unqualified.
 *  Everything else on the site is unaffected by this flag.
 * ══════════════════════════════════════════════════════════════════════════════
 */
export const PRICING_CONFIRMED = false;

export type Plan = {
  slug: string;
  name: string;
  months: number;
  /** Total payable for the period, in rupees. */
  price: number;
  /** Optional "was" price. Set to null when nothing is being discounted. */
  strikePrice: number | null;
  /** Short line under the price — the reason this tier exists. */
  positioning: string;
  perks: string[];
  featured: boolean;
};

export const plans: Plan[] = [
  {
    slug: 'monthly',
    name: 'Monthly',
    months: 1,
    price: 1200,
    strikePrice: null,
    positioning: 'Test the floor before you commit to a season.',
    perks: [
      'Access 24×7 at your home branch',
      'Free fitness assessment on joining',
      'Trainer-led induction workout',
      'Locker and changing room',
    ],
    featured: false,
  },
  {
    slug: 'quarterly',
    name: 'Quarterly',
    months: 3,
    price: 3000,
    strikePrice: 3600,
    positioning: 'Long enough to see the first real change in the mirror.',
    perks: [
      'Everything in Monthly',
      'Access at all three branches',
      'Goal-based diet guidance',
      'Monthly body composition check',
    ],
    featured: false,
  },
  {
    slug: 'half-yearly',
    name: 'Half Yearly',
    months: 6,
    price: 5000,
    strikePrice: 7200,
    positioning: 'The tier most members renew into. Habit territory.',
    perks: [
      'Everything in Quarterly',
      'One complimentary PT month',
      'Programme rewritten every 8 weeks',
      'Priority slot booking for classes',
    ],
    featured: true,
  },
  {
    slug: 'yearly',
    name: 'Yearly',
    months: 12,
    price: 8000,
    strikePrice: 14400,
    positioning: 'Lowest monthly cost, and the only tier with a freeze.',
    perks: [
      'Everything in Half Yearly',
      'Two complimentary PT months',
      'Membership freeze up to 30 days',
      'Guest passes for family',
      'Invitations to member events',
    ],
    featured: false,
  },
];

export type PtPackage = {
  slug: string;
  name: string;
  sessions: string;
  price: number;
  summary: string;
  includes: string[];
};

export const ptPackages: PtPackage[] = [
  {
    slug: 'pt-starter',
    name: 'Starter',
    sessions: '12 sessions / 1 month',
    price: 3500,
    summary: 'For a first-timer who wants form corrected before anything gets heavy.',
    includes: ['Movement screen', 'Technique coaching on every lift', 'Written 4-week programme', 'Weekly check-in'],
  },
  {
    slug: 'pt-transform',
    name: 'Transformation',
    sessions: '36 sessions / 3 months',
    price: 9000,
    summary: 'The block where weight loss or muscle gain actually shows up in photos.',
    includes: [
      'Everything in Starter',
      'Macro-matched diet plan',
      'Fortnightly measurements and photos',
      'Progressive overload tracking',
      'WhatsApp support between sessions',
    ],
  },
  {
    slug: 'pt-athlete',
    name: 'Athlete',
    sessions: '72 sessions / 6 months',
    price: 16000,
    summary: 'Strength, physique or combat goals that need a full training season.',
    includes: [
      'Everything in Transformation',
      'Periodised strength blocks',
      'MMA or conditioning specialisation',
      'Competition or event peaking',
      'Recovery and mobility protocol',
    ],
  },
];

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  /** Decimal places to render. Defaults to 0. */
  decimals?: number;
  /** Years and counts of stations read wrong with thousand separators. */
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

export function pricePerMonth(plan: Plan): number {
  return Math.round(plan.price / plan.months);
}

export function savingsPercent(plan: Plan): number | null {
  if (!plan.strikePrice) return null;
  return Math.round(((plan.strikePrice - plan.price) / plan.strikePrice) * 100);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
