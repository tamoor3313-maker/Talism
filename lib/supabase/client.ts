import { createBrowserClient } from "@supabase/ssr";

// Placeholder values let the app build and render its UI without a
// configured Supabase project (e.g. in this sandbox). Real auth calls will
// simply fail with a network/auth error until real env vars are set —
// screens that call this already handle that failure gracefully.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  );
}
