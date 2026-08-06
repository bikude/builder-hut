'use client';

import { Compass, LoaderCircle, MessageCircle, Navigation, Phone } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Mascot } from '@/components/brand/mascot';
import { AutoVideo } from '@/components/media/auto-video';
import { Button } from '@/components/ui/button';
import { branches, directionsUrl, type Branch } from '@/content/branches';
import { locationFilm } from '@/content/media';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { telLink, whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Find your nearest hut.
 *
 * Sits directly under the hero because it is the one thing every visitor actually needs:
 * which of the three is closest, and how do I get there or ring them. Three rows, a
 * distance, three buttons. No paragraphs.
 *
 * The backdrop is the satellite zoom cut from the gym's own walkthrough film — the only
 * place on the site where the subject is literally location.
 *
 * Location is opt-in and stays local
 * ----------------------------------
 * Nothing is requested until the button is pressed; the browser then shows its own
 * prompt. Coordinates are used in this component to sort three items and are never sent
 * anywhere. If permission is refused the list simply keeps its default order.
 */

/** Great-circle distance in kilometres. Haversine is ample at city scale. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type LocationState =
  | { status: 'idle' }
  | { status: 'asking' }
  | { status: 'ready'; coords: { lat: number; lng: number } }
  | { status: 'denied' };

const ACCENT_ROW: Record<Branch['accent'], string> = {
  batanagar: 'hover:border-brand-bullion/50',
  club: 'hover:border-brand-blood/50',
  'three-zero': 'hover:border-brand-copper/50',
};

export function NearestHut() {
  const [location, setLocation] = useState<LocationState>({ status: 'idle' });
  const prefersReduced = usePrefersReducedMotion();

  const ranked = useMemo(() => {
    if (location.status !== 'ready') return branches.map((branch) => ({ branch, km: null as number | null }));
    return branches
      .map((branch) => ({ branch, km: distanceKm(location.coords, branch.coordinates) }))
      .sort((a, b) => a.km - b.km);
  }, [location]);

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocation({ status: 'denied' });
      return;
    }
    setLocation({ status: 'asking' });
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({ status: 'ready', coords: { lat: position.coords.latitude, lng: position.coords.longitude } }),
      () => setLocation({ status: 'denied' }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  return (
    <section id="nearest" className="relative overflow-hidden border-y border-brand-chalk/8 bg-brand-ink py-14 sm:py-16">
      <div className="absolute inset-0 -z-20 opacity-[0.16]">
        <AutoVideo src={locationFilm.src} poster={locationFilm.poster} preload="none" allowManualStart={false} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-ink via-brand-ink/80 to-brand-ink" aria-hidden="true" />

      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display-sm">
            Your nearest <span className="text-copper">hut</span>
          </h2>

          {location.status !== 'ready' && (
            <Button type="button" variant="glass" size="lg" onClick={request} disabled={location.status === 'asking'}>
              {location.status === 'asking' ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Compass aria-hidden="true" />
              )}
              {location.status === 'denied' ? 'Try again' : 'Use my location'}
            </Button>
          )}
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {ranked.map(({ branch, km }, index) => (
            <li key={branch.slug}>
              <div
                className={cn(
                  'flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl border border-brand-chalk/10 bg-brand-forge/60 p-4 backdrop-blur-xl transition-colors duration-500 ease-hut sm:p-5',
                  ACCENT_ROW[branch.accent],
                )}
              >
                <span
                  className="font-display text-3xl leading-none"
                  style={{ color: branch.accentHex }}
                  aria-hidden="true"
                >
                  {String(branch.index).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg uppercase leading-none tracking-tight sm:text-xl">
                    {branch.name}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
                    {branch.locality} · Open 24×7
                    {km !== null && (
                      <span className="text-emerald-300">
                        {' · '}
                        {km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`}
                        {index === 0 && ' · nearest'}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="forge">
                    <a href={telLink(branch.phone)} aria-label={`Call ${branch.name}`}>
                      <Phone aria-hidden="true" />
                      Call
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="glass">
                    <a
                      href={whatsappLink(`Hi! I'd like to visit ${branch.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${branch.name}`}
                    >
                      <MessageCircle aria-hidden="true" />
                      WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <a
                      href={directionsUrl(branch)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Directions to ${branch.name}`}
                    >
                      <Navigation aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {location.status === 'denied' && (
          <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
            Location unavailable — all three are listed above.
          </p>
        )}
      </div>

      {/* Moment two of four: the mascot points at the list. */}
      {!prefersReduced && (
        <Mascot
          act="point"
          size={200}
          facing="right"
          className="pointer-events-none absolute -bottom-2 left-[1vw] size-[120px] opacity-90 lg:size-[190px]"
        />
      )}
    </section>
  );
}
