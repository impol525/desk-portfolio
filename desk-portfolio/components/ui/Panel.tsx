"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio, type Project } from "@/data/portfolio";
import { playSfx } from "@/lib/sound";
import { useStore, type ViewId } from "@/store/useStore";

type SheetView = Exclude<ViewId, "home">;

const TITLES: Record<SheetView, string> = {
  projects: "Projects",
  about: "About me",
  stack: "Tech stack",
  contact: "Contact",
};

const TABS: { id: SheetView; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "stack", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function Avatar() {
  const [failed, setFailed] = useState(false);
  const initials = portfolio.name
    .split(" ")
    .filter((w) => !w.endsWith("."))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  if (failed) {
    return (
      <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-[var(--chip)] text-2xl font-semibold">
        {initials}
      </div>
    );
  }
  return (
    <Image
      src="/profile.jpg"
      alt={portfolio.name}
      width={96}
      height={96}
      priority
      onError={() => setFailed(true)}
      className="size-24 shrink-0 rounded-2xl object-cover"
    />
  );
}

function AboutContent() {
  return (
    <div className="space-y-4 text-sm leading-relaxed">
      <div className="flex items-center gap-4">
        <Avatar />
        <div>
          <p className="text-base font-semibold">{portfolio.name}</p>
          <p className="text-[var(--muted)]">{portfolio.role}</p>
          <p className="text-[var(--muted)]">{portfolio.school}</p>
        </div>
      </div>
      {portfolio.about.map((para) => (
        <p key={para} className="text-[var(--muted)]">
          {para}
        </p>
      ))}
    </div>
  );
}

function ContactContent() {
  const [copied, setCopied] = useState<string | null>(null);
  const c = portfolio.contact;

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      playSfx("toggle");
      setCopied(key);
      window.setTimeout(() => setCopied((cur) => (cur === key ? null : cur)), 1600);
    } catch {
      // clipboard blocked: the link next to it still works
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
    <div className="space-y-3 text-sm">
      <p className="text-[var(--muted)]">The fastest way to reach me is email.</p>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-3 rounded-2xl bg-[var(--chip)] p-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--muted)]">{r.label}</p>
              <a
                href={r.href}
                target={r.key === "location" ? "_blank" : undefined}
                rel="noreferrer"
                className="block truncate font-medium underline-offset-4 hover:underline"
              >
                {r.value}
              </a>
            </div>
            {r.copyable && (
              <button
                type="button"
                onClick={() => copy(r.key, r.value)}
                className="shrink-0 rounded-full border border-[var(--glass-border)] px-3 py-1 text-xs transition hover:bg-[var(--chip)]"
                aria-live="polite"
              >
                {copied === r.key ? "Copied" : "Copy"}
              </button>
            )}
          </li>
        ))}
      </ul>

      <a
        href={`mailto:${c.email}`}
        className="block rounded-full bg-[var(--fg)] px-4 py-2.5 text-center font-medium text-[var(--bg)] transition hover:opacity-90"
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
              className="rounded-full border border-[var(--glass-border)] px-4 py-1.5 transition hover:bg-[var(--chip)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** Screenshot gallery: swipe or use the arrows and dots. */
function Gallery({ project }: { project: Project }) {
  const images = project.images ?? [];
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const touchX = useRef<number | null>(null);
  const current = images[index];

  const go = (step: number) => {
    if (images.length < 2) return;
    playSfx("click");
    setIndex((i) => (i + step + images.length) % images.length);
  };

  return (
    <div>
      <div
        className="relative aspect-video overflow-hidden rounded-2xl bg-[var(--chip)]"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
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
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--muted)]">
            Screenshots coming soon
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
            >
              {"\u2039"}
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white"
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
              className={`size-2 rounded-full ${i === index ? "bg-[var(--fg)]" : "bg-[var(--chip)]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Project list. Tapping a project opens its detail page with the gallery. */
function ProjectsContent() {
  const [selected, setSelected] = useState<number | null>(null);
  const project = selected === null ? null : portfolio.projects[selected];

  if (project) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            playSfx("back");
            setSelected(null);
          }}
          className="text-sm font-medium underline underline-offset-4"
        >
          {"\u2039"} All projects
        </button>

        <Gallery project={project} />

        <div className="space-y-3 text-sm">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="leading-relaxed text-[var(--muted)]">{project.description}</p>
          {project.details && project.details.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-[var(--muted)]">
              {project.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full border border-[var(--glass-border)] px-2.5 py-0.5 text-xs">
                {t}
              </span>
            ))}
          </div>
          {(project.href || project.repo) && (
            <div className="flex gap-2">
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-semibold text-[var(--bg)]"
                >
                  Live site
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[var(--glass-border)] px-4 py-2 text-xs"
                >
                  Source code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {portfolio.projects.map((p, i) => (
        <li key={p.title}>
          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setSelected(i);
            }}
            className="w-full rounded-2xl bg-[var(--chip)] p-4 text-left"
          >
            <h3 className="font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-[var(--glass-border)] px-2.5 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs font-medium">View details {"\u203A"}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Content({ view }: { view: SheetView }) {
  switch (view) {
    case "projects":
      return <ProjectsContent />;
    case "about":
      return <AboutContent />;
    case "stack":
      return (
        <div className="space-y-5">
          {portfolio.stack.map((g) => (
            <section key={g.group}>
              <h3 className="mb-2 text-sm font-semibold">{g.group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <span key={i} className="rounded-full bg-[var(--chip)] px-3 py-1 text-sm">
                    {i}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    case "contact":
      return <ContactContent />;
  }
}

/** Phones and tall screens: a bottom card with tabs. Wide screens use the 3D monitor instead. */
export function Panel() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const monitorMode = useStore((s) => s.monitorMode);

  if (monitorMode) return null;

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-20 md:inset-x-auto md:bottom-auto md:right-10 md:top-1/2 md:w-[26rem] md:-translate-y-1/2">
      <AnimatePresence>
        {view !== "home" && (
          <motion.aside
            key="sheet"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.5, duration: 0.45, ease: "easeOut" } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.18 } }}
            className="glass pointer-events-auto max-h-[46vh] overflow-y-auto rounded-3xl p-6 md:max-h-[60vh]"
          >
            <div className="mb-4 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-current={view === t.id ? "page" : undefined}
                  onClick={() => {
                    playSfx("click");
                    setView(t.id);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    view === t.id ? "bg-[var(--fg)] text-[var(--bg)]" : "bg-[var(--chip)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">{TITLES[view]}</h2>
            <Content view={view} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}