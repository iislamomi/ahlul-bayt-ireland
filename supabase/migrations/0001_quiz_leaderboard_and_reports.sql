-- ─────────────────────────────────────────────────────────────────────────────
-- 0001  Quiz leaderboard + prayer-time reports
--
-- Both tables are closed to the anon key. Everything the app writes goes through
-- an Edge Function holding the service-role key, because the anon key ships in
-- app.js and anything anon can write, anyone can forge. The only thing anon may
-- read is a view that has already dropped the install hash and the hidden rows.
--
-- Apply with:  supabase db push       (or paste into the SQL editor)
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ── quiz_scores ──────────────────────────────────────────────────────────────
-- Every accepted attempt is kept: retakes are allowed, `best` marks the one that
-- represents an installation on the public board, and the rest are what the rate
-- limiter counts. Nothing here identifies a person — display_name is chosen by
-- the participant and install_hash is a peppered digest, never the raw id.
create table if not exists public.quiz_scores (
  id            uuid primary key default gen_random_uuid(),
  attempt_id    text        not null unique,           -- client-generated; the idempotency key
  quiz_id       text        not null check (char_length(quiz_id) between 1 and 64),
  difficulty    text        not null check (difficulty in ('easy', 'medium', 'hard')),
  display_name  text        not null check (char_length(display_name) between 2 and 20),
  score         integer     not null check (score >= 0 and score <= 100000),
  correct       integer     not null check (correct >= 0),
  total         integer     not null check (total > 0 and total <= 100),
  duration_ms   integer     not null check (duration_ms >= 0 and duration_ms <= 3600000),
  install_hash  text        not null check (char_length(install_hash) = 64),
  completed     boolean     not null default true,
  best          boolean     not null default false,
  hidden        boolean     not null default false,    -- administrator moderation
  hidden_reason text,
  client_score  integer,                               -- what the browser claimed, for auditing
  submitted_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  constraint quiz_scores_correct_within_total check (correct <= total)
);

-- one "best" row per installation per board, enforced by the database rather
-- than by whoever remembers to clear the old flag
create unique index if not exists quiz_scores_best_per_install
  on public.quiz_scores (quiz_id, difficulty, install_hash)
  where best;

-- the leaderboard's own ordering, so the top-20 query never sorts the table
create index if not exists quiz_scores_board
  on public.quiz_scores (quiz_id, difficulty, score desc, correct desc, duration_ms asc, submitted_at asc)
  where best and not hidden;

-- what the rate limiter asks: how many attempts from this installation lately
create index if not exists quiz_scores_install_recent
  on public.quiz_scores (install_hash, submitted_at desc);

alter table public.quiz_scores enable row level security;
-- deliberately no policies: anon and authenticated get nothing. The Edge
-- Function uses the service-role key, which bypasses RLS.

-- ── the only public surface ──────────────────────────────────────────────────
-- No install_hash, no hidden rows, no client_score, no answers. security_invoker
-- stays off so the view runs as its owner and can read past the RLS above.
create or replace view public.quiz_leaderboard_public
with (security_invoker = off) as
  select
    id,
    quiz_id,
    difficulty,
    display_name,
    score,
    correct,
    total,
    duration_ms,
    submitted_at
  from public.quiz_scores
  where best and not hidden;

grant select on public.quiz_leaderboard_public to anon, authenticated;

-- ── prayer_time_reports ──────────────────────────────────────────────────────
-- Write-only from the app, and not readable by anon at all: a report is a note
-- to the administrators, not community content. Reviewed in the Supabase
-- dashboard, which has real authentication behind it — unlike the app's own
-- admin screen, which is a client-side gate only.
create table if not exists public.prayer_time_reports (
  id            uuid primary key default gen_random_uuid(),
  report_id     text        not null unique,
  location_id   text        not null check (char_length(location_id) <= 64),
  location_name text        not null check (char_length(location_name) <= 80),
  prayer        text        not null check (prayer in ('Fajr', 'Sunrise', 'Dhuhr', 'Sunset', 'Maghrib', 'Midnight')),
  shown_time    text        check (shown_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  expected_time text        check (expected_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  note          text        check (char_length(note) <= 500),
  time_source   text        check (time_source in ('live', 'cached', 'preset', 'fallback')),
  app_date      date,
  install_hash  text        check (char_length(install_hash) = 64),
  status        text        not null default 'new' check (status in ('new', 'reviewing', 'resolved', 'dismissed')),
  admin_note    text,
  created_at    timestamptz not null default now()
);

create index if not exists prayer_time_reports_triage
  on public.prayer_time_reports (status, created_at desc);

create index if not exists prayer_time_reports_install_recent
  on public.prayer_time_reports (install_hash, created_at desc);

alter table public.prayer_time_reports enable row level security;
-- again no policies: service role only.
