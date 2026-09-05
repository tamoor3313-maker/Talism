"use client";

import { useState } from "react";

type ApplicationRow = {
  user_id: string;
  headline: string | null;
  bio: string | null;
  status: string;
  applied_at: string;
  profiles: { name: string } | null;
};

export function CoachApplicationRow({ application }: { application: ApplicationRow }) {
  const [status, setStatus] = useState(application.status);
  const [loading, setLoading] = useState(false);

  async function review(newStatus: "approved" | "rejected") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/coach-applications/${application.user_id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setStatus(newStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{application.profiles?.name ?? "Unknown"}</p>
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            {application.headline}
          </p>
          {application.bio && (
            <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
              {application.bio}
            </p>
          )}
          <p className="mt-2 text-xs text-text-muted dark:text-text-on-ink-muted">
            Applied {application.applied_at}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
            status === "approved"
              ? "bg-green-600/10 text-green-700 dark:text-green-400"
              : status === "rejected"
                ? "bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass"
                : "bg-ink-line/30 text-text-muted dark:text-text-on-ink-muted"
          }`}
        >
          {status}
        </span>
      </div>

      {status === "pending" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => review("approved")}
            disabled={loading}
            className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-text-on-ink dark:bg-brass dark:text-ink"
          >
            Approve
          </button>
          <button
            onClick={() => review("rejected")}
            disabled={loading}
            className="rounded-full border border-ink-line/60 px-4 py-1.5 text-xs text-text-muted dark:text-text-on-ink-muted"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
