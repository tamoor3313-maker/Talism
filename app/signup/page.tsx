"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThreadMark } from "@/components/thread-mark";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, name });
      await supabase.from("privacy_settings").insert({ user_id: data.user.id });
    }

    router.push("/onboarding");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-ink">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <ThreadMark className="h-6 w-6 text-garnet dark:text-brass" />
          <span className="font-display text-lg text-text-strong dark:text-text-on-ink">
            TALISM
          </span>
        </Link>

        <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-7 dark:bg-ink-raised">
          <h1 className="font-display text-2xl text-text-strong dark:text-text-on-ink">
            Create your account
          </h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink dark:focus:border-brass"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink dark:focus:border-brass"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted dark:text-text-on-ink-muted">
                Password
              </label>
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink-line/60 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-garnet dark:bg-ink dark:focus:border-brass"
              />
            </div>
            {error && <p className="text-xs text-garnet dark:text-brass-soft">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted dark:text-text-on-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-garnet dark:text-brass">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
