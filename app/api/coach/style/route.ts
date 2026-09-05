import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/ai";
import { STYLE_ADVISOR_PROMPT } from "@/lib/coach-prompts";

export async function POST(request: Request) {
  const { gender, age, bodyType, location, weather, dateType, personalStyle } =
    await request.json();

  if (!dateType) {
    return NextResponse.json({ error: "Missing dateType" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const details = [
    gender && `Gender: ${gender}`,
    age && `Age: ${age}`,
    bodyType && `Body type: ${bodyType}`,
    location && `Date location: ${location}`,
    weather && `Weather: ${weather}`,
    `Date type: ${dateType}`,
    personalStyle && `Personal style: ${personalStyle}`,
  ]
    .filter(Boolean)
    .join("\n");

  const reply = await chatComplete(STYLE_ADVISOR_PROMPT, [
    { role: "user", content: details },
  ]);

  return NextResponse.json({ reply });
}
