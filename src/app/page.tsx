import type { Metadata } from 'next';

import { Marquee } from '@/components/common/marquee';
import { BranchCards } from '@/components/home/branch-cards';
import { NearestHut } from '@/components/home/nearest-hut';
import { CtaBand } from '@/components/home/cta-band';
import { FacilitiesGrid } from '@/components/home/facilities-grid';
import { GalleryShowcase } from '@/components/home/gallery-showcase';
import { Hero } from '@/components/home/hero';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { buildMetadata } from '@/lib/seo';
import { graph, membershipServiceSchema } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'A Builder Hut — 24×7 Premium Gym in Maheshtala & Budge Budge',
  description:
    'Premium 24×7 air-conditioned gym with three branches in Maheshtala and Budge Budge, Kolkata. MMA zone, gaming lounge, café, spa, kids programme and certified trainers. Rated 4.8 across 448 Google reviews.',
  path: '/',
});

/** The one text band on the page, and it is a ticker rather than a paragraph. */
const TICKER = ['Open 24 × 7', 'AC floors', 'MMA zone', 'Gaming lounge', 'Café & spa', 'Kids programme', 'Three branches'];

/**
 * Home.
 *
 * Media-first: film, then location, then three branches, then the gallery. The page is
 * deliberately short on words — the previous version opened with four prose sections
 * before a visitor saw the inside of a gym, which is a brochure, not a gym.
 *
 * The order answers the three questions a visitor actually arrives with, in order:
 * what does it look like → where is it → which one is mine. Everything else is one
 * scroll further down, or a tap away on a branch page.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(membershipServiceSchema())) }}
      />

      {/* 🎥 cinematic film · one headline · two buttons */}
      <Hero />

      {/* 📍 where you are, before anything is explained */}
      <NearestHut />

      {/* 🏢 three cards, each moving, one line each */}
      <BranchCards />

      {/* 🎬 the main attraction */}
      <GalleryShowcase />

      <Marquee items={TICKER} />

      {/* 🏋️ icons and photographs, not descriptions */}
      <FacilitiesGrid />

      {/* ⭐ what members say */}
      <TestimonialsSection />

      {/* 📞 call · WhatsApp · directions */}
      <CtaBand />
    </>
  );
}
