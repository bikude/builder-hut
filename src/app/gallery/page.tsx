import type { Metadata } from 'next';
import { Info } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { gallery, galleryIsPlaceholderOnly } from '@/content/gallery';
import { siteConfig } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Gallery',
  description:
    'Inside A Builder Hut — training floors, equipment, the MMA zone, the cafeteria and the spa across all three branches in Maheshtala and Budge Budge.',
  path: '/gallery',
});

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Gallery', path: '/gallery' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Gallery"
        title="Inside the huts"
        lede={`${gallery.length} views across three branches — the floors, the racks, the combat zone, and the parts of the building that are not the gym.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />

      {galleryIsPlaceholderOnly && (
        <div className="border-b border-brand-bullion/25 bg-brand-bullion/8">
          <div className="container flex items-start gap-3 py-4">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-gilt" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-brand-chalk/85">
              These are branded placeholders at the correct aspect ratios. A Builder Hut’s own photographs belong to
              the gym and are not redistributed in this repository — see{' '}
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gilt underline-offset-4 hover:underline"
              >
                the Instagram page
              </a>{' '}
              for the real thing, and public/images/ASSETS.md for how to drop them in.
            </p>
          </div>
        </div>
      )}

      <section id="grid" className="py-20 sm:py-28">
        <div className="container">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
