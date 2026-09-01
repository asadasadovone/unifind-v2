-- Run this in Supabase SQL Editor once.
-- It creates a per-user JSON store used by the app to sync
-- My Programs, My Chats and Profile data across devices.

create table if not exists public.user_data (
  user_id uuid references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- Table privileges. RLS policies are only consulted *after* Postgres grants
-- the role access to the table at all, so without these the API returns
-- "permission denied for table user_data" and the policies never run.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.user_data to authenticated;

alter table public.user_data enable row level security;

drop policy if exists "user_data select own" on public.user_data;
drop policy if exists "user_data insert own" on public.user_data;
drop policy if exists "user_data update own" on public.user_data;
drop policy if exists "user_data delete own" on public.user_data;

create policy "user_data select own"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "user_data insert own"
  on public.user_data for insert
  with check (auth.uid() = user_id);

create policy "user_data update own"
  on public.user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_data delete own"
  on public.user_data for delete
  using (auth.uid() = user_id);
