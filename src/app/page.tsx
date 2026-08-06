import type { Metadata } from 'next';

import { BranchCards } from '@/components/home/branch-cards';
import { CtaBand } from '@/components/home/cta-band';
import { Hero } from '@/components/home/hero';
import { Hook } from '@/components/home/hook';
import { buildMetadata } from '@/lib/seo';
import { graph, membershipServiceSchema } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'A Builder Hut — 24×7 Premium Gym in Maheshtala & Budge Budge',
  description:
    'Premium 24×7 air-conditioned gym with three branches in Maheshtala and Budge Budge, Kolkata. MMA zone, gaming lounge, café, spa, kids programme and certified trainers. Rated 4.8 across 448 Google reviews.',
  path: '/',
});

/**
 * Home — v2.
 *
 * Deliberately short. Four sections, no more: a cinematic hero, one hook, the three
 * branches, and one general-contact band. Every other page this site used to open with —
 * gallery, facilities, testimonials, membership pricing — still exists, but one tap away
 * on a branch page or its own route, never as homepage scroll depth.
 *
 * The homepage has exactly one job: get a visitor to recognise there are three distinct
 * Builder Hut experiences and pick one before they have scrolled past two screens.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(membershipServiceSchema())) }}
      />

      {/* 🎥 fullscreen hero film · one headline · two buttons */}
      <Hero />

      {/* 💪 the hook — one line, one film */}
      <Hook />

      {/* 🏢 three branches, three posters */}
      <BranchCards />

      {/* 📞 call · WhatsApp · maps · Instagram */}
      <CtaBand />
    </>
  );
}
