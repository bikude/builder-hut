'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';

import { RatingStars } from '@/components/common/rating-stars';
import { TiltCard } from '@/components/common/tilt-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { directionsUrl, formatAddress, type Branch } from '@/content/branches';
import { telLink } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Full branch card: photo, address, rating, hours and the two actions someone standing
 * on the Trunk Road actually wants — call, and directions. Both are plain anchors so
 * they work without JavaScript and open the device's native dialler and maps app.
 */
export function BranchCard({ branch, className }: { branch: Branch; className?: string }) {
  return (
    <TiltCard className={cn('flex h-full flex-col overflow-hidden rounded-lg', className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={branch.image}
          alt={branch.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-hut"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/25 to-transparent"
          aria-hidden="true"
        />

        <span className="absolute left-4 top-4 font-mono text-[0.625rem] uppercase tracking-[0.28em] text-brand-bullion">
          Branch {String(branch.index).padStart(2, '0')}
        </span>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
          {branch.alwaysOpen && (
            <Badge variant="open">
              <Clock className="size-3" aria-hidden="true" />
              Open 24 hours
            </Badge>
          )}
          {branch.openedYear !== null && <Badge>Since {branch.openedYear}</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h3 className="font-display text-2xl uppercase leading-none tracking-tight">{branch.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-smoke">{branch.tagline}</p>
        </div>

        {branch.rating !== null && (
          <RatingStars rating={branch.rating} reviewCount={branch.reviewCount ?? undefined} />
        )}

        <address className="flex items-start gap-3 not-italic">
          <MapPin className="mt-0.5 size-4 shrink-0 text-brand-blood" aria-hidden="true" />
          <span className="text-sm leading-relaxed text-brand-chalk/75">{formatAddress(branch)}</span>
        </address>

        {branch.highlights.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {branch.highlights.slice(0, 4).map((highlight) => (
              <li
                key={highlight}
                className="rounded-full border border-brand-chalk/12 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-smoke"
              >
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button asChild size="sm" variant="forge">
            <a href={telLink(branch.phone)}>
              <Phone aria-hidden="true" />
              Call
            </a>
          </Button>
          <Button asChild size="sm" variant="glass">
            <a href={directionsUrl(branch)} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden="true" />
              Directions
            </a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/branches/${branch.slug}`}>Details</Link>
          </Button>
        </div>
      </div>
    </TiltCard>
  );
}
