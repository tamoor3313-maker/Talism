import { SiteNav } from "@/components/site-nav";
import { HeroConstellation } from "@/components/hero-constellation";
import { LinkButton } from "@/components/ui/button";
import { CompatibilityShowcase } from "@/components/marketing/compatibility-showcase";
import { ConversationShowcase } from "@/components/marketing/conversation-showcase";
import { SafetySection } from "@/components/marketing/safety-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-text-strong dark:bg-ink dark:text-text-on-ink">
      <SiteNav />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.1fr_1fr] md:items-center md:pb-28 md:pt-24">
        <div>
          <p className="text-sm text-garnet dark:text-brass-soft">
            AI matchmaking, not another swiping app
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Someone should actually get to know you first.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-text-muted dark:text-text-on-ink-muted">
            TALISM interviews you the way a thoughtful friend would, builds a
            real picture of what you want, and brings you a short list of
            people worth your time — with the reasoning shown.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton href="/onboarding" size="lg">
              Start the conversation
            </LinkButton>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 text-sm text-text-strong underline decoration-ink-line underline-offset-4 hover:decoration-garnet dark:text-text-on-ink"
            >
              See how it works
              <ArrowUpRight size={14} />
            </a>
          </div>
          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-ink-line/60 pt-6">
            {[
              ["18 min", "avg. first conversation"],
              ["6", "candidates per week, not 600"],
              ["71%", "request a second date"],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl">{stat}</dt>
                <dd className="mt-1 text-xs text-text-muted dark:text-text-on-ink-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative aspect-[4/3] w-full">
          <HeroConstellation />
        </div>
      </section>

      <ConversationShowcase />
      <CompatibilityShowcase />
      <SafetySection />
      <PricingSection />
      <SiteFooter />
    </div>
  );
}
