-- TALISM database schema (Supabase / PostgreSQL)
-- Run this in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ─────────────────────────────────────────────
-- Profiles (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  birthdate date,
  location text,
  bio text,
  relationship_goals text,
  values_list text[] default '{}',
  deal_breakers text[] default '{}',
  interests text[] default '{}',
  photo_url text,
  verified boolean default false,
  embedding vector(1024), -- generated from profile data via Voyage AI (voyage-2)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

create policy "users manage their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "users insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- Privacy / AI consent settings
-- ─────────────────────────────────────────────
create table if not exists privacy_settings (
  user_id uuid primary key references profiles (id) on delete cascade,
  remember_conversations boolean default true,
  use_messages_for_matching boolean default true,
  visible_in_discover boolean default true,
  allow_read_receipts boolean default false,
  updated_at timestamptz default now()
);

alter table privacy_settings enable row level security;

create policy "users manage their own privacy settings"
  on privacy_settings for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Matchmaker conversation history (per user, private)
-- ─────────────────────────────────────────────
create table if not exists matchmaker_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

alter table matchmaker_messages enable row level security;

create policy "users see only their own matchmaker history"
  on matchmaker_messages for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Matches — a computed compatibility pairing
-- ─────────────────────────────────────────────
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade,
  candidate_id uuid references profiles (id) on delete cascade,
  overall_score int check (overall_score between 0 and 100),
  category_scores jsonb, -- [{label, value, tier}]
  why_compatible text,
  discuss_points text[],
  status text check (status in ('suggested', 'liked', 'passed', 'matched')) default 'suggested',
  created_at timestamptz default now(),
  unique (user_id, candidate_id)
);

alter table matches enable row level security;

create policy "users see only their own matches"
  on matches for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users update their own match status"
  on matches for update
  to authenticated
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Conversations & messages (real-time chat between matched users)
-- ─────────────────────────────────────────────
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references profiles (id) on delete cascade,
  user_b uuid references profiles (id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_a, user_b)
);

alter table conversations enable row level security;

create policy "participants can see their conversation"
  on conversations for select
  to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations (id) on delete cascade,
  sender_id uuid references profiles (id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "participants can read messages in their conversation"
  on messages for select
  to authenticated
  using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id
      and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

create policy "participants can send messages in their conversation"
  on messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from conversations c
      where c.id = conversation_id
      and (c.user_a = auth.uid() or c.user_b = auth.uid())
    )
  );

-- ─────────────────────────────────────────────
-- Safety: blocks & reports
-- ─────────────────────────────────────────────
create table if not exists blocks (
  blocker_id uuid references profiles (id) on delete cascade,
  blocked_id uuid references profiles (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id)
);

alter table blocks enable row level security;

create policy "users manage their own blocks"
  on blocks for all
  to authenticated
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles (id) on delete cascade,
  reported_id uuid references profiles (id) on delete cascade,
  reason text not null,
  details text,
  status text check (status in ('open', 'reviewing', 'resolved')) default 'open',
  created_at timestamptz default now()
);

alter table reports enable row level security;

create policy "users can file reports"
  on reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "users can see reports they filed"
  on reports for select
  to authenticated
  using (auth.uid() = reporter_id);

-- ─────────────────────────────────────────────
-- Candidate retrieval by embedding similarity
-- ─────────────────────────────────────────────
create or replace function match_candidates(
  query_embedding vector(1024),
  match_user_id uuid,
  match_count int default 10
)
returns table (id uuid, similarity float)
language sql stable
as $$
  select
    p.id,
    1 - (p.embedding <=> query_embedding) as similarity
  from profiles p
  where p.id != match_user_id
    and p.embedding is not null
    and p.id not in (
      select blocked_id from blocks where blocker_id = match_user_id
      union
      select blocker_id from blocks where blocked_id = match_user_id
    )
  order by p.embedding <=> query_embedding
  limit match_count;
$$;

-- ─────────────────────────────────────────────
-- Subscriptions (Stripe)
-- ─────────────────────────────────────────────
create table if not exists subscriptions (
  user_id uuid primary key references profiles (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active', 'trialing', 'past_due', 'canceled', 'none')) default 'none',
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "users see their own subscription"
  on subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- service role (webhook handler) bypasses RLS by default via the service key

-- ─────────────────────────────────────────────
-- Admin flag (kept separate from profiles so it's never client-writable)
-- ─────────────────────────────────────────────
create table if not exists admins (
  user_id uuid primary key references profiles (id) on delete cascade,
  created_at timestamptz default now()
);

alter table admins enable row level security;
-- No policies defined = no client access at all. Only the service-role
-- client (used server-side in the admin routes) can read this table.

-- ─────────────────────────────────────────────
-- Profile photo storage
-- Run in the Supabase dashboard (Storage) or via the SQL editor:
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar images are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "users upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users update their own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
