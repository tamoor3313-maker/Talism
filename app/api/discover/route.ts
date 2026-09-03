import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("embedding")
    .eq("id", user.id)
    .single();

  if (!me?.embedding) {
    return NextResponse.json(
      { error: "No embedding yet — call /api/profile/embed first (needs a filled-out profile)" },
      { status: 400 }
    );
  }

  const { data: matches, error } = await supabase.rpc("match_candidates", {
    query_embedding: me.embedding,
    match_user_id: user.id,
    match_count: 10,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!matches?.length) {
    return NextResponse.json({ candidates: [] });
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, birthdate, location, bio, interests, photo_url")
    .in(
      "id",
      matches.map((m: { id: string }) => m.id)
    );

  const candidates = matches.map((m: { id: string; similarity: number }) => ({
    ...profiles?.find((p) => p.id === m.id),
    similarity: m.similarity,
  }));

  return NextResponse.json({ candidates });
}
