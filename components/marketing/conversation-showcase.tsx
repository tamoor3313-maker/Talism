import { ThreadMark } from "@/components/thread-mark";

const steps = [
  {
    n: "1",
    title: "Talk, don't fill out forms",
    body: "Your matchmaker asks what actually matters, then follows up like a person would — not a checklist of hobbies.",
  },
  {
    n: "2",
    title: "It builds a real profile",
    body: "Values, pace, deal-breakers and lifestyle get organized behind the scenes as you talk, and you can review or edit any of it.",
  },
  {
    n: "3",
    title: "You get a short list, with reasons",
    body: "A handful of candidates each week, each with a plain-language explanation of where you'd likely click — and where you might not.",
  },
];

const transcript = [
  {
    from: "ai" as const,
    text: "Hi, I'm your TALISM matchmaker. Instead of asking you to swipe through hundreds of profiles, I'd like to understand what you're actually looking for. What does an ideal relationship look like to you?",
  },
  {
    from: "user" as const,
    text: "Someone I can build a life with — emotionally mature, wants kids eventually, takes commitment seriously.",
  },
  {
    from: "ai" as const,
    text: "That's helpful. You mentioned emotional maturity and long-term commitment. How important is marriage to you, and what kind of lifestyle would you like to build together?",
  },
];

export function ConversationShowcase() {
  return (
    <section id="how-it-works" className="border-t border-ink-line/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              How TALISM gets to know you
            </h2>
            <ol className="mt-10 space-y-8">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="font-display text-2xl text-brass">{s.n}</span>
                  <div>
                    <h3 className="font-medium">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-5 shadow-sm dark:bg-ink-raised">
            <div className="flex items-center gap-2.5 border-b border-ink-line/60 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass">
                <ThreadMark className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">TALISM Matchmaker</p>
                <p className="text-xs text-text-muted dark:text-text-on-ink-muted">
                  getting to know you
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {transcript.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.from === "ai"
                      ? "mr-8 rounded-2xl rounded-tl-sm bg-paper px-4 py-3 text-sm leading-relaxed dark:bg-ink"
                      : "ml-8 rounded-2xl rounded-tr-sm bg-garnet px-4 py-3 text-sm leading-relaxed text-white"
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
