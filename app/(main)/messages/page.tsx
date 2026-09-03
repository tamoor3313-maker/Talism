"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, Send } from "lucide-react";
import { candidates, conversations as sampleConversations } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/client";
import clsx from "clsx";

const suggestions = [
  "Ask about her ceramics studio",
  "Suggest a Saturday coffee walk",
  "Follow up on the Catan comment",
];

type LiveMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type LiveThread = {
  conversationId: string;
  otherUserId: string;
  otherName: string;
  otherPhotoUrl: string | null;
};

const REALTIME_ENABLED = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(sampleConversations[0]?.candidateId);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Live data (only populated once Supabase is actually configured and the
  // user is authenticated — otherwise this page runs entirely on sample
  // data above, so the UI is demoable with zero setup).
  const [userId, setUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<LiveThread[]>([]);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [draft, setDraft] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (!REALTIME_ENABLED) return;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: convos } = await supabase
        .from("conversations")
        .select("id, user_a, user_b")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

      if (!convos?.length) return;

      const otherIds = convos.map((c) => (c.user_a === user.id ? c.user_b : c.user_a));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, photo_url")
        .in("id", otherIds);

      setThreads(
        convos.map((c) => {
          const otherUserId = c.user_a === user.id ? c.user_b : c.user_a;
          const profile = profiles?.find((p) => p.id === otherUserId);
          return {
            conversationId: c.id,
            otherUserId,
            otherName: profile?.name ?? "Someone",
            otherPhotoUrl: profile?.photo_url ?? null,
          };
        })
      );
    })();
  }, [supabase]);

  const activeConversationId = REALTIME_ENABLED
    ? threads.find((t) => t.otherUserId === activeId)?.conversationId
    : undefined;

  // Load history + subscribe to new messages for the active live thread.
  useEffect(() => {
    if (!REALTIME_ENABLED || !activeConversationId) return;

    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeConversationId)
        .order("created_at", { ascending: true });
      setLiveMessages(data ?? []);
    })();

    const channel = supabase
      .channel(`messages:${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          setLiveMessages((m) => [...m, payload.new as LiveMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId, supabase]);

  const sendLiveMessage = useCallback(async () => {
    if (!draft.trim() || !activeConversationId || !userId) return;
    await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      sender_id: userId,
      content: draft.trim(),
    });
    setDraft("");
  }, [draft, activeConversationId, userId, supabase]);

  // ── Rendering: prefer live threads once we have them, otherwise sample data ──
  const usingLiveData = REALTIME_ENABLED && threads.length > 0;

  const active = usingLiveData
    ? undefined
    : sampleConversations.find((c) => c.candidateId === activeId);
  const activeCandidate = usingLiveData
    ? undefined
    : candidates.find((c) => c.id === activeId);
  const activeThread = usingLiveData
    ? threads.find((t) => t.otherUserId === activeId)
    : undefined;

  return (
    <div className="mx-auto flex h-screen max-w-5xl">
      <div className="hidden w-72 shrink-0 border-r border-ink-line/60 sm:block">
        <h1 className="px-5 pb-4 pt-8 font-display text-2xl">Messages</h1>
        <div className="space-y-1 px-2">
          {usingLiveData
            ? threads.map((t) => (
                <button
                  key={t.conversationId}
                  onClick={() => setActiveId(t.otherUserId)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors",
                    activeId === t.otherUserId
                      ? "bg-garnet/10 dark:bg-brass/10"
                      : "hover:bg-paper-raised dark:hover:bg-ink-raised"
                  )}
                >
                  <div className="h-11 w-11 shrink-0 rounded-full bg-garnet dark:bg-brass" />
                  <p className="truncate text-sm font-medium">{t.otherName}</p>
                </button>
              ))
            : sampleConversations.map((c) => {
                const candidate = candidates.find((cd) => cd.id === c.candidateId)!;
                return (
                  <button
                    key={c.candidateId}
                    onClick={() => setActiveId(c.candidateId)}
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors",
                      activeId === c.candidateId
                        ? "bg-garnet/10 dark:bg-brass/10"
                        : "hover:bg-paper-raised dark:hover:bg-ink-raised"
                    )}
                  >
                    <div
                      className="h-11 w-11 shrink-0 rounded-full"
                      style={{ background: candidate.photoTone }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium">{candidate.name}</p>
                        <span className="shrink-0 text-[11px] text-text-muted dark:text-text-on-ink-muted">
                          {c.lastTime}
                        </span>
                      </div>
                      <p className="truncate text-xs text-text-muted dark:text-text-on-ink-muted">
                        {c.lastMessage}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-garnet text-[10px] text-white dark:bg-brass dark:text-ink">
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {usingLiveData && activeThread ? (
          <>
            <div className="flex items-center gap-3 border-b border-ink-line/60 px-6 py-5">
              <div className="h-9 w-9 rounded-full bg-garnet dark:bg-brass" />
              <p className="font-medium">{activeThread.otherName}</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {liveMessages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.sender_id !== userId
                      ? "mr-10 rounded-2xl rounded-tl-sm bg-paper-raised px-4 py-3 text-sm leading-relaxed dark:bg-ink-raised"
                      : "ml-10 rounded-2xl rounded-tr-sm bg-garnet px-4 py-3 text-sm leading-relaxed text-white dark:bg-brass dark:text-ink"
                  }
                >
                  {m.content}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-6 py-4 pb-20 md:pb-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendLiveMessage()}
                placeholder="Write a message..."
                className="flex-1 rounded-full border border-ink-line/60 bg-paper-raised px-4 py-2.5 text-sm outline-none placeholder:text-text-muted dark:bg-ink-raised dark:placeholder:text-text-on-ink-muted"
              />
              <button
                onClick={sendLiveMessage}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-text-on-ink dark:bg-brass dark:text-ink"
              >
                <Send size={15} />
              </button>
            </div>
          </>
        ) : active && activeCandidate ? (
          <>
            <div className="flex items-center gap-3 border-b border-ink-line/60 px-6 py-5">
              <div
                className="h-9 w-9 rounded-full"
                style={{ background: activeCandidate.photoTone }}
              />
              <p className="font-medium">{activeCandidate.name}</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.from === "them"
                      ? "mr-10 rounded-2xl rounded-tl-sm bg-paper-raised px-4 py-3 text-sm leading-relaxed dark:bg-ink-raised"
                      : "ml-10 rounded-2xl rounded-tr-sm bg-garnet px-4 py-3 text-sm leading-relaxed text-white dark:bg-brass dark:text-ink"
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 border-t border-ink-line/60 px-6 pt-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="rounded-full border border-ink-line/60 px-3.5 py-1.5 text-xs text-text-muted hover:border-brass hover:text-text-strong dark:text-text-on-ink-muted dark:hover:text-text-on-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 px-6 py-4 pb-20 md:pb-4">
              <button
                onClick={() => setShowSuggestions((v) => !v)}
                aria-label="AI conversation help"
                className={clsx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  showSuggestions
                    ? "border-garnet bg-garnet/10 text-garnet dark:border-brass dark:bg-brass/10 dark:text-brass"
                    : "border-ink-line/60 text-text-muted dark:text-text-on-ink-muted"
                )}
              >
                <Sparkles size={15} />
              </button>
              <input
                placeholder="Write a message..."
                className="flex-1 rounded-full border border-ink-line/60 bg-paper-raised px-4 py-2.5 text-sm outline-none placeholder:text-text-muted dark:bg-ink-raised dark:placeholder:text-text-on-ink-muted"
              />
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-text-on-ink dark:bg-brass dark:text-ink">
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-text-muted dark:text-text-on-ink-muted">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
