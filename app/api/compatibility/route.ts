import { NextResponse } from "next/server";
import { chatComplete, COMPATIBILITY_SYSTEM_PROMPT } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { candidateId } = await request.json();
  if (!candidateId) {
    return NextResponse.json({ error: "Missing candidateId" }, { status: 400 });
  }

  const [{ data: me }, { data: candidate }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("profiles").select("*").eq("id", candidateId).single(),
  ]);

  if (!me || !candidate) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const raw = await chatComplete(COMPATIBILITY_SYSTEM_PROMPT, [
    {
      role: "user",
      content: `Person A:\n${JSON.stringify(
        {
          relationshipGoals: me.relationship_goals,
          values: me.values_list,
          dealBreakers: me.deal_breakers,
          interests: me.interests,
          bio: me.bio,
        },
        null,
        2
      )}\n\nPerson B:\n${JSON.stringify(
        {
          relationshipGoals: candidate.relationship_goals,
          values: candidate.values_list,
          dealBreakers: candidate.deal_breakers,
          interests: candidate.interests,
          bio: candidate.bio,
        },
        null,
        2
      )}`,
    },
  ]);

  let result;
  try {
    result = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return NextResponse.json(
      { error: "Failed to parse compatibility result" },
      { status: 502 }
    );
  }

  await supabase.from("matches").upsert(
    {
      user_id: user.id,
      candidate_id: candidateId,
      overall_score: result.overall,
      category_scores: result.categories,
      why_compatible: result.whyCompatible,
      discuss_points: result.discussPoints,
    },
    { onConflict: "user_id,candidate_id" }
  );

  return NextResponse.json(result);
}
