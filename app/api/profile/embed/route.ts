import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embedText, profileToEmbeddingText } from "@/lib/voyage";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("bio, relationship_goals, values_list, deal_breakers, interests")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const text = profileToEmbeddingText(profile);
  if (!text.trim()) {
    return NextResponse.json(
      { error: "Not enough profile data yet to generate an embedding" },
      { status: 400 }
    );
  }

  let embedding: number[];
  try {
    embedding = await embedText(text);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ embedding, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
