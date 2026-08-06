'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

import { AutoVideo } from '@/components/media/auto-video';
import { branches, type Branch } from '@/content/branches';
import { heroPhoto, heroVideo, reels } from '@/content/media';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * The three branches — the section the whole homepage exists to deliver.
 *
 * Each card is a movie poster: moving footage of that floor, the branch's own name set
 * large, a three-word tagline and one button. No addresses, no ratings, no facility
 * lists — all of that lives on the branch page, one tap away.
 *
 * Height is capped at roughly half the viewport so all three are recognisable within a
 * short scroll. A full-height card would look impressive and hide the fact that there
 * are three of them, which is the one thing this page has to communicate.
 *
 * The 3D tilt is real perspective, driven by pointer position over each card, and is
 * skipped entirely on touch (no hover state to speak of) and under reduced motion.
 */

/**
 * Display name, split so the second half can carry the branch accent.
 * Batanagar has no suffix — its name IS the brand, so it sets in full.
 */
const NAME: Record<string, { lead: string; accent?: string }> = {
  batanagar: { lead: 'A Builder', accent: 'Hut' },
  'chandannagar-club': { lead: 'A Builder Hut', accent: 'Club' },
  'budge-budge-3-0': { lead: 'A Builder Hut', accent: '3.0' },
};

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
  const still = heroPhoto(branch.slug);
  const { t } = useI18n();

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
            baseImage={
              still
                ? { src: still.src, alt: still.alt, width: still.nativeWidth, height: still.nativeHeight }
                : undefined
            }
            className="scale-105 transition-transform duration-[1600ms] ease-hut group-hover:scale-110"
          />
        )}
      </div>

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-brand-ink/15"
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

      {/* The real logo, small, in the corner — present but not competing with the name. */}
      <Image
        src={branch.logo}
        alt=""
        width={220}
        height={172}
        aria-hidden="true"
        className="absolute left-4 top-4 h-auto w-14 opacity-80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:w-16"
      />

      <div className="flex h-full flex-col items-center justify-end gap-4 p-6 text-center">
        {/* The name, set large and solid. Gold-on-video was unreadable, so the name is
            chalk with only the suffix in the branch accent, and it sits on its own
            scrim rather than directly on moving footage. */}
        <h3
          className="font-display text-[clamp(1.75rem,7vw,2.5rem)] uppercase leading-[0.92] tracking-tight text-brand-chalk [text-shadow:0_2px_18px_rgb(0_0_0_/_0.85)]"
          style={{ transform: 'translateZ(45px)' }}
        >
          {NAME[branch.slug]?.lead}
          {NAME[branch.slug]?.accent && (
            <>
              {' '}
              <span style={{ color: branch.accentHex }}>{NAME[branch.slug]?.accent}</span>
            </>
          )}
        </h3>

        <p
          className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-brand-chalk/85 [text-shadow:0_1px_10px_rgb(0_0_0_/_0.9)]"
          style={{ transform: 'translateZ(30px)' }}
        >
          {TAGLINE[branch.slug]}
        </p>

        <Link
          href={`/branches/${branch.slug}`}
          className="mt-1 inline-flex items-center gap-2 rounded-full border border-brand-chalk/30 bg-brand-ink/70 px-6 py-3 font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-chalk backdrop-blur-md transition-all duration-300 ease-hut hover:border-brand-bullion hover:bg-brand-ink/85 hover:text-brand-gilt"
          style={{ transform: 'translateZ(30px)' }}
        >
          {t.explore}
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
