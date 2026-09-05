import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/ai";
import { WHAT_TO_SAY_PROMPT } from "@/lib/coach-prompts";

export async function POST(request: Request) {
  const { question, context } = await request.json();

  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const reply = await chatComplete(WHAT_TO_SAY_PROMPT, [
    {
      role: "user",
      content: context ? `Situation: ${context}\n\nQuestion: ${question}` : question,
    },
  ]);

  return NextResponse.json({ reply });
}
