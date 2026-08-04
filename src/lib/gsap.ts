'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/**
 * Single GSAP entry point.
 *
 * Import { gsap, ScrollTrigger } from here — never from the package directly — so every
 * scroll-linked animation on the site shares one registration and one refresh cycle.
 *
 * `registerPlugin` is safe to call more than once: GSAP overwrites the existing entry
 * rather than stacking duplicates, so no de-duplication guard is needed. (An earlier
 * version checked `gsap.core.globals()` — that function exists at runtime but has never
 * been part of GSAP's published type definitions, in any version, so it broke the build.)
 *
 * The `window` check keeps registration off the server pass, where there is no document
 * for ScrollTrigger to attach listeners to.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
