'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AutoVideo } from '@/components/media/auto-video';
import { branches } from '@/content/branches';
import type { Photo, Video } from '@/content/media';
import { cn } from '@/lib/utils';

/**
 * Fullscreen media viewer.
 *
 * One component for photographs and clips, because a visitor swiping through a gallery
 * should not hit a wall where the medium changes. Keyboard, swipe and click all drive the
 * same index.
 *
 * Only the active item and its two neighbours are mounted. A gallery of thirty would
 * otherwise hold thirty decoders and thirty full-resolution images in memory, which is
 * what turns a phone hot and drops the frame rate on the swipe itself.
 *
 * Built by hand rather than on a carousel library: the requirement is one axis, snap per
 * item, and a video that plays only when it is the active slide. A library would add
 * weight for options this does not use, and none of them pause off-screen video.
 */

export type MediaItem =
  | ({ kind: 'photo' } & Pick<Photo, 'src' | 'alt' | 'branchSlug' | 'nativeWidth' | 'nativeHeight'>)
  | ({ kind: 'video' } & Pick<Video, 'src' | 'poster' | 'alt' | 'branchSlug' | 'orientation'>);

export const photoItem = (photo: Photo): MediaItem => ({ kind: 'photo', ...photo });
export const videoItem = (video: Video): MediaItem => ({ kind: 'video', ...video });

const branchName = (slug: string) => branches.find((branch) => branch.slug === slug)?.shortName ?? '';
const accentOf = (slug: string) => branches.find((branch) => branch.slug === slug)?.accentHex ?? '#C9A227';

type ViewerProps = {
  items: MediaItem[];
  /** Index to open at, or null when closed. */
  openAt: number | null;
  onClose: () => void;
};

export function MediaViewer({ items, openAt, onClose }: ViewerProps) {
  const [index, setIndex] = useState(openAt ?? 0);
  const touchStartX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openAt !== null) setIndex(openAt);
  }, [openAt]);

  const step = useCallback(
    (delta: number) => setIndex((current) => (current + delta + items.length) % items.length),
    [items.length],
  );

  // Keyboard, and a scroll lock so the page behind does not move under the overlay.
  useEffect(() => {
    if (openAt === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [openAt, onClose, step]);

  if (openAt === null) return null;

  const active = items[index];
  if (!active) return null;

  // Mount the neighbours so a swipe reveals a decoded frame rather than a blank panel.
  const mounted = new Set([
    (index - 1 + items.length) % items.length,
    index,
    (index + 1) % items.length,
  ]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      tabIndex={-1}
      className="cinematic fixed inset-0 z-[200] flex flex-col bg-brand-ink/97 backdrop-blur-xl focus:outline-none"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        if (start === null || end === undefined) return;
        const delta = end - start;
        // 56px threshold: below this a swipe is usually an accidental drag on a tap.
        if (Math.abs(delta) > 56) step(delta < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p
          className="font-mono text-[0.625rem] uppercase tracking-[0.24em]"
          style={{ color: accentOf(active.branchSlug) }}
        >
          {branchName(active.branchSlug)}
        </p>
        <p className="font-mono text-[0.625rem] tabular-nums tracking-[0.2em] text-brand-smoke">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full border border-brand-chalk/20 text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion"
        >
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Close viewer</span>
        </button>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {items.map((item, itemIndex) => {
          if (!mounted.has(itemIndex)) return null;
          const offset = itemIndex - index;
          return (
            <div
              key={item.src}
              aria-hidden={offset !== 0}
              className={cn(
                'absolute inset-0 flex items-center justify-center p-4 transition-transform duration-500 ease-hut sm:p-8',
                offset !== 0 && 'pointer-events-none',
              )}
              style={{ transform: `translateX(${offset * 104}%)` }}
            >
              {item.kind === 'photo' ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.nativeWidth}
                  height={item.nativeHeight}
                  sizes="100vw"
                  // Never upscaled past the source: these top out near 720px.
                  className="max-h-full w-auto max-w-full object-contain"
                  priority={offset === 0}
                />
              ) : (
                <div
                  className={cn(
                    'relative h-full overflow-hidden rounded-xl',
                    item.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video w-full',
                  )}
                >
                  {/* Only the active slide gets a playing video. */}
                  {offset === 0 ? (
                    <AutoVideo src={item.src} poster={item.poster} label={item.alt} preload="metadata" />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.poster} alt="" className="size-full object-cover" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Desktop arrows. On touch the swipe is the primary control. */}
        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-chalk/15 bg-brand-ink/60 text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion sm:flex"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-chalk/15 bg-brand-ink/60 text-brand-chalk transition-colors hover:border-brand-bullion hover:text-brand-bullion sm:flex"
        >
          <ChevronRight className="size-6" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </button>
      </div>

      <footer className="px-5 pb-6 pt-2 sm:px-8">
        <p className="text-sm text-brand-chalk/70">{active.alt}</p>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {items.map((item, itemIndex) => (
            <span
              key={item.src}
              className={cn(
                'h-0.5 flex-1 rounded-full transition-colors duration-300',
                itemIndex === index ? 'bg-brand-bullion' : 'bg-brand-chalk/15',
              )}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
