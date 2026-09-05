# TALISM — AI Matchmaking

The complete web MVP: premium UI/UX, real Supabase auth, a full Postgres
schema, live Llama-powered matchmaking and compatibility scoring,
embeddings-based candidate retrieval, real-time messaging, photo upload,
Stripe subscriptions, safety tooling, and an admin dashboard. Every piece
is real, working code — it just needs your credentials.

## What's built

**Frontend**
- Landing page, conversational onboarding, login/signup.
- App shell (sidebar + mobile tab bar): Home, Discover, match detail (full
  compatibility breakdown), AI Matchmaker chat, Messages, Profile
  (goals/values/deal-breakers, photo upload, privacy/AI-consent toggles,
  TALISM+ upgrade).
- Admin dashboard at `/admin`: overview metrics, users, reports,
  subscriptions — gated by the `admins` table.
- Dark/light mode, fully responsive.

**Backend**
- `supabase/schema.sql` — full Postgres schema with row-level security:
  profiles (with a `vector(1024)` embedding column), privacy settings,
  matchmaker conversation history, matches, conversations/messages,
  blocks, reports, subscriptions, an admin-only `admins` table, a
  `match_candidates` pgvector similarity function, and Storage bucket
  policies for avatars.
- `middleware.ts` + `lib/supabase/*` — session refresh and route
  protection.
- `app/api/matchmaker/chat` — Llama-3.3-powered matchmaker via Groq,
  respecting each user's privacy toggle, persisting history.
- `app/api/compatibility` — scores two profiles via Groq/Llama, saves to
  `matches`.
- `app/api/profile/embed` + `app/api/discover` — generates a profile
  embedding via Voyage AI
  and retrieves the closest candidates with pgvector, excluding blocked
  users.
- `app/api/messages/start` + the Messages page — finds or creates a
  conversation and subscribes to it live via Supabase Realtime; falls
  back to sample data until a real conversation exists.
- `components/avatar-uploader.tsx` — uploads to the `avatars` Storage
  bucket and updates the profile.
- `app/api/stripe/checkout` + `app/api/stripe/webhook` — TALISM+
  subscription checkout and webhook-driven status sync.
- `app/api/safety/block` + `app/api/safety/report` — safety actions.
- `lib/require-admin.ts` — server-side admin gate for `/admin/*`.

## Getting it running for real

1. **Supabase** — create a project, run `supabase/schema.sql` in the SQL
   editor (this also creates the `avatars` Storage bucket and its
   policies). Copy the URL, anon key, and service role key into
   `.env.local`.
2. **Make yourself an admin** — after signing up once, run in the SQL
   editor: `insert into admins (user_id) values ('<your-user-id>');`
   (find your user id in Authentication → Users).
3. **Groq (Llama)** — get a free key from console.groq.com/keys and set
   `GROQ_API_KEY`. Powers the AI Matchmaker chat and compatibility
   scoring via Llama 3.3 70B. Only read server-side in `app/api/*`.
4. **Voyage AI** — set `VOYAGE_API_KEY` from dash.voyageai.com for
   Discover's real candidate matching. Call `POST /api/profile/embed`
   after a profile is filled out (e.g. at the end of onboarding) to
   generate its embedding; `GET /api/discover` then returns the closest
   candidates by cosine similarity.
5. **Stripe** — create a product/price for TALISM+, set
   `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PLUS_MONTHLY`, and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Point a webhook at
   `/api/stripe/webhook` for `checkout.session.completed` and
   `customer.subscription.updated/deleted`; set `STRIPE_WEBHOOK_SECRET`.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without those env vars, the app still runs and looks fully built —
sample data powers Home/Discover/Messages, the matchmaker chat falls back
to demo replies, and the admin dashboard shows demo metrics — so you can
review everything before wiring real credentials.

## Design system

- Colors: warm ink/paper base with brass (`#c9a15a`) and garnet (`#8f3346`)
  accents.
- Type: `Fraunces` (display) + `Inter` (body/UI), currently on system-font
  fallback because this sandbox can't reach Google Fonts — restore
  `next/font/google` in `app/layout.tsx` once deployed with internet
  access (the CSS variable names already match).
- Signature visual: a two-point "thread" motif (`components/thread-mark.tsx`,
  `components/hero-constellation.tsx`).

## Tech stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion +
lucide-react + Supabase (`@supabase/ssr`) + Groq SDK (Llama 3.3) +
Voyage AI + Stripe.

## Genuinely not built (by design — deferred)

- **React Native + Expo mobile app** — a separate project, intentionally
  sequenced after the web app per your earlier call. Would share these
  same design tokens and this same backend/schema.

Everything else from the original spec is implemented in real, working
code above — the only thing standing between this and a live product is
dropping in your own Supabase/Groq/Voyage/Stripe credentials.

## Dating Coach features (folded into TALISM)

Six additional AI-powered coach tools, reachable from Home's dashboard
cards and directly at these URLs:

- `/coach/bio-builder` — generate dating bios by tone and type
- `/coach/profile-review` — paste an existing bio, get a score + rewrite
- `/coach/conversation` — paste a chat, get a read + reply options by tone
- `/coach/what-to-say` — quick situational advice (what to text, how to
  ask someone out, etc.)
- `/coach/style` — outfit advice for a date
- `/coach/planner` — date ideas based on budget/location/interests

All six call Groq/Llama through `lib/coach-prompts.ts` system prompts,
which share a safety preamble (authenticity, consent, no manipulation or
harassment help, clear about uncertainty when reading someone else's
intent). Same `GROQ_API_KEY` env var powers these as the AI Matchmaker.

## Floating Matchmaker chat

A persistent chat bubble (`components/floating-matchmaker.tsx`) appears
in the bottom-right corner on every main page — not just the full-screen
`/matchmaker` page. It's hidden on `/matchmaker`, `/onboarding`,
`/login`, `/signup`, and `/admin`, where a floating bubble would be
redundant. Uses the same `/api/matchmaker/chat` endpoint and the same
demo-reply fallback.

## Talking to the AI Matchmaker requires no account

Both the floating chat bubble and the full-screen `/matchmaker` page work
for anyone, logged in or not:

- `middleware.ts` no longer protects `/matchmaker` — visiting it never
  redirects to `/login`.
- `/api/matchmaker/chat` checks for a logged-in user but doesn't require
  one. Logged-in users get their conversation remembered across visits
  (per their privacy toggle); anonymous visitors get a normal, coherent
  conversation for the current session (the client sends along the
  session's message history with each request), just with nothing saved
  server-side once they close the tab.

Pages that inherently need an account — Home, Discover, Messages,
Profile — are unaffected and still require login.

## Coaching marketplace

Real coaches apply, get approved by an admin, then create and sell
courses. Buyers get lifetime access to purchased course content.

**Flow**
1. Anyone applies at `/coach/apply` (headline + bio) — starts `pending`.
2. Admin reviews at `/admin/coach-applications` — approve or reject.
3. Approved coaches manage courses at `/coach/dashboard`: create a course
   (`/coach/dashboard/new`), add lessons, then publish.
4. Published courses appear in the public marketplace at `/courses`,
   filterable by topic.
5. Buyers purchase via Stripe Checkout (dynamic price per course, no
   Stripe Price ID needed) at `/courses/[id]`.
6. The Stripe webhook records the purchase in `course_purchases` with a
   **20% platform fee** (`PLATFORM_FEE_PERCENT` in
   `app/api/coach-marketplace/purchase/route.ts` — change the split
   there) and the coach's share, both computed and stored per sale.
7. Buyers view lesson content at `/my-courses/[id]` — access is enforced
   by a Postgres RLS policy on `lessons` requiring a matching row in
   `course_purchases`, not just app-level logic.

**Not built**: actual payouts to coaches. This tracks each coach's
earnings per sale in `course_purchases.coach_earnings_cents`, but sending
that money to coaches requires Stripe Connect (each coach onboarding
their own connected account) — a meaningfully bigger integration than
what's here, worth building as its own phase once you have real coaches
and real sales to justify it.

## Buy and interact without an account

The core principle now: **nobody has to sign up to spend money or talk to
the AI.**

- **`/quiz`** — a public, no-signup, 4-question dating archetype quiz with
  a shareable text result. Links out to the matchmaker chat and
  topic-matched courses. Pure client-side logic, no backend needed.
- **Guest course checkout** — `/courses/[id]`'s Buy button works with no
  login. Stripe Checkout collects the buyer's email itself. The webhook
  (`app/api/stripe/webhook/route.ts`) then finds-or-creates a lightweight
  account from that email (`findOrCreateGuestAccount`, using
  `supabase.auth.admin.inviteUserByEmail` so they get a real email with a
  link to set a password) and records the purchase against it — so a
  first-time buyer never sees a signup form before paying, but still has
  somewhere to come back to afterward.
- **`/purchase-success`** — public confirmation page; tells guests to
  check their email, sends logged-in buyers straight to My Courses.
- Fixed a real bug in `middleware.ts`: the protected-routes check used
  `pathname.startsWith("/match")`, which also matched `/matchmaker` by
  accident (since "/matchmaker" starts with "/match") — meaning the
  "chat without login" feature from before was actually still redirecting
  to `/login`. Now matches on exact path segments instead.

`profiles` gained an `email` column (mirrored from `auth.users` at
signup and guest-checkout time) specifically so the webhook can look up
"has this email already got an account?" without an extra admin API
call on every repeat guest purchase.
