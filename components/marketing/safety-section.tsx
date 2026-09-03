import { ShieldCheck, Eye, Flag, Ban, Lock, UserCheck } from "lucide-react";

const items = [
  {
    icon: UserCheck,
    title: "Profile verification",
    body: "A quick verification step helps confirm people are who they say they are before you match.",
  },
  {
    icon: Ban,
    title: "Block anytime",
    body: "Blocking is immediate and mutual — a blocked person can't see your profile or reach you again.",
  },
  {
    icon: Flag,
    title: "Report in one tap",
    body: "Reports go to a human reviewer, not just a queue. Repeated or severe issues lead to removal.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-scam signals",
    body: "TALISM watches for common scam patterns — off-platform pushes, financial requests, love-bombing pacing — and flags them to you.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Your profile, conversations, and preferences are stored securely and never sold or exposed to third parties.",
  },
  {
    icon: Eye,
    title: "Consent for AI analysis",
    body: "You choose what your matchmaker is allowed to remember and use — and can revoke that access at any time.",
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="border-t border-ink-line/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-lg font-display text-3xl tracking-tight md:text-4xl">
          Built to be trusted with something this personal
        </h2>
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <Icon size={20} className="text-garnet dark:text-brass" />
                <h3 className="mt-3 font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
