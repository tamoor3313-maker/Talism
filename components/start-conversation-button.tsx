"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function StartConversationButton({
  candidateId,
  candidateName,
}: {
  candidateId: string;
  candidateName: string;
}) {
  const router = useRouter();

  async function handleClick() {
    try {
      const res = await fetch("/api/messages/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: candidateId }),
      });
      if (!res.ok) throw new Error("not configured");
    } catch {
      // No live backend yet — Messages falls back to sample data.
    }
    router.push("/messages");
  }

  return (
    <button
      onClick={handleClick}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-medium text-text-on-ink transition-colors hover:bg-ink/90 dark:bg-brass dark:text-ink dark:hover:bg-brass-soft"
    >
      <MessageCircle size={16} />
      Message {candidateName}
    </button>
  );
}
