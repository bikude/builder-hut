'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Compass, LoaderCircle, MapPin, Navigation, Phone } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Mascot } from '@/components/brand/mascot';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, formatAddress, type Branch } from '@/content/branches';
import { locationFilm } from '@/content/media';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { gsap } from '@/lib/gsap';
import { telLink } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * The branch rail.
 *
 * Three panels travelling sideways while the section is pinned, so moving between
 * branches is a lateral journey rather than a scroll down a list. Each panel wears its
 * own branch accent — gold for Batanagar, red for the Club, copper for 3.0 — sampled from
 * that branch's real lighting, so the three read as siblings instead of repaints.
 *
 * Two behaviours, one component
 * -----------------------------
 * On a pointer device with room, GSAP pins the section and drives the panels horizontally
 * from vertical scroll. On touch and narrow viewports that is replaced by native
 * horizontal scroll with snap points — hijacking scroll on a phone is how these sections
 * usually go wrong, and a swipe is what a thumb expects anyway.
 *
 * Location is opt-in
 * ------------------
 * Nothing is requested until the visitor presses the button. The browser then shows its
 * own permission prompt; if it is refused or unavailable the rail carries on in its
 * normal order and says so. Coordinates are used in the browser to sort three items and
 * are never sent anywhere.
 */

/** Great-circle distance in kilometres. Haversine — accurate enough at city scale. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const ACCENT_RING: Record<Branch['accent'], string> = {
  batanagar: 'group-hover:border-brand-bullion/60',
  club: 'group-hover:border-brand-blood/60',
  'three-zero': 'group-hover:border-brand-copper/60',
};

type LocationState =
  | { status: 'idle' }
  | { status: 'asking' }
  | { status: 'ready'; coords: { lat: number; lng: number } }
  | { status: 'denied'; reason: string };

export function BranchRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [location, setLocation] = useState<LocationState>({ status: 'idle' });

  const ordered = useMemo(() => {
    if (location.status !== 'ready') {
      return branches.map((branch) => ({ branch, km: null as number | null }));
    }
    return branches
      .map((branch) => ({ branch, km: distanceKm(location.coords, branch.coordinates) }))
      .sort((a, b) => (a.km ?? 0) - (b.km ?? 0));
  }, [location]);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocation({ status: 'denied', reason: 'This browser cannot share a location.' });
      return;
    }
    setLocation({ status: 'asking' });
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          status: 'ready',
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
        }),
      () =>
        setLocation({
          status: 'denied',
          reason: 'No problem — all three are listed below, nearest first once you allow it.',
        }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  // Pinned horizontal travel. Desktop only: below lg the track is a native snap scroller.
  useIsomorphicLayoutEffect(() => {
    if (prefersReduced) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add('(min-width: 1024px) and (pointer: fine)', () => {
        const travel = () => track.scrollWidth - window.innerWidth + 96;
        gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // Scroll distance matches travel distance, so the pace feels one-to-one.
            end: () => `+=${travel()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="branch-rail"
      className="relative overflow-hidden border-y border-brand-chalk/8 bg-brand-ink py-20 lg:min-h-screen lg:py-0"
    >
      {/* The satellite zoom cut from the walkthrough film. It belongs here, where the
          subject is literally where you are. */}
      <video
        className="absolute inset-0 -z-20 size-full object-cover opacity-[0.14]"
        src={locationFilm.src}
        poster={locationFilm.poster}
        muted
        loop
        playsInline
        preload="none"
        autoPlay={!prefersReduced}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-ink via-brand-ink/85 to-brand-ink" aria-hidden="true" />

      <div className="lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
        <div className="container">
          <div className="flex flex-col gap-6 pb-10 lg:pb-14">
            <span className="flex items-center gap-3 font-mono text-eyebrow uppercase text-brand-gilt">
              <span className="h-px w-10 bg-brand-bullion/60" aria-hidden="true" />
              Three huts
            </span>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-[14ch] text-display-md">
                Find your <span className="text-copper">nearest hut</span>
              </h2>

              <div className="flex flex-col items-start gap-2">
                {location.status === 'ready' ? (
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-emerald-300">
                    Sorted by distance from you
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="glass"
                    size="lg"
                    onClick={requestLocation}
                    disabled={location.status === 'asking'}
                  >
                    {location.status === 'asking' ? (
                      <LoaderCircle className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Compass aria-hidden="true" />
                    )}
                    {location.status === 'asking' ? 'Locating' : 'Find the nearest to me'}
                  </Button>
                )}
                <p className="max-w-xs font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-brand-smoke">
                  {location.status === 'denied'
                    ? location.reason
                    : 'Used in your browser to sort three branches. Never sent anywhere.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className={cn(
            'flex gap-5 px-5 sm:px-6 lg:px-10',
            // Touch and narrow: native snap scrolling. Desktop: GSAP drives x, so the
            // element must not also be scrollable or the two fight each other.
            'snap-x snap-mandatory overflow-x-auto pb-4 lg:overflow-visible lg:pb-0',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {ordered.map(({ branch, km }, index) => (
            <article
              key={branch.slug}
              className={cn(
                'group relative flex w-[86vw] shrink-0 snap-center flex-col overflow-hidden rounded-xl border border-brand-chalk/10 bg-brand-forge/70 backdrop-blur-xl transition-colors duration-500 ease-hut',
                'sm:w-[62vw] lg:w-[46vw] xl:w-[38vw]',
                ACCENT_RING[branch.accent],
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={branch.image}
                  alt={branch.imageAlt}
                  fill
                  // Capped at the 720px source width — upscaling these is what would make
                  // the whole page look cheap.
                  sizes="(max-width: 1024px) 86vw, 640px"
                  className="object-cover transition-transform duration-[1200ms] ease-hut group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/30 to-transparent" aria-hidden="true" />

                <span
                  className="absolute left-5 top-5 font-mono text-[0.625rem] uppercase tracking-[0.28em]"
                  style={{ color: branch.accentHex }}
                >
                  {String(branch.index).padStart(2, '0')} · {branch.character}
                </span>

                {km !== null && (
                  <span className="absolute right-5 top-5 rounded-full bg-brand-ink/80 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-emerald-300">
                    {km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`}
                    {index === 0 && ' · nearest'}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                <div>
                  <h3 className="font-display text-2xl uppercase leading-none tracking-tight sm:text-3xl">
                    {branch.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-brand-smoke">{branch.tagline}</p>
                </div>

                <address className="flex items-start gap-3 not-italic text-sm leading-relaxed text-brand-chalk/70">
                  <MapPin className="mt-0.5 size-4 shrink-0" style={{ color: branch.accentHex }} aria-hidden="true" />
                  {formatAddress(branch)}
                </address>

                <ul className="flex flex-wrap gap-2">
                  {branch.highlights.slice(0, 3).map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-brand-smoke"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm" variant="bullion">
                    <Link href={`/branches/${branch.slug}`}>Explore</Link>
                  </Button>
                  <Button asChild size="sm" variant="glass">
                    <a href={directionsUrl(branch)} target="_blank" rel="noopener noreferrer">
                      <Navigation aria-hidden="true" />
                      Navigate
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <a href={telLink(branch.phone)}>
                      <Phone aria-hidden="true" />
                      Call
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="container hidden lg:block">
          <p className="pt-10 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-brand-smoke">
            Keep scrolling to travel between branches
          </p>
        </div>
      </div>

      {/* The mascot points the way here — location is the one place a nudge earns itself. */}
      <Mascot act="point" size={220} facing="right" className="absolute bottom-8 left-[3vw] hidden xl:block" />
    </section>
  );
}
