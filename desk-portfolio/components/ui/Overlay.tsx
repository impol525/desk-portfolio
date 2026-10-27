"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/data/views";
import { playSfx } from "@/lib/sound";
import { useStore, type ViewId } from "@/store/useStore";
import { BackIcon, CloseIcon, MenuIcon, MoonIcon, SoundOffIcon, SoundOnIcon, SunIcon } from "./Icons";
import { Panel } from "./Panel";

const roundBtn =
  "glass pointer-events-auto flex size-11 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const ORDER: ViewId[] = ["home", "projects", "about", "stack", "contact"];

export function Overlay() {
  const { view, theme, muted, menuOpen, hintSeen } = useStore();
  const { setView, goHome, toggleTheme, toggleMuted, setMenuOpen } = useStore.getState();

  // Keyboard: 1-4 open a view, Esc or 0 go back, arrows cycle, M sound, T theme, L lamp
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // do not steal keys while someone is typing (for example in the monitor terminal)
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (typing && e.key !== "Escape") return;

      const s = useStore.getState();
      const open = (id: ViewId) => {
        playSfx("click");
        if (id === "home") s.goHome();
        else s.setView(id);
      };

      switch (e.key) {
        case "Escape":
        case "0":
          if (s.view !== "home") playSfx("back");
          s.goHome();
          break;
        case "1":
          open("projects");
          break;
        case "2":
          open("about");
          break;
        case "3":
          open("stack");
          break;
        case "4":
          open("contact");
          break;
        case "ArrowRight":
        case "ArrowLeft": {
          const step = e.key === "ArrowRight" ? 1 : ORDER.length - 1;
          open(ORDER[(ORDER.indexOf(s.view) + step) % ORDER.length]);
          break;
        }
        case "m":
        case "M":
          s.toggleMuted();
          playSfx("toggle");
          break;
        case "t":
        case "T":
          s.toggleTheme();
          playSfx("toggle");
          break;
        case "l":
        case "L":
          s.toggleLamp();
          playSfx("toggle");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-[var(--fg)]">
      {/* top-left: menu + back */}
      <div className="absolute left-5 top-5 flex items-start gap-3">
        <div className="relative">
          <button
            type="button"
            className={roundBtn}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              playSfx("click");
              setMenuOpen(!menuOpen);
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="glass pointer-events-auto absolute left-0 top-14 w-48 rounded-2xl p-2"
              >
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      if (item.id === "home") goHome();
                      else setView(item.id);
                    }}
                    aria-current={view === item.id ? "page" : undefined}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[var(--chip)] aria-[current=page]:bg-[var(--chip)] aria-[current=page]:font-semibold"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {view !== "home" && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => {
                playSfx("back");
                goHome();
              }}
              className="glass pointer-events-auto flex h-11 items-center gap-1.5 rounded-full pl-3 pr-4 text-sm font-medium transition hover:scale-105"
            >
              <BackIcon />
              Back
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <Panel />

      {/* first-visit hint */}
      <div className="absolute inset-x-0 bottom-20 flex justify-center px-6 sm:bottom-6 sm:px-24">
        <AnimatePresence>
          {view === "home" && !hintSeen && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.2 } }}
              exit={{ opacity: 0 }}
              className="glass rounded-full px-4 py-2 text-center text-xs sm:text-sm"
            >
              <span className="[@media(hover:none)]:hidden">
                Click the monitor to open the portfolio. The lamp, window and chair react too.
              </span>
              <span className="hidden [@media(hover:none)]:inline">
                Tap the monitor to open the portfolio. The lamp, window and chair react too.
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* bottom-right: sound + theme */}
      <div className="absolute bottom-5 right-5 flex gap-3">
        <button
          type="button"
          className={roundBtn}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          aria-pressed={!muted}
          onClick={() => {
            toggleMuted();
            playSfx("toggle");
          }}
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
        <button
          type="button"
          className={roundBtn}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => {
            toggleTheme();
            playSfx("toggle");
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
}