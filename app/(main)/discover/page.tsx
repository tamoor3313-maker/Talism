"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { candidates } from "@/lib/sample-data";
import { MatchCard } from "@/components/match-card";
import clsx from "clsx";

const sortOptions = ["Best match", "Newest", "Nearby"];

export default function DiscoverPage() {
  const [sort, setSort] = useState("Best match");
  const [minCompat, setMinCompat] = useState(0);

  const filtered = candidates
    .filter((c) => c.overall >= minCompat)
    .sort((a, b) => (sort === "Best match" ? b.overall - a.overall : 0));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl tracking-tight">Discover</h1>
      <p className="mt-1.5 text-text-muted dark:text-text-on-ink-muted">
        Curated by your matchmaker, not an endless feed.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm text-text-muted dark:text-text-on-ink-muted">
          <SlidersHorizontal size={14} />
          Sort
        </div>
        {sortOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSort(opt)}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              sort === opt
                ? "border-garnet bg-garnet/10 text-garnet dark:border-brass dark:bg-brass/10 dark:text-brass"
                : "border-ink-line/60 text-text-muted dark:text-text-on-ink-muted"
            )}
          >
            {opt}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 text-xs text-text-muted dark:text-text-on-ink-muted">
          Min. compatibility
          <input
            type="range"
            min={0}
            max={95}
            step={5}
            value={minCompat}
            onChange={(e) => setMinCompat(Number(e.target.value))}
            className="accent-garnet dark:accent-brass"
          />
          {minCompat}%
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <MatchCard key={c.id} candidate={c} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-text-muted dark:text-text-on-ink-muted">
            No one meets that bar yet — try lowering the compatibility filter.
          </p>
        )}
      </div>
    </div>
  );
}
