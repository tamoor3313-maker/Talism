import { NextResponse } from "next/server";
import { chatComplete, MATCHMAKER_SYSTEM_PROMPT } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { message, history: clientHistory } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  // The matchmaker chat works for anyone, logged in or not — talking to
  // the AI shouldn't require an account. Logged-in users additionally get
  // their conversation remembered across sessions (subject to their
  // privacy toggle); anonymous visitors just get the current session's
  // history, sent up by the client, with nothing persisted server-side.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let history: { role: "user" | "assistant"; content: string }[] = [];
  let rememberHistory = false;

  if (user) {
    const { data: privacy } = await supabase
      .from("privacy_settings")
      .select("remember_conversations")
      .eq("user_id", user.id)
      .maybeSingle();

    rememberHistory = privacy?.remember_conversations ?? true;

    if (rememberHistory) {
      const { data: pastMessages } = await supabase
        .from("matchmaker_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(40);
      history = pastMessages ?? [];
    }
  } else if (Array.isArray(clientHistory)) {
    // Trust only role/content shape from the client — anonymous session
    // history never touches the database.
    history = clientHistory
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .slice(-40);
  }

  const reply = await chatComplete(MATCHMAKER_SYSTEM_PROMPT, [
    ...history,
    { role: "user", content: message },
  ]);

  if (user && rememberHistory) {
    await supabase.from("matchmaker_messages").insert([
      { user_id: user.id, role: "user", content: message },
      { user_id: user.id, role: "assistant", content: reply },
    ]);
  }

  return NextResponse.json({ reply });
}
