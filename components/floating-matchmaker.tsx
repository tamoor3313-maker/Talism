"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Send, Sparkles, X } from "lucide-react";
import { ThreadMark } from "@/components/thread-mark";

type ChatMessage = { from: "ai" | "user"; text: string };

const initialMessages: ChatMessage[] = [
  {
    from: "ai",
    text: "Hi, I'm your TALISM matchmaker. Ask me anything — about your matches, your profile, or dating in general.",
  },
];

const canned = [
  "That's a great question. When you picture a Sunday morning a few years from now, who's there and what does it look like?",
  "Got it — I'll factor that in. How do you tend to handle disagreements with someone you're close to?",
  "Noted. I'll keep that in mind for who I bring you next.",
];

// Pages that already have their own dedicated chat/onboarding UI, so the
// floating bubble would just be redundant or in the way.
const hiddenOn = ["/matchmaker", "/onboarding", "/login", "/signup"];

export function FloatingMatchmaker() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);

  if (hiddenOn.some((p) => pathname?.startsWith(p)) || pathname?.startsWith("/admin")) {
    return null;
  }

  async function send() {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/matchmaker/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.from === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      if (!res.ok) throw new Error("backend not configured");
      const data = await res.json();
      setMessages((m) => [...m, { from: "ai", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: "ai", text: canned[replyIndex % canned.length] }]);
      setReplyIndex((i) => i + 1);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] md:bottom-6 md:right-6">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-ink-line/60 bg-paper-raised shadow-xl dark:bg-ink-raised">
          <div className="flex items-center justify-between border-b border-ink-line/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass">
                <ThreadMark className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-medium">TALISM Matchmaker</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted hover:text-text-strong dark:text-text-on-ink-muted dark:hover:text-text-on-ink"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "ai"
                    ? "mr-6 rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-sm leading-relaxed dark:bg-ink"
                    : "ml-6 rounded-2xl rounded-tr-sm bg-garnet px-3.5 py-2.5 text-sm leading-relaxed text-white dark:bg-brass dark:text-ink"
                }
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="mr-6 w-fit rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-sm text-text-muted dark:bg-ink dark:text-text-on-ink-muted">
                typing...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-ink-line/60 p-3">
            <input
              value={input}
              disabled={sending}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask your matchmaker..."
              className="w-full flex-1 rounded-full border border-ink-line/60 bg-paper px-3.5 py-2 text-sm outline-none placeholder:text-text-muted disabled:opacity-50 dark:bg-ink dark:placeholder:text-text-on-ink-muted"
            />
            <button
              onClick={send}
              disabled={sending}
              aria-label="Send"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-text-on-ink disabled:opacity-50 dark:bg-brass dark:text-ink"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close matchmaker chat" : "Open matchmaker chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-text-on-ink shadow-lg transition-transform hover:scale-105 dark:bg-brass dark:text-ink"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>
    </div>
  );
}
