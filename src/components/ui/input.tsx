import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Text input. `aria-invalid` drives the error styling so the visual state and the
 * state announced to a screen reader can never disagree.
 */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'h-12 w-full rounded-md border border-brand-chalk/12 bg-brand-forge/70 px-4 text-sm text-brand-chalk transition-colors duration-200 placeholder:text-brand-smoke/60 hover:border-brand-chalk/25 focus:border-brand-bullion focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-brand-blood aria-[invalid=true]:bg-brand-blood/5',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
