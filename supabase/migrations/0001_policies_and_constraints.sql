-- ValPay Roadmap Voting — RLS policies + constraints for your existing
-- `profiles`, `requests`, and `votes` tables.
--
-- This does NOT create the tables (you already have them) — it only adds
-- security policies and a couple of missing constraints. Everything here
-- is written to be safe to re-run (drops before creating, checks before
-- adding), so run it even if some of this is already in place.

-- ---------------------------------------------------------------------------
-- 0. Make sure `profiles.id` has a primary key / unique constraint — the
--    trigger below uses `ON CONFLICT (id)`, which requires one to exist.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'p'
  ) then
    alter table public.profiles add constraint profiles_pkey primary key (id);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 1. Prevent duplicate votes. Your `votes` table currently has no unique
--    constraint on (user_id, request_id), so the same user could vote for
--    the same request twice. The app's vote-toggle route already checks
--    for an existing vote first, but this is cheap insurance at the DB
--    level too.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'votes_user_id_request_id_key'
  ) then
    alter table public.votes
      add constraint votes_user_id_request_id_key unique (user_id, request_id);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.votes    enable row level security;

drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "Requests are viewable by authenticated users" on public.requests;
create policy "Requests are viewable by authenticated users"
  on public.requests for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can create their own requests" on public.requests;
create policy "Users can create their own requests"
  on public.requests for insert
  with check (auth.uid() = submitted_by);

drop policy if exists "Votes are viewable by authenticated users" on public.votes;
create policy "Votes are viewable by authenticated users"
  on public.votes for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can cast their own votes" on public.votes;
create policy "Users can cast their own votes"
  on public.votes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their own votes" on public.votes;
create policy "Users can remove their own votes"
  on public.votes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Restrict sign-ups to ValPay email addresses, and keep `profiles` in
--    sync with `auth.users`. This runs on every insert into auth.users
--    regardless of how the account was created (client signUp(), the
--    Admin API, etc.), so it's enforced even if the app-layer check is
--    bypassed. Adjust the allowed domains below if needed.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email !~* '^[^@\s]+@(valpay\.com|valsoftcorp\.com)$' then
    raise exception 'Sign up with a ValPay email address.';
  end if;

  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Helpful indexes (safe no-ops if they already exist).
-- ---------------------------------------------------------------------------
create index if not exists votes_request_id_idx on public.votes(request_id);
create index if not exists requests_created_at_idx on public.requests(created_at desc);
