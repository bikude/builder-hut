import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Phone } from 'lucide-react';

import { RatingStars } from '@/components/common/rating-stars';
import { Reveal } from '@/components/common/reveal';
import { SectionHeading } from '@/components/common/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, formatAddress } from '@/content/branches';
import { telLink } from '@/lib/site';
import { ordinal } from '@/lib/utils';

/**
 * Branch cards.
 *
 * Directions links carry the Google Place ID, so tapping one opens navigation to the
 * exact listing rather than a name search that can land on the wrong Maheshtala road.
 */
export function BranchesPreview() {
  return (
    <section id="branches" className="relative bg-brand-forge/40 py-20 lg:py-28">
      <div className="container flex flex-col gap-12">
        <SectionHeading
          eyebrow="Three floors · One membership"
          title={
            <>
              Find the hut <span className="text-gold">closest to you</span>
            </>
          }
          lede="Every branch runs 24 hours a day, every day of the year. Members train at whichever floor suits the day."
        />

        <ul className="grid gap-6 lg:grid-cols-3">
          {branches.map((branch, index) => (
            <Reveal as="li" key={branch.slug} delay={0.08 * index}>
              <article className="glass group flex h-full flex-col overflow-hidden rounded-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={branch.image}
                    alt={branch.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform [transition-duration:1200ms] ease-hut group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/20 to-transparent" aria-hidden="true" />
                  <span className="absolute left-4 top-4 font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-bullion">
                    Branch {ordinal(branch.index)}
                  </span>
                  <div className="absolute right-4 top-4">
                    <Badge variant="open">Open 24 h</Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-2xl uppercase leading-none tracking-tight text-brand-chalk">
                      {branch.name}
                    </h3>
                    <p className="text-sm italic leading-relaxed text-brand-smoke">{branch.tagline}</p>
                  </div>

                  {branch.rating && <RatingStars rating={branch.rating} reviewCount={branch.reviewCount} />}

                  <address className="not-italic text-sm leading-relaxed text-brand-smoke">
                    {formatAddress(branch)}
                  </address>

                  <ul className="flex flex-wrap gap-2">
                    {branch.highlights.slice(0, 3).map((highlight) => (
                      <li
                        key={highlight}
                        className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-brand-smoke"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Button asChild variant="forge" size="sm">
                      <a href={telLink(branch.phone)} aria-label={`Call ${branch.name}`}>
                        <Phone aria-hidden="true" />
                        Call
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={directionsUrl(branch)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Directions to ${branch.name}`}
                      >
                        <Navigation aria-hidden="true" />
                        Directions
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/branches#${branch.slug}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
