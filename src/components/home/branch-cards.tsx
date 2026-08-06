'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

import { AutoVideo } from '@/components/media/auto-video';
import { branches, type Branch } from '@/content/branches';
import { heroVideo, reels } from '@/content/media';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * The three branches — the section the whole homepage exists to deliver.
 *
 * Each card is a movie poster: moving footage of that floor, the branch's own gold
 * lockup, a three-word tagline and one button. No addresses, no ratings, no facility
 * lists — all of that lives on the branch page, one tap away.
 *
 * Height is capped at roughly half the viewport so all three are recognisable within a
 * short scroll. A full-height card would look impressive and hide the fact that there
 * are three of them, which is the one thing this page has to communicate.
 *
 * The 3D tilt is real perspective, driven by pointer position over each card, and is
 * skipped entirely on touch (no hover state to speak of) and under reduced motion.
 */

const TAGLINE: Record<string, string> = {
  batanagar: 'Where it started',
  'chandannagar-club': 'Iron and lifestyle',
  'budge-budge-3-0': 'The newest hut',
};

const GLOW: Record<Branch['accent'], string> = {
  batanagar: 'hover:shadow-glow-gold',
  club: 'hover:shadow-glow-red',
  'three-zero': 'hover:shadow-glow-copper',
};

/** Falls back to the branch's own reel where no landscape film exists. */
const filmFor = (slug: string) => heroVideo(slug) ?? reels.find((reel) => reel.branchSlug === slug) ?? null;

function BranchCard({ branch }: { branch: Branch }) {
  const cardRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const film = filmFor(branch.slug);

  const tilt = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || prefersReduced || event.pointerType !== 'mouse') return;
    const rect = card.getBoundingClientRect();
    // −0.5…0.5 from the card's centre, so the tilt is symmetrical about the middle.
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * 11).toFixed(2)}deg`);
    // The specular sheen follows the cursor, which is what makes it read as a lit
    // surface rather than a rotating rectangle.
    card.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
    card.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const reset = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={tilt}
      onPointerLeave={reset}
      className={cn(
        'group relative isolate overflow-hidden rounded-2xl border border-brand-chalk/12 bg-brand-forge',
        // ~50% of a phone viewport; taller and steadier on desktop.
        'h-[48svh] min-h-[19rem] md:h-[30rem]',
        'transition-[transform,box-shadow,border-color] duration-500 ease-hut',
        'hover:border-brand-chalk/25',
        GLOW[branch.accent],
      )}
      style={{
        transform: 'perspective(1100px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {film && (
          <AutoVideo
            src={film.src}
            poster={film.poster}
            preload="metadata"
            allowManualStart={false}
            className="scale-105 transition-transform duration-[1600ms] ease-hut group-hover:scale-110"
          />
        )}
      </div>

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink via-brand-ink/45 to-brand-ink/5"
        aria-hidden="true"
      />

      {/* Specular sheen, positioned by the pointer. Invisible until hover. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(40% 40% at var(--mx,50%) var(--my,50%), rgb(245 242 237 / 0.16) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="flex h-full flex-col items-center justify-end gap-5 p-6 text-center">
        {/* The branch's own lockup, lifted toward the viewer on the Z axis. */}
        <Image
          src={branch.logo}
          alt={branch.name}
          width={220}
          height={172}
          priority
          className="h-auto w-[min(62%,11rem)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-hut group-hover:-translate-y-1"
          style={{ transform: 'translateZ(45px)' }}
        />

        <p
          className="font-mono text-[0.625rem] uppercase tracking-[0.28em]"
          style={{ color: branch.accentHex, transform: 'translateZ(30px)' }}
        >
          {TAGLINE[branch.slug]}
        </p>

        <Link
          href={`/branches/${branch.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-brand-chalk/25 bg-brand-ink/60 px-6 py-3 font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-chalk backdrop-blur-md transition-all duration-300 ease-hut hover:border-brand-bullion hover:text-brand-gilt"
          style={{ transform: 'translateZ(30px)' }}
        >
          Explore
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          <span className="sr-only">{branch.name}</span>
        </Link>
      </div>
    </article>
  );
}

export function BranchCards() {
  return (
    <section id="branches" className="relative bg-brand-ink py-14 sm:py-20">
      <div className="container grid gap-4 md:grid-cols-3">
        {branches.map((branch) => (
          <BranchCard key={branch.slug} branch={branch} />
        ))}
      </div>
    </section>
  );
}
