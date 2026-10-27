"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { easing } from "maath";
import type { Group } from "three";
import type { Vec3 } from "@/data/views";
import { playSfx } from "@/lib/sound";
import { useStore, type ViewId } from "@/store/useStore";

interface HotspotProps {
  /** Opens this view (camera zoom + panel). */
  id?: Exclude<ViewId, "home">;
  /** Or run any action, for example toggling the lamp. */
  onSelect?: () => void;
  label: string;
  position: Vec3;
  rotation?: Vec3;
  /** Height of the floating label above the group origin. */
  labelHeight?: number;
  children: ReactNode;
}

/**
 * Wraps any model (primitive today, .glb later) with hover + click behaviour.
 * Labels are always visible on the home view so touch users can see what is tappable.
 */
export function Hotspot({ id, onSelect, label, position, rotation, labelHeight = 1, children }: HotspotProps) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);

  const interactive = view === "home";
  const active = hovered && interactive;
  useCursor(active);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const s = active ? 1.04 : 1;
    easing.damp3(ref.current.scale, [s, s, s], 0.15, delta);
  });

  const select = () => {
    if (!interactive) return;
    playSfx("click");
    if (id) setView(id);
    onSelect?.();
    // touch screens never send "pointer out", so clear the hover state ourselves
    if (window.matchMedia("(hover: none)").matches) setHovered(false);
  };

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!hovered && interactive) playSfx("hover");
    setHovered(true);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    select();
  };

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={onOver}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
      <Html position={[0, labelHeight, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <button
          type="button"
          tabIndex={interactive ? 0 : -1}
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            select();
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className={`glass whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition duration-300 sm:text-sm ${
            interactive ? "pointer-events-auto opacity-90" : "pointer-events-none opacity-0"
          } ${active ? "scale-110 opacity-100" : "scale-100"}`}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}