'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * The Builder Hut mascot — a rigged, stylised 3D character.
 *
 * Built entirely in code rather than loaded as a model. There is no Blender step and no
 * GLB download: the figure is a hierarchy of `<group>` joints wrapping capsule and sphere
 * primitives, and every animation is a list of joint rotations interpolated at runtime.
 *
 * Why procedural rather than a authored model
 * -------------------------------------------
 * A rigged, skinned humanoid would be a 3–6 MB download before a single frame renders,
 * on a site whose photography already tops out at 720px. This rig is a few hundred
 * triangles, ships as JavaScript, and — because the poses are data — a new exercise is
 * fifteen lines rather than a new export from a DCC tool.
 *
 * What it keeps from the logo
 * ---------------------------
 * The gold body, the wings, and the barbell. The proportions are the logo's too:
 * exaggerated shoulders, narrow waist, heroic stance. It is recognisably the same
 * character, freed from a single static pose.
 *
 * Rig
 * ---
 *   hips → spine → chest → neck → head
 *                 chest → shoulderL/R → elbowL/R → hand
 *                 chest → wingL/R
 *   hips → hipL/R → kneeL/R → foot
 *
 * Rotations are Euler triples in radians. Anything a clip does not name falls back to the
 * rest pose, so a clip only has to describe what actually moves.
 */

const JOINTS = [
  'hips',
  'spine',
  'chest',
  'neck',
  'shoulderL',
  'elbowL',
  'shoulderR',
  'elbowR',
  'hipL',
  'kneeL',
  'hipR',
  'kneeR',
  'wingL',
  'wingR',
] as const;

type Joint = (typeof JOINTS)[number];
type Euler3 = [number, number, number];
type Pose = Partial<Record<Joint, Euler3>>;

/** Rest pose: arms down, feet planted, wings folded back. */
const REST: Record<Joint, Euler3> = {
  hips: [0, 0, 0],
  spine: [0, 0, 0],
  chest: [0, 0, 0],
  neck: [0, 0, 0],
  // Arms hang with a slight outward flare, the way a lifter's lats push them out.
  shoulderL: [0, 0, 0.22],
  elbowL: [0, 0, 0.12],
  shoulderR: [0, 0, -0.22],
  elbowR: [0, 0, -0.12],
  hipL: [0, 0, 0.06],
  kneeL: [0, 0, 0],
  hipR: [0, 0, -0.06],
  kneeR: [0, 0, 0],
  wingL: [0, 0.5, 0.25],
  wingR: [0, -0.5, -0.25],
};

type Key = {
  /** Normalised time within the clip, 0–1. */
  t: number;
  pose: Pose;
  /** Root vertical offset — jumps, squat depth, the bob of a walk cycle. */
  y?: number;
  /** Root rotation, for lying down or turning. */
  rootRot?: Euler3;
  /** Barbell height relative to the hips. Ignored when the clip hides the bar. */
  bar?: number;
};

export type MascotAct =
  | 'idle'
  | 'walk'
  | 'wave'
  | 'point'
  | 'deadlift'
  | 'bench'
  | 'curl'
  | 'stretch'
  | 'box'
  | 'celebrate';

type Clip = { duration: number; showBar: boolean; keys: Key[] };

/**
 * The clip library.
 *
 * Each is a small number of extreme poses; the interpolator fills the rest. Timings are
 * deliberately uneven — a real rep spends longer in the eccentric than the concentric,
 * and matching that is most of what makes the motion read as lifting rather than bobbing.
 */
const CLIPS: Record<MascotAct, Clip> = {
  idle: {
    duration: 4,
    showBar: false,
    keys: [
      { t: 0, pose: { chest: [0.02, 0, 0], shoulderL: [0, 0, 0.24], shoulderR: [0, 0, -0.24] }, y: 0 },
      { t: 0.5, pose: { chest: [-0.03, 0, 0], shoulderL: [0, 0, 0.19], shoulderR: [0, 0, -0.19] }, y: 0.02 },
      { t: 1, pose: { chest: [0.02, 0, 0], shoulderL: [0, 0, 0.24], shoulderR: [0, 0, -0.24] }, y: 0 },
    ],
  },

  walk: {
    duration: 1.05,
    showBar: false,
    keys: [
      {
        t: 0,
        pose: {
          hipL: [0.62, 0, 0.06], kneeL: [-0.28, 0, 0],
          hipR: [-0.48, 0, -0.06], kneeR: [-0.62, 0, 0],
          shoulderL: [-0.5, 0, 0.2], shoulderR: [0.5, 0, -0.2],
          spine: [0, 0.08, 0],
        },
        y: 0,
      },
      // Mid-stride: the pass-through, where the body is at its highest.
      { t: 0.25, pose: { hipL: [0, 0, 0.06], kneeL: [-0.5, 0, 0], hipR: [0, 0, -0.06], kneeR: [-0.2, 0, 0], shoulderL: [0, 0, 0.2], shoulderR: [0, 0, -0.2] }, y: 0.06 },
      {
        t: 0.5,
        pose: {
          hipL: [-0.48, 0, 0.06], kneeL: [-0.62, 0, 0],
          hipR: [0.62, 0, -0.06], kneeR: [-0.28, 0, 0],
          shoulderL: [0.5, 0, 0.2], shoulderR: [-0.5, 0, -0.2],
          spine: [0, -0.08, 0],
        },
        y: 0,
      },
      { t: 0.75, pose: { hipL: [0, 0, 0.06], kneeL: [-0.2, 0, 0], hipR: [0, 0, -0.06], kneeR: [-0.5, 0, 0], shoulderL: [0, 0, 0.2], shoulderR: [0, 0, -0.2] }, y: 0.06 },
      {
        t: 1,
        pose: {
          hipL: [0.62, 0, 0.06], kneeL: [-0.28, 0, 0],
          hipR: [-0.48, 0, -0.06], kneeR: [-0.62, 0, 0],
          shoulderL: [-0.5, 0, 0.2], shoulderR: [0.5, 0, -0.2],
          spine: [0, 0.08, 0],
        },
        y: 0,
      },
    ],
  },

  wave: {
    duration: 2.4,
    showBar: false,
    keys: [
      { t: 0, pose: { shoulderR: [0, 0, -0.22], elbowR: [0, 0, -0.12] } },
      { t: 0.22, pose: { shoulderR: [0, 0, -2.5], elbowR: [0, 0, -0.5], neck: [0, -0.15, 0] } },
      { t: 0.4, pose: { shoulderR: [0, 0, -2.5], elbowR: [0, 0, -1.0], neck: [0, -0.15, 0] } },
      { t: 0.55, pose: { shoulderR: [0, 0, -2.5], elbowR: [0, 0, -0.35], neck: [0, -0.15, 0] } },
      { t: 0.7, pose: { shoulderR: [0, 0, -2.5], elbowR: [0, 0, -1.0], neck: [0, -0.15, 0] } },
      { t: 1, pose: { shoulderR: [0, 0, -0.22], elbowR: [0, 0, -0.12] } },
    ],
  },

  point: {
    duration: 3,
    showBar: false,
    keys: [
      { t: 0, pose: { shoulderR: [0, 0, -0.22] } },
      // Arm swings forward and slightly down: pointing at something on the page below.
      { t: 0.25, pose: { shoulderR: [-1.35, -0.35, -0.5], elbowR: [0, 0, -0.05], neck: [0.12, -0.3, 0], spine: [0, -0.18, 0] } },
      { t: 0.8, pose: { shoulderR: [-1.35, -0.35, -0.5], elbowR: [0, 0, -0.05], neck: [0.12, -0.3, 0], spine: [0, -0.18, 0] } },
      { t: 1, pose: { shoulderR: [0, 0, -0.22] } },
    ],
  },

  deadlift: {
    duration: 3.4,
    showBar: true,
    keys: [
      // Setup: hips back, chest over the bar, arms straight down.
      { t: 0, pose: { hips: [0.95, 0, 0], spine: [0.2, 0, 0], chest: [-0.25, 0, 0], kneeL: [-0.6, 0, 0], kneeR: [-0.6, 0, 0], shoulderL: [0.15, 0, 0.16], shoulderR: [0.15, 0, -0.16] }, y: -0.42, bar: 0.16 },
      // Drive: the fast part. Hips and chest rise together.
      { t: 0.3, pose: { hips: [0.1, 0, 0], spine: [0, 0, 0], chest: [0, 0, 0], kneeL: [-0.1, 0, 0], kneeR: [-0.1, 0, 0], shoulderL: [0, 0, 0.14], shoulderR: [0, 0, -0.14] }, y: 0, bar: 0.92 },
      // Lockout: shoulders back, a beat of stillness.
      { t: 0.45, pose: { hips: [-0.08, 0, 0], chest: [-0.1, 0, 0], shoulderL: [0, 0, 0.12], shoulderR: [0, 0, -0.12], wingL: [0, 0.9, 0.4], wingR: [0, -0.9, -0.4] }, y: 0.03, bar: 0.96 },
      // Eccentric: slower than the drive, which is what sells it as heavy.
      { t: 0.85, pose: { hips: [0.95, 0, 0], spine: [0.2, 0, 0], chest: [-0.25, 0, 0], kneeL: [-0.6, 0, 0], kneeR: [-0.6, 0, 0] }, y: -0.42, bar: 0.16 },
      { t: 1, pose: { hips: [0.95, 0, 0], spine: [0.2, 0, 0], chest: [-0.25, 0, 0], kneeL: [-0.6, 0, 0], kneeR: [-0.6, 0, 0] }, y: -0.42, bar: 0.16 },
    ],
  },

  bench: {
    duration: 3,
    showBar: true,
    // Root is laid on its back; the press then runs along what is now the vertical axis.
    keys: [
      { t: 0, pose: { shoulderL: [-1.5, 0, 0.5], elbowL: [0, 0, 1.2], shoulderR: [-1.5, 0, -0.5], elbowR: [0, 0, -1.2], hipL: [-1.5, 0, 0.2], kneeL: [-1.2, 0, 0], hipR: [-1.5, 0, -0.2], kneeR: [-1.2, 0, 0] }, rootRot: [-1.5, 0, 0], y: -0.55, bar: 0.35 },
      { t: 0.35, pose: { shoulderL: [-2.6, 0, 0.25], elbowL: [0, 0, 0.08], shoulderR: [-2.6, 0, -0.25], elbowR: [0, 0, -0.08], hipL: [-1.5, 0, 0.2], kneeL: [-1.2, 0, 0], hipR: [-1.5, 0, -0.2], kneeR: [-1.2, 0, 0] }, rootRot: [-1.5, 0, 0], y: -0.55, bar: 0.95 },
      { t: 0.5, pose: { shoulderL: [-2.6, 0, 0.25], elbowL: [0, 0, 0.08], shoulderR: [-2.6, 0, -0.25], elbowR: [0, 0, -0.08], hipL: [-1.5, 0, 0.2], kneeL: [-1.2, 0, 0], hipR: [-1.5, 0, -0.2], kneeR: [-1.2, 0, 0] }, rootRot: [-1.5, 0, 0], y: -0.55, bar: 0.95 },
      { t: 1, pose: { shoulderL: [-1.5, 0, 0.5], elbowL: [0, 0, 1.2], shoulderR: [-1.5, 0, -0.5], elbowR: [0, 0, -1.2], hipL: [-1.5, 0, 0.2], kneeL: [-1.2, 0, 0], hipR: [-1.5, 0, -0.2], kneeR: [-1.2, 0, 0] }, rootRot: [-1.5, 0, 0], y: -0.55, bar: 0.35 },
    ],
  },

  curl: {
    duration: 2.6,
    showBar: true,
    keys: [
      { t: 0, pose: { shoulderL: [0.1, 0, 0.2], elbowL: [0, 0, 0.1], shoulderR: [0.1, 0, -0.2], elbowR: [0, 0, -0.1] }, bar: 0.42 },
      { t: 0.3, pose: { shoulderL: [0.15, 0, 0.2], elbowL: [-2.3, 0, 0.1], shoulderR: [0.15, 0, -0.2], elbowR: [-2.3, 0, -0.1], chest: [-0.06, 0, 0] }, bar: 1.02 },
      { t: 0.42, pose: { shoulderL: [0.15, 0, 0.2], elbowL: [-2.3, 0, 0.1], shoulderR: [0.15, 0, -0.2], elbowR: [-2.3, 0, -0.1] }, bar: 1.02 },
      { t: 1, pose: { shoulderL: [0.1, 0, 0.2], elbowL: [0, 0, 0.1], shoulderR: [0.1, 0, -0.2], elbowR: [0, 0, -0.1] }, bar: 0.42 },
    ],
  },

  stretch: {
    duration: 5,
    showBar: false,
    keys: [
      { t: 0, pose: {} },
      // Overhead reach, then a long side bend each way.
      { t: 0.2, pose: { shoulderL: [0, 0, 2.9], shoulderR: [0, 0, -2.9], chest: [-0.12, 0, 0] }, y: 0.04 },
      { t: 0.42, pose: { shoulderL: [0, 0, 2.9], shoulderR: [0, 0, -2.9], spine: [0, 0, -0.35], chest: [0, 0, -0.2] }, y: 0.04 },
      { t: 0.64, pose: { shoulderL: [0, 0, 2.9], shoulderR: [0, 0, -2.9], spine: [0, 0, 0.35], chest: [0, 0, 0.2] }, y: 0.04 },
      { t: 0.85, pose: { shoulderL: [0, 0, 2.9], shoulderR: [0, 0, -2.9] }, y: 0.04 },
      { t: 1, pose: {} },
    ],
  },

  box: {
    duration: 1.9,
    showBar: false,
    // Guard high, alternating straight punches, weight shifting through the hips.
    keys: [
      { t: 0, pose: { shoulderL: [-1.1, 0.3, 0.6], elbowL: [0, 0, 1.9], shoulderR: [-1.1, -0.3, -0.6], elbowR: [0, 0, -1.9], spine: [0, 0.25, 0] } },
      { t: 0.18, pose: { shoulderL: [-1.5, -0.15, 0.25], elbowL: [0, 0, 0.12], shoulderR: [-1.1, -0.3, -0.6], elbowR: [0, 0, -1.9], spine: [0, -0.2, 0], hips: [0, -0.18, 0] } },
      { t: 0.36, pose: { shoulderL: [-1.1, 0.3, 0.6], elbowL: [0, 0, 1.9], shoulderR: [-1.1, -0.3, -0.6], elbowR: [0, 0, -1.9], spine: [0, 0.25, 0] } },
      { t: 0.56, pose: { shoulderR: [-1.5, 0.15, -0.25], elbowR: [0, 0, -0.12], shoulderL: [-1.1, 0.3, 0.6], elbowL: [0, 0, 1.9], spine: [0, 0.3, 0], hips: [0, 0.2, 0] } },
      { t: 0.76, pose: { shoulderL: [-1.1, 0.3, 0.6], elbowL: [0, 0, 1.9], shoulderR: [-1.1, -0.3, -0.6], elbowR: [0, 0, -1.9], spine: [0, 0.25, 0] } },
      { t: 1, pose: { shoulderL: [-1.1, 0.3, 0.6], elbowL: [0, 0, 1.9], shoulderR: [-1.1, -0.3, -0.6], elbowR: [0, 0, -1.9], spine: [0, 0.25, 0] } },
    ],
  },

  celebrate: {
    duration: 2.6,
    showBar: false,
    keys: [
      { t: 0, pose: {}, y: 0 },
      // Dip, then a jump with the wings thrown wide.
      { t: 0.15, pose: { hipL: [0, 0, 0.06], kneeL: [-0.7, 0, 0], hipR: [0, 0, -0.06], kneeR: [-0.7, 0, 0], hips: [0.3, 0, 0] }, y: -0.28 },
      { t: 0.42, pose: { shoulderL: [0, 0, 2.7], shoulderR: [0, 0, -2.7], kneeL: [-0.35, 0, 0], kneeR: [-0.35, 0, 0], wingL: [0, 1.35, 0.7], wingR: [0, -1.35, -0.7], chest: [-0.18, 0, 0] }, y: 0.75 },
      { t: 0.68, pose: { shoulderL: [0, 0, 2.5], shoulderR: [0, 0, -2.5], kneeL: [-0.55, 0, 0], kneeR: [-0.55, 0, 0], wingL: [0, 1.1, 0.55], wingR: [0, -1.1, -0.55] }, y: -0.12 },
      { t: 1, pose: {}, y: 0 },
    ],
  },
};

/** Smoothstep — removes the linear feel between keys without an easing library. */
const ease = (t: number) => t * t * (3 - 2 * t);

/** Resolve the pose at a normalised time by interpolating the surrounding keys. */
function sample(clip: Clip, t: number) {
  const keys = clip.keys;
  let a = keys[0]!;
  let b = keys[keys.length - 1]!;

  for (let i = 0; i < keys.length - 1; i += 1) {
    if (t >= keys[i]!.t && t <= keys[i + 1]!.t) {
      a = keys[i]!;
      b = keys[i + 1]!;
      break;
    }
  }

  const span = b.t - a.t;
  const k = span <= 0 ? 0 : ease((t - a.t) / span);

  const pose = {} as Record<Joint, Euler3>;
  for (const joint of JOINTS) {
    const from = a.pose[joint] ?? REST[joint];
    const to = b.pose[joint] ?? REST[joint];
    pose[joint] = [
      from[0] + (to[0] - from[0]) * k,
      from[1] + (to[1] - from[1]) * k,
      from[2] + (to[2] - from[2]) * k,
    ];
  }

  const lerp = (x: number, y: number) => x + (y - x) * k;
  const aRot = a.rootRot ?? [0, 0, 0];
  const bRot = b.rootRot ?? [0, 0, 0];

  return {
    pose,
    y: lerp(a.y ?? 0, b.y ?? 0),
    bar: lerp(a.bar ?? 0.5, b.bar ?? 0.5),
    rootRot: [lerp(aRot[0], bRot[0]), lerp(aRot[1], bRot[1]), lerp(aRot[2], bRot[2])] as Euler3,
  };
}

const GOLD = '#C9A227';
const GOLD_DEEP = '#8A6B18';
const IRON = '#2A2530';

function Metal({ color = GOLD, roughness = 0.26 }: { color?: string; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={0.96} roughness={roughness} envMapIntensity={1.7} />;
}

/** One wing: three tapered feather blades fanned out from the shoulder. */
function Wing({ side }: { side: 1 | -1 }) {
  const feathers = useMemo(() => [
    { len: 1.25, tilt: 0.1, spread: 0.0, thick: 0.075 },
    { len: 1.05, tilt: 0.42, spread: 0.16, thick: 0.065 },
    { len: 0.8, tilt: 0.76, spread: 0.3, thick: 0.055 },
  ], []);

  return (
    <group>
      {feathers.map((feather, index) => (
        <mesh
          key={index}
          position={[side * (0.12 + feather.spread), feather.spread * 0.5, -0.08 - index * 0.05]}
          rotation={[0, 0, side * (0.9 - feather.tilt)]}
        >
          <capsuleGeometry args={[feather.thick, feather.len, 3, 6]} />
          <Metal color={index === 0 ? GOLD : GOLD_DEEP} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

type RigProps = {
  act: MascotAct;
  /** Playback speed multiplier. */
  speed?: number;
};

/**
 * The character itself. Drop it inside an existing `<Canvas>` — it brings no lights of
 * its own, so it picks up whatever environment the surrounding scene provides.
 */
export function MascotRig({ act, speed = 1 }: RigProps) {
  const rootRef = useRef<THREE.Group>(null);
  const barRef = useRef<THREE.Group>(null);
  const clock = useRef(0);

  // One ref per joint, keyed by name, created once.
  const joints = useMemo(() => {
    const map = {} as Record<Joint, React.RefObject<THREE.Group | null>>;
    for (const joint of JOINTS) map[joint] = { current: null };
    return map;
  }, []);

  const clip = CLIPS[act];

  useFrame((_state, delta) => {
    clock.current += delta * speed;
    const t = (clock.current % clip.duration) / clip.duration;
    const frame = sample(clip, t);

    for (const joint of JOINTS) {
      const group = joints[joint].current;
      if (!group) continue;
      const [x, y, z] = frame.pose[joint];
      group.rotation.set(x, y, z);
    }

    if (rootRef.current) {
      rootRef.current.position.y = frame.y;
      rootRef.current.rotation.set(frame.rootRot[0], frame.rootRot[1], frame.rootRot[2]);
    }
    if (barRef.current) {
      barRef.current.visible = clip.showBar;
      barRef.current.position.y = frame.bar;
    }
  });

  return (
    <group ref={rootRef} dispose={null}>
      {/* The barbell is not parented to the hands: it is positioned by the clip, and the
          arms are posed to meet it. That is how hand-keyed animation works, and it avoids
          an IK solver for a figure that is always gripping symmetrically. */}
      <group ref={barRef} position={[0, 0.5, 0.28]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.038, 0.038, 2.1, 12]} />
          <Metal color="#9A96A2" roughness={0.3} />
        </mesh>
        {[-0.78, 0.78].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.11, 20]} />
            <Metal color={IRON} roughness={0.42} />
          </mesh>
        ))}
      </group>

      <group ref={joints.hips} position={[0, 0.92, 0]}>
        <mesh>
          <capsuleGeometry args={[0.19, 0.16, 4, 10]} />
          <Metal />
        </mesh>

        {/* ── Torso ─────────────────────────────────────────────────────── */}
        <group ref={joints.spine} position={[0, 0.2, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <capsuleGeometry args={[0.17, 0.2, 4, 10]} />
            <Metal />
          </mesh>

          <group ref={joints.chest} position={[0, 0.3, 0]}>
            {/* Broad, flat chest — the logo's silhouette is all shoulder width. */}
            <mesh position={[0, 0.08, 0]} scale={[1.45, 1, 0.72]}>
              <capsuleGeometry args={[0.21, 0.16, 4, 12]} />
              <Metal />
            </mesh>

            <group ref={joints.neck} position={[0, 0.32, 0]}>
              <mesh>
                <capsuleGeometry args={[0.062, 0.06, 3, 8]} />
                <Metal color={GOLD_DEEP} />
              </mesh>
              <mesh position={[0, 0.19, 0]} scale={[0.92, 1.05, 0.95]}>
                <sphereGeometry args={[0.145, 16, 14]} />
                <Metal />
              </mesh>
            </group>

            <group ref={joints.wingL} position={[-0.3, 0.12, -0.08]}>
              <Wing side={-1} />
            </group>
            <group ref={joints.wingR} position={[0.3, 0.12, -0.08]}>
              <Wing side={1} />
            </group>

            {/* ── Arms ────────────────────────────────────────────────── */}
            <group ref={joints.shoulderL} position={[-0.33, 0.14, 0]}>
              <mesh position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.082, 0.3, 4, 8]} />
                <Metal />
              </mesh>
              <group ref={joints.elbowL} position={[0, -0.46, 0]}>
                <mesh position={[0, -0.2, 0]}>
                  <capsuleGeometry args={[0.068, 0.28, 4, 8]} />
                  <Metal color={GOLD_DEEP} />
                </mesh>
                <mesh position={[0, -0.4, 0]}>
                  <sphereGeometry args={[0.078, 10, 8]} />
                  <Metal />
                </mesh>
              </group>
            </group>

            <group ref={joints.shoulderR} position={[0.33, 0.14, 0]}>
              <mesh position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.082, 0.3, 4, 8]} />
                <Metal />
              </mesh>
              <group ref={joints.elbowR} position={[0, -0.46, 0]}>
                <mesh position={[0, -0.2, 0]}>
                  <capsuleGeometry args={[0.068, 0.28, 4, 8]} />
                  <Metal color={GOLD_DEEP} />
                </mesh>
                <mesh position={[0, -0.4, 0]}>
                  <sphereGeometry args={[0.078, 10, 8]} />
                  <Metal />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* ── Legs ──────────────────────────────────────────────────────── */}
        <group ref={joints.hipL} position={[-0.13, -0.14, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.098, 0.32, 4, 8]} />
            <Metal />
          </mesh>
          <group ref={joints.kneeL} position={[0, -0.5, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.079, 0.3, 4, 8]} />
              <Metal color={GOLD_DEEP} />
            </mesh>
            <mesh position={[0, -0.42, 0.055]} scale={[1, 0.5, 1.7]}>
              <sphereGeometry args={[0.088, 10, 8]} />
              <Metal />
            </mesh>
          </group>
        </group>

        <group ref={joints.hipR} position={[0.13, -0.14, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.098, 0.32, 4, 8]} />
            <Metal />
          </mesh>
          <group ref={joints.kneeR} position={[0, -0.5, 0]}>
            <mesh position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.079, 0.3, 4, 8]} />
              <Metal color={GOLD_DEEP} />
            </mesh>
            <mesh position={[0, -0.42, 0.055]} scale={[1, 0.5, 1.7]}>
              <sphereGeometry args={[0.088, 10, 8]} />
              <Metal />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export { CLIPS as mascotClips };
