import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/ai";
import { CONVERSATION_COACH_PROMPT } from "@/lib/coach-prompts";

export async function POST(request: Request) {
  const { conversationText } = await request.json();

  if (!conversationText) {
    return NextResponse.json({ error: "Missing conversationText" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const raw = await chatComplete(CONVERSATION_COACH_PROMPT, [
    { role: "user", content: conversationText },
  ]);

  try {
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to parse coaching result" }, { status: 502 });
  }
}
