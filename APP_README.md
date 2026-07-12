# Cadence

Real implementation of the `Cadence.dc.html` design (see `project/` and `chats/` for the original Claude Design handoff bundle).

## Stack

- React 18 + TypeScript + Vite
- React Router for navigation
- Supabase (auth + Postgres + storage) for the real, persisted parts of the app

## What's real vs. mocked

Per the design's own scope (social APIs, AI generation, and payments were always placeholders — see `chats/chat1.md`):

- **Real**: email/password + Google auth, user profiles, and the `videos` table (created via the Create flow, edited in the editor, listed on the dashboard/queue/calendar), all scoped per-user with Postgres RLS.
- **Mocked/placeholder** (matches the design prototype exactly): social OAuth connect (simulated, but the "connected" flag is persisted to your profile), the AI generation pipeline (animated, deterministic), analytics, billing/plans, team & roles, multi-workspace switching, referral program, trending ideas, and publication history — these are static/local data, ready to swap for real integrations later.

## Setup

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
```

Run the SQL in `supabase/migrations/0001_init.sql` against your Supabase project (via the SQL editor or `supabase db push`) to create the `profiles`/`videos` tables, RLS policies, and the `references` storage bucket.

If you want Google sign-in, enable the Google provider in Supabase Auth settings.

```bash
npm run dev       # start the dev server
npm run typecheck # tsc --noEmit
npm run build     # production build
```

Without a configured `.env`, the app still runs — use "Voir la démo sans compte" on the auth screen to explore the UI with in-memory state (nothing persists).
