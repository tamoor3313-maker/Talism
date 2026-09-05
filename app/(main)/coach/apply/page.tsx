"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

export default function CoachApplyPage() {
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!headline.trim() || !bio.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coach-marketplace/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, bio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-8 text-center dark:bg-ink-raised">
          <h1 className="font-display text-2xl">Application submitted</h1>
          <p className="mt-2 text-sm text-text-muted dark:text-text-on-ink-muted">
            We'll review your application and get back to you. Once approved,
            you'll be able to create and sell courses from your coach dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <CoachHeader
        title="Become a coach"
        subtitle="Share your expertise and sell courses on TALISM. Every application is reviewed before you can publish."
      />

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
            Headline
          </label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Dating coach, 8 years, former matchmaker"
            className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
            Tell us about your experience and what you'd want to teach
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            className="mt-1.5 w-full resize-none rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
        </div>
        {error && <p className="text-sm text-garnet dark:text-brass-soft">{error}</p>}
        <Button onClick={submit} disabled={loading || !headline.trim() || !bio.trim()} className="w-full">
          {loading ? "Submitting..." : "Submit application"}
        </Button>
      </div>
    </div>
  );
}
