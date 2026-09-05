"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThreadMark } from "@/components/thread-mark";
import { LinkButton } from "@/components/ui/button";

export default function PurchaseSuccessPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setLoggedIn(Boolean(user));
    })();
  }, [supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 dark:bg-ink">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <ThreadMark className="h-6 w-6 text-garnet dark:text-brass" />
          <span className="font-display text-lg text-text-strong dark:text-text-on-ink">
            TALISM
          </span>
        </div>

        <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-7 dark:bg-ink-raised">
          <h1 className="font-display text-2xl text-text-strong dark:text-text-on-ink">
            You're in
          </h1>
          {loggedIn === null ? (
            <p className="mt-3 text-sm text-text-muted dark:text-text-on-ink-muted">
              Just a moment...
            </p>
          ) : loggedIn ? (
            <>
              <p className="mt-3 text-sm text-text-muted dark:text-text-on-ink-muted">
                Your course is ready — head to My Courses to start.
              </p>
              <LinkButton href="/my-courses" className="mt-6 w-full">
                Go to My Courses
              </LinkButton>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-text-muted dark:text-text-on-ink-muted">
                Check your email — we sent you a link to set up access, so
                you can come back anytime to view your course.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-block text-sm text-garnet dark:text-brass"
              >
                Keep browsing courses
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
