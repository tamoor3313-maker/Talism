import { candidates } from "@/lib/sample-data";
import { MatchCard } from "@/components/match-card";
import { ThreadMark } from "@/components/thread-mark";
import { LinkButton } from "@/components/ui/button";
import {
  Sparkles,
  MessageSquareText,
  MessagesSquare,
  CalendarHeart,
  Shirt,
  Wand2,
} from "lucide-react";

const coachCards = [
  { href: "/coach/bio-builder", icon: Wand2, title: "Improve My Profile", desc: "Rewrite your bio in the tone that fits you" },
  { href: "/coach/what-to-say", icon: MessageSquareText, title: "What Should I Text?", desc: "Get help with a specific message" },
  { href: "/coach/conversation", icon: MessagesSquare, title: "Analyze My Conversation", desc: "Paste a chat, get reply options" },
  { href: "/coach/planner", icon: CalendarHeart, title: "Plan a Date", desc: "Ideas that fit your budget and vibe" },
  { href: "/coach/style", icon: Shirt, title: "What Should I Wear?", desc: "Outfit advice for any kind of date" },
  { href: "/coach/profile-review", icon: Sparkles, title: "Ask the Dating Coach", desc: "Get your existing profile reviewed" },
];

export default function HomePage() {
  const top = candidates[0];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl tracking-tight">Good afternoon, Jordan</h1>
      <p className="mt-1.5 text-text-muted dark:text-text-on-ink-muted">
        Your matchmaker found 3 people worth a look this week.
      </p>

      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass">
          <ThreadMark className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm leading-relaxed">
            <span className="font-medium">{top.name}</span> stood out this
            week — you both want kids within a few years and described
            near-identical ideas of emotional maturity. Worth a conversation.
          </p>
          <LinkButton href={`/match/${top.id}`} size="sm" className="mt-3">
            See why you match
          </LinkButton>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl">Your dating coach</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coachCards.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-ink-line/60 bg-paper-raised p-5 transition-shadow hover:shadow-md dark:bg-ink-raised"
            >
              <Icon size={19} className="text-garnet dark:text-brass" />
              <h3 className="mt-3 font-medium">{c.title}</h3>
              <p className="mt-1 text-sm text-text-muted dark:text-text-on-ink-muted">
                {c.desc}
              </p>
            </a>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl">Recommended for you</h2>
        <a href="/discover" className="text-sm text-garnet dark:text-brass">
          See all
        </a>
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {candidates.map((c) => (
          <MatchCard key={c.id} candidate={c} />
        ))}
      </div>
    </div>
  );
}
