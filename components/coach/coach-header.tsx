import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CoachHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <Link
        href="/home"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted dark:text-text-on-ink-muted"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>
      <h1 className="mt-4 font-display text-3xl tracking-tight">{title}</h1>
      <p className="mt-1.5 text-text-muted dark:text-text-on-ink-muted">{subtitle}</p>
    </div>
  );
}
