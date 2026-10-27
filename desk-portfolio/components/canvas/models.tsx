"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { DoubleSide, type Group } from "three";
import type { Vec3 } from "@/data/views";
import { useStore } from "@/store/useStore";
import { drawKeyboard, drawPhone, drawScreen, useCanvasTexture } from "./textures";

/**
 * Placeholder models. Every component is origin-at-base (y = 0 sits on the surface it rests on),
 * so replacing one with a <primitive object={gltf.scene} /> keeps the layout intact.
 */

interface ModelProps {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number;
}

const METAL = "#cfd3e0";

export function Desk({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[4, 0.1, 2]} radius={0.025} smoothness={4} position={[0, 0.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8a6a4f" roughness={0.55} />
      </RoundedBox>

      {/* desk mat */}
      <RoundedBox args={[1.9, 0.012, 0.85]} radius={0.005} position={[0.05, 1.006, 0.3]} receiveShadow>
        <meshStandardMaterial color="#1d2236" roughness={0.9} />
      </RoundedBox>

      {/* left legs with a cross bar */}
      {[-0.85, 0.85].map((z) => (
        <mesh key={z} position={[-1.9, 0.45, z]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#20232d" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[-1.9, 0.3, 0]} castShadow>
        <boxGeometry args={[0.05, 0.05, 1.7]} />
        <meshStandardMaterial color="#20232d" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* right drawer cabinet */}
      <RoundedBox args={[0.9, 0.85, 1.8]} radius={0.02} position={[1.45, 0.475, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2c3350" roughness={0.6} />
      </RoundedBox>
      {[0.2, 0.47, 0.74].map((y) => (
        <group key={y}>
          <RoundedBox args={[0.8, 0.25, 0.02]} radius={0.008} position={[1.45, y, 0.905]} castShadow>
            <meshStandardMaterial color="#363e63" roughness={0.5} />
          </RoundedBox>
          <mesh position={[1.45, y + 0.06, 0.93]}>
            <boxGeometry args={[0.22, 0.018, 0.03]} />
            <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Monitor({ position, rotation }: ModelProps) {
  const screen = useCanvasTexture(1024, 546, drawScreen);

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.55, 0.03, 0.32]} radius={0.012} position={[0, 0.015, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#20232d" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.22, -0.03]} castShadow>
        <boxGeometry args={[0.07, 0.4, 0.05]} />
        <meshStandardMaterial color="#20232d" metalness={0.6} roughness={0.3} />
      </mesh>
      <RoundedBox args={[1.6, 0.9, 0.06]} radius={0.02} smoothness={4} position={[0, 0.87, 0]} castShadow>
        <meshStandardMaterial color="#14161d" metalness={0.3} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.87, 0.032]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.85} toneMapped={false} />
      </mesh>
      {/* power light */}
      <mesh position={[0.7, 0.44, 0.032]}>
        <boxGeometry args={[0.02, 0.01, 0.004]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* soft light the screen throws onto the desk */}
      <pointLight position={[0, 0.8, 0.7]} color="#6b9bff" intensity={0.8} distance={2.5} decay={2} />
    </group>
  );
}

export function Keyboard({ position, rotation }: ModelProps) {
  const keys = useCanvasTexture(1024, 298, drawKeyboard);
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.0, 0.035, 0.34]} radius={0.012} position={[0, 0.0175, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#aab0c0" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.0365, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.96, 0.3]} />
        <meshStandardMaterial map={keys} roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Mouse({ position, rotation }: ModelProps) {
  return (
    <RoundedBox args={[0.07, 0.035, 0.115]} radius={0.016} smoothness={4} position={position} rotation={rotation} castShadow>
      <meshStandardMaterial color="#e6e9f2" roughness={0.4} />
    </RoundedBox>
  );
}

export function Phone({ position, rotation }: ModelProps) {
  const screen = useCanvasTexture(250, 500, drawPhone);
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.28, 0.03, 0.55]} radius={0.02} smoothness={4} position={[0, 0.015, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1c24" metalness={0.7} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.0305, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 0.5]} />
        <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Notebook({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.7, 0.04, 0.9]} radius={0.01} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e9588a" roughness={0.7} />
      </RoundedBox>
      <mesh position={[0.02, 0.055, 0]} castShadow>
        <boxGeometry args={[0.64, 0.03, 0.84]} />
        <meshStandardMaterial color="#f5f3ee" roughness={0.9} />
      </mesh>
      {/* spiral binding */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-0.335, 0.055, -0.38 + i * 0.085]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.011, 0.011, 0.09, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {/* pen */}
      <mesh position={[0.1, 0.085, 0.1]} rotation={[0, 0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, 0.3, 12]} />
        <meshStandardMaterial color="#f2c14e" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function BookStack({ position, rotation, scale = 1 }: ModelProps) {
  const books: { size: Vec3; y: number; color: string; rotY: number }[] = [
    { size: [0.7, 0.12, 0.5], y: 0.06, color: "#2f6f5e", rotY: 0.05 },
    { size: [0.62, 0.1, 0.45], y: 0.17, color: "#d9a441", rotY: -0.12 },
    { size: [0.55, 0.09, 0.4], y: 0.265, color: "#5b6cf0", rotY: 0.1 },
  ];
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {books.map((b, i) => (
        <group key={i} position={[0, b.y, 0]} rotation={[0, b.rotY, 0]}>
          <RoundedBox args={b.size} radius={0.008} castShadow receiveShadow>
            <meshStandardMaterial color={b.color} roughness={0.75} />
          </RoundedBox>
          {/* page block peeking out of the cover */}
          <mesh>
            <boxGeometry args={[b.size[0] - 0.03, b.size[1] - 0.035, b.size[2] + 0.03]} />
            <meshStandardMaterial color="#f1eee6" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Mug({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.2, 32]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.197, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.078, 32]} />
        <meshStandardMaterial color="#3b2416" roughness={0.3} />
      </mesh>
      <mesh position={[0.09, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.012, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.25} />
      </mesh>
    </group>
  );
}

export function Lamp({ position, rotation }: ModelProps) {
  const dark = useStore((s) => s.theme === "dark");
  const on = useStore((s) => s.lampOn);
  return (
    <group position={position} rotation={rotation}>
      {/* invisible hit area so the thin lamp is easy to click */}
      <mesh position={[-0.05, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.9, 0.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.14, 0.03, 32]} />
        <meshStandardMaterial color="#20232d" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.086, 0.265, 0]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.004, 0.64, 0]} rotation={[0, 0, 0.9]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 12]} />
        <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.18, 0.8, 0]} rotation={[0, 0, 0.15]} castShadow>
        <coneGeometry args={[0.11, 0.16, 28, 1, true]} />
        <meshStandardMaterial color="#f2c14e" roughness={0.4} side={DoubleSide} />
      </mesh>
      <mesh position={[-0.18, 0.74, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={on ? "#fff2cf" : "#cfc8b4"} emissive="#ffc36b" emissiveIntensity={on ? 3 : 0} toneMapped={false} />
      </mesh>
      <pointLight position={[-0.18, 0.7, 0]} color="#ffb36b" intensity={on ? (dark ? 5 : 2.5) : 0} distance={5} decay={2} />
    </group>
  );
}

export function Plant({ position, rotation, scale = 1 }: ModelProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.17, 0.4, 24]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.395, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 24]} />
        <meshStandardMaterial color="#3a2b20" roughness={1} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => {
        const angle = (i / 9) * Math.PI * 2;
        const tilt = 0.25 + (i % 3) * 0.2;
        const height = 0.62 + (i % 3) * 0.1;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0.1 + (i % 3) * 0.03, height, 0]} rotation={[0, 0, -tilt]} scale={[0.07, 0.34, 0.025]} castShadow>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={i % 2 ? "#3f8f5a" : "#2f7a4b"} roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function Chair({ position, rotation }: ModelProps) {
  const fabric = "#2a2f4a";
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.27, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshStandardMaterial color="#20232d" metalness={0.6} roughness={0.3} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.17, 0.05, 0]} castShadow>
              <boxGeometry args={[0.34, 0.03, 0.05]} />
              <meshStandardMaterial color="#20232d" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0.33, 0.04, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#111318" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
      <RoundedBox args={[0.56, 0.1, 0.56]} radius={0.04} smoothness={4} position={[0, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.55, 0.08]} radius={0.035} smoothness={4} position={[0, 0.92, -0.26]} rotation={[-0.08, 0, 0]} castShadow>
        <meshStandardMaterial color={fabric} roughness={0.85} />
      </RoundedBox>
    </group>
  );
}

/** The chair spins when clicked (see kickChair in the store) and slowly settles. */
export function SpinChair() {
  const ref = useRef<Group>(null);
  const velocity = useRef(0);
  const seen = useRef(useStore.getState().chairKicks);

  useFrame((_, delta) => {
    const kicks = useStore.getState().chairKicks;
    if (kicks !== seen.current) {
      seen.current = kicks;
      velocity.current += 9;
    }
    if (!ref.current) return;
    ref.current.rotation.y += velocity.current * delta;
    velocity.current *= Math.exp(-2.2 * delta);
    if (velocity.current < 0.01) velocity.current = 0;
  });

  return (
    <group ref={ref}>
      <Chair />
    </group>
  );
}
