"use client";

import { useState } from "react";
import { myProfile } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "@/components/avatar-uploader";
import { Shield, Trash2 } from "lucide-react";

const settings = [
  { label: "Let my matchmaker remember our conversations", defaultOn: true },
  { label: "Use my messages to improve match suggestions", defaultOn: true },
  { label: "Show my profile in Discover", defaultOn: true },
  { label: "Allow read receipts", defaultOn: false },
];

export default function ProfilePage() {
  const [toggles, setToggles] = useState(settings.map((s) => s.defaultOn));
  const [upgrading, setUpgrading] = useState(false);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Stripe isn't configured yet.");
      }
    } finally {
      setUpgrading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-3xl tracking-tight">Your profile</h1>

      <section className="mt-8 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
        <div className="flex items-center gap-4">
          <AvatarUploader />
          <div>
            <h2 className="font-medium">
              {myProfile.name}, {myProfile.age}
            </h2>
            <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
              {myProfile.location}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
          {myProfile.bio}
        </p>
        <Button variant="secondary" size="sm" className="mt-4">
          Edit personal info
        </Button>
      </section>

      <section className="mt-6 flex items-center justify-between rounded-2xl border border-garnet/40 bg-garnet/5 p-6 dark:border-brass/40 dark:bg-brass/5">
        <div>
          <h2 className="font-medium">TALISM+</h2>
          <p className="mt-1 text-sm text-text-muted dark:text-text-on-ink-muted">
            6 matches a week, unlimited matchmaker access, and priority review.
          </p>
        </div>
        <Button onClick={handleUpgrade} disabled={upgrading} size="sm">
          {upgrading ? "Redirecting..." : "Upgrade"}
        </Button>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
        <h2 className="font-medium">Relationship goals</h2>
        <p className="mt-2 text-sm text-text-muted dark:text-text-on-ink-muted">
          {myProfile.relationshipGoals}
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
        <h2 className="font-medium">Values</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {myProfile.values.map((v) => (
            <span
              key={v}
              className="rounded-full bg-paper px-3 py-1.5 text-xs dark:bg-ink"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
        <h2 className="font-medium">Deal-breakers</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {myProfile.dealBreakers.map((v) => (
            <span
              key={v}
              className="rounded-full border border-garnet/30 px-3 py-1.5 text-xs text-garnet dark:border-brass/30 dark:text-brass"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
        <h2 className="font-medium">Interests</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {myProfile.interests.map((v) => (
            <span
              key={v}
              className="rounded-full bg-paper px-3 py-1.5 text-xs dark:bg-ink"
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-line/60 bg-paper-raised p-6 dark:bg-ink-raised">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-garnet dark:text-brass" />
          <h2 className="font-medium">Privacy & AI consent</h2>
        </div>
        <div className="mt-4 space-y-4">
          {settings.map((s, i) => (
            <label key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-text-muted dark:text-text-on-ink-muted">
                {s.label}
              </span>
              <button
                onClick={() =>
                  setToggles((t) => t.map((v, idx) => (idx === i ? !v : v)))
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  toggles[i] ? "bg-garnet dark:bg-brass" : "bg-ink-line/60"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    toggles[i] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </section>

      <button className="mt-8 flex items-center gap-2 text-sm text-garnet dark:text-brass">
        <Trash2 size={14} />
        Delete my account
      </button>
    </div>
  );
}
