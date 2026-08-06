'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useRef } from 'react';

import { Mascot } from '@/components/brand/mascot';
import { AutoVideo } from '@/components/media/auto-video';
import { IronSceneLoader } from '@/components/three/iron-scene-loader';
import { Button } from '@/components/ui/button';
import { heroVideo } from '@/content/media';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { gsap } from '@/lib/gsap';
import { siteConfig } from '@/lib/site';

/**
 * The hero.
 *
 * Built on the gym's own walkthrough film — the interior segment, cut out of a longer
 * promotional video whose satellite intro and logo outro were split off to other parts of
 * the site. It plays muted and looped behind the type, with a poster frame painted first
 * so Largest Contentful Paint lands on a real image instead of waiting for the decoder.
 *
 * Layering, back to front:
 *   1. video          — the room itself
 *   2. heat wash      — warm gradient that guarantees text contrast over any frame
 *   3. WebGL iron     — floating plates and dust, parallaxed by pointer
 *   4. type + actions — the only layer carrying information
 *
 * The headline animates per word behind a clipping box, so the words rise out of the line
 * rather than fading onto it. Reduced-motion visitors get the finished state immediately:
 * no video autoplay, no WebGL context, no timeline.
 */

const HEADLINE = ['Build', 'your', 'strongest', 'self'];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const film = heroVideo('batanagar');

  useIsomorphicLayoutEffect(() => {
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero-word]', { yPercent: 118, duration: 1.1, stagger: 0.085 })
        .from('[data-hero-eyebrow]', { opacity: 0, y: 14, duration: 0.7 }, 0.25)
        .from('[data-hero-action]', { opacity: 0, y: 20, duration: 0.7, stagger: 0.08 }, 0.9)

      // The film drifts and dims as the section leaves, so the next block reads as
      // arriving over the top rather than following behind.
      gsap.to('[data-hero-film]', {
        yPercent: 14,
        scale: 1.08,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReduced]);


  return (
    <section
      ref={rootRef}
      className="light-rays relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-brand-ink pb-16 pt-[var(--header-h)] sm:pb-24"
    >
      {/* 1 — the room */}
      <div data-hero-film className="absolute inset-0 -z-30">
        {film && <AutoVideo src={film.src} poster={film.poster} preload="metadata" allowManualStart={false} />}
      </div>

      {/* 2 — warm wash, so the type keeps contrast on whatever frame the film is showing */}
      <div className="absolute inset-0 -z-20 bg-heat-wash" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-t from-brand-ink via-brand-ink/72 to-brand-ink/40"
        aria-hidden="true"
      />

      {/* 3 — floating iron */}
      <IronSceneLoader intensity={1} className="-z-10" />

      {/* 4 — content */}
      <div className="container relative">
        <div className="flex flex-col gap-8">
          <span data-hero-eyebrow className="flex items-center gap-3 font-mono text-eyebrow uppercase text-brand-gilt">
            <span className="h-px w-10 bg-brand-bullion/60" aria-hidden="true" />
            Maheshtala &amp; Budge Budge · Since {siteConfig.founded}
          </span>

          <h1 className="max-w-[16ch] text-display-lg">
            {HEADLINE.map((word, index) => (
              <span key={word} className="block overflow-hidden pb-[0.06em]">
                <span data-hero-word className={index === HEADLINE.length - 1 ? 'block text-engraved' : 'block'}>
                  {word}
                </span>
              </span>
            ))}
          </h1>


          <div className="flex flex-wrap items-center gap-3">
            <div data-hero-action>
              <Button asChild variant="bullion" size="lg">
                <Link href="/contact#join">Join now</Link>
              </Button>
            </div>
            <div data-hero-action>
              <Button asChild variant="glass" size="lg">
                <Link href="#nearest">
                  <MapPin aria-hidden="true" />
                  Find your nearest hut
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* The mascot walks in once here, then does not appear again until a section
          explicitly asks for it. Hidden below lg: on a phone it would crowd the CTAs. */}
      <Mascot act="wave" size={300} facing="left" className="absolute bottom-20 right-[2vw] size-[170px] sm:bottom-24 sm:right-[4vw] sm:size-[240px] lg:size-[320px]" />
    </section>
  );
}
