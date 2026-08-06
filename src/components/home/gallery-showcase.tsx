'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AutoVideo } from '@/components/media/auto-video';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { branches } from '@/content/branches';
import { galleryPhotos, reels, videos, type Photo } from '@/content/media';
import { cn } from '@/lib/utils';

/**
 * The gallery — the main attraction, placed accordingly.
 *
 * Two bands, both media, almost no words:
 *
 *   1. **Reels.** The five vertical clips, playing silently in a swipeable rail. These are
 *      the closest thing the gym has to what a member actually sees, and vertical video
 *      is the format this audience already scrolls all day.
 *   2. **Collections.** Every photograph, filterable by branch, opening full-screen.
 *
 * Only what is on screen decodes: `AutoVideo` pauses off-screen clips, so a rail of five
 * reels costs one or two decoders rather than five.
 *
 * Photographs are never rendered wider than their source. These top out around 720px, so
 * the tiles are sized to sit under that — an upscaled photo is what makes a premium site
 * look cheap, and there is no CSS that hides it.
 */

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? '';
const accentOf = (slug: string) => branches.find((branch) => branch.slug === slug)?.accentHex ?? '#C9A227';

export function GalleryShowcase() {
  const [filter, setFilter] = useState<'all' | string>('all');
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const shown = useMemo(
    () => (filter === 'all' ? galleryPhotos : galleryPhotos.filter((photo) => photo.branchSlug === filter)),
    [filter],
  );

  // Landscape section films sit in the rail alongside the vertical reels — more motion,
  // and it stops the rail reading as five clips of the same shape.
  const rail = useMemo(() => [...reels, ...videos.filter((video) => video.use === 'section')], []);

  return (
    <section id="gallery" className="relative overflow-hidden bg-brand-ink py-16 sm:py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display-sm">
            Inside the <span className="text-copper">huts</span>
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/gallery">
              Full gallery
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Reels ──────────────────────────────────────────────────────────
          Full-bleed and swipeable. Snap points so a thumb lands on a clip
          rather than between two. */}
      <div
        className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:px-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Short clips from the training floors"
      >
        {rail.map((clip) => (
          <figure
            key={clip.src}
            className={cn(
              'relative shrink-0 snap-center overflow-hidden rounded-xl border border-brand-chalk/12 bg-brand-forge',
              clip.orientation === 'portrait' ? 'aspect-[9/16] w-[62vw] sm:w-[15rem]' : 'aspect-video w-[86vw] sm:w-[26rem]',
            )}
          >
            <AutoVideo src={clip.src} poster={clip.poster} label={clip.alt} preload="none" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-ink/90 to-transparent p-4">
              <figcaption
                className="font-mono text-[0.625rem] uppercase tracking-[0.22em]"
                style={{ color: accentOf(clip.branchSlug) }}
              >
                {branchName(clip.branchSlug)}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      {/* ── Collections ────────────────────────────────────────────────── */}
      <div className="container mt-12">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photographs by branch">
          {[{ slug: 'all', label: 'All' }, ...branches.map((b) => ({ slug: b.slug, label: b.shortName }))].map(
            (option) => (
              <button
                key={option.slug}
                type="button"
                onClick={() => setFilter(option.slug)}
                aria-pressed={filter === option.slug}
                className={cn(
                  'rounded-full border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300 ease-hut',
                  filter === option.slug
                    ? 'border-brand-bullion bg-brand-bullion/15 text-brand-gilt'
                    : 'border-brand-chalk/12 text-brand-smoke hover:border-brand-chalk/30 hover:text-brand-chalk',
                )}
              >
                {option.label}
              </button>
            ),
          )}
        </div>

        <div className="mt-6 columns-2 gap-3 lg:columns-3 [&>*]:mb-3">
          {shown.map((photo) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setLightbox(photo)}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-brand-chalk/10"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.nativeWidth}
                height={photo.nativeHeight}
                loading="lazy"
                // Capped below the 720px source: never upscaled.
                sizes="(max-width: 1024px) 48vw, 400px"
                className="h-auto w-full object-cover transition-transform duration-700 ease-hut group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-end justify-end bg-brand-ink/0 p-3 opacity-0 transition-all duration-500 group-hover:bg-brand-ink/30 group-hover:opacity-100">
                <Maximize2 className="size-4 text-brand-gilt" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent closeLabel="Close photograph">
          {lightbox && (
            <figure className="overflow-hidden rounded-xl border border-brand-chalk/12 bg-brand-ink">
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={lightbox.nativeWidth}
                height={lightbox.nativeHeight}
                sizes="(max-width: 1100px) 96vw, 1100px"
                className="h-auto w-full object-contain"
              />
              <figcaption className="flex items-center justify-between gap-4 p-4">
                <DialogTitle
                  className="font-mono text-[0.625rem] uppercase tracking-[0.22em]"
                  style={{ color: accentOf(lightbox.branchSlug) }}
                >
                  {branchName(lightbox.branchSlug)}
                </DialogTitle>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
