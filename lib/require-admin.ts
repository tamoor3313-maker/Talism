import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * Verifies the current user is an admin. Uses the service-role client to
 * check the `admins` table, since that table has no client-facing RLS
 * policies at all (see supabase/schema.sql) — only server code with the
 * service key can read it.
 */
export async function requireAdmin() {
  // No real Supabase project configured (e.g. this sandbox) — let the
  // demo through so the admin UI is reviewable before wiring credentials.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { id: "demo-admin", email: "demo@talism.ai" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: admin } = await service
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/home");

  return user;
}

/**
 * Same admin check, but for API route handlers, where redirect() doesn't
 * make sense — returns null when the caller isn't an admin, and the
 * route should respond with a 403 in that case, instead of a redirect.
 */
export async function requireAdminApi() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { id: "demo-admin", email: "demo@talism.ai" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const service = createServiceClient();
  const { data: admin } = await service
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return admin ? user : null;
}
