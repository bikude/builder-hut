'use client';

import { useRef } from 'react';

import { AutoVideo } from '@/components/media/auto-video';
import { heroVideo } from '@/content/media';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { gsap } from '@/lib/gsap';

/**
 * The hook.
 *
 * One line, one film, one idea — the beat that has to earn the next scroll. It replaced a
 * scrolling ticker of feature words, which said nine things and made nobody feel anything.
 *
 * The single animation: as the section is pinned, the film pushes in while the line
 * separates into its two halves and the second half lands in gold. It is the only pinned
 * scale on the site, which is what keeps it feeling expensive rather than routine.
 */
export function Hook() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const film = heroVideo('chandannagar-club');

  useIsomorphicLayoutEffect(() => {
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: '+=90%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        })
        .fromTo('[data-hook-film]', { scale: 1.25, opacity: 0.3 }, { scale: 1, opacity: 0.55, ease: 'none' }, 0)
        .fromTo('[data-hook-a]', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo('[data-hook-b]', { yPercent: 90, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none' }, 0.15);
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-brand-ink"
    >
      <div data-hook-film className="absolute inset-0 -z-20 opacity-55">
        {film && <AutoVideo src={film.src} poster={film.poster} preload="none" allowManualStart={false} />}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-ink via-brand-ink/55 to-brand-ink" aria-hidden="true" />

      <h2 className="container text-center text-display-lg">
        <span data-hook-a className="block overflow-hidden">
          Not just a gym.
        </span>
        <span data-hook-b className="block overflow-hidden text-engraved">
          A lifestyle.
        </span>
      </h2>
    </section>
  );
}
