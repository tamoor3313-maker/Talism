import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { title, content, videoUrl, orderIndex } = await request.json();
  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  // RLS also enforces this, but checking here gives a clearer error message.
  const { data: course } = await supabase
    .from("courses")
    .select("coach_id")
    .eq("id", courseId)
    .single();

  if (course?.coach_id !== user.id) {
    return NextResponse.json({ error: "Not your course" }, { status: 403 });
  }

  const { error } = await supabase.from("lessons").insert({
    course_id: courseId,
    title,
    content,
    video_url: videoUrl,
    order_index: orderIndex ?? 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
