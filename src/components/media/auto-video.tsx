'use client';

import { Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * Autoplaying background video that actually autoplays.
 *
 * Muted autoplay fails more often than it looks like it should, and each cause needs a
 * different answer:
 *
 *  - **Not yet on screen.** Several mobile browsers reject `play()` for an off-screen
 *    element. Fixed by retrying on intersection rather than only on mount.
 *  - **iOS Low Power Mode.** Blocks *all* autoplay, permanently, whatever the attributes
 *    say. Nothing can force it — so when `play()` rejects we surface a tap-to-play button
 *    over the poster instead of leaving a dead rectangle.
 *  - **`preload="none"`.** Means there is nothing buffered to start, so autoplay silently
 *    does nothing. Anything meant to play on sight uses `metadata` at minimum.
 *  - **A stray audio track.** Even on a muted element this makes some browsers treat
 *    playback as user-gesture-only. Every clip here is encoded with `-an`.
 *
 * Off-screen videos are paused, so a page holding a dozen reels decodes only the ones
 * being looked at — which is the difference between smooth scrolling and a hot phone.
 */

type AutoVideoProps = {
  src: string;
  poster: string;
  /** Describes the clip for assistive tech. Omit only for pure background texture. */
  label?: string;
  className?: string;
  /** Fill the parent (absolute inset-0) rather than sit in flow. */
  fill?: boolean;
  /** `metadata` for anything on first screen; `none` for far-below-the-fold reels. */
  preload?: 'none' | 'metadata' | 'auto';
  /** Show the tap-to-play affordance when autoplay is refused. */
  allowManualStart?: boolean;
  objectPosition?: string;
};

export function AutoVideo({
  src,
  poster,
  label,
  className,
  fill = true,
  preload = 'metadata',
  allowManualStart = true,
  objectPosition,
}: AutoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [blocked, setBlocked] = useState(false);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const attempt = video.play();
    // Older Safari returns undefined rather than a promise.
    if (attempt && typeof attempt.catch === 'function') {
      attempt.then(() => setBlocked(false)).catch(() => setBlocked(true));
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) attemptPlay();
        else video.pause();
      },
      { threshold: 0.2 },
    );
    observer.observe(video);

    // Also try immediately: if it is already in view on load, waiting for an
    // intersection callback would show a frozen poster for a beat.
    attemptPlay();

    return () => observer.disconnect();
  }, [attemptPlay, prefersReduced]);

  const shared = cn('size-full object-cover', className);

  // Reduced motion gets the poster frame, not a paused video element.
  if (prefersReduced) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={poster}
        alt={label ?? ''}
        aria-hidden={label ? undefined : true}
        className={cn(shared, fill && 'absolute inset-0')}
        style={{ objectPosition }}
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className={cn(shared, fill && 'absolute inset-0')}
        style={{ objectPosition }}
        src={src}
        poster={poster}
        // All four are required together for muted autoplay on iOS. `playsInline` in
        // particular: without it iPhone Safari takes the video fullscreen instead.
        muted
        loop
        playsInline
        autoPlay
        preload={preload}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        tabIndex={-1}
      />

      {blocked && allowManualStart && (
        <button
          type="button"
          onClick={attemptPlay}
          className="absolute inset-0 z-10 flex items-center justify-center bg-brand-ink/35 backdrop-blur-[2px] transition-colors hover:bg-brand-ink/20"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-brand-bullion/60 bg-brand-ink/70 text-brand-gilt shadow-glow-gold">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
          </span>
          <span className="sr-only">Play video{label ? `: ${label}` : ''}</span>
        </button>
      )}
    </>
  );
}
