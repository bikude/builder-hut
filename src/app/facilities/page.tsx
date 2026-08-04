import type { Metadata } from 'next';
import Link from 'next/link';

import { FacilityIcon } from '@/components/common/facility-icon';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { TiltCard } from '@/components/common/tilt-card';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';
import { facilities } from '@/content/facilities';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema, graph } from '@/lib/structured-data';

export const metadata: Metadata = buildMetadata({
  title: 'Facilities',
  description:
    'Strength, cardio, functional training, CrossFit, an MMA zone, gaming lounge, salon and spa, healthy cafeteria, lockers, personal training and diet guidance — across three air-conditioned 24×7 branches.',
  path: '/facilities',
  keywords: ['MMA gym Maheshtala', 'CrossFit Kolkata', 'AC gym Budge Budge', 'gym with spa Maheshtala'],
});

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? slug;

export default function FacilitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Facilities', path: '/facilities' },
              ]),
            ),
          ),
        }}
      />

      <PageHero
        eyebrow="Facilities"
        title="Everything under one roof"
        lede="Eleven things you can do inside an A Builder Hut. Where a facility sits at one branch only, the card says which one — nothing here is claimed for a floor that does not have it."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Facilities' }]}
      />

      <section id="all-facilities" className="border-b border-brand-chalk/8 py-24 sm:py-32">
        <div className="container">
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {facilities.map((facility, index) => (
              <Reveal as="li" key={facility.slug} delay={(index % 3) * 0.06}>
                <TiltCard className="flex h-full flex-col gap-4 rounded-lg p-7">
                  <div className="flex items-start justify-between gap-4">
                    <FacilityIcon name={facility.icon} className="size-7 text-brand-blood" />
                    {facility.spec && (
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-bullion">
                        {facility.spec}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl uppercase leading-none tracking-tight">{facility.title}</h2>
                  <p className="leading-relaxed text-brand-chalk/75">{facility.detail}</p>

                  <p className="mt-auto pt-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke">
                    {facility.branches.length === 0
                      ? 'Available at all three branches'
                      : `Only at ${facility.branches.map(branchName).join(', ')}`}
                  </p>
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="glass clip-slant relative overflow-hidden rounded-lg px-8 py-14 sm:px-14 sm:py-20">
            <div className="max-w-2xl">
              <SectionHeading
                eyebrow="Not sure which branch"
                title={<>Come and <span className="text-engraved">walk the floor</span></>}
                lede="Book a free trial and a trainer will show you the room, the equipment and the hours that suit your week. No card, no commitment."
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild variant="bullion" size="lg">
                  <Link href="/contact#free-trial">Book free trial</Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link href="/branches">Compare branches</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
