"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

const examples = [
  "What should I text her first?",
  "How do I ask someone on a date?",
  "What should I say after the first date?",
  "How do I apologize for canceling?",
  "How do I tell someone I like them?",
];

export default function WhatToSayPage() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(q?: string) {
    const finalQuestion = q ?? question;
    if (!finalQuestion.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach/what-to-say", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: finalQuestion, context }),
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
        title="What Should I Say?"
        subtitle="Ask anything situational — texting, asking someone out, apologizing, whatever it is."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setQuestion(ex);
              ask(ex);
            }}
            className="rounded-full border border-ink-line/60 px-3.5 py-1.5 text-xs text-text-muted hover:border-garnet hover:text-text-strong dark:text-text-on-ink-muted dark:hover:border-brass dark:hover:text-text-on-ink"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
            Your question
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What should I text her?"
            className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
        </div>
        <div>
          <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
            Any relevant context (optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder="e.g. We matched 3 days ago, talked a bit, then she went quiet..."
            className="mt-1.5 w-full resize-none rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
        </div>

        <Button onClick={() => ask()} disabled={loading || !question.trim()} className="w-full">
          {loading ? "Thinking..." : "Get advice"}
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
