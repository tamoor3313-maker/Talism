import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, coaches(headline, profiles(name))")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courses: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: coach } = await supabase
    .from("coaches")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (coach?.status !== "approved") {
    return NextResponse.json(
      { error: "Only approved coaches can create courses" },
      { status: 403 }
    );
  }

  const { title, description, topic, priceCents } = await request.json();
  if (!title || priceCents === undefined) {
    return NextResponse.json({ error: "Missing title or priceCents" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      coach_id: user.id,
      title,
      description,
      topic,
      price_cents: priceCents,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courseId: data.id });
}
