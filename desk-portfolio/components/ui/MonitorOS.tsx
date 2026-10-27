"use client";

import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { portfolio, type Project } from "@/data/portfolio";
import { playSfx } from "@/lib/sound";
import { useStore, type ViewId } from "@/store/useStore";

type AppId = Exclude<ViewId, "home"> | "terminal";

/** true on portrait phones: smaller paddings, single columns, icon-only dock. */
const CompactCtx = createContext(false);

const APPS: { id: AppId; label: string; file: string; gradient: string; glyph: string }[] = [
  { id: "projects", label: "Projects", file: "projects.tsx", gradient: "linear-gradient(135deg,#38bdf8,#2563eb)", glyph: "P" },
  { id: "about", label: "About", file: "about.md", gradient: "linear-gradient(135deg,#e879f9,#db2777)", glyph: "A" },
  { id: "stack", label: "Skills", file: "skills.json", gradient: "linear-gradient(135deg,#34d399,#0d9488)", glyph: "S" },
  { id: "contact", label: "Contact", file: "contact.ts", gradient: "linear-gradient(135deg,#fcd34d,#f97316)", glyph: "C" },
  { id: "terminal", label: "Terminal", file: "terminal", gradient: "linear-gradient(135deg,#64748b,#1e293b)", glyph: ">_" },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter((w) => !w.endsWith("."))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

/* ---------------- boot screen ---------------- */

function BootScreen() {
  const compact = useContext(CompactCtx);

  return (
    <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-black text-slate-200 ${compact ? "gap-2" : "gap-5"}`}>
      <div
        className={`flex items-center justify-center rounded-2xl font-bold text-white ${compact ? "size-10 text-base" : "size-16 text-2xl"}`}
        style={{ background: "linear-gradient(135deg,#38bdf8,#2563eb)" }}
      >
        {initialsOf(portfolio.name)}
      </div>
      <p className={`font-semibold tracking-wide ${compact ? "text-[12px]" : "text-[15px]"}`}>{portfolio.name}</p>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
        <div className="os-bar h-full rounded-full bg-sky-400" />
      </div>
      <div className={`space-y-1 text-center font-mono text-[11px] text-slate-400 ${compact ? "h-10" : "h-14"}`}>
        <p className="os-line" style={{ animationDelay: "0.1s" }}>
          Loading projects...
        </p>
        <p className="os-line" style={{ animationDelay: "0.6s" }}>
          Loading skills...
        </p>
        <p className="os-line" style={{ animationDelay: "1.1s" }}>
          Ready.
        </p>
      </div>
    </div>
  );
}

/* ---------------- projects ---------------- */

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const compact = useContext(CompactCtx);
  const images = project.images ?? [];
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const current = images[index];

  const go = (step: number) => {
    playSfx("click");
    setIndex((i) => (i + step + images.length) % images.length);
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      <button
        type="button"
        onClick={() => {
          playSfx("back");
          onBack();
        }}
        className="cursor-pointer text-[13px] text-sky-300 hover:underline"
      >
        {"\u2039"} All projects
      </button>

      <div className={compact ? "flex flex-col gap-3" : "flex gap-5"}>
        <div className={compact ? "w-full" : "w-[54%] shrink-0"}>
          <div
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-black/40 ${
              compact ? "aspect-[2/1]" : "aspect-video"
            }`}
          >
            {current && !broken[current] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current}
                alt={`${project.title} screenshot ${index + 1}`}
                onError={() => setBroken((b) => ({ ...b, [current]: true }))}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-slate-600" />
                  <span className="size-2 rounded-full bg-slate-600" />
                  <span className="size-2 rounded-full bg-slate-600" />
                </div>
                <p className="text-[12px]">Screenshots coming soon</p>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  {"\u2039"}
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  {"\u203A"}
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-2 flex justify-center gap-1.5">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Screenshot ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`size-2 cursor-pointer rounded-full ${i === index ? "bg-sky-400" : "bg-white/25"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
          <p className="text-[13px] leading-relaxed text-slate-300">{project.description}</p>
          {project.details && project.details.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-[13px] text-slate-300">
              {project.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-[11px] text-sky-200">
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-900 hover:bg-slate-200"
              >
                Live site
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] text-slate-100 hover:bg-white/10"
              >
                Source code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsApp() {
  const compact = useContext(CompactCtx);
  const [selected, setSelected] = useState<number | null>(null);
  const project = selected === null ? null : portfolio.projects[selected];

  if (project) return <ProjectDetail project={project} onBack={() => setSelected(null)} />;

  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
      {portfolio.projects.map((p, i) => (
        <button
          key={p.title}
          type="button"
          onClick={() => {
            playSfx("click");
            setSelected(i);
          }}
          className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-sky-400/50 hover:bg-white/10"
        >
          <h3 className="text-[15px] font-semibold text-white">{p.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{p.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-[11px] text-sky-200">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-sky-300">View details {"\u203A"}</p>
        </button>
      ))}
    </div>
  );
}

/* ---------------- about, skills, contact ---------------- */

function AboutApp() {
  const compact = useContext(CompactCtx);
  const [failed, setFailed] = useState(false);
  const photo = compact ? "size-16" : "size-28";

  return (
    <div className={`flex ${compact ? "gap-3" : "gap-5"}`}>
      {failed ? (
        <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl font-semibold text-white ${photo}`}>
          {initialsOf(portfolio.name)}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/profile.jpg"
          alt={portfolio.name}
          width={112}
          height={112}
          onError={() => setFailed(true)}
          className={`shrink-0 rounded-2xl object-cover ${photo}`}
        />
      )}
      <div className="space-y-2 text-[13px] leading-relaxed text-slate-300">
        <div>
          <p className="text-lg font-semibold text-white">{portfolio.name}</p>
          <p className="text-sky-300">{portfolio.role}</p>
          <p className="text-slate-400">{portfolio.school}</p>
        </div>
        {portfolio.about.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
    </div>
  );
}

function StackApp() {
  return (
    <div className="space-y-4">
      {portfolio.stack.map((g) => (
        <section key={g.group}>
          <h3 className="mb-2 text-[13px] font-semibold text-emerald-300">{g.group}</h3>
          <div className="flex flex-wrap gap-2">
            {g.items.map((i) => (
              <span key={i} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-slate-100">
                {i}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ContactApp() {
  const [copied, setCopied] = useState<string | null>(null);
  const c = portfolio.contact;

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      playSfx("toggle");
      setCopied(key);
      window.setTimeout(() => setCopied((cur) => (cur === key ? null : cur)), 1600);
    } catch {
      // clipboard blocked: the link still works
    }
  }

  const rows: { key: string; label: string; value: string; href: string; copyable: boolean }[] = [
    { key: "email", label: "Email", value: c.email, href: `mailto:${c.email}`, copyable: true },
  ];
  if (c.phone) {
    rows.push({ key: "phone", label: "Phone", value: c.phone, href: `tel:${c.phoneIntl ?? c.phone}`, copyable: true });
  }
  rows.push({ key: "location", label: "Location", value: c.location, href: c.mapsUrl, copyable: false });

  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-400">{r.label}</p>
            <a
              href={r.href}
              target={r.key === "location" ? "_blank" : undefined}
              rel="noreferrer"
              className="block truncate text-[14px] font-medium text-white hover:underline"
            >
              {r.value}
            </a>
          </div>
          {r.copyable && (
            <button
              type="button"
              onClick={() => copy(r.key, r.value)}
              className="shrink-0 cursor-pointer rounded-full border border-white/20 px-3 py-1 text-[12px] text-slate-200 transition hover:bg-white/10"
            >
              {copied === r.key ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      ))}
      <a
        href={`mailto:${c.email}`}
        className="block rounded-xl bg-white px-4 py-2.5 text-center text-[14px] font-semibold text-slate-900 transition hover:bg-slate-200"
      >
        Send an email
      </a>
      {c.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {c.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-1.5 text-[13px] text-slate-100 transition hover:bg-white/10"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- terminal ---------------- */

interface TermLine {
  id: number;
  kind: "in" | "out";
  text: string;
}

const OPEN_TARGETS: Record<string, AppId> = {
  projects: "projects",
  about: "about",
  skills: "stack",
  stack: "stack",
  contact: "contact",
  terminal: "terminal",
};

function TerminalApp({ goApp }: { goApp: (id: AppId) => void }) {
  const nextId = useRef(1);
  const [lines, setLines] = useState<TermLine[]>([
    {
      id: 0,
      kind: "out",
      text: `Welcome to ${portfolio.name}'s portfolio terminal.\nType help to see what you can do.`,
    },
  ]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function run(raw: string): string | null {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    const store = useStore.getState();
    const c = portfolio.contact;

    switch (cmd.toLowerCase()) {
      case "":
        return null;
      case "help":
        return [
          "Commands:",
          "  about        who I am",
          "  projects     list my projects",
          "  skills       my tech stack",
          "  contact      how to reach me",
          "  open <app>   projects | about | skills | contact",
          "  theme        switch day and night",
          "  lamp         toggle the desk lamp",
          "  whoami       short intro",
          "  ls           list files",
          "  clear        clear the screen",
          "  exit         back to the desk",
        ].join("\n");
      case "whoami":
        return `${portfolio.name}\n${portfolio.role}, ${portfolio.school}`;
      case "about":
        return portfolio.about.join("\n\n");
      case "projects":
        return portfolio.projects.map((p, i) => `${i + 1}. ${p.title}\n   ${p.description}`).join("\n");
      case "skills":
      case "stack":
        return portfolio.stack.map((g) => `${g.group}: ${g.items.join(", ")}`).join("\n");
      case "contact":
        return [`Email:    ${c.email}`, c.phone ? `Phone:    ${c.phone}` : null, `Location: ${c.location}`]
          .filter(Boolean)
          .join("\n");
      case "open": {
        const target = OPEN_TARGETS[arg] as AppId | undefined;
        if (!target) return "Usage: open projects | about | skills | contact";
        goApp(target);
        return `Opening ${arg}...`;
      }
      case "theme":
        store.toggleTheme();
        return useStore.getState().theme === "dark" ? "Night mode." : "Sunset mode.";
      case "lamp":
        store.toggleLamp();
        return useStore.getState().lampOn ? "Lamp on." : "Lamp off.";
      case "ls":
        return "projects/   about.md   skills.json   contact.ts";
      case "date":
        return new Date().toString();
      case "sudo":
        return "Nice try.";
      case "exit":
        store.goHome();
        return "Bye.";
      default:
        return `command not found: ${cmd}. Type help.`;
    }
  }

  function submit() {
    const text = input;
    setInput("");
    if (text.trim()) history.current.push(text);
    cursor.current = history.current.length;

    if (text.trim().toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    const out = run(text);
    const added: TermLine[] = [{ id: nextId.current++, kind: "in", text }];
    if (out) added.push({ id: nextId.current++, kind: "out", text: out });
    setLines((prev) => [...prev, ...added]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setInput(history.current[cursor.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      cursor.current = Math.min(history.current.length, cursor.current + 1);
      setInput(history.current[cursor.current] ?? "");
    }
  }

  return (
    <div
      ref={scroller}
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      className="h-full cursor-text overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed [scrollbar-width:thin]"
    >
      {lines.map((l) =>
        l.kind === "in" ? (
          <p key={l.id} className="text-slate-100">
            <span className="text-emerald-400">guest@portfolio</span>
            <span className="text-slate-500">:~$ </span>
            {l.text}
          </p>
        ) : (
          <p key={l.id} className="whitespace-pre-wrap text-slate-300">
            {l.text}
          </p>
        ),
      )}
      <div className="flex">
        <span className="text-emerald-400">guest@portfolio</span>
        <span className="text-slate-500">:~$&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-slate-100 caret-emerald-400 outline-none"
        />
      </div>
    </div>
  );
}

/* ---------------- the desktop ---------------- */

/**
 * A tiny desktop that lives on the 3D monitor.
 * 960 x 512 px normally, 440 x 235 px in compact mode (see MonitorScreen.tsx).
 */
export function MonitorOS({ open, compact = false }: { open: boolean; compact?: boolean }) {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const goHome = useStore((s) => s.goHome);

  const [app, setApp] = useState<AppId>("projects");
  const [phase, setPhase] = useState<"off" | "boot" | "ready">("off");

  // follow the store when something outside opens a view (the monitor click, keyboard shortcuts)
  useEffect(() => {
    if (view !== "home") setApp(view);
  }, [view]);

  // boot the first time the monitor opens
  useEffect(() => {
    if (!open || phase !== "off") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduced ? "ready" : "boot");
  }, [open, phase]);

  useEffect(() => {
    if (phase !== "boot") return;
    const id = window.setTimeout(() => setPhase("ready"), 2000);
    return () => window.clearTimeout(id);
  }, [phase]);

  const goApp = (id: AppId) => {
    setApp(id);
    if (id !== "terminal") setView(id);
  };

  const current = APPS.find((a) => a.id === app) ?? APPS[0];

  if (phase === "off") return <div className="h-full w-full bg-black" />;
  if (phase === "boot") {
    return (
      <CompactCtx.Provider value={compact}>
        <div className="relative h-full w-full bg-black">
          <BootScreen />
        </div>
      </CompactCtx.Provider>
    );
  }

  return (
    <CompactCtx.Provider value={compact}>
      <div
        className="os-fade-in flex h-full w-full flex-col overflow-hidden text-slate-100"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#0b1020 100%)" }}
      >
        {/* menu bar */}
        <div
          className={`flex shrink-0 items-center justify-between bg-black/40 text-slate-300 ${
            compact ? "h-6 px-3 text-[10px]" : "h-8 px-4 text-[12px]"
          }`}
        >
          <span className="font-semibold text-white">{portfolio.name}</span>
          <Clock />
        </div>

        {/* window */}
        <div className={`min-h-0 flex-1 ${compact ? "px-3 pt-2" : "px-5 pt-4"}`}>
          <div className="flex h-full flex-col overflow-hidden rounded-t-xl border border-white/10 bg-[#0e1320]/95">
            <div
              className={`flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#161c2e] px-3 ${
                compact ? "h-6" : "h-9"
              }`}
            >
              <button
                type="button"
                aria-label="Close and go back to the desk"
                onClick={() => {
                  playSfx("back");
                  goHome();
                }}
                className="size-3 cursor-pointer rounded-full bg-[#ff5f57]"
              />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[12px] text-slate-400">{current.file}</span>
            </div>
            <div
              className={`min-h-0 flex-1 ${
                app === "terminal"
                  ? "overflow-hidden bg-[#0a0e18]"
                  : `overflow-y-auto [scrollbar-width:thin] ${compact ? "p-3" : "p-5"}`
              }`}
            >
              {app === "projects" && <ProjectsApp />}
              {app === "about" && <AboutApp />}
              {app === "stack" && <StackApp />}
              {app === "contact" && <ContactApp />}
              {app === "terminal" && <TerminalApp goApp={goApp} />}
            </div>
          </div>
        </div>

        {/* dock */}
        <div
          className={`flex shrink-0 items-center justify-center bg-black/40 ${
            compact ? "h-[44px] gap-4" : "h-[68px] gap-4"
          }`}
        >
          {APPS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-label={a.label}
              onClick={() => {
                playSfx("click");
                goApp(a.id);
              }}
              className="group flex cursor-pointer flex-col items-center gap-1"
            >
              <span
                className={`flex items-center justify-center rounded-xl font-bold text-white shadow-lg transition group-hover:-translate-y-0.5 ${
                  compact ? "size-8 text-[12px]" : "size-9 text-[14px]"
                } ${a.id === app ? "ring-2 ring-white/80" : "opacity-80"}`}
                style={{ background: a.gradient }}
              >
                {a.glyph}
              </span>
              {!compact && (
                <span className={`text-[10px] ${a.id === app ? "text-white" : "text-slate-400"}`}>{a.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </CompactCtx.Provider>
  );
}