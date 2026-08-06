'use client';

import { Compass, Instagram, LoaderCircle, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { branches, directionsUrl } from '@/content/branches';
import { useI18n } from '@/lib/i18n';
import { whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * General contact — the homepage's last section, and its only remaining list.
 *
 * The geolocation ranking used to be a section of its own. It is folded in here instead,
 * because "which one is nearest" and "how do I reach one" are the same question, and the
 * homepage brief allows four sections rather than five. Pressing the compass reorders the
 * rows by distance; it changes nothing else.
 *
 * Location is opt-in and never leaves the browser: coordinates are used here to sort
 * three rows and are not transmitted or stored.
 */

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type Located = { lat: number; lng: number } | null;

export function GeneralContact() {
  const [coords, setCoords] = useState<Located>(null);
  const [asking, setAsking] = useState(false);
  const { t } = useI18n();

  const ranked = useMemo(() => {
    if (!coords) return branches.map((branch) => ({ branch, km: null as number | null }));
    return branches
      .map((branch) => ({ branch, km: distanceKm(coords, branch.coordinates) }))
      .sort((a, b) => a.km - b.km);
  }, [coords]);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) return;
    setAsking(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setAsking(false);
      },
      () => setAsking(false),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  return (
    <section id="contact" className="relative border-t border-brand-chalk/8 bg-brand-ink py-16 sm:py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display-sm">
            <span className="text-engraved">{t.visitToday}</span>
          </h2>
          {!coords && (
            <Button type="button" variant="glass" size="lg" onClick={locate} disabled={asking}>
              {asking ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Compass aria-hidden="true" />}
              {t.nearestToMe}
            </Button>
          )}
        </div>

        <ul className="mt-8 flex flex-col gap-3">
          {ranked.map(({ branch, km }, index) => (
            <li
              key={branch.slug}
              className={cn(
                'flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-brand-chalk/10 bg-brand-forge/50 p-4 sm:p-5',
              )}
            >
              <span
                className="font-display text-2xl leading-none"
                style={{ color: branch.accentHex }}
                aria-hidden="true"
              >
                {String(branch.index).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-display text-base uppercase leading-none tracking-tight sm:text-lg">
                  {branch.name}
                </p>
                <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-brand-smoke">
                  {branch.phoneDisplay}
                  {km !== null && (
                    <span className="text-emerald-300">
                      {' · '}
                      {km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`}
                      {index === 0 && ` · ${t.nearest}`}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="forge">
                  <a href={`tel:${branch.phone}`} aria-label={`Call ${branch.name}`}>
                    <Phone aria-hidden="true" />
                    {t.call}
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
                    {t.whatsapp}
                  </a>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <a
                    href={directionsUrl(branch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Directions to ${branch.name}`}
                  >
                    <MapPin aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <a
                    href={branch.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${branch.name} on Instagram`}
                  >
                    <Instagram aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
