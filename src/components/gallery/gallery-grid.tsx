'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { gallery, galleryCategories, type GalleryItem } from '@/content/gallery';
import { branches } from '@/content/branches';
import { cn } from '@/lib/utils';

const RATIO_CLASS: Record<GalleryItem['ratio'], string> = {
  portrait: 'aspect-[5/7]',
  landscape: 'aspect-[16/10]',
  square: 'aspect-square',
};

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? '';

/**
 * Masonry gallery with a keyboard-navigable lightbox.
 *
 * CSS multi-column gives true masonry with no JavaScript measuring and no layout thrash
 * on resize, which a JS masonry library cannot match on a mid-range Android phone.
 * The trade-off is reading order runs down each column rather than across — acceptable
 * for a photo grid, and the lightbox restores a linear order for keyboard users.
 */
export function GalleryGrid() {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]['value']>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () => (category === 'all' ? gallery : gallery.filter((entry) => entry.category === category)),
    [category],
  );

  // Changing the filter while the lightbox is open would point the index at a different
  // photo, so the lightbox closes with the filter.
  useEffect(() => setOpenIndex(null), [category]);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, step]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter photographs by area">
        {galleryCategories.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => setCategory(entry.value)}
            aria-pressed={category === entry.value}
            className={cn(
              'rounded-full border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-all duration-300 ease-hut',
              category === entry.value
                ? 'border-brand-bullion bg-brand-bullion/15 text-brand-gilt'
                : 'border-brand-chalk/12 text-brand-smoke hover:border-brand-chalk/30 hover:text-brand-chalk',
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-brand-chalk/10 text-left"
          >
            <div className={cn('relative w-full', RATIO_CLASS[entry.ratio])}>
              <Image
                src={entry.src}
                alt={entry.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
                className="object-cover transition-transform duration-700 ease-hut group-hover:scale-105"
              />
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-hut group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-bullion">
                {branchName(entry.branchSlug)}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-brand-chalk">{entry.alt}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent closeLabel="Close photograph">
          {active && (
            <div className="glass overflow-hidden rounded-lg">
              <div className="relative aspect-[16/10] w-full bg-brand-ink">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 1100px) 96vw, 1100px"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <DialogTitle className="font-display text-lg uppercase tracking-tight text-brand-chalk">
                    {branchName(active.branchSlug)}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-brand-smoke">{active.alt}</DialogDescription>
                  <p className="mt-3 flex items-start gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brand-bullion">
                    <Info className="mt-px size-3 shrink-0" aria-hidden="true" />
                    {branchName(active.branchSlug)} · shot on location
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="flex size-10 items-center justify-center rounded-full border border-brand-chalk/15 text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    <span className="sr-only">Previous photograph</span>
                  </button>
                  <span className="font-mono text-[0.625rem] tabular-nums tracking-[0.2em] text-brand-smoke">
                    {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="flex size-10 items-center justify-center rounded-full border border-brand-chalk/15 text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion"
                  >
                    <ArrowRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">Next photograph</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
