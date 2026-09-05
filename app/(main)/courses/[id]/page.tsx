"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { courses } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === params.id);
  const [purchasing, setPurchasing] = useState(false);

  if (!course) notFound();

  async function handlePurchase() {
    setPurchasing(true);
    try {
      const res = await fetch("/api/coach-marketplace/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course!.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Purchases aren't configured yet in this demo.");
      }
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted dark:text-text-on-ink-muted"
      >
        <ArrowLeft size={14} />
        Back to Courses
      </Link>

      <div
        className="mt-5 h-48 rounded-2xl"
        style={{
          background: `linear-gradient(160deg, ${course.thumbnailTone}, ${course.thumbnailTone}CC)`,
        }}
      />

      <h1 className="mt-5 font-display text-2xl">{course.title}</h1>
      <p className="mt-1.5 text-sm text-text-muted dark:text-text-on-ink-muted">
        {course.coachName} · {course.coachHeadline}
      </p>
      <p className="mt-4 text-sm leading-relaxed">{course.description}</p>

      <div className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-3xl">${(course.priceCents / 100).toFixed(0)}</p>
            <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
              {course.lessonCount} lessons · lifetime access
            </p>
          </div>
          <Button onClick={handlePurchase} disabled={purchasing}>
            {purchasing ? "Redirecting..." : "Buy course"}
          </Button>
        </div>
      </div>
    </div>
  );
}
