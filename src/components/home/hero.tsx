'use client';

import Link from 'next/link';
import { ArrowDown, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Mascot } from '@/components/brand/mascot';
import { IronSceneLoader } from '@/components/three/iron-scene-loader';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';
import { heroVideo } from '@/content/media';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { gsap } from '@/lib/gsap';
import { siteConfig, telLink, whatsappLink } from '@/lib/site';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const film = heroVideo('batanagar');

  useIsomorphicLayoutEffect(() => {
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero-word]', { yPercent: 118, duration: 1.1, stagger: 0.085 })
        .from('[data-hero-eyebrow]', { opacity: 0, y: 14, duration: 0.7 }, 0.25)
        .from('[data-hero-sub]', { opacity: 0, y: 18, duration: 0.8 }, 0.7)
        .from('[data-hero-action]', { opacity: 0, y: 20, duration: 0.7, stagger: 0.08 }, 0.9)
        .from('[data-hero-status]', { opacity: 0, duration: 0.8 }, 1.1);

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

  // Several mobile browsers refuse the first autoplay call and only allow it once the
  // element is on screen. Retrying on intersection is the difference between a moving
  // hero and a frozen poster frame on a good proportion of Android devices — and pausing
  // when it scrolls away stops the decoder running behind the rest of the page.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReduced) return;

    const attempt = () => void video.play().catch(() => undefined);
    attempt();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) attempt();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={rootRef}
      className="light-rays relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-brand-ink pb-16 pt-[var(--header-h)] sm:pb-24"
    >
      {/* 1 — the room */}
      <div data-hero-film className="absolute inset-0 -z-30">
        {film && !prefersReduced ? (
          <video
            ref={videoRef}
            className="size-full object-cover"
            src={film.src}
            poster={film.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={film?.poster} alt="" className="size-full object-cover" aria-hidden="true" />
        )}
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

          <p data-hero-sub className="max-w-xl text-lg leading-relaxed text-brand-chalk/75 sm:text-xl">
            Three air-conditioned floors across Maheshtala and Budge Budge. Certified trainers, iron that is
            maintained rather than merely present, and doors that never close.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div data-hero-action>
              <Button asChild variant="bullion" size="lg">
                <Link href="/contact#join">Join now</Link>
              </Button>
            </div>
            <div data-hero-action>
              <Button asChild variant="glass" size="lg">
                <a
                  href={whatsappLink('Hi! I would like to visit A Builder Hut.')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            </div>
            <div data-hero-action>
              <Button asChild variant="ghost" size="lg">
                <a href={telLink()}>
                  <Phone aria-hidden="true" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </Button>
            </div>
            <div data-hero-action>
              <Button asChild variant="ghost" size="lg">
                <Link href="#branch-rail">
                  <MapPin aria-hidden="true" />
                  Find your hut
                </Link>
              </Button>
            </div>
          </div>

          <div
            data-hero-status
            className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-brand-chalk/10 pt-6 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brand-smoke"
          >
            <span className="flex items-center gap-2 text-emerald-300">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              All three huts open now
            </span>
            <span>{branches.length} branches</span>
            <span>Open 24 × 7</span>
            <span className="flex items-center gap-2">
              <ArrowDown className="size-3 animate-bounce" aria-hidden="true" />
              Scroll
            </span>
          </div>
        </div>
      </div>

      {/* The mascot walks in once here, then does not appear again until a section
          explicitly asks for it. Hidden below lg: on a phone it would crowd the CTAs. */}
      <Mascot act="wave" size={320} facing="left" className="absolute bottom-24 right-[4vw] hidden lg:block" />
    </section>
  );
}
