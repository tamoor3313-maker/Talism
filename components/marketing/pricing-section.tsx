import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "",
    description: "Get matched and see how TALISM thinks.",
    features: [
      "Conversational onboarding",
      "1 curated match per week",
      "Compatibility breakdown",
      "Basic messaging",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "TALISM+",
    price: "$29",
    cadence: "/month",
    description: "For people serious about finding the right person.",
    features: [
      "6 curated matches per week",
      "Full AI matchmaker access, anytime",
      "Conversation coaching & date planning",
      "See who's interested first",
      "Priority profile review",
    ],
    cta: "Start TALISM+",
    featured: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-ink-line/60 bg-paper-raised py-20 dark:bg-ink-raised/40 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Simple pricing
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.featured
                  ? "rounded-2xl border-2 border-garnet bg-paper p-8 dark:border-brass dark:bg-ink"
                  : "rounded-2xl border border-ink-line/60 bg-paper p-8 dark:bg-ink"
              }
            >
              <h3 className="font-medium">{tier.name}</h3>
              <p className="mt-3 font-display text-4xl">
                {tier.price}
                <span className="font-sans text-base text-text-muted dark:text-text-on-ink-muted">
                  {tier.cadence}
                </span>
              </p>
              <p className="mt-2 text-sm text-text-muted dark:text-text-on-ink-muted">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-garnet dark:text-brass" />
                    {f}
                  </li>
                ))}
              </ul>
              <LinkButton
                href="/onboarding"
                variant={tier.featured ? "primary" : "secondary"}
                className="mt-8 w-full"
              >
                {tier.cta}
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
