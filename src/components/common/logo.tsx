import { cn } from '@/lib/utils';

/**
 * A Builder Hut mark — an original wordmark drawn for this site.
 *
 * The gym's own logo is its property and is not redistributed here. To swap it in:
 *   1. drop the file at `public/logo.svg` (and `public/logo-mark.svg` if separate),
 *   2. replace the <svg> below with <Image src="/logo.svg" … />, keeping the same
 *      width/height props so the header layout does not shift.
 *
 * The mark reads as a hut roof over a loaded bar — the two things the brand is named for.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" role="presentation" aria-hidden="true" className={cn('size-9', className)}>
      <defs>
        <linearGradient id="abh-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3DA95" />
          <stop offset="55%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#7A5C12" />
        </linearGradient>
      </defs>
      {/* Roof */}
      <path d="M24 4 3 20h6.5L24 9.2 38.5 20H45L24 4Z" fill="url(#abh-gold)" />
      {/* Barbell inside the hut */}
      <rect x="9" y="26.5" width="30" height="4" rx="1.2" fill="#E11B22" />
      <rect x="5" y="22" width="5" height="13" rx="1.6" fill="#F5F2ED" />
      <rect x="38" y="22" width="5" height="13" rx="1.6" fill="#F5F2ED" />
      <rect x="12" y="24" width="4" height="9" rx="1.2" fill="#F5F2ED" opacity="0.7" />
      <rect x="32" y="24" width="4" height="9" rx="1.2" fill="#F5F2ED" opacity="0.7" />
      {/* Floor line */}
      <rect x="3" y="41" width="42" height="2" rx="1" fill="#C9A227" opacity="0.5" />
    </svg>
  );
}

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
