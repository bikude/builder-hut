import type { ReactNode } from 'react';

import { Reveal } from '@/components/common/reveal';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  /** Mono label above the headline. Encodes what the section is, not decoration. */
  eyebrow: string;
  title: ReactNode;
  /** Word rendered hollow with a bullion hairline — the site's headline signature. */
  lede?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ eyebrow, title, lede, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-5', align === 'center' && 'items-center text-center', className)}>
      <Reveal>
        <span className="flex items-center gap-3 font-mono text-eyebrow uppercase text-brand-bullion">
          <span className="h-px w-8 bg-brand-bullion/60" aria-hidden="true" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className={cn('max-w-3xl text-display-sm text-balance', align === 'center' && 'mx-auto')}>{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.12}>
          <p className={cn('max-w-2xl text-base leading-relaxed text-brand-smoke', align === 'center' && 'mx-auto')}>
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
