-- Run this in your Supabase project's SQL Editor
-- Dashboard → SQL Editor → New Query → paste this → Run

-- Create the entries table
create table public.entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  date        date not null,
  had_headache  boolean not null default false,
  had_migraine  boolean not null default false,
  medication    text check (medication in ('triptan', 'naproxen', 'none')) default 'none',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),

  -- One entry per user per day
  unique (user_id, date)
);

-- Enable Row Level Security (users can only see their own data)
alter table public.entries enable row level security;

create policy "Users can read their own entries"
  on public.entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger entries_updated_at
  before update on public.entries
  for each row execute function update_updated_at();
