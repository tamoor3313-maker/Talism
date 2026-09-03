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
