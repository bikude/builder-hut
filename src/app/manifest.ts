import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/site';

/** Served at /manifest.webmanifest — makes the site installable on Android. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — 24×7 Premium Gym`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#08070A',
    theme_color: '#08070A',
    orientation: 'portrait',
    categories: ['health', 'fitness', 'sports'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
