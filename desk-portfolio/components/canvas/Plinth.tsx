"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import type { Vec3 } from "@/data/views";
import { useStore } from "@/store/useStore";
import { useCanvasTexture } from "./textures";

function drawShadow(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  g.addColorStop(0, "rgba(0,0,0,0.65)");
  g.addColorStop(0.6, "rgba(0,0,0,0.25)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

/** The base slab under the room, with a glowing edge and a soft shadow below. */
export function Plinth() {
  const dark = useStore((s) => s.theme === "dark");
  const shadow = useCanvasTexture(256, 256, drawShadow);

  return (
    <group>
      <RoundedBox args={[7.6, 0.45, 5.6]} radius={0.06} smoothness={3} position={[0.3, -0.425, 0.9]} castShadow receiveShadow>
        <meshStandardMaterial color={dark ? "#10152b" : "#5a2d3c"} roughness={0.6} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0.3, -0.43, 0.9]}>
        <boxGeometry args={[7.62, 0.04, 5.62]} />
        <meshStandardMaterial
          color={dark ? "#5b7cff" : "#ff9a3c"}
          emissive={dark ? "#5b7cff" : "#ff9a3c"}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.3, -1.0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 9]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} fog={false} />
      </mesh>
    </group>
  );
}

interface PuffProps {
  position: Vec3;
  size: number;
  speed: number;
  phase: number;
}

const PUFFS: PuffProps[] = [
  { position: [-5, 3.2, -5], size: 1.3, speed: 0.12, phase: 0 },
  { position: [3, 4.2, -7.5], size: 1.5, speed: 0.1, phase: 1.5 },
  { position: [-7, -0.5, 1], size: 1.1, speed: 0.14, phase: 3 },
  { position: [7, 0.5, -2], size: 1.2, speed: 0.11, phase: 4.5 },
  { position: [-2.5, -3, 6.5], size: 1.4, speed: 0.13, phase: 2 },
  { position: [5, -2.2, 5.5], size: 1.2, speed: 0.1, phase: 5 },
];

const BLOBS: [number, number, number, number][] = [
  [0, 0, 0, 1],
  [0.9, -0.1, 0.1, 0.75],
  [-0.9, -0.15, 0, 0.7],
  [0.3, 0.35, 0, 0.65],
];

function Puff({ position, size, speed, phase }: PuffProps) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed + phase) * 0.8;
  });

  return (
    <group ref={ref} position={position} scale={size}>
      {BLOBS.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} scale={[r * 1.3, r * 0.8, r]}>
          <sphereGeometry args={[0.6, 16, 12]} />
          <meshBasicMaterial color="#ffb9a0" transparent opacity={0.55} fog={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Soft pink clouds drifting around the room at sunset (hidden at night, where stars take over). */
export function DriftClouds() {
  const dark = useStore((s) => s.theme === "dark");
  if (dark) return null;

  return (
    <group>
      {PUFFS.map((p, i) => (
        <Puff key={i} {...p} />
      ))}
    </group>
  );
}