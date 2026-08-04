import type { Metadata } from 'next';

import { BranchCard } from '@/components/branches/branch-card';
import { BranchMapLoader } from '@/components/branches/branch-map-loader';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { branches, totalReviews } from '@/content/branches';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Branches',
  description:
    'All three A Builder Hut branches — Batanagar and Chandannagar in Maheshtala, and 3.0 at Shyampur, Budge Budge. Addresses, maps, phone numbers, and open 24 hours at every one.',
  path: '/branches',
  keywords: ['A Builder Hut Batanagar', 'A Builder Hut Chandannagar', 'A Builder Hut 3.0 Budge Budge'],
});

export default function BranchesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Branches', path: '/branches' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Branches"
        title="Three huts, one membership"
        lede="Two in Maheshtala, one in Budge Budge. Every floor is air-conditioned, staffed and open at every hour — including the ones nobody else opens for."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Branches' }]}
        aside={
          <dl className="glass grid grid-cols-3 gap-6 rounded-lg p-6">
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Branches</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums text-brand-chalk">{branches.length}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Reviews</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums text-brand-chalk">{totalReviews}+</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">Open</dt>
              <dd className="mt-1 font-display text-3xl tabular-nums text-brand-chalk">24×7</dd>
            </div>
          </dl>
        }
      />

      <section id="all-branches" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch, index) => (
              <Reveal key={branch.slug} delay={index * 0.08} className="h-full">
                <BranchCard branch={branch} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="map" className="py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            eyebrow="On the map"
            title={<>All three, <span className="text-engraved">plotted</span></>}
            lede="Tap a marker for the address and a one-tap route. Directions open in Google Maps against the exact place, not a text search."
          />
          <Reveal className="mt-14">
            <BranchMapLoader className="h-[32rem]" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
