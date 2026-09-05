"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Lesson = { id: string; title: string; content: string | null; video_url: string | null };

export default function MyCourseLessonsPage() {
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [active, setActive] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: course } = await supabase
        .from("courses")
        .select("title")
        .eq("id", params.id)
        .single();
      setTitle(course?.title ?? null);

      const { data } = await supabase
        .from("lessons")
        .select("id, title, content, video_url")
        .eq("course_id", params.id)
        .order("order_index", { ascending: true });
      setLessons(data ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const current = lessons[active];

  return (
    <div className="mx-auto flex max-w-4xl gap-8 px-6 py-10">
      <aside className="w-56 shrink-0">
        <h1 className="font-display text-xl">{title}</h1>
        <div className="mt-4 space-y-1">
          {lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setActive(i)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${
                i === active
                  ? "bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass"
                  : "text-text-muted hover:bg-paper-raised dark:text-text-on-ink-muted dark:hover:bg-ink-raised"
              }`}
            >
              {i + 1}. {l.title}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1">
        {current ? (
          <>
            <h2 className="font-display text-2xl">{current.title}</h2>
            {current.video_url && (
              <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-ink">
                <iframe src={current.video_url} className="h-full w-full" allowFullScreen />
              </div>
            )}
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
              {current.content}
            </p>
          </>
        ) : (
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            No lessons yet, or you don't have access to this course.
          </p>
        )}
      </div>
    </div>
  );
}
