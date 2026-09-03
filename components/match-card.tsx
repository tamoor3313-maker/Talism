import Link from "next/link";
import type { Candidate } from "@/lib/sample-data";

export function MatchCard({ candidate }: { candidate: Candidate }) {
  return (
    <Link
      href={`/match/${candidate.id}`}
      className="block overflow-hidden rounded-2xl border border-ink-line/60 bg-paper-raised transition-shadow hover:shadow-md dark:bg-ink-raised"
    >
      <div
        className="flex h-40 items-end p-4"
        style={{
          background: `linear-gradient(160deg, ${candidate.photoTone}, ${candidate.photoTone}CC)`,
        }}
      >
        <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {candidate.overall}% compatible
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-medium">
          {candidate.name}, {candidate.age}
        </h3>
        <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
          {candidate.location}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
          {candidate.headline}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {candidate.interests.slice(0, 3).map((i) => (
            <span
              key={i}
              className="rounded-full bg-paper px-2.5 py-1 text-[11px] text-text-muted dark:bg-ink dark:text-text-on-ink-muted"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
