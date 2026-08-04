import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * shadcn/ui Button, restyled to the A Builder Hut palette.
 *
 * `forge` is the primary action (red), `bullion` is the premium action (gold) and is
 * reserved for membership and trial CTAs so the gold keeps its meaning.
 */
const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-hut disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        forge:
          'bg-red-forge text-brand-chalk shadow-glow-red hover:-translate-y-0.5 hover:shadow-[0_0_60px_-10px_rgba(225,27,34,0.8)] active:translate-y-0',
        bullion:
          'bg-gold-sheen bg-[length:200%_auto] text-brand-ink shadow-glow-gold hover:-translate-y-0.5 hover:bg-[position:100%_center] active:translate-y-0',
        outline:
          'border border-brand-chalk/25 bg-transparent text-brand-chalk hover:border-brand-bullion hover:bg-brand-bullion/10 hover:text-brand-gilt',
        glass: 'glass text-brand-chalk hover:border-brand-chalk/25 hover:bg-brand-chalk/10',
        ghost: 'text-brand-smoke hover:bg-brand-chalk/5 hover:text-brand-chalk',
        link: 'text-brand-bullion underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 rounded-sm px-4 text-[0.625rem]',
        md: 'h-11 rounded-md px-6',
        lg: 'h-14 rounded-md px-8 text-[0.8125rem]',
        icon: 'size-11 rounded-md',
      },
    },
    defaultVariants: { variant: 'forge', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. a Next `<Link>`) instead of a `<button>`. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
