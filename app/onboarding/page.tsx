"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThreadMark } from "@/components/thread-mark";
import { Send } from "lucide-react";

type Step = {
  prompt: string;
  placeholder: string;
};

const steps: Step[] = [
  {
    prompt:
      "Hi, I'm your TALISM matchmaker. Instead of asking you to swipe through hundreds of profiles, I'd like to understand what you're actually looking for. What does an ideal relationship look like to you?",
    placeholder: "Take your time...",
  },
  {
    prompt:
      "That's helpful. How important is marriage to you, and what kind of lifestyle would you like to build with your partner?",
    placeholder: "Marriage, kids, day-to-day life...",
  },
  {
    prompt:
      "Good to know. What are one or two things that would be dealbreakers for you — not preferences, but genuine dealbreakers?",
    placeholder: "Be specific if you can...",
  },
  {
    prompt:
      "Last one for now: how do you like to spend a weekend when nothing's planned?",
    placeholder: "Painting a picture of your ideal weekend...",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<{ prompt: string; answer: string }[]>([]);

  const done = stepIndex >= steps.length;
  const current = steps[stepIndex];

  function submit() {
    if (!answer.trim()) return;
    setHistory((h) => [...h, { prompt: current.prompt, answer }]);
    setAnswer("");
    setStepIndex((i) => i + 1);
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper dark:bg-ink">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
        <div className="mb-8 flex items-center gap-2.5">
          <ThreadMark className="h-6 w-6 text-garnet dark:text-brass" />
          <span className="font-display text-lg text-text-strong dark:text-text-on-ink">
            TALISM
          </span>
        </div>

        {!done && (
          <div className="mb-6 flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= stepIndex ? "bg-garnet dark:bg-brass" : "bg-ink-line/40"
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex-1 space-y-5">
          {history.map((h, i) => (
            <div key={i} className="space-y-2.5">
              <div className="mr-8 rounded-2xl rounded-tl-sm bg-paper-raised px-4 py-3 text-sm leading-relaxed text-text-strong dark:bg-ink-raised dark:text-text-on-ink">
                {h.prompt}
              </div>
              <div className="ml-8 rounded-2xl rounded-tr-sm bg-garnet px-4 py-3 text-sm leading-relaxed text-white dark:bg-brass dark:text-ink">
                {h.answer}
              </div>
            </div>
          ))}

          {!done && (
            <div className="mr-8 rounded-2xl rounded-tl-sm bg-paper-raised px-4 py-3 text-sm leading-relaxed text-text-strong dark:bg-ink-raised dark:text-text-on-ink">
              {current.prompt}
            </div>
          )}

          {done && (
            <div className="rounded-2xl border border-ink-line/60 bg-paper-raised p-6 text-center dark:bg-ink-raised">
              <p className="font-display text-xl text-text-strong dark:text-text-on-ink">
                That's a great start
              </p>
              <p className="mt-2 text-sm text-text-muted dark:text-text-on-ink-muted">
                Your matchmaker will keep learning as you go. Your profile is
                already taking shape — you can review or edit anything it's
                picked up on.
              </p>
              <button
                onClick={() => router.push("/home")}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-text-on-ink dark:bg-brass dark:text-ink"
              >
                See my matches
              </button>
            </div>
          )}
        </div>

        {!done && (
          <div className="mt-8 flex items-center gap-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={current.placeholder}
              rows={2}
              className="w-full resize-none rounded-2xl border border-ink-line/60 bg-paper-raised px-4 py-3 text-sm outline-none focus:border-garnet dark:bg-ink-raised dark:focus:border-brass"
            />
            <button
              onClick={submit}
              aria-label="Send"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-text-on-ink dark:bg-brass dark:text-ink"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
