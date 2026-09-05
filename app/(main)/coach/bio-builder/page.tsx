"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

const tones = ["Funny", "Confident", "Romantic", "Professional", "Flirty but respectful", "Adventurous"];
const bioTypes = ["Short bio", "Funny bio", "Serious relationship bio", "Casual dating bio", "Profile headline"];

export default function BioBuilderPage() {
  const [aboutMe, setAboutMe] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [bioType, setBioType] = useState(bioTypes[0]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!aboutMe.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutMe, tone, bioType }),
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
        title="Bio Builder"
        subtitle="Tell your matchmaker about yourself, pick a tone, and get a few bios to choose from."
      />

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
            Tell us about yourself — interests, hobbies, personality, what you're looking for
          </label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={5}
            placeholder="e.g. 29, software engineer, into trail running and terrible board game nights, looking for something long-term..."
            className="mt-1.5 w-full resize-none rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-muted dark:text-text-on-ink-muted">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
            >
              {tones.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted dark:text-text-on-ink-muted">Bio type</label>
            <select
              value={bioType}
              onChange={(e) => setBioType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
            >
              {bioTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={generate} disabled={loading || !aboutMe.trim()} className="w-full">
          {loading ? "Writing..." : "Generate bios"}
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
