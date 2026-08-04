import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full resize-y rounded-md border border-brand-chalk/12 bg-brand-forge/70 px-4 py-3 text-sm leading-relaxed text-brand-chalk transition-colors duration-200 placeholder:text-brand-smoke/60 hover:border-brand-chalk/25 focus:border-brand-bullion focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-brand-blood aria-[invalid=true]:bg-brand-blood/5',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
