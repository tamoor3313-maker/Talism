"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThreadMark } from "@/components/thread-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { LinkButton } from "@/components/ui/button";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#compatibility", label: "Compatibility" },
  { href: "#safety", label: "Safety" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/60 bg-paper/85 backdrop-blur dark:bg-ink/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <ThreadMark className="h-6 w-6 text-garnet" />
          <span className="font-display text-lg tracking-tight text-text-strong dark:text-text-on-ink">
            TALISM
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-muted transition-colors hover:text-text-strong dark:text-text-on-ink-muted dark:hover:text-text-on-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LinkButton href="/login" variant="ghost" size="sm">
            Log in
          </LinkButton>
          <LinkButton href="/signup" variant="primary" size="sm">
            Get started
          </LinkButton>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center text-text-strong md:hidden dark:text-text-on-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-line/60 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-text-muted dark:text-text-on-ink-muted"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <LinkButton href="/login" variant="secondary" size="sm" className="flex-1">
                Log in
              </LinkButton>
              <LinkButton href="/signup" variant="primary" size="sm" className="flex-1">
                Get started
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
