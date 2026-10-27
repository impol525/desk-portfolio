"use client";

import { RoundedBox } from "@react-three/drei";
import type { Vec3 } from "@/data/views";
import { useStore } from "@/store/useStore";
import { Hotspot } from "./Hotspot";
import { BookStack, Plant } from "./models";
import { drawArt, drawFloor, drawNightSky, drawSunsetSky, useCanvasTexture } from "./textures";

const PALETTE = {
  dark: {
    wall: "#121629", /* Deep cinematic navy/black */
    base: "#1a1f38", /* Darker baseboard */
    floorTint: "#1d2338", /* Dark cool wood shadow */
    rug: "#152030", /* Pitch blue rug */
    rugInner: "#0b111a",
  },
  light: {
    wall: "#c4b7b1",
    base: "#ffffff",
    floorTint: "#bdaea6",
    rug: "#4a3b34",
    rugInner: "#2b211d",
  },
};

interface FrameProps {
  position: Vec3;
  size: [number, number];
  seed: number;
  palette: [string, string, string];
}

function Frame({ position, size, seed, palette }: FrameProps) {
  const art = useCanvasTexture(
    400,
    Math.round((400 * size[1]) / size[0]),
    (ctx, w, h) => drawArt(ctx, w, h, seed, palette),
  );
  return (
    <group position={position}>
      <RoundedBox args={[size[0], size[1], 0.04]} radius={0.01} castShadow receiveShadow>
        <meshStandardMaterial color="#f4f1ea" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[size[0] - 0.12, size[1] - 0.12]} />
        <meshStandardMaterial map={art} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Window() {
  const dark = useStore((s) => s.theme === "dark");
  const night = useCanvasTexture(512, 512, drawNightSky);
  const sunset = useCanvasTexture(512, 512, drawSunsetSky);
  const sky = dark ? night : sunset;
  const frame = "#f4f1ea";

  return (
    <group>
      <mesh>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial
          map={sky}
          emissiveMap={sky}
          emissive="#ffffff"
          emissiveIntensity={dark ? 1.1 : 1.5}
          toneMapped={false}
        />
      </mesh>
      {[
        { p: [0, 0.78, 0.01], s: [1.65, 0.08, 0.06] },
        { p: [0, -0.78, 0.01], s: [1.65, 0.08, 0.06] },
        { p: [-0.78, 0, 0.01], s: [0.08, 1.5, 0.06] },
        { p: [0.78, 0, 0.01], s: [0.08, 1.5, 0.06] },
        { p: [0, 0, 0.01], s: [0.04, 1.5, 0.04] },
        { p: [0, 0, 0.01], s: [1.5, 0.04, 0.04] },
      ].map((b, i) => (
        <mesh key={i} position={b.p as Vec3} castShadow>
          <boxGeometry args={b.s as Vec3} />
          <meshStandardMaterial color={frame} roughness={0.5} />
        </mesh>
      ))}
      <pointLight
        position={[0.9, 0, 0]}
        color={dark ? "#5983ff" : "#ff5500"}
        intensity={dark ? 1.8 : 8.0}
        distance={10}
        decay={2.5}
      />
    </group>
  );
}

export function Room() {
  const theme = useStore((s) => s.theme);
  const { wall, base, floorTint, rug, rugInner } = PALETTE[theme];
  const toggleTheme = useStore((s) => s.toggleTheme);
  const floorMap = useCanvasTexture(1024, 1024, drawFloor, { repeat: [2.4, 1.75] });

  return (
    <group>
      {/* floor */}
      <mesh position={[0.3, -0.1, 0.9]} receiveShadow>
        <boxGeometry args={[7.2, 0.2, 5.2]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.001, 0.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 5.2]} />
        <meshStandardMaterial map={floorMap} color={floorTint} roughness={0.55} />
      </mesh>

      {/* walls */}
      <mesh position={[0.3, 1.75, -1.7]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 3.5, 0.2]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      <mesh position={[-3.3, 1.75, 0.9]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.5, 5.2]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>

      {/* baseboards */}
      <mesh position={[0.3, 0.07, -1.58]} receiveShadow>
        <boxGeometry args={[6.8, 0.14, 0.04]} />
        <meshStandardMaterial color={base} roughness={0.6} />
      </mesh>
      <mesh position={[-3.18, 0.07, 0.9]} receiveShadow>
        <boxGeometry args={[0.04, 0.14, 5.0]} />
        <meshStandardMaterial color={base} roughness={0.6} />
      </mesh>

      <Hotspot label="Day / night" position={[-3.19, 2.0, 0.6]} rotation={[0, Math.PI / 2, 0]} labelHeight={1.0} onSelect={toggleTheme}>
        <Window />
      </Hotspot>

      {/* wall art */}
      <Frame position={[-2.25, 2.45, -1.575]} size={[0.9, 0.65]} seed={5} palette={["#f4a261", "#e76f51", "#264653"]} />
      <Frame position={[-1.3, 2.7, -1.575]} size={[0.55, 0.75]} seed={9} palette={["#e76f51", "#f4a261", "#2a9d8f"]} />
      <Frame position={[1.15, 2.75, -1.575]} size={[0.7, 0.5]} seed={14} palette={["#e9c46a", "#f4a261", "#e76f51"]} />

      {/* shelf */}
      <RoundedBox args={[1.5, 0.05, 0.28]} radius={0.01} position={[2.45, 2.4, -1.46]} castShadow receiveShadow>
        <meshStandardMaterial color="#8a6a4f" roughness={0.55} />
      </RoundedBox>
      {[1.9, 3.0].map((x) => (
        <mesh key={x} position={[x, 2.34, -1.54]} castShadow>
          <boxGeometry args={[0.04, 0.12, 0.12]} />
          <meshStandardMaterial color="#20232d" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <BookStack position={[2.05, 2.425, -1.46]} scale={0.5} />
      <Plant position={[2.8, 2.425, -1.46]} scale={0.45} />

      {/* rug */}
      <mesh position={[0.4, 0.012, 1.1]} scale={[1, 1, 0.72]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.024, 64]} />
        <meshStandardMaterial color={rug} roughness={1} />
      </mesh>
      <mesh position={[0.4, 0.026, 1.1]} scale={[1, 1, 0.72]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.012, 64]} />
        <meshStandardMaterial color={rugInner} roughness={1} />
      </mesh>
    </group>
  );
}