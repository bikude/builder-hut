import type { Metadata } from 'next';

import { Marquee } from '@/components/common/marquee';
import { BranchRail } from '@/components/home/branch-rail';
import { BrandIntro } from '@/components/home/brand-intro';
import { CtaBand } from '@/components/home/cta-band';
import { FacilitiesGrid } from '@/components/home/facilities-grid';
import { Hero } from '@/components/home/hero';
import { MembershipPreview } from '@/components/home/membership-preview';
import { ProgrammeTimeline } from '@/components/home/programme-timeline';
import { StatsBand } from '@/components/home/stats-band';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { buildMetadata } from '@/lib/seo';
import { graph, membershipServiceSchema } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'A Builder Hut — 24×7 Premium Gym in Maheshtala & Budge Budge',
  description:
    'Premium 24×7 air-conditioned gym with three branches in Maheshtala and Budge Budge, Kolkata. 65+ stations, MMA zone, CrossFit, personal training, spa and healthy cafeteria. Rated 4.8 across 448 Google reviews.',
  path: '/',
});

/** Ticker copy is the brand's own vernacular, taken from how the branches describe themselves. */
const TICKER = [
  'Open 24 × 7',
  'AC training floors',
  '65+ stations',
  'MMA zone',
  'Certified trainers',
  'CrossFit',
  'Healthy cafeteria',
  'Salon & spa',
  'Three branches',
];

export default function HomePage() {
  return (
    <>
      {/* Membership offers as structured data — home is where most price searches land. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(membershipServiceSchema())) }}
      />

      <Hero />
      <StatsBand />
      <Marquee items={TICKER} />
      <BrandIntro />
      <FacilitiesGrid />
      <BranchRail />
      <ProgrammeTimeline />
      <MembershipPreview />
      <TestimonialsSection />
      <CtaBand />
    </>
  );
}
