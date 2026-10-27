"use client";

import { useMemo } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/** Tiny deterministic random generator so textures look identical on every load. */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

interface TextureOptions {
  repeat?: [number, number];
}

export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  options?: TextureOptions,
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx, width, height);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    if (options?.repeat) {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(...options.repeat);
    }
    return tex;
    // draw functions are static, so only the size matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);
}

/** A code editor window for the monitor. */
export function drawScreen(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const r = rng(7);
  ctx.fillStyle = "#0e1320";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#161c2e";
  ctx.fillRect(0, 0, W, 38);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(24 + i * 22, 19, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#121827";
  ctx.fillRect(0, 38, 190, H - 38);
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = i === 2 ? "#3b82f6" : "#2a3350";
    ctx.fillRect(20 + (i % 3 === 1 ? 14 : 0), 64 + i * 30, 60 + r() * 80, 10);
  }
  const colors = ["#7aa2f7", "#bb9af7", "#9ece6a", "#e0af68", "#7dcfff", "#c0caf5"];
  for (let line = 0; line < 18; line++) {
    const y = 70 + line * 26;
    ctx.fillStyle = "#3b4261";
    ctx.fillRect(214, y, 18, 8);
    let x = 256 + Math.floor(r() * 3) * 28;
    const n = 2 + Math.floor(r() * 4);
    for (let k = 0; k < n; k++) {
      const w = 30 + r() * 110;
      ctx.fillStyle = colors[Math.floor(r() * colors.length)];
      ctx.fillRect(x, y, w, 10);
      x += w + 12;
    }
  }
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(0, H - 26, W, 26);
}

export function drawKeyboard(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#b9bfcd";
  ctx.fillRect(0, 0, W, H);
  const rows = [14, 14, 13, 12, 8];
  const rowH = H / rows.length;
  rows.forEach((count, row) => {
    const keyW = W / count;
    for (let k = 0; k < count; k++) {
      const wide = row === 4 && k === 3;
      const w = wide ? keyW * 3.2 : keyW;
      ctx.fillStyle = "#eef0f6";
      ctx.fillRect(k * keyW + 3, row * rowH + 3, Math.min(w, W - k * keyW) - 6, rowH - 6);
    }
  });
}

export function drawPhone(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#10243f");
  g.addColorStop(1, "#2a5d9a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"];
  const r = rng(11);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      ctx.fillStyle = colors[Math.floor(r() * colors.length)];
      ctx.fillRect(18 + col * 56, 50 + row * 70, 40, 40);
    }
  }
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(W / 2 - 24, H - 18, 48, 5);
}

export function drawFloor(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const r = rng(3);
  const palette = ["#a67c52", "#9c7249", "#b08657", "#946b45", "#a07850"];
  const cols = 8;
  const plankW = W / cols;
  ctx.fillStyle = "#4a3624";
  ctx.fillRect(0, 0, W, H);
  for (let c = 0; c < cols; c++) {
    let y = -r() * 300;
    while (y < H) {
      const len = 260 + r() * 220;
      ctx.fillStyle = palette[Math.floor(r() * palette.length)];
      ctx.fillRect(c * plankW + 2, y + 2, plankW - 4, len - 4);
      ctx.strokeStyle = "rgba(60,38,20,0.25)";
      ctx.lineWidth = 1.5;
      for (let g = 0; g < 5; g++) {
        const gx = c * plankW + 10 + r() * (plankW - 20);
        ctx.beginPath();
        ctx.moveTo(gx, y + 6);
        ctx.lineTo(gx + (r() - 0.5) * 8, y + len - 6);
        ctx.stroke();
      }
      y += len;
    }
  }
}

export function drawArt(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  seed: number,
  palette: [string, string, string],
) {
  const r = rng(seed);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, palette[0]);
  g.addColorStop(1, palette[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = palette[2];
  ctx.beginPath();
  ctx.arc(W * (0.3 + r() * 0.4), H * (0.35 + r() * 0.2), W * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(0, H * 0.7, W, H * 0.3);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(W * (0.3 + r() * 0.3), H * 0.62);
  ctx.lineTo(W * 0.75, H);
  ctx.fill();
}

function hills(ctx: CanvasRenderingContext2D, W: number, H: number, baseY: number, amp: number, color: string, seed: number) {
  const r = rng(seed);
  const p1 = r() * 6;
  const p2 = r() * 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 8) {
    ctx.lineTo(x, baseY + Math.sin(x / 90 + p1) * amp + Math.sin(x / 37 + p2) * amp * 0.4);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
}

/** Golden-hour sky for the window in light mode. */
export function drawSunsetSky(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.75);
  sky.addColorStop(0, "#2b2a5e");
  sky.addColorStop(0.35, "#7b3f7a");
  sky.addColorStop(0.65, "#e0575a");
  sky.addColorStop(0.85, "#ff9a3c");
  sky.addColorStop(1, "#ffd27a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const sx = W * 0.62;
  const sy = H * 0.7;
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.55);
  glow.addColorStop(0, "rgba(255,230,160,0.95)");
  glow.addColorStop(0.15, "rgba(255,170,80,0.6)");
  glow.addColorStop(1, "rgba(255,120,60,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff3c4";
  ctx.beginPath();
  ctx.arc(sx, sy, W * 0.07, 0, Math.PI * 2);
  ctx.fill();

  const r = rng(21);
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = `rgba(255,${150 + Math.floor(r() * 60)},${120 + Math.floor(r() * 60)},0.35)`;
    ctx.beginPath();
    ctx.ellipse(r() * W, H * (0.2 + r() * 0.35), 70 + r() * 90, 8 + r() * 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  hills(ctx, W, H, H * 0.74, 10, "#5a2d52", 4);
  hills(ctx, W, H, H * 0.82, 14, "#2d1636", 8);
}

/** Starry night with a moon for the window in dark mode. */
export function drawNightSky(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.8);
  sky.addColorStop(0, "#04061a");
  sky.addColorStop(1, "#14204a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const r = rng(5);
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.35 + r() * 0.65})`;
    ctx.beginPath();
    ctx.arc(r() * W, r() * H * 0.72, 0.6 + r() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const mx = W * 0.68;
  const my = H * 0.28;
  const glow = ctx.createRadialGradient(mx, my, 0, mx, my, W * 0.3);
  glow.addColorStop(0, "rgba(190,210,255,0.55)");
  glow.addColorStop(1, "rgba(190,210,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#f3efe0";
  ctx.beginPath();
  ctx.arc(mx, my, W * 0.075, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(180,175,160,0.45)";
  [
    [-0.02, -0.015, 0.014],
    [0.02, 0.01, 0.018],
    [-0.01, 0.03, 0.01],
  ].forEach(([dx, dy, rad]) => {
    ctx.beginPath();
    ctx.arc(mx + dx * W, my + dy * W, rad * W, 0, Math.PI * 2);
    ctx.fill();
  });

  hills(ctx, W, H, H * 0.8, 10, "#0a1030", 4);
  hills(ctx, W, H, H * 0.88, 12, "#060a1e", 8);
  const lights = rng(17);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = "rgba(255,210,120,0.9)";
    ctx.fillRect(lights() * W, H * (0.86 + lights() * 0.1), 3, 3);
  }
}