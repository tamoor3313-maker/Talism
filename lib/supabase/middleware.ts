import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Without a real Supabase project configured, skip route protection so
  // the UI/sample-data demo stays reachable (e.g. in local dev before
  // env vars are set). Once NEXT_PUBLIC_SUPABASE_URL is set for real,
  // protection kicks in automatically.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /matchmaker is intentionally NOT in this list — talking to the AI
  // matchmaker never requires an account, whether or not login is
  // working. Other pages genuinely need an account (they show your real
  // matches, messages, profile) so those stay protected.
  const protectedPaths = ["/home", "/discover", "/match", "/messages", "/profile"];
  const isProtected = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
