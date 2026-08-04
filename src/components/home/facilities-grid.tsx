import Link from 'next/link';

import { FacilityIcon } from '@/components/common/facility-icon';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { TiltCard } from '@/components/common/tilt-card';
import { Button } from '@/components/ui/button';
import { facilities } from '@/content/facilities';
import { branches } from '@/content/branches';

/** Branch short names, so a facility card can say where it is available. */
const branchNames = new Map(branches.map((branch) => [branch.slug, branch.shortName]));

export function FacilitiesGrid() {
  return (
    <section id="facilities" className="relative py-20 lg:py-28">
      <div className="container flex flex-col gap-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What's on the floor"
            title={
              <>
                Eleven reasons you never need a <span className="text-gold">second membership</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <Button asChild variant="outline" size="md">
              <Link href="/facilities">All facilities</Link>
            </Button>
          </Reveal>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, index) => (
            <Reveal as="li" key={facility.slug} delay={0.04 * (index % 3)}>
              <TiltCard className="group h-full" intensity={6}>
                <article className="glass flex h-full flex-col gap-4 rounded-lg p-6 transition-colors duration-500 hover:border-brand-bullion/35">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-md bg-red-forge text-brand-chalk shadow-glow-red transition-transform duration-500 ease-hut group-hover:scale-105">
                      <FacilityIcon name={facility.icon} className="size-5" />
                    </span>
                    {facility.spec && (
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-brand-bullion">
                        {facility.spec}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl uppercase tracking-wide text-brand-chalk">{facility.title}</h3>
                    <p className="text-sm leading-relaxed text-brand-smoke">{facility.summary}</p>
                  </div>

                  <p className="mt-auto font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-brand-smoke/70">
                    {facility.branches.length === 0
                      ? 'All branches'
                      : facility.branches.map((slug) => branchNames.get(slug) ?? slug).join(' · ')}
                  </p>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
