'use client';

import dynamic from 'next/dynamic';

import type { Branch } from '@/content/branches';
import { cn } from '@/lib/utils';

/**
 * Leaflet reads `window` at module scope, so the map can never be server-rendered.
 * This loader is the only place `ssr: false` appears, which keeps every page that shows
 * a map a plain server component.
 */
const BranchMap = dynamic(() => import('@/components/branches/branch-map').then((mod) => mod.BranchMap), {
  ssr: false,
  loading: () => (
    <div className="glass flex h-full min-h-[20rem] w-full items-center justify-center rounded-lg">
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-brand-smoke">Loading map…</span>
    </div>
  ),
});

export function BranchMapLoader({ branch, className }: { branch?: Branch; className?: string }) {
  return (
    <div className={cn('h-[26rem] w-full', className)}>
      <BranchMap branch={branch} className="h-full w-full" />
    </div>
  );
}
