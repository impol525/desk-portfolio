"use client";

import { Html } from "@react-three/drei";
import { useStore } from "@/store/useStore";
import { MonitorOS } from "../ui/MonitorOS";

const SCREEN_WIDTH = 1.5; // world units

/**
 * The desktop UI is 960 x 512 px on wide screens and 440 x 235 px in compact mode (portrait phones).
 * distanceFactor maps the UI's pixel width onto the monitor screen's 1.5 world units.
 * If the UI looks slightly too big or small on the screen, nudge the factor (bigger = smaller UI).
 */
export function MonitorScreen() {
  const open = useStore((s) => s.monitorMode && s.view !== "home");
  const compact = useStore((s) => s.compact);

  const width = compact ? 440 : 960;
  const height = compact ? 235 : 512;

  return (
    <Html
      transform
      distanceFactor={(SCREEN_WIDTH / width) * 400}
      position={[0, 1.87, -0.462]}
      pointerEvents={open ? "auto" : "none"}
      zIndexRange={[10, 0]}
    >
      <div
        style={{ width, height }}
        className={`select-none overflow-hidden transition-opacity ${
          open ? "opacity-100 delay-500 duration-500" : "pointer-events-none opacity-0 duration-200"
        }`}
      >
        <MonitorOS open={open} compact={compact} />
      </div>
    </Html>
  );
}