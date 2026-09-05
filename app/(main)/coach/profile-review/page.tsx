"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

type ReviewResult = {
  score: number;
  strengths: string[];
  improvements: string[];
  rewrite: string;
};

export default function ProfileReviewPage() {
  const [profileText, setProfileText] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!profileText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <CoachHeader
        title="Profile Review"
        subtitle="Paste your existing bio and get an honest score, strengths, and a rewrite."
      />

      <div className="mt-6 space-y-4">
        <textarea
          value={profileText}
          onChange={(e) => setProfileText(e.target.value)}
          rows={7}
          placeholder="Paste your current dating profile bio here..."
          className="w-full resize-none rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <Button onClick={analyze} disabled={loading || !profileText.trim()} className="w-full">
          {loading ? "Analyzing..." : "Review my profile"}
        </Button>
        {error && <p className="text-sm text-garnet dark:text-brass-soft">{error}</p>}

        {result && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised">
              <p className="font-display text-4xl">{result.score}</p>
              <p className="text-sm text-text-muted dark:text-text-on-ink-muted">/ 100</p>
            </div>

            <div>
              <h2 className="font-medium">Strengths</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-text-muted dark:text-text-on-ink-muted">
                {result.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-medium">Worth improving</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-text-muted dark:text-text-on-ink-muted">
                {result.improvements.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-medium">Suggested rewrite</h2>
              <p className="mt-2 rounded-2xl border border-ink-line/60 bg-paper-raised p-4 text-sm leading-relaxed dark:bg-ink-raised">
                {result.rewrite}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
