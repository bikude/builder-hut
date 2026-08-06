import Image from 'next/image';

import { brand } from '@/content/media';
import { cn } from '@/lib/utils';

/**
 * A Builder Hut mark — the gym's real logo.
 *
 * The supplied logo files are circular renders of the mark sitting over a photograph of
 * the gym floor. `tools/process-media.py` keys the gold emblem off that background — on
 * brightness AND warmth together, so the concrete's own highlights are excluded — and
 * writes a transparent PNG. That is what these components render.
 *
 * `LogoMark` uses the emblem alone. The full lockup sets the wordmark twice, which turns
 * to gold mush below roughly 140px wide, so it is reserved for `LogoLockup` where there
 * is room for it — the footer and the preloader.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('relative block size-9', className)}>
      <Image src={brand.emblem} alt="" fill sizes="72px" priority className="object-contain" aria-hidden="true" />
    </span>
  );
}

/** The full lockup — emblem plus wordmark. Only where it has space to be legible. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <Image
      src={brand.logo.batanagar}
      alt="A Builder Hut"
      width={872}
      height={612}
      priority
      className={cn('h-auto w-[180px]', className)}
    />
  );
}

/**
 * Header lockup: emblem plus typeset name. The name is live text rather than part of the
 * image so it stays crisp at any zoom and is readable to a screen reader as text.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg uppercase tracking-[0.08em] text-brand-chalk">
            A Builder <span className="text-gold">Hut</span>
          </span>
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.32em] text-brand-smoke">24×7 · Kolkata</span>
        </span>
      )}
    </span>
  );
}
