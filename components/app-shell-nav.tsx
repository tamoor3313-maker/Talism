"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, MessageCircle, User, Sparkles, LogOut } from "lucide-react";
import { ThreadMark } from "@/components/thread-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import clsx from "clsx";

const items = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/matchmaker", label: "AI Matchmaker", icon: Sparkles },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShellNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-ink-line/60 bg-paper-raised p-5 md:flex dark:bg-ink-raised/40">
        <Link href="/" className="mb-10 flex items-center gap-2.5 px-1">
          <ThreadMark className="h-6 w-6 text-garnet dark:text-brass" />
          <span className="font-display text-lg">TALISM</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass"
                    : "text-text-muted hover:bg-paper hover:text-text-strong dark:text-text-on-ink-muted dark:hover:bg-ink"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-garnet dark:bg-brass" />
            <span className="text-sm">Jordan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-line text-text-muted transition-colors hover:border-garnet hover:text-garnet dark:text-text-on-ink-muted dark:hover:border-brass dark:hover:text-brass"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-ink-line/60 bg-paper-raised/95 backdrop-blur md:hidden dark:bg-ink-raised/95">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px]",
                active ? "text-garnet dark:text-brass" : "text-text-muted dark:text-text-on-ink-muted"
              )}
            >
              <Icon size={20} />
              {item.label === "AI Matchmaker" ? "Matchmaker" : item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
