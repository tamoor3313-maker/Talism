"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type PurchasedCourse = { id: string; title: string; topic: string | null };

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<PurchasedCourse[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setCourses([]);
        return;
      }
      const { data: purchases } = await supabase
        .from("course_purchases")
        .select("course_id")
        .eq("user_id", user.id);

      if (!purchases?.length) {
        setCourses([]);
        return;
      }

      const { data } = await supabase
        .from("courses")
        .select("id, title, topic")
        .in("id", purchases.map((p) => p.course_id));
      setCourses(data ?? []);
    })();
  }, [supabase]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl tracking-tight">My courses</h1>

      {courses?.length === 0 && (
        <p className="mt-6 text-sm text-text-muted dark:text-text-on-ink-muted">
          You haven't purchased any courses yet.{" "}
          <Link href="/courses" className="text-garnet dark:text-brass">
            Browse the marketplace
          </Link>
          .
        </p>
      )}

      <div className="mt-6 space-y-3">
        {courses?.map((c) => (
          <Link
            key={c.id}
            href={`/my-courses/${c.id}`}
            className="flex items-center justify-between rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised"
          >
            <div>
              <p className="font-medium">{c.title}</p>
              {c.topic && (
                <p className="text-xs text-text-muted dark:text-text-on-ink-muted">{c.topic}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
