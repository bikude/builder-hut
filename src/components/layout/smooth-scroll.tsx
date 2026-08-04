'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { ScrollTrigger, gsap } from '@/lib/gsap';

/**
 * Site-wide smooth scrolling.
 *
 * Lenis owns the scroll position; GSAP owns the animation clock. Driving Lenis from
 * `gsap.ticker` instead of its own rAF loop keeps ScrollTrigger's measurements and the
 * eased scroll position on the same frame — without this they drift by a frame and
 * pinned sections judder.
 *
 * Nothing is instantiated when the visitor prefers reduced motion: native scrolling is
 * left completely alone, and ScrollTrigger still works because it falls back to the
 * window scroll it already listens to.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: catches the flick quickly, settles without a long tail.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have momentum scrolling; doubling it feels laggy.
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Wrapped rather than passed by reference: Lenis calls scroll listeners with the
    // Lenis instance, which ScrollTrigger.update would receive as its `safe` argument.
    lenis.on('scroll', () => ScrollTrigger.update());
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  // A client-side route change must reset both the scroll position and every trigger's
  // cached start/end, otherwise the new page inherits the old page's measurements.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  // In-page anchors (#free-trial, #why-abh) bypass Lenis by default and jump.
  useEffect(() => {
    if (prefersReduced) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href*="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === '_blank' || event.metaKey || event.ctrlKey) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      // Offset clears the fixed header so the section title is not hidden behind it.
      lenisRef.current?.scrollTo(target as HTMLElement, { offset: -96 });
      window.history.pushState(null, '', url.hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [prefersReduced]);

  return <>{children}</>;
}
