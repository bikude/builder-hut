'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { LogoMark } from '@/components/common/logo';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { EASE } from '@/lib/motion';

const SESSION_KEY = 'abh:preloaded';
const MIN_DURATION_MS = 1100;

/**
 * Opening sequence.
 *
 * The counter tracks something real: it eases toward 90% while assets are still in
 * flight and only completes once `window.load` has fired, so a fast connection gets a
 * short curtain and a slow one is not left staring at a frozen "100%".
 *
 * It plays once per browser session (sessionStorage), never for visitors who asked for
 * reduced motion, and it locks scroll while it is up so the page cannot be read through
 * the overlay with a trackpad.
 */
export function Preloader() {
  const [active, setActive] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const loadedRef = useRef(false);
  const prefersReduced = usePrefersReducedMotion();

  // Decide whether to play at all — after mount, so server and client markup match.
  useEffect(() => {
    if (prefersReduced) {
      setActive(false);
      return;
    }
    const seen = window.sessionStorage.getItem(SESSION_KEY) === '1';
    setActive(!seen);
  }, [prefersReduced]);

  useEffect(() => {
    if (active !== true) return;

    const startedAt = performance.now();
    document.body.style.overflow = 'hidden';

    const markLoaded = () => {
      loadedRef.current = true;
    };
    if (document.readyState === 'complete') markLoaded();
    else window.addEventListener('load', markLoaded);

    const id = window.setInterval(() => {
      setProgress((current) => {
        const elapsed = performance.now() - startedAt;
        const ceiling = loadedRef.current && elapsed >= MIN_DURATION_MS ? 100 : 92;
        if (current >= ceiling) return ceiling;
        // Ease out: fast at the start, slower as it approaches the ceiling.
        return Math.min(ceiling, current + Math.max(0.8, (ceiling - current) * 0.09));
      });
    }, 24);

    return () => {
      window.clearInterval(id);
      window.removeEventListener('load', markLoaded);
      document.body.style.overflow = '';
    };
  }, [active]);

  useEffect(() => {
    if (progress < 100) return;
    const timeout = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setActive(false);
    }, 260);
    return () => window.clearTimeout(timeout);
  }, [progress]);

  return (
    <AnimatePresence>
      {active === true && (
        <motion.div
          key="preloader"
          className="grain fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-brand-ink px-6 py-8 sm:px-10"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: EASE } }}
          role="status"
          aria-live="polite"
          aria-label="Loading A Builder Hut"
        >
          <div className="flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.28em] text-brand-smoke">
            <span>Maheshtala · Budge Budge</span>
            <span>Est. 2022</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <LogoMark className="size-16" />
            </motion.div>
            <motion.h1
              className="text-center text-display-sm"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
              A Builder <span className="text-gold">Hut</span>
            </motion.h1>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.32em] text-brand-smoke">
              Open 24 × 7 · Doors never close
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between font-mono text-xs uppercase tracking-[0.2em] text-brand-smoke">
              <span>Loading the floor</span>
              <span className="text-2xl text-brand-chalk tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-px w-full bg-brand-chalk/12">
              <div
                className="h-full bg-gold-sheen transition-[width] duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
