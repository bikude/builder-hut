import { cn } from '@/lib/utils';

type MarqueeProps = {
  items: string[];
  className?: string;
  /** Gold hairline separator between items. */
  separator?: string;
};

/**
 * Infinite ticker. The list is rendered twice and translated by exactly -50%, so the
 * loop is seamless without measuring anything at runtime. Pure CSS — no JS on the
 * main thread, and it stops dead under prefers-reduced-motion.
 */
export function Marquee({ items, className, separator = '✦' }: MarqueeProps) {
  const strip = [...items, ...items];

  return (
    <div
      className={cn('relative flex overflow-hidden border-y border-brand-chalk/10 bg-brand-forge/60 py-4', className)}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {strip.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8">
            <span className="font-display text-lg uppercase tracking-[0.12em] text-brand-chalk/85 sm:text-xl">
              {item}
            </span>
            <span className="text-brand-bullion">{separator}</span>
          </span>
        ))}
      </div>
      {/* Fade the strip into the page edges instead of cutting it off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-ink to-transparent" />
    </div>
  );
}
