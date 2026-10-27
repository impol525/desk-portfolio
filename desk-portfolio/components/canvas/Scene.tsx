"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerspectiveCamera, Sparkles, Stars } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import { VIEWS } from "@/data/views";
import { useStore } from "@/store/useStore";
import { CameraRig } from "./CameraRig";
import { Hotspot } from "./Hotspot";
import { LightShafts } from "./LightShafts";
import { DriftClouds, Plinth } from "./Plinth";
import { Room } from "./Room";
import { BookStack, Desk, Keyboard, Lamp, Monitor, Mouse, Mug, Notebook, Phone, Plant, SpinChair } from "./models";

// The sky behind the scene is drawn in CSS (see .sky in globals.css), so the canvas is transparent.
// Fog only needs a color close to that sky.
const FOG = { dark: "#0a0f26", light: "#e27a4a" };

function Lights({ coarse }: { coarse: boolean }) {
  const dark = useStore((s) => s.theme === "dark");

  return (
    <>
      <ambientLight intensity={dark ? 0.25 : 0.05} />
      <hemisphereLight
        args={[
          dark ? "#5a75b3" : "#ffb899",
          dark ? "#15192b" : "#1b122b",
          dark ? 0.45 : 0.35,
        ]}
      />
      <directionalLight
        castShadow
        position={dark ? [4, 6, 4] : [8, 1.8, 6]}
        color={dark ? "#8ba8ff" : "#ff4400"}
        intensity={dark ? 1.8 : 6.0}
        shadow-mapSize={coarse ? [1024, 1024] : [2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* soft pool of light on the desk, like a film key light */}
      <spotLight
        position={[0.3, 4.2, 2.4]}
        angle={0.55}
        penumbra={1}
        intensity={dark ? 30 : 14}
        distance={12}
        decay={2}
        color={dark ? "#ffd9a8" : "#ffc58a"}
      />
      <Environment resolution={256} frames={1} environmentIntensity={dark ? 0.3 : 0.15}>
        <Lightformer form="rect" intensity={dark ? 0.8 : 1} position={[0, 6, -4]} scale={[10, 4, 1]} color={dark ? "#4a70ff" : "#ff8844"} />
        <Lightformer form="rect" intensity={dark ? 0.8 : 1} position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color={dark ? "#3355ff" : "#ff5500"} />
        <Lightformer form="circle" intensity={dark ? 1.5 : 2} position={[5, 2, 5]} scale={5} color={dark ? "#6688ff" : "#ff3300"} />
      </Environment>
    </>
  );
}

export default function Scene() {
  const theme = useStore((s) => s.theme);
  const toggleLamp = useStore((s) => s.toggleLamp);
  const kickChair = useStore((s) => s.kickChair);

  const dark = theme === "dark";
  // phones and tablets: lighter shadows, lower pixel ratio, no antialiasing
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      shadows
      dpr={coarse ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !coarse, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <fogExp2 attach="fog" args={[FOG[theme], 0.03]} />
      <PerspectiveCamera makeDefault fov={30} near={0.1} far={60} position={VIEWS.home.position} />
      <CameraRig />
      <Lights coarse={coarse} />

      {/* the sky around the room */}
      {dark && <Stars radius={28} depth={24} count={coarse ? 700 : 1800} factor={4} saturation={0} fade speed={0.6} />}
      <DriftClouds />

      <Plinth />
      <Room />
      <LightShafts />
      <Desk />
      <Keyboard position={[0, 1.03, 0.4]} />
      <Mouse position={[0.85, 1.03, 0.42]} rotation={[0, 0.15, 0]} />
      <Mug position={[-0.95, 1, 0.05]} />

      <Plant position={[3.1, 0, -1.0]} />

      <ContactShadows position={[0.3, 0.02, 0.9]} opacity={0.4} scale={9} blur={2.5} far={3} frames={1} />

      {/* room dust */}
      <Sparkles
        count={coarse ? 15 : 40}
        scale={[6, 3, 4]}
        position={[0.3, 2, 0.8]}
        size={2}
        speed={0.25}
        opacity={dark ? 0.6 : 0.35}
        color={dark ? "#a3c2ff" : "#ffffff"}
      />
      {/* dust floating in the window light */}
      <Sparkles
        count={coarse ? 10 : 30}
        scale={[3.5, 1.8, 1.5]}
        position={[-1.4, 1.6, 0.6]}
        size={3}
        speed={0.15}
        opacity={0.8}
        color={dark ? "#bcd0ff" : "#ffd9a0"}
      />

      <Hotspot label="Desk lamp" position={[1.65, 1, -0.7]} labelHeight={1.05} onSelect={toggleLamp}>
        <Lamp />
      </Hotspot>

      <Hotspot label="Spin the chair" position={[0.9, 0, 1.75]} rotation={[0, Math.PI + 0.55, 0]} labelHeight={1.35} onSelect={kickChair}>
        <SpinChair />
      </Hotspot>

      <Hotspot id="projects" label="Projects" position={[0, 1, -0.5]} labelHeight={1.5}>
        <Monitor />
      </Hotspot>

      <Hotspot id="about" label="About me" position={[-1.3, 1, 0.5]} rotation={[0, 0.3, 0]} labelHeight={0.5}>
        <Notebook />
      </Hotspot>

      <Hotspot id="stack" label="Tech stack" position={[-1.6, 1, -0.6]} labelHeight={0.6}>
        <BookStack />
      </Hotspot>

      <Hotspot id="contact" label="Contact" position={[1.5, 1, 0.5]} rotation={[0, -0.4, 0]} labelHeight={0.5}>
        <Phone />
      </Hotspot>
    </Canvas>
  );
}