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

  // /matchmaker and /courses are intentionally NOT in this list — talking
  // to the AI and browsing/buying courses never requires an account.
  // Other pages genuinely need an account (real matches, messages,
  // profile, purchased-course library) so those stay protected.
  //
  // Match on path segments, not raw prefixes — "/match".startsWith would
  // also match "/matchmaker", which is exactly the bug this avoids.
  const protectedPaths = ["/home", "/discover", "/match", "/messages", "/profile", "/my-courses", "/coach/dashboard"];
  const isProtected = protectedPaths.some((p) => {
    const path = request.nextUrl.pathname;
    return path === p || path.startsWith(`${p}/`);
  });

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
