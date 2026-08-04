import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em]',
  {
    variants: {
      variant: {
        default: 'border-brand-chalk/15 bg-brand-chalk/5 text-brand-smoke',
        forge: 'border-brand-blood/40 bg-brand-blood/10 text-brand-blood',
        bullion: 'border-brand-bullion/40 bg-brand-bullion/10 text-brand-gilt',
        open: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
