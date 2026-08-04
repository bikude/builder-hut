import type { ReactNode } from 'react';

import { Reveal } from '@/components/common/reveal';
import { cn } from '@/lib/utils';

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  /** Mono label — what kind of page this is. */
  eyebrow: string;
  title: string;
  lede?: string;
  /** Optional right-hand slot: a stat, a badge row, a CTA. */
  aside?: ReactNode;
  crumbs?: Crumb[];
  className?: string;
};

/**
 * The standard opening block for every page except home.
 *
 * Home gets the full-bleed slider; interior pages get this instead — shorter, quieter,
 * and always the same height, so moving between pages does not feel like moving between
 * websites. The angled base (`clip-slant`) is the one shape carried through the site.
 */
export function PageHero({ eyebrow, title, lede, aside, crumbs, className }: PageHeroProps) {
  return (
    <header
      className={cn(
        'clip-slant grain relative overflow-hidden border-b border-brand-chalk/8 bg-brand-forge pb-24 pt-[calc(var(--header-h)+3.5rem)] sm:pb-28',
        className,
      )}
    >
      {/* Two soft light sources: red low-left, bullion high-right. Pure CSS, no image weight. */}
      <div
        className="pointer-events-none absolute -left-40 bottom-[-30%] size-[36rem] rounded-full bg-brand-blood/12 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 -top-40 size-[30rem] rounded-full bg-brand-bullion/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-smoke">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {crumb.href ? (
                    <a href={crumb.href} className="transition-colors hover:text-brand-bullion">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-brand-chalk">{crumb.label}</span>
                  )}
                  {index < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <span className="flex items-center gap-3 font-mono text-eyebrow uppercase text-brand-bullion">
                <span className="h-px w-8 bg-brand-bullion/60" aria-hidden="true" />
                {eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-5 text-display-md text-balance">{title}</h1>
            </Reveal>

            {lede && (
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-chalk/75">{lede}</p>
              </Reveal>
            )}
          </div>

          {aside && (
            <Reveal delay={0.18} className="lg:pb-2">
              {aside}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}
