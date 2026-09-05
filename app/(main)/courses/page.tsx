"use client";

import { useState } from "react";
import Link from "next/link";
import { courses } from "@/lib/sample-data";
import { LinkButton } from "@/components/ui/button";

const topics = ["All", ...Array.from(new Set(courses.map((c) => c.topic)))];

export default function CoursesPage() {
  const [topic, setTopic] = useState("All");
  const filtered = topic === "All" ? courses : courses.filter((c) => c.topic === topic);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Courses</h1>
          <p className="mt-1.5 text-text-muted dark:text-text-on-ink-muted">
            Real coaches, real courses — on confidence, communication, and everything in between.
          </p>
        </div>
        <LinkButton href="/coach/apply" variant="secondary" size="sm">
          Become a coach
        </LinkButton>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
              topic === t
                ? "border-garnet bg-garnet/10 text-garnet dark:border-brass dark:bg-brass/10 dark:text-brass"
                : "border-ink-line/60 text-text-muted dark:text-text-on-ink-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.id}`}
            className="block overflow-hidden rounded-2xl border border-ink-line/60 bg-paper-raised transition-shadow hover:shadow-md dark:bg-ink-raised"
          >
            <div
              className="flex h-32 items-end p-4"
              style={{ background: `linear-gradient(160deg, ${c.thumbnailTone}, ${c.thumbnailTone}CC)` }}
            >
              <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                {c.topic}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium">{c.title}</h3>
              <p className="mt-1 text-xs text-text-muted dark:text-text-on-ink-muted">
                {c.coachName} · {c.lessonCount} lessons
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
                {c.description}
              </p>
              <p className="mt-3 font-display text-lg">${(c.priceCents / 100).toFixed(0)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
