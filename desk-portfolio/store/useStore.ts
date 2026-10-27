import { create } from "zustand";

export type ViewId = "home" | "projects" | "about" | "stack" | "contact";
export type Theme = "dark" | "light";

interface PortfolioState {
  view: ViewId;
  theme: Theme;
  muted: boolean;
  menuOpen: boolean;
  lampOn: boolean;
  chairKicks: number;
  hintSeen: boolean;
  /** The info is always shown on the 3D monitor (the bottom card is no longer used). */
  monitorMode: boolean;
  /** true on portrait phones and tall screens: the monitor desktop uses a smaller layout. */
  compact: boolean;
  setView: (view: ViewId) => void;
  goHome: () => void;
  toggleTheme: () => void;
  toggleMuted: () => void;
  toggleLamp: () => void;
  kickChair: () => void;
  setMenuOpen: (open: boolean) => void;
  setMonitorMode: (on: boolean) => void;
  setCompact: (on: boolean) => void;
}

export const useStore = create<PortfolioState>((set) => ({
  view: "home",
  theme: "dark",
  muted: true,
  menuOpen: false,
  lampOn: true,
  chairKicks: 0,
  hintSeen: false,
  monitorMode: true,
  compact: false,
  setView: (view) => set({ view, menuOpen: false, hintSeen: true }),
  goHome: () => set({ view: "home", menuOpen: false }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
  toggleLamp: () => set((s) => ({ lampOn: !s.lampOn })),
  kickChair: () => set((s) => ({ chairKicks: s.chairKicks + 1 })),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setMonitorMode: (monitorMode) => set({ monitorMode }),
  setCompact: (compact) => set({ compact }),
}));