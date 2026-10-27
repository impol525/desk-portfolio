"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { MathUtils, Vector3, type PerspectiveCamera } from "three";
import { VIEWS } from "@/data/views";
import { useStore } from "@/store/useStore";

const SMOOTH_TIME = 0.65;
const INTRO_SECONDS = 3.2;

// the monitor screen in world space (see MonitorScreen.tsx)
const SCREEN = { x: 0, y: 1.87, z: -0.47, w: 1.5, h: 0.8 };

export function CameraRig() {
  const lookAt = useRef(new Vector3(...VIEWS.home.target));
  const goal = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const shiftY = useRef(0);
  const intro = useRef(0);
  const ready = useRef(false);
  const reduced = useRef(false);

  useFrame((state, delta) => {
    const cam = state.camera as PerspectiveCamera;
    const { size } = state;
    const { view: viewId, monitorMode, compact } = useStore.getState();
    const home = viewId === "home";
    const onMonitor = monitorMode && !home;
    const { position, target: look, shiftX = 0 } = VIEWS[viewId];

    if (!ready.current) {
      reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced.current) intro.current = 1;
    }

    // 0 on desktop and landscape, 1 on a tall phone screen
    const aspect = size.width / size.height;
    const p = MathUtils.clamp((1.2 - aspect) / (1.2 - 0.46), 0, 1);

    if (onMonitor) {
      // face the screen straight on, close enough that it fills most of the view
      const tanHalf = Math.tan(MathUtils.degToRad((30 + 12 * p) / 2));
      const fitH = SCREEN.h / (0.74 * 2 * tanHalf);
      const fitW = SCREEN.w / ((compact ? 0.94 : 0.84) * 2 * tanHalf * aspect);
      target.set(SCREEN.x, SCREEN.y, SCREEN.z);
      goal.set(SCREEN.x, SCREEN.y, SCREEN.z + Math.max(fitH, fitW));
    } else {
      // phones use a bottom sheet, so drop the sideways offset made for the desktop side panel
      const sx = shiftX * p;
      target.set(look[0] - sx, look[1], look[2]);
      goal.set(position[0] - sx, position[1], position[2]);

      // pull the camera back on narrow screens so the object still fits
      const dolly = 1 + (home ? 0.5 : 1.4) * p;
      goal.sub(target).multiplyScalar(dolly).add(target);
    }

    // opening shot: start tight and low, then pull back to the full desk
    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + delta / INTRO_SECONDS);
      if (home) {
        const e = 1 - Math.pow(1 - intro.current, 3);
        goal.sub(target).multiplyScalar(0.55 + 0.45 * e).add(target);
        goal.y -= (1 - e) * 0.8;
      }
    }

    if (home) {
      // gentle pointer parallax on the home view only
      goal.x += state.pointer.x * 0.5;
      goal.y += state.pointer.y * 0.25;
    }

    // slow handheld-camera drift (very small while reading the monitor)
    if (!reduced.current) {
      const t = state.clock.elapsedTime;
      const k = home ? 1 : onMonitor ? 0.2 : 0.5;
      goal.x += Math.sin(t * 0.35) * 0.05 * k;
      goal.y += Math.sin(t * 0.5 + 1) * 0.03 * k;
    }

    // first frame: start exactly on the opening shot instead of sliding to it
    if (!ready.current) {
      cam.position.copy(goal);
      ready.current = true;
    }

    easing.damp3(cam.position, goal, SMOOTH_TIME, delta);
    easing.damp3(lookAt.current, target, SMOOTH_TIME, delta);
    cam.lookAt(lookAt.current);

    // wider field of view on tall screens
    const fov = 30 + 12 * p;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // keep the view centered while on the monitor
    const targetShift = home || onMonitor ? 0 : 0.26 * size.height * p;
    shiftY.current = MathUtils.damp(shiftY.current, targetShift, 1 / SMOOTH_TIME, delta);
    if (shiftY.current > 0.5) {
      cam.setViewOffset(size.width, size.height, 0, shiftY.current, size.width, size.height);
    } else if (cam.view) {
      cam.clearViewOffset();
    }
  });

  return null;
}