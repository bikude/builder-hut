import type { Metadata, Viewport } from 'next';
import { Anton, IBM_Plex_Mono, Manrope } from 'next/font/google';

import { Preloader } from '@/components/common/preloader';
import { ScrollProgress } from '@/components/common/scroll-progress';
import { FloatingActions } from '@/components/layout/floating-actions';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { baseKeywords } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { siteGraph } from '@/lib/structured-data';

import './globals.css';

/**
 * Type system.
 *  - Anton      → display. Condensed, heavy, built for signage. Used large and uppercase.
 *  - Manrope    → body. Open counters keep long Bengali-English paragraphs readable.
 *  - Plex Mono  → data. Clock, stats, eyebrows, specs — anything that is a measurement.
 * Subsets are pinned to latin so the fetch stays small; `display: swap` keeps LCP text
 * painting immediately with the fallback stack declared in tailwind.config.ts.
 */
const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — 24×7 Premium Gym in Maheshtala & Budge Budge`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: baseKeywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: 'Health & Fitness',
  alternates: { canonical: '/' },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — 24×7 Premium Gym in Maheshtala`,
    description: siteConfig.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `${siteConfig.name} — 24×7 premium gym in Maheshtala` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — 24×7 Premium Gym in Maheshtala`,
    description: siteConfig.description,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#08070A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-brand-ink antialiased">
        {/* Local-business graph for all three branches — one script, whole site. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph()) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-brand-bullion focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-brand-ink"
        >
          Skip to content
        </a>

        <Preloader />
        <ScrollProgress />

        <SmoothScroll>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </SmoothScroll>

        <FloatingActions />
      </body>
    </html>
  );
}
