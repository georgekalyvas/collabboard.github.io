-- Supabase schema for CollabBoard
-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Boards
create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.boards enable row level security;

-- Create index for faster board lookups
create index if not exists idx_boards_created_by on public.boards(created_by);

-- Participants
create table if not exists public.participants (
  id bigserial primary key,
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin','member')),
  online boolean not null default false,
  last_seen timestamptz not null default now(),
  joined_at timestamptz not null default now(),
  unique(board_id, user_id)
);
alter table public.participants enable row level security;

-- Items (agenda items)
create table if not exists public.items (
  id bigserial primary key,
  board_id uuid not null references public.boards(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  meta jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.items enable row level security;

-- Votes
create table if not exists public.votes (
  id bigserial primary key,
  item_id bigint not null references public.items(id) on delete cascade,
  participant_id bigint not null references public.participants(id) on delete cascade,
  choice text not null,
  created_at timestamptz not null default now(),
  unique(item_id, participant_id)
);
alter table public.votes enable row level security;

-- RLS Policies
-- Boards: only participants can select, only creator (admin) can update/delete (simplified)
create policy if not exists boards_select on public.boards
for select using (
  created_by = auth.uid() or
  exists(
    select 1 from public.participants p
    where p.board_id = boards.id and p.user_id = auth.uid()
  )
);

create policy if not exists boards_insert on public.boards
for insert with check (created_by = auth.uid());

create policy if not exists boards_update on public.boards
for update using (created_by = auth.uid());

create policy if not exists boards_delete on public.boards
for delete using (created_by = auth.uid());

-- Participants: users can see rows for boards they are on; insert their own row; update their own row
create policy if not exists participants_select on public.participants
for select using (
  exists(
    select 1 from public.participants me
    where me.board_id = participants.board_id and me.user_id = auth.uid()
  )
);

create policy if not exists participants_insert on public.participants
for insert with check (user_id = auth.uid());

create policy if not exists participants_update on public.participants
for update using (user_id = auth.uid());

-- Items: participants of a board can select; only admins can insert/update/delete
create policy if not exists items_select on public.items
for select using (
  exists(
    select 1 from public.participants me
    where me.board_id = items.board_id and me.user_id = auth.uid()
  )
);

create policy if not exists items_insert on public.items
for insert with check (
  exists(
    select 1 from public.participants me
    where me.board_id = items.board_id and me.user_id = auth.uid() and me.role = 'admin'
  )
);

create policy if not exists items_update on public.items
for update using (
  exists(
    select 1 from public.participants me
    where me.board_id = items.board_id and me.user_id = auth.uid() and me.role = 'admin'
  )
);

create policy if not exists items_delete on public.items
for delete using (
  exists(
    select 1 from public.participants me
    where me.board_id = items.board_id and me.user_id = auth.uid() and me.role = 'admin'
  )
);

-- Votes: participants of a board can read; participants can upsert only their own vote
create policy if not exists votes_select on public.votes
for select using (
  exists(
    select 1 from public.participants me
    join public.items i on i.id = votes.item_id
    where me.board_id = i.board_id and me.user_id = auth.uid()
  )
);

create policy if not exists votes_insert on public.votes
for insert with check (
  exists(
    select 1 from public.participants me
    where me.id = votes.participant_id and me.user_id = auth.uid()
  )
);

create policy if not exists votes_update on public.votes
for update using (
  exists(
    select 1 from public.participants me
    where me.id = votes.participant_id and me.user_id = auth.uid()
  )
);

create policy if not exists votes_delete on public.votes
for delete using (
  exists(
    select 1 from public.participants me
    where me.id = votes.participant_id and me.user_id = auth.uid()
  )
);

-- Realtime: supabase realtime requires replica identity full for tables with updates; on supabase this is handled automatically.
