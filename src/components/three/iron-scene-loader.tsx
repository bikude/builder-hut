'use client';

import dynamic from 'next/dynamic';

/**
 * Three.js and R3F are the heaviest dependencies on the site by a wide margin. Loading
 * them through a dynamic import with `ssr: false` keeps them out of the initial bundle
 * and out of the server render entirely, so first paint never waits on WebGL.
 *
 * There is no loading fallback on purpose: the scene is atmosphere behind content that is
 * already legible without it, and a spinner for decoration would be worse than nothing.
 */
const IronScene = dynamic(() => import('@/components/three/iron-scene').then((mod) => mod.IronScene), {
  ssr: false,
  loading: () => null,
});

export function IronSceneLoader({ intensity, className }: { intensity?: number; className?: string }) {
  return <IronScene intensity={intensity} className={className} />;
}
