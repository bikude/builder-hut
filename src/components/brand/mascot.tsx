'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import type { MascotAct } from '@/components/three/mascot-rig';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * The mascot, as placed on the page.
 *
 * This is the presentation shell around `MascotRig`: it owns the canvas, the lighting,
 * the dialogue and — most importantly — the restraint. The character itself is a rigged
 * procedural figure; see `src/components/three/mascot-rig.tsx` for the skeleton and clips.
 *
 * Restraint
 * ---------
 * It is not a chat widget and never sits in a fixed corner. Sections place it where they
 * want it, and it is capped at `MAX_APPEARANCES` mounts and `MAX_LINES` spoken lines per
 * visit, counted across the whole site. Past the cap it simply stops rendering. The
 * difference between a brand character and an irritant is entirely how often it shows up.
 *
 * It is `aria-hidden` throughout and its lines appear nowhere else: this is atmosphere,
 * and a screen reader announcing a floating logo would be actively hostile.
 */

const LINES: Record<MascotAct, string[]> = {
  idle: ['Every rep counts.'],
  walk: ['Welcome.', "Let's build strength."],
  wave: ['Welcome.', 'Ready?'],
  point: ['This way.', 'Find your nearest Builder Hut.'],
  deadlift: ["Let's build strength.", 'Every rep counts.'],
  bench: ['One more.'],
  curl: ['Every rep counts.'],
  stretch: ['Almost there.'],
  box: ['Ready?'],
  celebrate: ['Join the family.', "You're almost there."],
};

/** Hard caps for a single visit, across every appearance on every page. */
const MAX_APPEARANCES = 5;
const MAX_LINES = 3;

let appearances = 0;
let linesSpoken = 0;

const MascotCanvas = dynamic(() => import('@/components/brand/mascot-canvas').then((mod) => mod.MascotCanvas), {
  ssr: false,
  loading: () => null,
});

type MascotProps = {
  act?: MascotAct;
  /** Rendered box size in pixels. The figure is framed to fill it. */
  size?: number;
  /** Which way the character faces. */
  facing?: 'left' | 'right';
  /** Suppress dialogue for this instance. */
  silent?: boolean;
  className?: string;
};

export function Mascot({ act = 'idle', size = 300, facing = 'right', silent = false, className }: MascotProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [line, setLine] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  // Claim an appearance slot on mount. Doing this in an effect rather than during render
  // keeps the counter honest under React's double-invoked development renders.
  useEffect(() => {
    if (appearances >= MAX_APPEARANCES) return;
    appearances += 1;
    setAllowed(true);
  }, []);

  const candidate = useMemo(() => {
    const options = LINES[act];
    return options[Math.floor(Math.random() * options.length)] ?? null;
  }, [act]);

  useEffect(() => {
    if (!allowed || silent || !candidate || prefersReduced) return;
    if (linesSpoken >= MAX_LINES) return;

    const show = window.setTimeout(() => {
      linesSpoken += 1;
      setLine(candidate);
    }, 1600);
    const hide = window.setTimeout(() => setLine(null), 6800);

    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [allowed, candidate, silent, prefersReduced]);

  // No canvas at all when motion is unwelcome: an idle WebGL context still costs memory
  // and battery, and the character carries no information worth preserving as a still.
  if (!allowed || prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none relative size-[var(--mascot-size)] select-none', className)}
      style={{ '--mascot-size': `${size}px` } as CSSProperties}
    >
      {/* Warm pool of light on the floor beneath the figure. */}
      <span className="absolute bottom-[12%] left-1/2 -z-10 h-[16%] w-[62%] -translate-x-1/2 rounded-[50%] bg-brand-bullion/25 blur-2xl" />

      <MascotCanvas act={act} facing={facing} />

      {line && (
        <p className="glass absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-brand-gilt opacity-0 [animation:mascot-speak_6.8s_ease-out_forwards]">
          {line}
        </p>
      )}
    </div>
  );
}
