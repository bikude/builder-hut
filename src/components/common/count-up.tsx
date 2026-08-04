'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { EASE } from '@/lib/motion';

type CountUpProps = {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Skip thousand separators — years read wrong as "2,022". */
  plain?: boolean;
};

/**
 * Animates a number once it scrolls into view. Renders the final value immediately
 * for reduced-motion visitors and for the server pass, so the figure is never missing
 * from the accessibility tree or from a crawler's snapshot.
 */
export function CountUp({ to, decimals = 0, duration = 1.6, className, plain = false }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (prefersReduced) {
      setValue(to);
      return;
    }
    if (!isInView) {
      setValue(0);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [isInView, prefersReduced, to, duration]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {plain
        ? value.toFixed(decimals)
        : value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}
