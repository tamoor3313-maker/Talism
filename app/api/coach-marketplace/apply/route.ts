import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { headline, bio } = await request.json();
  if (!headline || !bio) {
    return NextResponse.json({ error: "Missing headline or bio" }, { status: 400 });
  }

  const { error } = await supabase
    .from("coaches")
    .upsert({ user_id: user.id, headline, bio, status: "pending" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
