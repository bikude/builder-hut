/**
 * Single source of truth for brand-level facts that appear in more than one place:
 * navigation, contact routes, social profiles and default SEO copy.
 *
 * Anything a non-developer might want to change without touching a component lives
 * either here or in `src/content/*`. See README → "Editing content".
 */

export const siteConfig = {
  name: 'A Builder Hut',
  legalName: 'A Builder Hut',
  shortName: 'Builder Hut',
  tagline: 'Premium Fitness Experience in Maheshtala',
  /** Facebook page bio, verbatim brand voice. */
  promise: 'Building strength, crafting wellness — 24/7.',
  description:
    'A Builder Hut is a 24×7 air-conditioned premium gym with three branches across Maheshtala and Budge Budge, Kolkata. Strength, cardio, CrossFit, MMA, personal training, spa and a healthy cafeteria under one roof.',
  founded: 2022,
  /** Overridden per-environment. Falls back to the production domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://abuilderhut.com',
  locale: 'en_IN',
  timeZone: 'Asia/Kolkata',
  currency: 'INR',
  currencySymbol: '₹',

  contact: {
    /** Google Business Profile number for the Batanagar and Chandannagar branches. */
    phone: '+918276903867',
    phoneDisplay: '+91 82769 03867',
    /** Listed on the A Builder Hut 3.0 Facebook page. */
    phoneAlt: '+918981332647',
    phoneAltDisplay: '+91 89813 32647',
    whatsapp: '918276903867',
    email: 'hello@abuilderhut.com', // OWNER ACTION: replace with the mailbox you actually monitor.
    hours: 'Open 24 hours, every day',
  },

  social: {
    instagram: 'https://www.instagram.com/a_builder_hut/',
    instagramAlt: 'https://www.instagram.com/a_builder_hut_2.0/',
    facebook: 'https://www.facebook.com/builderhut22/',
    facebookAlt: 'https://www.facebook.com/p/A-Builder-Hut-30-Budge-Budge-61574711963786/',
    youtube: '', // No public channel found at build time — leave empty to hide the icon.
  },

  /** Aggregate of the three Google Business Profiles. Refresh when reviews grow. */
  reviews: {
    rating: 4.8,
    count: 448,
    verifiedOn: '2026-08-03',
  },
} as const;

export type NavItem = { href: string; label: string; description?: string };

export const mainNav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/branches', label: 'Branches' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/membership', label: 'Membership' },
  { href: '/personal-training', label: 'Personal Training' },
  { href: '/transformations', label: 'Transformations' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/bmi-calculator', label: 'BMI Calculator' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

/** The seven links that fit the desktop bar. Everything else lives in the menu sheet. */
export const primaryNav: NavItem[] = mainNav.filter((item) =>
  ['/', '/about', '/branches', '/facilities', '/membership', '/personal-training', '/contact'].includes(item.href),
);

export const footerNav = {
  train: mainNav.filter((i) => ['/facilities', '/personal-training', '/membership', '/bmi-calculator'].includes(i.href)),
  explore: mainNav.filter((i) => ['/about', '/branches', '/gallery', '/transformations'].includes(i.href)),
  help: mainNav.filter((i) => ['/faq', '/testimonials', '/blog', '/contact'].includes(i.href)),
};

/** Pre-filled WhatsApp deep link. `text` is encoded for you. */
export function whatsappLink(text = "Hi! I'd like to know more about A Builder Hut memberships.") {
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string = siteConfig.contact.phone) {
  return `tel:${phone}`;
}
