"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { ThreadMark } from "@/components/thread-mark";

type ChatMessage = { from: "ai" | "user"; text: string };

const initialMessages: ChatMessage[] = [
  {
    from: "ai",
    text: "Welcome back, Jordan. Last time we talked about what commitment looks like to you — want to keep going, or is there something specific on your mind?",
  },
];

const canned = [
  "That's a great question. When you picture a Sunday morning a few years from now, who's there and what does it look like?",
  "Got it — I'll factor that in. How do you tend to handle disagreements with someone you're close to?",
  "Noted. I'll keep that in mind for who I bring you next.",
];

export default function MatchmakerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [replyIndex, setReplyIndex] = useState(0);
  const [sending, setSending] = useState(false);

  async function send() {
    if (!input.trim() || sending) return;
    const text = input.trim();
    const userMsg: ChatMessage = { from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/matchmaker/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("backend not configured");
      const data = await res.json();
      setMessages((m) => [...m, { from: "ai", text: data.reply }]);
    } catch {
      // Backend/API key not configured yet (e.g. running this demo without
      // Supabase + Anthropic credentials) — fall back to a sample reply so
      // the UI still demonstrates the flow.
      setMessages((m) => [...m, { from: "ai", text: canned[replyIndex % canned.length] }]);
      setReplyIndex((i) => i + 1);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col px-6">
      <div className="flex items-center gap-3 border-b border-ink-line/60 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass">
          <ThreadMark className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-medium">TALISM Matchmaker</h1>
          <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
            Building your profile as you talk
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto py-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.from === "ai"
                ? "mr-10 rounded-2xl rounded-tl-sm bg-paper-raised px-4 py-3 text-sm leading-relaxed dark:bg-ink-raised"
                : "ml-10 rounded-2xl rounded-tr-sm bg-garnet px-4 py-3 text-sm leading-relaxed text-white dark:bg-brass dark:text-ink"
            }
          >
            {m.text}
          </div>
        ))}
        {sending && (
          <div className="mr-10 w-fit rounded-2xl rounded-tl-sm bg-paper-raised px-4 py-3 text-sm text-text-muted dark:bg-ink-raised dark:text-text-on-ink-muted">
            typing...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-ink-line/60 py-4 pb-20 md:pb-4">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-ink-line/60 bg-paper-raised px-4 py-2.5 dark:bg-ink-raised">
          <Sparkles size={15} className="shrink-0 text-garnet dark:text-brass" />
          <input
            value={input}
            disabled={sending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Tell your matchmaker anything..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted disabled:opacity-50 dark:placeholder:text-text-on-ink-muted"
          />
        </div>
        <button
          onClick={send}
          disabled={sending}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-text-on-ink disabled:opacity-50 dark:bg-brass dark:text-ink"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
