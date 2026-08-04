import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion variants.
 *
 * Division of labour across the site:
 *  - Framer Motion  → mount/unmount, hover, tap, page transitions, the preloader.
 *  - GSAP ScrollTrigger → anything tied to scroll position (parallax layers, pinned
 *    elements, the section progress rail).
 * Keeping the two in separate lanes stops them fighting over the same transform.
 */

/** Typed as a mutable 4-tuple, not `as const`: framer-motion's BezierDefinition is a
 *  mutable tuple, and a readonly tuple is not assignable to it. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Parent wrapper that releases its children one after another. */
export function stagger(delayChildren = 0, staggerChildren = 0.08): Variants {
  return {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  };
}

/** Headline words rise out of an overflow-hidden mask. */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  show: (i: number = 0) => ({
    y: '0%',
    transition: { duration: 0.9, ease: EASE, delay: 0.06 * i },
  }),
};

/** Standard viewport trigger — fires once, slightly before the element is fully in view. */
export const inView = { once: true, amount: 0.25, margin: '0px 0px -10% 0px' } as const;
