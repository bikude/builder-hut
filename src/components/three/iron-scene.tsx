'use client';

import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { CanvasBoundary } from '@/components/three/canvas-boundary';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

/**
 * The iron layer.
 *
 * Weight plates, a barbell and dust drifting in shafts of warm light, rendered behind the
 * page. Everything is built from primitives at runtime rather than loaded as a model:
 * a plate is a lathe of its own profile, a barbell is a cylinder with knurl rings. That
 * keeps the whole scene at zero download weight, which matters far more here than
 * photoreal geometry would — the supplied photography already sets the realism ceiling,
 * and a 4 MB GLB to sit behind it would be a bad trade.
 *
 * Performance posture
 * -------------------
 * The scene is deliberately cheap: no shadow maps, no post-processing, a capped device
 * pixel ratio, and `frameloop="demand"` is *not* used because the drift is continuous —
 * instead the object count is small and the materials are standard PBR with a tiny
 * environment. On a mid-range Android this is a handful of draw calls.
 *
 * It renders nothing at all when the visitor prefers reduced motion, and it is always
 * `aria-hidden`: it carries no information, only atmosphere.
 */

const GOLD = '#C9A227';
const COPPER = '#B4693C';
const IRON = '#2A2530';

/** Olympic plate: a lathe of the real side profile — thick rim, dished centre, bore. */
function Plate({
  radius = 1,
  color = IRON,
  ...props
}: { radius?: number; color?: string } & ThreeElements['group']) {
  const geometry = useMemo(() => {
    const r = radius;
    // Half-profile, revolved. Units are relative to the plate radius.
    const profile = [
      new THREE.Vector2(r * 0.16, 0.09), // bore wall
      new THREE.Vector2(r * 0.16, 0.0),
      new THREE.Vector2(r * 0.34, 0.0),
      new THREE.Vector2(r * 0.34, 0.05), // hub step
      new THREE.Vector2(r * 0.78, 0.05), // dished face
      new THREE.Vector2(r * 0.88, 0.11), // rim shoulder
      new THREE.Vector2(r * 1.0, 0.13), // outer rim
      new THREE.Vector2(r * 1.0, 0.19),
      new THREE.Vector2(r * 0.88, 0.21),
      new THREE.Vector2(r * 0.34, 0.21),
      new THREE.Vector2(r * 0.16, 0.25),
    ];
    return new THREE.LatheGeometry(profile, 48);
  }, [radius]);

  return (
    <group {...props}>
      <mesh geometry={geometry} rotation={[Math.PI / 2, 0, 0]} castShadow={false}>
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.32} envMapIntensity={1.4} />
      </mesh>
    </group>
  );
}

/** Barbell: sleeve, knurled shaft, collars. */
function Barbell(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 4.2, 20]} />
        <meshStandardMaterial color="#8C8894" metalness={0.95} roughness={0.28} envMapIntensity={1.6} />
      </mesh>
      {/* Knurl rings — three narrow bands, the grip marks on a real bar. */}
      {[-0.9, 0, 0.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.062, 0.062, 0.34, 20]} />
          <meshStandardMaterial color="#6E6A78" metalness={0.9} roughness={0.62} />
        </mesh>
      ))}
      {[-1.55, 1.55].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.16, 20]} />
          <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.22} envMapIntensity={2} />
        </mesh>
      ))}
      <Plate radius={0.62} color={IRON} position={[-1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Plate radius={0.62} color={IRON} position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}

/** Chalk dust caught in the light. One buffer, one draw call. */
function Dust({ count = 420 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 16;
      array[i * 3 + 1] = (Math.random() - 0.5) * 10;
      array[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return array;
  }, [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    // Slow updraft with a lateral sway; wraps rather than respawning, so no allocation.
    const attribute = points.geometry.attributes.position as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const y = i * 3 + 1;
      array[y] += 0.0016 + (i % 7) * 0.00018;
      if (array[y] > 5) array[y] = -5;
      array[i * 3] += Math.sin(time * 0.22 + i) * 0.00035;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={GOLD}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Two spotlights that sweep across the scene, as if rigged above a platform. */
function MovingSpots() {
  const warm = useRef<THREE.SpotLight>(null);
  const cool = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (warm.current) {
      warm.current.position.x = Math.sin(time * 0.18) * 6;
      warm.current.position.z = 4 + Math.cos(time * 0.14) * 2;
    }
    if (cool.current) {
      cool.current.position.x = Math.cos(time * 0.13) * -7;
    }
  });

  return (
    <>
      <spotLight ref={warm} position={[4, 6, 4]} angle={0.7} penumbra={1} intensity={90} color={COPPER} distance={30} />
      <spotLight ref={cool} position={[-6, 5, 3]} angle={0.8} penumbra={1} intensity={55} color={GOLD} distance={30} />
      <ambientLight intensity={0.22} />
    </>
  );
}

/**
 * The scene contents. Parallax is driven by pointer position rather than scroll so this
 * stays independent of ScrollTrigger and cannot fight the Lenis-driven scroll.
 */
function Rig({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const { x, y } = state.pointer;
    // Damped follow — the lag is what makes it feel like weight rather than a cursor tie.
    group.rotation.y += (x * 0.16 * intensity - group.rotation.y) * Math.min(1, delta * 1.8);
    group.rotation.x += (-y * 0.1 * intensity - group.rotation.x) * Math.min(1, delta * 1.8);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1.1}>
        <Barbell position={[-3.6, 1.5, -3]} rotation={[0.3, 0.4, -0.28]} scale={0.85} />
      </Float>

      <Float speed={1.5} rotationIntensity={0.9} floatIntensity={1.4}>
        <Plate radius={1.15} color={IRON} position={[4.2, -0.8, -2.2]} rotation={[0.5, 0.3, 0.7]} />
      </Float>

      <Float speed={0.9} rotationIntensity={1.2} floatIntensity={1.6}>
        <Plate radius={0.72} color={COPPER} position={[3.1, 2.4, -4.5]} rotation={[1.1, 0.2, 0.2]} />
      </Float>

      <Float speed={1.3} rotationIntensity={0.7} floatIntensity={1.2}>
        <Plate radius={0.52} color={GOLD} position={[-4.6, -1.9, -3.4]} rotation={[0.2, 0.9, 1.2]} />
      </Float>

      {/* A single glass shard catching the spotlights — the one non-metal element,
          which is what makes the metal read as metal by contrast. */}
      <Float speed={0.8} rotationIntensity={1.4} floatIntensity={1}>
        <mesh position={[1.2, 2.8, -5]} rotation={[0.6, 0.4, 0.2]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.1}
            transmission={1}
            ior={1.6}
            chromaticAberration={0.06}
            color={GOLD}
          />
        </mesh>
      </Float>

      <Dust />
    </group>
  );
}

type IronSceneProps = {
  /** How strongly the rig reacts to the pointer. 0 disables the parallax. */
  intensity?: number;
  className?: string;
};

export function IronScene({ intensity = 1, className }: IronSceneProps) {
  const prefersReduced = usePrefersReducedMotion();

  // No canvas at all, rather than a still frame: an idle WebGL context on a phone still
  // costs memory and battery, and this layer carries no information to preserve.
  if (prefersReduced) return null;

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      <CanvasBoundary>
        <Canvas
          camera={{ position: [0, 0, 9], fov: 42 }}
          // Capping DPR at 1.5 is the single biggest win on high-density phones: rendering
          // this at a Pixel's native 3x costs 4x the fragments for no visible gain.
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <MovingSpots />
            {/* Tiny built-in environment: gives the metal something to reflect without
                shipping an HDRI. Built from Lightformer primitives rather than a fetched
                preset, so this stays true zero download weight — `metalness: 0.9` renders
                as flat black without something for it to reflect. */}
            <Environment environmentIntensity={0.55} resolution={64}>
              <Lightformer form="rect" intensity={2} color="#FFD9A0" scale={[8, 4, 1]} position={[0, 5, -2]} />
              <Lightformer
                form="rect"
                intensity={0.6}
                color="#B4693C"
                scale={[6, 3, 1]}
                position={[-4, 2, 3]}
                rotation={[0, Math.PI / 3, 0]}
              />
              <Lightformer
                form="rect"
                intensity={0.4}
                color="#ffffff"
                scale={[6, 3, 1]}
                position={[4, 1, 3]}
                rotation={[0, -Math.PI / 3, 0]}
              />
            </Environment>
            <Rig intensity={intensity} />
            <fog attach="fog" args={['#06050A', 8, 18]} />
          </Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}

export default IronScene;
