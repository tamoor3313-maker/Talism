"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThreadMark } from "@/components/thread-mark";
import { Button, LinkButton } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type Archetype = {
  id: string;
  title: string;
  description: string;
  suggestedCourseTopic: string;
};

const archetypes: Record<string, Archetype> = {
  planner: {
    id: "planner",
    title: "The Planner",
    description:
      "You know what you want and you're not interested in wasting time. You value clarity, direct communication, and someone who takes commitment as seriously as you do.",
    suggestedCourseTopic: "Communication",
  },
  romantic: {
    id: "romantic",
    title: "The Romantic",
    description:
      "You lead with feeling — grand gestures, deep conversations, and a real belief that connection can't be rushed. You're looking for chemistry, not just compatibility on paper.",
    suggestedCourseTopic: "Confidence",
  },
  explorer: {
    id: "explorer",
    title: "The Explorer",
    description:
      "You're still figuring out what you actually want, and that's fine — you'd rather stay curious and meet different kinds of people than lock in too early.",
    suggestedCourseTopic: "Mindset",
  },
  steady: {
    id: "steady",
    title: "The Steady One",
    description:
      "You've been through enough to know what works and what doesn't. You're patient, a little guarded at first, and looking for something built to last rather than something exciting for a month.",
    suggestedCourseTopic: "Age-gap dating",
  },
};

type Question = {
  prompt: string;
  options: { label: string; archetype: string }[];
};

const questions: Question[] = [
  {
    prompt: "A first date goes well. What are you thinking on the way home?",
    options: [
      { label: "When can I see them again?", archetype: "planner" },
      { label: "I felt something rare there", archetype: "romantic" },
      { label: "Glad I went, curious what else is out there", archetype: "explorer" },
      { label: "Let's not rush this", archetype: "steady" },
    ],
  },
  {
    prompt: "Someone takes two days to reply to your text. You:",
    options: [
      { label: "Ask directly if they're still interested", archetype: "planner" },
      { label: "Write something a little vulnerable back", archetype: "romantic" },
      { label: "Shrug it off, you weren't sitting by the phone anyway", archetype: "explorer" },
      { label: "Wait it out, you've seen worse", archetype: "steady" },
    ],
  },
  {
    prompt: "Your ideal second date is:",
    options: [
      { label: "Something with a plan — dinner reservation, real conversation", archetype: "planner" },
      { label: "Something a little unexpected and memorable", archetype: "romantic" },
      { label: "Trying something neither of you has done before", archetype: "explorer" },
      { label: "Something low-key where you can actually talk", archetype: "steady" },
    ],
  },
  {
    prompt: "What matters most to you right now?",
    options: [
      { label: "Finding the person and building toward something real", archetype: "planner" },
      { label: "Feeling genuinely excited by someone again", archetype: "romantic" },
      { label: "Meeting different people without pressure", archetype: "explorer" },
      { label: "Getting it right this time", archetype: "steady" },
    ],
  },
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Archetype | null>(null);
  const [copied, setCopied] = useState(false);

  function answer(archetype: string) {
    const next = { ...scores, [archetype]: (scores[archetype] ?? 0) + 1 };
    setScores(next);

    if (step + 1 >= questions.length) {
      const winner = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0];
      setResult(archetypes[winner]);
    } else {
      setStep(step + 1);
    }
  }

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(
      `I got "${result?.title}" on TALISM's dating archetype quiz — ${url}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-paper text-text-strong dark:bg-ink dark:text-text-on-ink">
      <SiteNav />

      <div className="mx-auto max-w-lg px-6 py-14">
        {!result ? (
          <>
            <div className="mb-8 flex items-center gap-2.5">
              <ThreadMark className="h-6 w-6 text-garnet dark:text-brass" />
              <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
                Question {step + 1} of {questions.length}
              </p>
            </div>
            <h1 className="font-display text-2xl leading-snug">
              {questions[step].prompt}
            </h1>
            <div className="mt-6 space-y-2.5">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => answer(opt.archetype)}
                  className="block w-full rounded-2xl border border-ink-line/60 bg-paper-raised px-4 py-3 text-left text-sm transition-colors hover:border-garnet dark:bg-ink-raised dark:hover:border-brass"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-garnet dark:text-brass-soft">Your dating archetype is</p>
            <h1 className="mt-2 font-display text-4xl">{result.title}</h1>
            <p className="mt-4 text-sm leading-relaxed text-text-muted dark:text-text-on-ink-muted">
              {result.description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button onClick={share} variant="secondary" className="w-full">
                <Share2 size={14} />
                {copied ? "Copied!" : "Share your result"}
              </Button>
              <LinkButton href="/onboarding" className="w-full">
                Talk to the matchmaker
              </LinkButton>
              <Link
                href="/courses"
                className="text-sm text-garnet underline underline-offset-4 dark:text-brass"
              >
                See courses on {result.suggestedCourseTopic.toLowerCase()}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
