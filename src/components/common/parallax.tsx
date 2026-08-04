'use client';

import { useRef, type ReactNode } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Travel in pixels across the full scroll pass. Negative moves against the scroll. */
  distance?: number;
  /** Scale the layer up so the parallax travel never exposes an edge. */
  overscan?: boolean;
};

/**
 * Scroll-linked vertical drift, driven by GSAP ScrollTrigger.
 *
 * `scrub: true` ties progress to scroll position rather than firing a fixed-duration
 * tween, which is what makes the movement feel attached to the page. Everything is
 * created inside a gsap.context so a single revert() cleans up the tween and its
 * ScrollTrigger on unmount — critical under React strict mode double-mounting.
 */
export function Parallax({ children, className, distance = 90, overscan = true }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (prefersReduced || !containerRef.current || !layerRef.current) return;

    // Captured after the guard so the tween targets are `HTMLDivElement`, not
    // `HTMLDivElement | null` — reading `.current` inside the closure loses the narrowing.
    const container = containerRef.current;
    const layer = layerRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer,
        { yPercent: 0, y: -distance / 2 },
        {
          y: distance / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, container);

    // Images finishing late would leave triggers measured against the wrong height.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [distance, prefersReduced]);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div
        ref={layerRef}
        className={cn('h-full w-full will-change-transform', overscan && !prefersReduced && 'scale-110')}
      >
        {children}
      </div>
    </div>
  );
}
