'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

import { AutoVideo } from '@/components/media/auto-video';
import { MediaViewer, photoItem, videoItem, type MediaItem } from '@/components/media/media-viewer';
import { photosFor, videosFor } from '@/content/media';
import { cn } from '@/lib/utils';

/**
 * A branch's media, as the branch page's main body.
 *
 * Clips first, then photographs, then everything opens fullscreen into one continuous
 * swipeable set — a visitor moving through a branch never hits a boundary between "the
 * video bit" and "the photo bit".
 *
 * Ordering clips before stills is deliberate: a still cannot show what a room sounds and
 * moves like, and the whole point of a branch page is to answer "what is it actually like
 * in there" before anyone reads a word.
 */
export function BranchShowcase({ branchSlug, accentHex }: { branchSlug: string; accentHex: string }) {
  const clips = useMemo(() => videosFor(branchSlug), [branchSlug]);
  const stills = useMemo(() => photosFor(branchSlug).filter((photo) => photo.role !== 'poster'), [branchSlug]);

  // One combined set so the viewer can run straight through both media types.
  const items = useMemo<MediaItem[]>(
    () => [...clips.map(videoItem), ...stills.map(photoItem)],
    [clips, stills],
  );

  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <>
      {clips.length > 0 && (
        <section className="border-b border-brand-chalk/8 py-12 sm:py-16">
          <div className="container">
            <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.26em]" style={{ color: accentHex }}>
              On the floor
            </h2>
          </div>

          <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:px-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {clips.map((clip, index) => (
              <button
                key={clip.src}
                type="button"
                onClick={() => setOpenAt(index)}
                className={cn(
                  'group relative shrink-0 snap-center overflow-hidden rounded-xl border border-brand-chalk/12 bg-brand-forge',
                  clip.orientation === 'portrait'
                    ? 'aspect-[9/16] w-[64vw] sm:w-[16rem]'
                    : 'aspect-video w-[88vw] sm:w-[28rem]',
                )}
              >
                <AutoVideo src={clip.src} poster={clip.poster} label={clip.alt} preload="none" allowManualStart={false} />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex size-12 items-center justify-center rounded-full border border-brand-bullion/60 bg-brand-ink/70">
                    <Play className="ml-0.5 size-5 fill-current text-brand-gilt" aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {stills.length > 0 && (
        <section className="border-b border-brand-chalk/8 py-12 sm:py-16">
          <div className="container">
            <h2 className="font-mono text-[0.625rem] uppercase tracking-[0.26em]" style={{ color: accentHex }}>
              The rooms
            </h2>

            <div className="mt-6 columns-2 gap-3 lg:columns-3 [&>*]:mb-3">
              {stills.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setOpenAt(clips.length + index)}
                  className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg border border-brand-chalk/10"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.nativeWidth}
                    height={photo.nativeHeight}
                    loading="lazy"
                    sizes="(max-width: 1024px) 48vw, 400px"
                    className="h-auto w-full object-cover transition-transform duration-700 ease-hut group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <MediaViewer items={items} openAt={openAt} onClose={() => setOpenAt(null)} />
    </>
  );
}
