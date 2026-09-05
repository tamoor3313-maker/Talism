"use client";

import { useState } from "react";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

type CoachResult = {
  reading: string;
  replies: {
    friendly: string;
    funny: string;
    confident: string;
    romantic: string;
    shortAndCasual: string;
  };
};

const replyLabels: Record<keyof CoachResult["replies"], string> = {
  friendly: "Friendly",
  funny: "Funny",
  confident: "Confident",
  romantic: "Romantic",
  shortAndCasual: "Short & casual",
};

export default function ConversationCoachPage() {
  const [conversationText, setConversationText] = useState("");
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!conversationText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/coach/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationText }),
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
        title="Conversation Coach"
        subtitle="Paste a conversation and get a read on it, plus reply options in different tones."
      />

      <div className="mt-6 space-y-4">
        <textarea
          value={conversationText}
          onChange={(e) => setConversationText(e.target.value)}
          rows={7}
          placeholder={`Paste the conversation, e.g.:\nThem: hey how was your weekend\nMe: pretty good, went hiking. you?\nThem: nice! same, just relaxed mostly`}
          className="w-full resize-none rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
        />
        <Button onClick={analyze} disabled={loading || !conversationText.trim()} className="w-full">
          {loading ? "Reading..." : "Analyze conversation"}
        </Button>
        {error && <p className="text-sm text-garnet dark:text-brass-soft">{error}</p>}

        {result && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-4 text-sm leading-relaxed dark:bg-ink-raised">
              {result.reading}
            </div>

            <div className="space-y-3">
              {(Object.keys(result.replies) as (keyof CoachResult["replies"])[]).map((key) => (
                <div key={key}>
                  <p className="text-xs font-medium text-garnet dark:text-brass">
                    {replyLabels[key]}
                  </p>
                  <p className="mt-1 rounded-2xl bg-paper-raised px-4 py-3 text-sm leading-relaxed dark:bg-ink-raised">
                    {result.replies[key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
