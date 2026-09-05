import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/ai";
import { BIO_BUILDER_PROMPT } from "@/lib/coach-prompts";

export async function POST(request: Request) {
  const { aboutMe, tone, bioType } = await request.json();

  if (!aboutMe || !tone || !bioType) {
    return NextResponse.json(
      { error: "Missing aboutMe, tone, or bioType" },
      { status: 400 }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const reply = await chatComplete(BIO_BUILDER_PROMPT, [
    {
      role: "user",
      content: `About me: ${aboutMe}\n\nTone: ${tone}\nBio type: ${bioType}`,
    },
  ]);

  return NextResponse.json({ reply });
}
