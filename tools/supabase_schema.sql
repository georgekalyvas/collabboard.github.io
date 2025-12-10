-- Supabase CollabBoard schema (idempotent)

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Boards
CREATE TABLE IF NOT EXISTS public.boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- Create index for faster board lookups
CREATE INDEX IF NOT EXISTS idx_boards_created_by ON public.boards(created_by);

-- Participants
CREATE TABLE IF NOT EXISTS public.participants (
  id bigserial PRIMARY KEY,
  board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','member')),
  online boolean NOT NULL DEFAULT false,
  last_seen timestamptz NOT NULL DEFAULT now(),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(board_id, user_id)
);
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Items (agenda items)
CREATE TABLE IF NOT EXISTS public.items (
  id bigserial PRIMARY KEY,
  board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Votes
CREATE TABLE IF NOT EXISTS public.votes (
  id bigserial PRIMARY KEY,
  item_id bigint NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  participant_id bigint NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  choice text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(item_id, participant_id)
);
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (DROP IF EXISTS then CREATE)

-- Boards policies
DROP POLICY IF EXISTS boards_select ON public.boards;
CREATE POLICY boards_select ON public.boards
  FOR SELECT
  USING (
    created_by = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.participants p
      WHERE p.board_id = boards.id AND p.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS boards_insert ON public.boards;
CREATE POLICY boards_insert ON public.boards
  FOR INSERT
  WITH CHECK (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS boards_update ON public.boards;
CREATE POLICY boards_update ON public.boards
  FOR UPDATE
  USING (created_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS boards_delete ON public.boards;
CREATE POLICY boards_delete ON public.boards
  FOR DELETE
  USING (created_by = (SELECT auth.uid()));

-- Participants policies
DROP POLICY IF EXISTS participants_select ON public.participants;
CREATE POLICY participants_select ON public.participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = participants.board_id AND me.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS participants_insert ON public.participants;
CREATE POLICY participants_insert ON public.participants
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS participants_update ON public.participants;
CREATE POLICY participants_update ON public.participants
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

-- Items policies
DROP POLICY IF EXISTS items_select ON public.items;
CREATE POLICY items_select ON public.items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS items_insert ON public.items;
CREATE POLICY items_insert ON public.items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid()) AND me.role = 'admin'
    )
  );

DROP POLICY IF EXISTS items_update ON public.items;
CREATE POLICY items_update ON public.items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid()) AND me.role = 'admin'
    )
  );

DROP POLICY IF EXISTS items_delete ON public.items;
CREATE POLICY items_delete ON public.items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid()) AND me.role = 'admin'
    )
  );

-- Votes policies
DROP POLICY IF EXISTS votes_select ON public.votes;
CREATE POLICY votes_select ON public.votes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      JOIN public.items i ON i.id = votes.item_id
      WHERE me.board_id = i.board_id AND me.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS votes_insert ON public.votes;
CREATE POLICY votes_insert ON public.votes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.id = votes.participant_id AND me.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS votes_update ON public.votes;
CREATE POLICY votes_update ON public.votes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.id = votes.participant_id AND me.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS votes_delete ON public.votes;
CREATE POLICY votes_delete ON public.votes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.id = votes.participant_id AND me.user_id = (SELECT auth.uid())
    )
  );

-- Note: Supabase Realtime requires REPLICA IDENTITY FULL for tables that broadcast updates; Supabase handles this automatically.
