import type { ViewId } from "@/store/useStore";

export type Vec3 = [number, number, number];

export interface CameraView {
  position: Vec3;
  target: Vec3;
  /** Sideways offset baked into the pose for the desktop side panel (removed on phones). */
  shiftX?: number;
}

export const VIEWS: Record<ViewId, CameraView> = {
  home: { position: [6.5, 5.5, 6.5], target: [0, 1.1, 0.2] },
  projects: { position: [1.0, 1.9, 1.9], target: [1.0, 1.87, -0.5], shiftX: 1.0 },
  about: { position: [-0.4, 2.4, 1.9], target: [-1.3, 1.03, 0.5] },
  stack: { position: [-0.7, 1.9, 1.3], target: [-1.6, 1.2, -0.6] },
  contact: { position: [2.5, 2.3, 1.9], target: [1.5, 1.02, 0.5] },
};

export const NAV: { id: ViewId; label: string }[] = [
  { id: "home", label: "Desk" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About me" },
  { id: "stack", label: "Tech stack" },
  { id: "contact", label: "Contact" },
];