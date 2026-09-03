const categories = [
  { label: "Relationship goals", value: 95, tier: "Excellent" },
  { label: "Values", value: 82, tier: "Strong" },
  { label: "Lifestyle", value: 90, tier: "Excellent" },
  { label: "Communication", value: 80, tier: "Strong" },
  { label: "Interests", value: 68, tier: "Good" },
];

export function CompatibilityShowcase() {
  return (
    <section
      id="compatibility"
      className="border-t border-ink-line/60 bg-paper-raised py-20 dark:bg-ink-raised/40 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Every match comes with its reasoning
          </h2>
          <p className="mt-5 max-w-md text-text-muted dark:text-text-on-ink-muted">
            Compatibility is shown as a structured estimate across five
            dimensions, not a mystery percentage. You&apos;ll always see why
            TALISM thinks a match is worth a conversation — and what&apos;s
            worth asking about early.
          </p>
          <p className="mt-6 max-w-md text-xs text-text-muted dark:text-text-on-ink-muted">
            Compatibility scores are AI-generated estimates based on what
            you&apos;ve shared. They&apos;re a starting point for
            conversation, not a scientific prediction or a guarantee.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-line/60 bg-paper p-6 dark:bg-ink">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-4xl">92%</p>
              <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
                compatibility estimate
              </p>
            </div>
            <div className="h-14 w-14 rounded-full border-4 border-brass" />
          </div>

          <div className="mt-6 space-y-3.5">
            {categories.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-text-muted dark:text-text-on-ink-muted">
                    {c.label}
                  </span>
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

          <div className="mt-6 rounded-xl bg-paper-raised p-4 text-xs leading-relaxed text-text-muted dark:bg-ink-raised dark:text-text-on-ink-muted">
            <span className="font-medium text-text-strong dark:text-text-on-ink">
              Worth discussing:
            </span>{" "}
            you both value deep conversation, but Maya travels for work
            often — worth raising how you&apos;d handle time apart.
          </div>
        </div>
      </div>
    </section>
  );
}
