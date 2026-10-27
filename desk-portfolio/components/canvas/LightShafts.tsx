"use client";

import { AdditiveBlending, DoubleSide } from "three";
import { useStore } from "@/store/useStore";
import { useCanvasTexture } from "./textures";

const LENGTH = 5.5;

function drawBeam(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // fades out along the beam...
  const along = ctx.createLinearGradient(0, 0, W, 0);
  along.addColorStop(0, "rgba(255,255,255,0.9)");
  along.addColorStop(0.5, "rgba(255,255,255,0.35)");
  along.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = along;
  ctx.fillRect(0, 0, W, H);

  // ...and softens at the edges
  ctx.globalCompositeOperation = "destination-in";
  const across = ctx.createLinearGradient(0, 0, 0, H);
  across.addColorStop(0, "rgba(255,255,255,0)");
  across.addColorStop(0.5, "rgba(255,255,255,1)");
  across.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = across;
  ctx.fillRect(0, 0, W, H);
}

/** Fake volumetric light: a few additive ribbons streaming in through the window. */
export function LightShafts() {
  const dark = useStore((s) => s.theme === "dark");
  const beam = useCanvasTexture(256, 128, drawBeam);
  const color = dark ? "#8fb0ff" : "#ffa24a";
  const opacity = dark ? 0.16 : 0.32;

  const material = (
    <meshBasicMaterial
      map={beam}
      color={color}
      transparent
      opacity={opacity}
      blending={AdditiveBlending}
      depthWrite={false}
      side={DoubleSide}
    />
  );

  return (
    <group position={[-3.15, 2.0, 0.6]} rotation={[0, 0, -0.4]}>
      <mesh position={[LENGTH / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LENGTH, 1.4]} />
        {material}
      </mesh>
      <mesh position={[LENGTH / 2, 0, 0]}>
        <planeGeometry args={[LENGTH, 1.4]} />
        {material}
      </mesh>
      <mesh position={[LENGTH / 2, 0.35, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LENGTH * 0.85, 0.9]} />
        {material}
      </mesh>
      <mesh position={[LENGTH / 2, -0.35, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LENGTH * 0.85, 0.9]} />
        {material}
      </mesh>
    </group>
  );
}