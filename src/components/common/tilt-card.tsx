'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the corners. Keep this small; 8 already reads as 3D. */
  intensity?: number;
  /** Adds a light sweep that follows the pointer across the surface. */
  sheen?: boolean;
};

/**
 * Pointer-tracked 3D tilt.
 *
 * Only binds to pointer events on devices with a real pointer — on touch there is no
 * hover to track and the handler would fire on every scroll. Reduced-motion visitors
 * get the card with no transform at all.
 */
export function TiltCard({ children, className, intensity = 8, sheen = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 180, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 20, mass: 0.4 });

  const rotateY = useTransform(springX, [0, 1], [-intensity, intensity]);
  const rotateX = useTransform(springY, [0, 1], [intensity, -intensity]);
  const sheenX = useTransform(springX, [0, 1], ['0%', '100%']);
  const sheenY = useTransform(springY, [0, 1], ['0%', '100%']);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function reset() {
    x.set(0.5);
    y.set(0.5);
  }

  if (prefersReduced) {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  return (
    <div className="scene-3d">
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('relative will-change-transform', className)}
      >
        {children}
        {sheen && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle at var(--mx) var(--my), rgba(243,218,149,0.18), transparent 55%)',
              ['--mx' as string]: sheenX,
              ['--my' as string]: sheenY,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
