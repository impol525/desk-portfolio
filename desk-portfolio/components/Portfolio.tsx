"use client";

import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import { Overlay } from "./ui/Overlay";

// The WebGL canvas only exists in the browser.
const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false });

export default function Portfolio() {
  const theme = useStore((s) => s.theme);

  return (
    <main data-theme={theme} className="relative h-dvh w-screen overflow-hidden bg-[var(--bg)]">
      {/* painted sky behind the transparent 3D canvas */}
      <div className="sky" aria-hidden="true">
        <div className="sky-orb" />
        <div className="sky-cloud sky-cloud-1" />
        <div className="sky-cloud sky-cloud-2" />
        <div className="sky-cloud sky-cloud-3" />
        <div className="sky-skyline" />
      </div>

      <div className="cine-grade absolute inset-0">
        <Scene />
      </div>

      {/* film look: vignette, grain and letterbox bars (all ignore clicks) */}
      <div className="cine-vignette pointer-events-none absolute inset-0 z-[5]" />
      <div className="cine-grain pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        <div className="cine-grain-inner" />
      </div>
      <div className="cine-bars pointer-events-none absolute inset-0 z-[6]" />

      <Overlay />
    </main>
  );
}