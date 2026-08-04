import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type RatingStarsProps = {
  rating: number;
  reviewCount?: number | null;
  className?: string;
  /** Hides the numeric label and leaves only the glyphs. */
  glyphsOnly?: boolean;
};

/**
 * Five glyphs with the fractional star clipped to the exact rating.
 * The accessible name carries the real number — screen readers get "4.8 out of 5",
 * not five repeated "star" announcements.
 */
export function RatingStars({ rating, reviewCount, className, glyphsOnly = false }: RatingStarsProps) {
  const label = reviewCount
    ? `Rated ${rating} out of 5 from ${reviewCount} Google reviews`
    : `Rated ${rating} out of 5`;

  return (
    <span className={cn('inline-flex items-center gap-2', className)} role="img" aria-label={label}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex text-brand-chalk/20">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4" fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-brand-bullion"
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 shrink-0" fill="currentColor" strokeWidth={0} />
          ))}
        </span>
      </span>
      {!glyphsOnly && (
        <span className="font-mono text-xs tracking-wider text-brand-smoke" aria-hidden="true">
          {rating.toFixed(1)}
          {reviewCount ? ` · ${reviewCount} reviews` : ''}
        </span>
      )}
    </span>
  );
}
