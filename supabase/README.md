# Backend

The app talks to one Supabase project. The anon key in `app.js` is a public
identifier, not a secret — it gets a request past the gateway and nothing more.
Anything that must not be forged goes through an Edge Function holding the
service-role key.

| Piece | Table | Who can read it | Who can write it |
|---|---|---|---|
| Community content | `content` | anyone with the anon key | anyone with the anon key ⚠️ |
| Push subscriptions | `push_subscriptions` | anon | anon |
| Quiz results | `quiz_scores` | **nobody** via the API | `submit-quiz-score` only |
| Public board | `quiz_leaderboard_public` (view) | anon, read-only | — |
| Time reports | `prayer_time_reports` | **nobody** via the API | `report-prayer-time` only |

⚠️ The `content` row is pre-existing and not something this change introduced,
but it is worth stating plainly: the in-app admin screen is a client-side gate,
so anyone who reads `app.js` can rewrite community content. See *Known gaps*.

## Deploying

Nothing below is applied automatically — the leaderboard and reporting features
degrade to a labelled error state until it is.

```bash
supabase link --project-ref zwpimotdtuhbpwjcooiz

# 1. tables, indexes, RLS and the public view
supabase db push        # or paste migrations/0001_quiz_leaderboard_and_reports.sql

# 2. secrets (see below)
supabase secrets set ABI_INSTALL_PEPPER="$(openssl rand -hex 32)"

# 3. the two functions. --no-verify-jwt because there are no accounts:
#    the functions do their own validation and rate limiting.
supabase functions deploy submit-quiz-score --no-verify-jwt
supabase functions deploy report-prayer-time --no-verify-jwt
```

Each function is a single self-contained file with no relative imports. That is
deliberate: an import reaching outside the function's own directory is the usual
reason one deploys successfully and then answers 502. The cost is that the
scoring and display-name rules exist twice — here and in `app.js` — and must be
changed together. `test/unit.js` covers the browser copy.

**Checking a deploy landed.** A 404 means the function is not there; a 502 means
it is there but failed to boot, and `supabase functions logs <name>` will say
why. A healthy function answers a `{}` POST with a 400 from its own validator:

```bash
curl -s -X POST "$SB/functions/v1/submit-quiz-score" \
  -H "apikey: $ANON" -H "Content-Type: application/json" -d '{}'
# {"error":"bad_attempt_id"}
```

## Environment variables

| Name | Used by | Notes |
|---|---|---|
| `SUPABASE_URL` | all functions | injected by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | all functions | injected by Supabase. Never ship this to a client |
| `ABI_INSTALL_PEPPER` | `submit-quiz-score`, `report-prayer-time` | set once, never rotate casually — changing it orphans every stored install hash, so every installation gets a fresh "best result" |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | `send-push` | pre-existing |

## Reviewing reports

`prayer_time_reports` is deliberately unreadable through the API. Review it in
the Supabase dashboard, which has real authentication in front of it. The in-app
admin screen is not a safe place to surface it — see below.

## Known gaps

- **Admin authentication is client-side.** Until it is real, any endpoint that
  exposes private data to "the admin" would in fact expose it to everyone. That
  is why reports are dashboard-only and why moderation (`quiz_scores.hidden`) is
  a database column rather than an in-app button.
- **`content` is world-writable with the anon key.** Fixing this needs RLS on
  `content` plus an authenticated write path, which is the same piece of work as
  the point above.
