import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { candidates } from "@/lib/sample-data";
import { StartConversationButton } from "@/components/start-conversation-button";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted dark:text-text-on-ink-muted"
      >
        <ArrowLeft size={14} />
        Back to Discover
      </Link>

      <div
        className="mt-5 h-52 rounded-2xl"
        style={{
          background: `linear-gradient(160deg, ${candidate.photoTone}, ${candidate.photoTone}CC)`,
        }}
      />

      <div className="mt-5 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl">
            {candidate.name}, {candidate.age}
          </h1>
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            {candidate.location}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl">{candidate.overall}%</p>
          <p className="text-xs text-text-muted dark:text-text-on-ink-muted">compatibility</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{candidate.headline}</p>

      <div className="mt-8 rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised">
        <h2 className="font-medium">Compatibility breakdown</h2>
        <div className="mt-4 space-y-3.5">
          {candidate.categories.map((c) => (
            <div key={c.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-text-muted dark:text-text-on-ink-muted">{c.label}</span>
                <span className="font-medium">{c.tier}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-line/40">
                <div
                  className="h-full rounded-full bg-garnet dark:bg-brass"
                  style={{ width: `${c.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-medium">Why TALISM thinks you may be compatible</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
          {candidate.whyCompatible}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="font-medium">Things to discuss</h2>
        <ul className="mt-2 space-y-2">
          {candidate.discussPoints.map((p) => (
            <li
              key={p}
              className="rounded-xl bg-paper-raised px-4 py-3 text-sm leading-relaxed text-text-muted dark:bg-ink-raised dark:text-text-on-ink-muted"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs text-text-muted dark:text-text-on-ink-muted">
        This compatibility score is an AI-generated estimate based on what
        you&apos;ve both shared — not a scientific prediction or a guarantee.
      </p>

      <StartConversationButton candidateId={candidate.id} candidateName={candidate.name} />
    </div>
  );
}
