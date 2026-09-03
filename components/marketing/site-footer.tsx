import Link from "next/link";
import { ThreadMark } from "@/components/thread-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line/60 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <ThreadMark className="h-5 w-5 text-garnet dark:text-brass" />
          <span className="font-display text-base">TALISM</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted dark:text-text-on-ink-muted">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/safety">Safety center</Link>
          <a href="mailto:hello@talism.ai">Contact</a>
        </nav>
        <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
          © {new Date().getFullYear()} TALISM. Compatibility scores are AI-generated estimates, not guarantees.
        </p>
      </div>
    </footer>
  );
}
