'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { AutoVideo } from '@/components/media/auto-video';
import { Button } from '@/components/ui/button';
import { branches, type Branch } from '@/content/branches';
import { brand, heroVideo, reels } from '@/content/media';
import { cn } from '@/lib/utils';

/**
 * Three branches, three posters.
 *
 * The most important section on the page: a visitor should be able to tell there are
 * three distinct Builder Hut experiences without reading a word, and pick one within a
 * couple of seconds of arriving. Each card carries only what a movie poster would —
 * moving footage, the mark, a three-to-five-word line, one button. Everything a visitor
 * would actually need to decide (facilities, equipment, address, hours) lives one tap
 * away on that branch's own page, not here.
 *
 * Card height is a percentage of the viewport rather than a fixed size, so on a phone
 * three cards read as three siblings within a short scroll rather than three more
 * full-screen sections to get through.
 */

const TAGLINE: Record<string, string> = {
  batanagar: 'Where it all began',
  'chandannagar-club': 'Train. Recover. Repeat.',
  'budge-budge-3-0': 'Bright, modern, family-first',
};

const LOGO_BY_SLUG: Record<string, string> = {
  batanagar: brand.logo.batanagar,
  'chandannagar-club': brand.logo.club,
  'budge-budge-3-0': brand.logo.threeZero,
};

const ACCENT_BORDER: Record<Branch['accent'], string> = {
  batanagar: 'hover:border-brand-bullion/70',
  club: 'hover:border-brand-blood/70',
  'three-zero': 'hover:border-brand-copper/70',
};

/** Falls back to that branch's own reel where no landscape film exists. */
function filmFor(slug: string) {
  return heroVideo(slug) ?? reels.find((reel) => reel.branchSlug === slug) ?? null;
}

export function BranchCards() {
  return (
    <section id="branches" className="relative border-y border-brand-chalk/8 bg-brand-ink py-16 sm:py-20">
      <div className="container">
        <h2 className="text-display-sm">
          Three <span className="text-engraved">huts</span>
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {branches.map((branch) => {
            const film = filmFor(branch.slug);
            return (
              <article
                key={branch.slug}
                className={cn(
                  'group relative flex h-[46svh] flex-col items-center justify-end overflow-hidden rounded-xl border border-brand-chalk/12 transition-colors duration-500 ease-hut sm:h-[50svh] lg:h-[56svh]',
                  ACCENT_BORDER[branch.accent],
                )}
              >
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  {film ? (
                    <AutoVideo
                      src={film.src}
                      poster={film.poster}
                      preload="none"
                      allowManualStart={false}
                      className="transition-transform duration-[1400ms] ease-hut group-hover:scale-105"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/50 to-brand-ink/10"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  <span className="relative block h-14 w-14">
                    <Image src={LOGO_BY_SLUG[branch.slug]} alt={branch.name} fill sizes="56px" className="object-contain" />
                  </span>

                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-chalk/85">
                    {TAGLINE[branch.slug]}
                  </p>

                  <Button asChild size="sm" variant="bullion">
                    <Link href={`/branches/${branch.slug}`}>
                      Explore
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
