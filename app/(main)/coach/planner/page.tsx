"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

export default function DatePlannerPage() {
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [setting, setSetting] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function plan() {
    if (!location.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, location, interests, timeOfDay, setting }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setResult(data.reply);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <CoachHeader
        title="Date Planner"
        subtitle="A few constraints and you'll get date ideas plus prep tips."
      />

      <div className="mt-6 space-y-4">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City / neighborhood"
          className="w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
          <input
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            placeholder="Time of day"
            className="rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
        </div>
        <input
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Shared interests (e.g. food, art, hiking)"
          className="w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <input
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          placeholder="Indoor, outdoor, or no preference"
          className="w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />

        <Button onClick={plan} disabled={loading || !location.trim()} className="w-full">
          {loading ? "Planning..." : "Plan the date"}
        </Button>
        {error && <p className="text-sm text-garnet dark:text-brass-soft">{error}</p>}

        {result && (
          <div className="whitespace-pre-wrap rounded-2xl border border-ink-line/60 bg-paper-raised p-5 text-sm leading-relaxed dark:bg-ink-raised">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
