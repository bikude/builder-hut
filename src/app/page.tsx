import type { Metadata } from 'next';

import { BranchCards } from '@/components/home/branch-cards';
import { GeneralContact } from '@/components/home/general-contact';
import { Hero } from '@/components/home/hero';
import { Hook } from '@/components/home/hook';
import { buildMetadata } from '@/lib/seo';
import { graph, membershipServiceSchema } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'A Builder Hut — 24×7 Premium Gym in Maheshtala & Budge Budge',
  description:
    'Three premium 24×7 air-conditioned gyms across Maheshtala and Budge Budge, Kolkata. Rated 4.8 across 448 Google reviews.',
  path: '/',
});

/**
 * Home.
 *
 * Four sections, and it stays four. The page has exactly one job: impress in the first
 * two seconds, then get the visitor into one of the three branches. Everything else —
 * gallery, facilities, equipment, trainers, hours — lives on the branch pages, where
 * someone who has already chosen a hut will actually read it.
 *
 * If a section ever feels like it belongs here, it belongs on a branch page instead.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph(membershipServiceSchema())) }}
      />

      {/* 1 · fullscreen film, one headline, two buttons */}
      <Hero />

      {/* 2 · the hook — one line, one pinned animation */}
      <Hook />

      {/* 3 · the three branches. This is what the page is for. */}
      <BranchCards />

      {/* 4 · call · WhatsApp · maps · Instagram, folded in with "nearest to me" */}
      <GeneralContact />
    </>
  );
}
