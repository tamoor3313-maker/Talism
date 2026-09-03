import { NextResponse } from "next/server";
import { chatComplete, MATCHMAKER_SYSTEM_PROMPT } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { message } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  // Pull consent + history — never call the model with data the user
  // hasn't agreed to let TALISM remember and use.
  const { data: privacy } = await supabase
    .from("privacy_settings")
    .select("remember_conversations")
    .eq("user_id", user.id)
    .maybeSingle();

  const rememberHistory = privacy?.remember_conversations ?? true;

  let history: { role: "user" | "assistant"; content: string }[] = [];
  if (rememberHistory) {
    const { data: pastMessages } = await supabase
      .from("matchmaker_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(40);
    history = pastMessages ?? [];
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  const reply = await chatComplete(MATCHMAKER_SYSTEM_PROMPT, [
    ...history,
    { role: "user", content: message },
  ]);

  if (rememberHistory) {
    await supabase.from("matchmaker_messages").insert([
      { user_id: user.id, role: "user", content: message },
      { user_id: user.id, role: "assistant", content: reply },
    ]);
  }

  return NextResponse.json({ reply });
}
