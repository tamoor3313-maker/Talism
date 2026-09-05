"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

const dateTypes = ["Coffee date", "Dinner date", "First date", "Casual date", "Formal event", "Outdoor date"];

export default function StyleAdvisorPage() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [dateType, setDateType] = useState(dateTypes[0]);
  const [personalStyle, setPersonalStyle] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getAdvice() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, age, bodyType, location, weather, dateType, personalStyle }),
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
        title="What Should I Wear?"
        subtitle="A few details and you'll get an outfit recommendation built for confidence, not just looks."
      />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Gender"
          className="rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <input
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value)}
          placeholder="Body type (optional)"
          className="col-span-2 rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Date location"
          className="rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <input
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          placeholder="Weather"
          className="rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <select
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
          className="col-span-2 rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        >
          {dateTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          value={personalStyle}
          onChange={(e) => setPersonalStyle(e.target.value)}
          placeholder="Your personal style (e.g. minimalist, streetwear, classic)"
          className="col-span-2 rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
      </div>

      <Button onClick={getAdvice} disabled={loading} className="mt-4 w-full">
        {loading ? "Styling..." : "Get outfit advice"}
      </Button>
      {error && <p className="mt-3 text-sm text-garnet dark:text-brass-soft">{error}</p>}

      {result && (
        <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-ink-line/60 bg-paper-raised p-5 text-sm leading-relaxed dark:bg-ink-raised">
          {result}
        </div>
      )}
    </div>
  );
}
