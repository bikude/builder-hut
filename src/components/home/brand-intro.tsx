import Image from 'next/image';
import Link from 'next/link';
import { Clock, Snowflake, Users } from 'lucide-react';

import { Parallax } from '@/components/common/parallax';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';

const PILLARS = [
  {
    Icon: Clock,
    title: 'Open every hour',
    body: 'Night shifts, early starts, exam weeks — the floor is staffed and lit whenever you can get here.',
  },
  {
    Icon: Snowflake,
    title: 'Air-conditioned floors',
    body: 'Kolkata summers do not end sessions early at any of the three branches.',
  },
  {
    Icon: Users,
    title: 'Coached, not watched',
    body: 'Certified trainers correct technique on the floor. Beginners get the most attention, on purpose.',
  },
];

export function BrandIntro() {
  const club = branches[1];

  return (
    <section id="why-abh" className="relative overflow-hidden py-20 lg:py-28">
      <div className="container grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Since 2022 · Batanagar"
            title={
              <>
                A neighbourhood gym built to a <span className="text-gold">club standard</span>
              </>
            }
            lede="A Builder Hut started with one floor on Budge Budge Trunk Road. Three branches later, the idea has not changed: equipment that belongs in a premium club, at a price that works in Maheshtala, open at the hour you can actually train."
          />

          <ul className="flex flex-col gap-6">
            {PILLARS.map(({ Icon, title, body }, index) => (
              <Reveal as="li" key={title} delay={0.08 * index} className="flex gap-4">
                <span className="glass flex size-11 shrink-0 items-center justify-center rounded-md text-brand-bullion">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wide text-brand-chalk">{title}</h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-brand-smoke">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <Button asChild variant="outline" size="md">
              <Link href="/about">Read our story</Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <Parallax className="clip-slant aspect-[4/5] w-full rounded-lg" distance={70}>
            <Image
              src={club?.image ?? '/media/branches/chandannagar-club/floor-wide.jpg'}
              alt={club?.imageAlt ?? 'A Builder Hut Club training floor'}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Parallax>

          {/* Floating spec plate — the club's real headline numbers. */}
          <div className="glass absolute -bottom-6 left-4 flex gap-6 rounded-lg px-6 py-5 sm:left-auto sm:right-6">
            <div>
              <p className="font-display text-3xl leading-none text-brand-chalk">11,000</p>
              <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-brand-bullion">Sq ft club</p>
            </div>
            <div className="w-px bg-brand-chalk/15" aria-hidden="true" />
            <div>
              <p className="font-display text-3xl leading-none text-brand-chalk">65+</p>
              <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-brand-bullion">Stations</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
