"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LinkButton } from "@/components/ui/button";

type MyCourse = {
  id: string;
  title: string;
  status: string;
  price_cents: number;
};

export default function CoachDashboardPage() {
  const [courses, setCourses] = useState<MyCourse[] | null>(null);
  const [coachStatus, setCoachStatus] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: coach } = await supabase
        .from("coaches")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      setCoachStatus(coach?.status ?? null);

      const { data } = await supabase
        .from("courses")
        .select("id, title, status, price_cents")
        .eq("coach_id", user.id)
        .order("created_at", { ascending: false });
      setCourses(data ?? []);
    })();
  }, [supabase]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-tight">Coach dashboard</h1>
        {coachStatus === "approved" && (
          <LinkButton href="/coach/dashboard/new" size="sm">
            <Plus size={14} />
            New course
          </LinkButton>
        )}
      </div>

      {coachStatus === null && (
        <div className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            You haven't applied to be a coach yet.
          </p>
          <LinkButton href="/coach/apply" size="sm" className="mt-4">
            Apply now
          </LinkButton>
        </div>
      )}

      {coachStatus === "pending" && (
        <div className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            Your application is under review. We'll let you know once it's been approved.
          </p>
        </div>
      )}

      {coachStatus === "rejected" && (
        <div className="mt-6 rounded-2xl border border-garnet/40 bg-garnet/5 p-6 dark:border-brass/40 dark:bg-brass/5">
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            Your application wasn't approved this time.
          </p>
        </div>
      )}

      {coachStatus === "approved" && (
        <div className="mt-6 space-y-3">
          {courses?.length === 0 && (
            <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
              No courses yet — create your first one.
            </p>
          )}
          {courses?.map((c) => (
            <Link
              key={c.id}
              href={`/coach/dashboard/${c.id}`}
              className="flex items-center justify-between rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised"
            >
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
                  ${(c.price_cents / 100).toFixed(0)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  c.status === "published"
                    ? "bg-green-600/10 text-green-700 dark:text-green-400"
                    : "bg-ink-line/30 text-text-muted dark:text-text-on-ink-muted"
                }`}
              >
                {c.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
