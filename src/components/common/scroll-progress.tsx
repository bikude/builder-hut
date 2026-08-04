'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * Bullion hairline under the header that fills as the page is read.
 * Hidden from assistive tech — it duplicates information the scrollbar already conveys.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-[var(--header-h)] z-40 h-px w-full origin-left bg-gold-sheen"
    />
  );
}
