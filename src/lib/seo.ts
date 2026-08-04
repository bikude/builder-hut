import type { Metadata } from 'next';

import { siteConfig } from '@/lib/site';

type PageSeo = {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/membership". Home is "/". */
  path: string;
  /** Absolute or root-relative image path. Falls back to the generated OG image. */
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
};

/**
 * Builds a complete Metadata object: canonical URL, Open Graph, Twitter card and
 * robots directives. Every page should call this rather than hand-rolling tags,
 * so a change to the OG defaults propagates everywhere at once.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = '/og.jpg',
  keywords = [],
  type = 'website',
  publishedTime,
}: PageSeo): Metadata {
  const url = `${siteConfig.url}${path === '/' ? '' : path}`;
  const fullTitle = path === '/' ? title : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [...baseKeywords, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: image, width: 1200, height: 630, alt: `${siteConfig.name} — ${title}` }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/** Local-intent terms that belong on every page of a three-branch neighbourhood gym. */
export const baseKeywords = [
  'gym in Maheshtala',
  'gym in Batanagar',
  'gym in Budge Budge',
  '24 hours gym Kolkata',
  'AC gym Maheshtala',
  'A Builder Hut',
  'best gym near me Maheshtala',
  'personal trainer Maheshtala',
  'MMA training Kolkata',
  'weight loss gym Kolkata',
  'fitness centre Chandannagar Maheshtala',
];
