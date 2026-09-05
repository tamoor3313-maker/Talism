import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/ai";
import { PROFILE_REVIEW_PROMPT } from "@/lib/coach-prompts";

export async function POST(request: Request) {
  const { profileText } = await request.json();

  if (!profileText) {
    return NextResponse.json({ error: "Missing profileText" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const raw = await chatComplete(PROFILE_REVIEW_PROMPT, [
    { role: "user", content: profileText },
  ]);

  try {
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to parse review result" }, { status: 502 });
  }
}
