# ValPay Roadmap Voting

Next.js 14 (App Router) + TypeScript app for voting on ValPay roadmap
requests, backed by **Supabase** (Postgres + Auth) and deployable on
**Vercel**.

Real authentication (email + password, restricted to `@valpay.com` /
`@valsoftcorp.com` addresses), real persistence, and row-level security —
no more `localStorage`-based fake auth.

## Stack

- **Next.js 14** App Router, TypeScript, single client page (`app/page.tsx`)
- **Supabase Auth** for sign-up/login (email + password)
- **Supabase Postgres** for roadmap requests + votes, protected by Row Level
  Security policies
- **`@supabase/ssr`** for cookie-based sessions across Server/Client
  Components, Route Handlers, and middleware

## 1. Point this app at your existing Supabase project

This app was wired up against your existing `profiles`, `requests`, and
`votes` tables — no tables are created by this repo. Schema assumed:

- `profiles`: `id uuid` (PK, matches `auth.users.id`), `email text`
- `requests`: `id text` (no default — the app generates one per insert),
  `title text`, `description text`, `status text`, `urgency text`,
  `gmv_label text`, `gmv_value numeric`, `partner text`,
  `categories text[]`, `audience text[]`, `primary_category text`,
  `compliance boolean`, `submitted_by uuid` (nullable, references
  `profiles.id`), `created_at timestamptz`
- `votes`: `user_id uuid`, `request_id text`, `created_at timestamptz`

In the Supabase **SQL Editor**, run
[`supabase/migrations/0001_policies_and_constraints.sql`](supabase/migrations/0001_policies_and_constraints.sql).
It doesn't create or touch your existing tables' columns — it only adds:

- A unique constraint on `votes(user_id, request_id)` (your table had none,
  so nothing currently stops a duplicate vote)
- Row Level Security policies: any signed-in user can read `profiles` /
  `requests` / `votes`; users can only insert their own requests/votes
- A trigger on `auth.users` that **rejects sign-ups from outside
  `@valpay.com` / `@valsoftcorp.com`**, enforced in the database regardless
  of how the account was created
- A couple of indexes

It's written to be safe to re-run (drops-then-creates policies, checks
before adding constraints), in case some of this is already in place.

If your actual column names/types differ from the above, the API routes in
`app/api/requests/route.ts` and `app/api/requests/[id]/vote/route.ts` will
need matching updates — they talk to `requests`/`votes`/`profiles` with the
exact column names listed here.

In **Authentication → Providers → Email**, decide whether "Confirm email"
is on or off:
- **On** (default): new users get a confirmation email before they can log
  in. `app/signup/page.tsx` already handles this ("Check your email"
  screen).
- **Off**: signups get a session immediately.

## 2. Configure environment variables

Find your **Project URL**, **anon public** key, and **service_role** key in
**Project Settings → API**, then:

```
cp .env.example .env.local
cp .env.example .env       # scripts/seed.ts loads this one (outside Next.js)
```

Fill in the three values from step 1. `SUPABASE_SERVICE_ROLE_KEY` is only
used by the seed script — never expose it to the browser, and don't set it
in Vercel's client-exposed env vars.

## 3. Install, seed, run

```
npm install
npm run db:seed   # loads the 103 legacy roadmap requests + demo user accounts
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

The seed script creates demo accounts for the existing ValPay team roster
(see `DEMO_USERS` in `scripts/seed.ts`), all with the password
`ValPayRoadmap!2026`. Log in with any of those and use **Change password**
(top-right menu) to set a real one, or just sign up fresh via `/signup`.

## 4. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
   Vercel environment variables (Project Settings → Environment Variables).
   Do **not** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel — run the seed
   script locally/once, not from the deployed app.
3. Deploy. `middleware.ts` handles session refresh + route protection
   automatically on Vercel's edge runtime.

## Structure

- `app/page.tsx` — the whole authenticated app (feed, sort tabs, compliance
  filter, search, pagination, submit modal, detail modal, password-change
  modal, theme toggle, particle effects, Q3 roadmap tab). Talks to the API
  routes below instead of `localStorage`.
- `app/login/page.tsx`, `app/signup/page.tsx` — Supabase email/password
  auth screens (public routes).
- `app/api/requests/route.ts` — `GET` lists requests with vote
  counts/voters; `POST` creates a request (auto-casts the submitter's vote).
- `app/api/requests/[id]/vote/route.ts` — `POST` toggles the current user's
  vote on a request.
- `lib/supabase/client.ts` — browser Supabase client (Client Components).
- `lib/supabase/server.ts` — server Supabase client (Route Handlers),
  reads/writes the session via cookies so RLS sees the real caller.
- `lib/supabase/middleware.ts` + `middleware.ts` — refreshes the session
  cookie on every request and redirects unauthenticated visitors to
  `/login` (API routes are exempt — they return their own 401s).
- `supabase/migrations/0001_policies_and_constraints.sql` — RLS policies,
  the vote-uniqueness constraint, and the domain-restriction trigger for
  your existing tables. Safe to re-run.
- `scripts/seed.ts` — one-time data migration (legacy requests + demo
  users), upserted by id so it's safe to re-run. Requires
  `SUPABASE_SERVICE_ROLE_KEY`.
- `data/requests-data.ts` — the 103 seed roadmap requests (ported from the
  original Notion export), only imported by the seed script now.
- `public/assets/`, `public/fonts/`, `styles/design-system.css` — ValPay
  design system, unchanged from the original prototype.

## Notes

- Password changes (`app/page.tsx` → "Change password") re-verify the
  current password with a fresh `signInWithPassword` call before calling
  Supabase's `auth.updateUser()`, since that API trusts the existing
  session and doesn't ask for the old password on its own.
- All 103 legacy requests were seeded with 0 votes (matching the source
  data) and `submitted_by = null` (no real account to attribute them to),
  so they'll show "Unknown" as the submitter in the detail modal until
  someone re-submits them for real. Every vote/voter you see after
  seeding reflects a real vote cast through the app.
- `next` is pinned to `14.2.35` (the patched line for the December 2025
  Next.js/React Server Components CVEs). `npm audit` may still show
  advisories against a broad Next.js version range; those don't apply to
  App Router usage on 14.2.35, but keep an eye on
  https://nextjs.org/blog for future patches.
