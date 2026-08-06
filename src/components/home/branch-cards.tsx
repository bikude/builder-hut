'use client';

import Link from 'next/link';
import { ArrowRight, Navigation } from 'lucide-react';

import { Mascot } from '@/components/brand/mascot';
import { AutoVideo } from '@/components/media/auto-video';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, type Branch } from '@/content/branches';
import { heroVideo, reels } from '@/content/media';
import { cn } from '@/lib/utils';

/**
 * Three branches, three cards, one line of copy each.
 *
 * Every card leads with moving footage of that actual floor, because a still cannot show
 * what a gym feels like at 11pm and a paragraph certainly cannot. The copy is a single
 * line — the card's job is to make you want to open it, not to explain the branch.
 *
 * Batanagar and the Club have their own landscape films. 3.0 does not, so it borrows its
 * own vertical reel rather than falling back to a static photograph: motion on two cards
 * and a frozen third would read as a broken card.
 */

const ONE_LINER: Record<string, string> = {
  batanagar: 'Where it started. Raw steel, open all night.',
  'chandannagar-club': 'The big floor. Iron, gaming, café, spa.',
  'budge-budge-3-0': 'The newest hut. Gold light, Viva iron, kids welcome.',
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
    <section id="branches" className="relative overflow-hidden border-y border-brand-chalk/8 bg-brand-ink py-16 sm:py-20">
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
                  'group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-xl border border-brand-chalk/12 transition-colors duration-500 ease-hut sm:min-h-[30rem]',
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
                    className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/55 to-brand-ink/10"
                    aria-hidden="true"
                  />
                </div>

                <div className="p-6">
                  <span
                    className="font-mono text-[0.625rem] uppercase tracking-[0.28em]"
                    style={{ color: branch.accentHex }}
                  >
                    {String(branch.index).padStart(2, '0')} · {branch.character}
                  </span>

                  <h3 className="mt-3 font-display text-2xl uppercase leading-none tracking-tight sm:text-3xl">
                    {branch.name}
                  </h3>

                  <p className="mt-3 text-brand-chalk/75">{ONE_LINER[branch.slug]}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="bullion">
                      <Link href={`/branches/${branch.slug}`}>
                        Explore
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="glass">
                      <a href={directionsUrl(branch)} target="_blank" rel="noopener noreferrer">
                        <Navigation aria-hidden="true" />
                        Navigate
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
          {/* Moment three of four: the mascot lifts while you choose a hut. */}
      <Mascot
        act="deadlift"
        size={190}
        facing="right"
        className="pointer-events-none absolute -bottom-1 left-[1vw] size-[110px] opacity-90 xl:size-[180px]"
      />
</section>
  );
}
