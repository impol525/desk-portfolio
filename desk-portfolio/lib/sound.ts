import { useStore } from "@/store/useStore";

export type Sfx = "hover" | "click" | "back" | "toggle";

interface Tone {
  from: number;
  to: number;
  duration: number;
  volume: number;
  type: OscillatorType;
}

// Tiny synthesized sounds, so there are no audio files to download.
const TONES: Record<Sfx, Tone> = {
  hover: { from: 520, to: 640, duration: 0.07, volume: 0.025, type: "sine" },
  click: { from: 520, to: 880, duration: 0.14, volume: 0.06, type: "triangle" },
  back: { from: 640, to: 360, duration: 0.14, volume: 0.05, type: "triangle" },
  toggle: { from: 420, to: 620, duration: 0.1, volume: 0.05, type: "square" },
};

let ctx: AudioContext | null = null;
let lastHover = 0;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playSfx(kind: Sfx) {
  if (useStore.getState().muted) return;
  if (kind === "hover") {
    const now = performance.now();
    if (now - lastHover < 150) return;
    lastHover = now;
  }
  const ac = getContext();
  if (!ac) return;

  const tone = TONES[kind];
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = tone.type;
  osc.frequency.setValueAtTime(tone.from, t);
  osc.frequency.exponentialRampToValueAtTime(tone.to, t + tone.duration);
  gain.gain.setValueAtTime(tone.volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + tone.duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + tone.duration);
}
