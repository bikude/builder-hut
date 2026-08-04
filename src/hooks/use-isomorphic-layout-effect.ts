'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server.
 *
 * Client components still render once on the server, and React logs a warning if
 * `useLayoutEffect` runs there. GSAP setup needs layout timing to avoid a first-paint
 * flash, so this picks the right one instead of dropping to `useEffect` everywhere.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
