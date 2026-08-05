import { branches, formatAddress, type Branch } from '@/content/branches';
import { plans } from '@/content/membership';
import { siteConfig } from '@/lib/site';

/**
 * Schema.org graphs.
 *
 * Google reads these to build the knowledge panel, the "open 24 hours" chip and the
 * star rating in local results. Three types matter here:
 *  - HealthClub (one per branch, with geo + opening hours + aggregate rating)
 *  - Organization (the brand that owns them)
 *  - WebSite (enables the sitelinks search box)
 *
 * Ratings must reflect the live Google listings. They are read from
 * `src/content/branches.ts`, so updating that file updates the markup too.
 */

const socialProfiles = [
  siteConfig.social.instagram,
  siteConfig.social.instagramAlt,
  siteConfig.social.facebook,
  siteConfig.social.facebookAlt,
].filter(Boolean);

export function branchSchema(branch: Branch) {
  return {
    '@type': 'HealthClub',
    '@id': `${siteConfig.url}/branches/${branch.slug}#gym`,
    name: branch.name,
    description: branch.tagline,
    url: `${siteConfig.url}/branches/${branch.slug}`,
    telephone: branch.phone,
    image: `${siteConfig.url}${branch.image}`,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.addressLines.join(', '),
      addressLocality: branch.locality,
      addressRegion: branch.region,
      postalCode: branch.postalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: branch.coordinates.lat,
      longitude: branch.coordinates.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${branch.coordinates.lat},${branch.coordinates.lng}&query_place_id=${branch.placeId}`,
    openingHoursSpecification: branch.alwaysOpen
      ? [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ]
      : [],
    amenityFeature: branch.highlights.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    ...(branch.rating && branch.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: branch.rating,
            reviewCount: branch.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    foundingDate: String(siteConfig.founded),
    sameAs: socialProfiles,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.contact.phone,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en', 'bn', 'hi'],
      },
    ],
    department: branches.map((branch) => ({ '@id': `${siteConfig.url}/branches/${branch.slug}#gym` })),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: 'en-IN',
    publisher: { '@id': `${siteConfig.url}#organization` },
  };
}

/** Membership tiers as Offers, so price-aware snippets can pick them up. */

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

export function faqSchema(entries: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/** Wraps any number of schema nodes into one @graph document. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Full site-level graph, injected once in the root layout. */
export function siteGraph() {
  return graph(organizationSchema(), websiteSchema(), ...branches.map(branchSchema));
}

/** Address string helper shared with the footer, so markup and copy cannot drift apart. */
export { formatAddress };

/**
 * Membership is described as a service rather than an `Offer`.
 *
 * Google requires a price on an Offer, and the gym does not publish one — an Offer with a
 * fabricated or omitted price is invalid structured data and risks a manual action. A
 * `Service` node states truthfully what is sold without claiming a rate.
 */
export function membershipServiceSchema() {
  return {
    '@type': 'Service',
    name: 'Gym membership at A Builder Hut',
    serviceType: 'Fitness membership',
    provider: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    areaServed: ['Maheshtala', 'Budge Budge', 'Kolkata'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Membership terms',
      itemListElement: plans.map((plan) => ({
        '@type': 'OfferCatalog',
        name: `${plan.name} — ${plan.months} ${plan.months === 1 ? 'month' : 'months'}`,
      })),
    },
  };
}
