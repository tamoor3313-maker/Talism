"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CoachHeader } from "@/components/coach/coach-header";
import { Button } from "@/components/ui/button";

type Lesson = { id: string; title: string; content: string | null; order_index: number };
type CourseRow = { id: string; title: string; status: string };

export default function CourseEditorPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [course, setCourse] = useState<CourseRow | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  async function load() {
    const { data: c } = await supabase
      .from("courses")
      .select("id, title, status")
      .eq("id", params.id)
      .single();
    setCourse(c);

    const { data: ls } = await supabase
      .from("lessons")
      .select("id, title, content, order_index")
      .eq("course_id", params.id)
      .order("order_index", { ascending: true });
    setLessons(ls ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function addLesson() {
    if (!lessonTitle.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/coach-marketplace/courses/${params.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          orderIndex: lessons.length,
        }),
      });
      setLessonTitle("");
      setLessonContent("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!course) return;
    setPublishing(true);
    try {
      const newStatus = course.status === "published" ? "draft" : "published";
      await fetch(`/api/coach-marketplace/courses/${params.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await load();
    } finally {
      setPublishing(false);
    }
  }

  if (!course) {
    return <div className="mx-auto max-w-2xl px-6 py-10 text-sm text-text-muted">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <CoachHeader title={course.title} subtitle={`Status: ${course.status}`} />

      <Button onClick={togglePublish} disabled={publishing} variant="secondary" className="mt-4">
        {course.status === "published" ? "Unpublish" : "Publish course"}
      </Button>

      <div className="mt-8">
        <h2 className="font-medium">Lessons</h2>
        <div className="mt-3 space-y-2">
          {lessons.map((l, i) => (
            <div
              key={l.id}
              className="rounded-2xl border border-ink-line/60 bg-paper-raised p-4 dark:bg-ink-raised"
            >
              <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
                Lesson {i + 1}
              </p>
              <p className="font-medium">{l.title}</p>
              {l.content && (
                <p className="mt-1 text-sm text-text-muted dark:text-text-on-ink-muted">
                  {l.content}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 rounded-2xl border border-dashed border-ink-line/60 p-4">
          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="Lesson title"
            className="w-full rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
          <textarea
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            rows={4}
            placeholder="Lesson content"
            className="w-full resize-none rounded-xl border border-ink-line/60 bg-paper-raised px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
          />
          <Button onClick={addLesson} disabled={saving || !lessonTitle.trim()} size="sm">
            {saving ? "Adding..." : "Add lesson"}
          </Button>
        </div>
      </div>
    </div>
  );
}
