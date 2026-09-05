import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/ai";
import { DATE_PLANNER_PROMPT } from "@/lib/coach-prompts";

export async function POST(request: Request) {
  const { budget, location, interests, timeOfDay, setting } = await request.json();

  if (!location) {
    return NextResponse.json({ error: "Missing location" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const details = [
    budget && `Budget: ${budget}`,
    `Location: ${location}`,
    interests && `Interests: ${interests}`,
    timeOfDay && `Time of day: ${timeOfDay}`,
    setting && `Indoor/outdoor preference: ${setting}`,
  ]
    .filter(Boolean)
    .join("\n");

  const reply = await chatComplete(DATE_PLANNER_PROMPT, [
    { role: "user", content: details },
  ]);

  return NextResponse.json({ reply });
}
