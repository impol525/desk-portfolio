"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { playSfx } from "@/lib/sound";
import { useStore, type ViewId } from "@/store/useStore";

const TITLES: Record<Exclude<ViewId, "home">, string> = {
  projects: "Projects",
  about: "About me",
  stack: "Tech stack",
  contact: "Contact",
};

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

function Content({ view }: { view: Exclude<ViewId, "home"> }) {
  switch (view) {
    case "projects":
      return (
        <ul className="space-y-3">
          {portfolio.projects.map((p) => (
            <li key={p.title} className="rounded-2xl bg-[var(--chip)] p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--glass-border)] px-2.5 py-0.5 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              {p.href && (
                <a href={p.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline underline-offset-4">
                  View project
                </a>
              )}
            </li>
          ))}
        </ul>
      );
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

export function Panel() {
  const view = useStore((s) => s.view);

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-20 md:inset-x-auto md:bottom-auto md:right-10 md:top-1/2 md:w-[26rem] md:-translate-y-1/2">
      <AnimatePresence mode="wait">
        {view !== "home" && (
          <motion.aside
            key={view}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.5, duration: 0.45, ease: "easeOut" } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.18 } }}
            className="glass pointer-events-auto max-h-[46vh] overflow-y-auto rounded-3xl p-6 md:max-h-[60vh]"
          >
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">{TITLES[view]}</h2>
            <Content view={view} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}