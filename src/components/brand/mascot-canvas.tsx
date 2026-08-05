'use client';

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { Suspense } from 'react';

import { CanvasBoundary } from '@/components/three/canvas-boundary';
import { MascotRig, type MascotAct } from '@/components/three/mascot-rig';

/**
 * The mascot's own canvas.
 *
 * Deliberately separate from `IronScene`: the two appear in different places at different
 * sizes, and sharing one full-viewport canvas would mean rendering the character at the
 * page's resolution rather than inside its own small box. Two small contexts cost less
 * than one large one here.
 *
 * Kept cheap on purpose — no post-processing, no shadow maps beyond a single baked
 * contact shadow, DPR capped at 1.5, and `frameloop` left on demand-free default because
 * the animation is continuous. The figure is a few hundred triangles.
 */
export function MascotCanvas({ act, facing }: { act: MascotAct; facing: 'left' | 'right' }) {
  return (
    <CanvasBoundary>
      <Canvas
        camera={{ position: [0, 1.15, 4.4], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          {/* Key light warm and high, rim light cool behind — standard three-point, which
              is what makes gold read as metal rather than as a yellow plastic. */}
          <spotLight position={[2.6, 4, 3]} angle={0.6} penumbra={1} intensity={90} color="#FFD9A0" />
          <spotLight position={[-3, 2.4, -2.4]} angle={0.8} penumbra={1} intensity={45} color="#B4693C" />
          <ambientLight intensity={0.3} />

          {/* Procedural — built from Lightformer primitives rather than a fetched HDRI, so
              the figure's metal has something to reflect with zero network dependency. */}
          <Environment environmentIntensity={0.6} resolution={64}>
            <Lightformer form="rect" intensity={2} color="#FFD9A0" scale={[6, 3, 1]} position={[2, 4, 2]} />
            <Lightformer
              form="rect"
              intensity={0.7}
              color="#B4693C"
              scale={[4, 2, 1]}
              position={[-3, 2, -2]}
              rotation={[0, Math.PI / 2, 0]}
            />
          </Environment>

          <group rotation={[0, facing === 'left' ? -0.55 : 0.55, 0]} position={[0, -0.9, 0]}>
            <MascotRig act={act} />
          </group>

          <ContactShadows position={[0, -0.9, 0]} opacity={0.5} scale={6} blur={2.6} far={3} color="#000000" />
        </Suspense>
      </Canvas>
    </CanvasBoundary>
  );
}
