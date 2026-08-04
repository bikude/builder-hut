'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { fadeUp, inView } from '@/lib/motion';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
};

/**
 * Scroll-in wrapper. One place to change how the whole site enters view.
 * When the visitor asks for reduced motion the content renders plainly — no
 * transform, no opacity ramp, no observer.
 */
export function Reveal({ children, className, delay = 0, variants = fadeUp, as = 'div' }: RevealProps) {
  const prefersReduced = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
