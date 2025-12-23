-- ============================================================================
-- CollabBoard Supabase Database Schema
-- ============================================================================
--
-- This script creates the complete database structure for CollabBoard,
-- including tables, indexes, and Row-Level Security (RLS) policies.
--
-- IMPORTANT: This script is idempotent (safe to run multiple times)
--
-- To apply:
-- 1. Open Supabase SQL Editor
-- 2. Copy this entire file
-- 3. Paste and click "Run"
-- 4. Verify "Success. No rows returned"
--
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable pgcrypto extension for UUID generation
-- This allows us to use gen_random_uuid() function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- TABLE: boards
-- ============================================================================
-- Stores board meetings created by users
-- Each board represents one meeting session
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.boards (
  -- Unique identifier for this board (auto-generated UUID)
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Board meeting title (e.g., "Q4 Board Meeting")
  title text NOT NULL,

  -- Reference to the user who created this board (from Supabase Auth)
  -- CASCADE: If user is deleted, their boards are deleted too
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- When this board was created
  created_at timestamptz NOT NULL DEFAULT now(),

  -- When this board was last updated
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row-Level Security on boards table
-- This ensures users can only see/modify boards they have access to
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups by creator
-- This speeds up queries like "show me all boards created by user X"
CREATE INDEX IF NOT EXISTS idx_boards_created_by ON public.boards(created_by);

-- ============================================================================
-- TABLE: participants
-- ============================================================================
-- Stores users who have joined a board meeting
-- Links users to boards and tracks their role and online status
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.participants (
  -- Auto-incrementing unique identifier
  id bigserial PRIMARY KEY,

  -- Which board this participant belongs to
  -- CASCADE: If board is deleted, all its participants are deleted
  board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,

  -- Which Supabase user this participant is
  -- CASCADE: If user is deleted, their participant records are deleted
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Display name entered by the participant
  name text NOT NULL,

  -- Role: 'admin' (creator, can manage agenda) or 'member' (can view and vote)
  role text NOT NULL CHECK (role IN ('admin','member')),

  -- Is this participant currently online?
  online boolean NOT NULL DEFAULT false,

  -- When was this participant last seen/active
  last_seen timestamptz NOT NULL DEFAULT now(),

  -- When did this participant join the board
  joined_at timestamptz NOT NULL DEFAULT now(),

  -- Ensure one user can only join a board once
  -- (they can't create duplicate participant records)
  UNIQUE(board_id, user_id)
);

-- Enable Row-Level Security
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: items
-- ============================================================================
-- Stores agenda items for board meetings
-- Each item represents a topic/decision to be discussed
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.items (
  -- Auto-incrementing unique identifier
  id bigserial PRIMARY KEY,

  -- Which board this agenda item belongs to
  -- CASCADE: If board is deleted, all its items are deleted
  board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,

  -- Type of item (e.g., 'simple_approval', 'weighted_voting', etc.)
  type text NOT NULL,

  -- Item title (e.g., "Approve Q4 Budget")
  title text NOT NULL,

  -- Detailed description of the agenda item (optional)
  description text,

  -- Additional metadata stored as JSON
  -- (e.g., voting options, thresholds, presenter info)
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Current status: 'pending', 'in_progress', 'completed'
  status text NOT NULL DEFAULT 'pending',

  -- When this item was created
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: votes
-- ============================================================================
-- Stores votes cast by participants on agenda items
-- Each vote links a participant to an item with their choice
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.votes (
  -- Auto-incrementing unique identifier
  id bigserial PRIMARY KEY,

  -- Which agenda item this vote is for
  -- CASCADE: If item is deleted, all votes on it are deleted
  item_id bigint NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,

  -- Which participant cast this vote
  -- CASCADE: If participant is removed, their votes are deleted
  participant_id bigint NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,

  -- The vote choice (e.g., "Approve", "Reject", "Abstain")
  choice text NOT NULL,

  -- When this vote was cast
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Ensure each participant can only vote once per item
  -- (they can update their vote, but not create duplicates)
  UNIQUE(item_id, participant_id)
);

-- Enable Row-Level Security
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- These policies control who can see and modify data
-- They run automatically on every database query
-- ============================================================================

-- ----------------------------------------------------------------------------
-- BOARDS POLICIES
-- ----------------------------------------------------------------------------

-- SELECT (Read) Policy: Users can see boards if they:
-- - Created the board, OR
-- - Are a participant in the board
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

-- INSERT (Create) Policy: Users can create boards
-- Requirement: They must set themselves as the creator
DROP POLICY IF EXISTS boards_insert ON public.boards;
CREATE POLICY boards_insert ON public.boards
  FOR INSERT
  WITH CHECK (created_by = (SELECT auth.uid()));

-- UPDATE (Edit) Policy: Only board creators can update boards
DROP POLICY IF EXISTS boards_update ON public.boards;
CREATE POLICY boards_update ON public.boards
  FOR UPDATE
  USING (created_by = (SELECT auth.uid()));

-- DELETE Policy: Only board creators can delete boards
DROP POLICY IF EXISTS boards_delete ON public.boards;
CREATE POLICY boards_delete ON public.boards
  FOR DELETE
  USING (created_by = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- PARTICIPANTS POLICIES
-- ----------------------------------------------------------------------------

-- SELECT Policy: Users can see participants if they're in the same board
DROP POLICY IF EXISTS participants_select ON public.participants;
CREATE POLICY participants_select ON public.participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = participants.board_id AND me.user_id = (SELECT auth.uid())
    )
  );

-- INSERT Policy: Users can join boards (create participant record)
-- Requirement: They must set themselves as the user_id
DROP POLICY IF EXISTS participants_insert ON public.participants;
CREATE POLICY participants_insert ON public.participants
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

-- UPDATE Policy: Users can only update their own participant record
-- (e.g., update online status, last_seen)
DROP POLICY IF EXISTS participants_update ON public.participants;
CREATE POLICY participants_update ON public.participants
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

-- Note: No DELETE policy - participants are removed via board deletion

-- ----------------------------------------------------------------------------
-- ITEMS (Agenda Items) POLICIES
-- ----------------------------------------------------------------------------

-- SELECT Policy: Users can see items if they're participants in that board
DROP POLICY IF EXISTS items_select ON public.items;
CREATE POLICY items_select ON public.items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid())
    )
  );

-- INSERT Policy: Only board ADMINS can create agenda items
DROP POLICY IF EXISTS items_insert ON public.items;
CREATE POLICY items_insert ON public.items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid()) AND me.role = 'admin'
    )
  );

-- UPDATE Policy: Only board ADMINS can update agenda items
DROP POLICY IF EXISTS items_update ON public.items;
CREATE POLICY items_update ON public.items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid()) AND me.role = 'admin'
    )
  );

-- DELETE Policy: Only board ADMINS can delete agenda items
DROP POLICY IF EXISTS items_delete ON public.items;
CREATE POLICY items_delete ON public.items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.board_id = items.board_id AND me.user_id = (SELECT auth.uid()) AND me.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- VOTES POLICIES
-- ----------------------------------------------------------------------------

-- SELECT Policy: Users can see votes if they're participants in the board
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

-- INSERT Policy: Users can vote if it's their own participant record
DROP POLICY IF EXISTS votes_insert ON public.votes;
CREATE POLICY votes_insert ON public.votes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.id = votes.participant_id AND me.user_id = (SELECT auth.uid())
    )
  );

-- UPDATE Policy: Users can only update their own votes
DROP POLICY IF EXISTS votes_update ON public.votes;
CREATE POLICY votes_update ON public.votes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.id = votes.participant_id AND me.user_id = (SELECT auth.uid())
    )
  );

-- DELETE Policy: Users can only delete their own votes
DROP POLICY IF EXISTS votes_delete ON public.votes;
CREATE POLICY votes_delete ON public.votes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.participants me
      WHERE me.id = votes.participant_id AND me.user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- REALTIME CONFIGURATION
-- ============================================================================
-- Supabase Realtime requires REPLICA IDENTITY FULL for tables that broadcast updates
-- Supabase handles this automatically when you enable Realtime in the dashboard
--
-- To enable Realtime:
-- 1. Go to Database → Replication in Supabase dashboard
-- 2. Enable Realtime for: participants, items, votes
-- ============================================================================

-- ============================================================================
-- SCHEMA APPLIED SUCCESSFULLY!
-- ============================================================================
-- Next steps:
-- 1. Verify tables in Table Editor (should see 4 tables)
-- 2. Enable Email authentication (Authentication → Providers)
-- 3. Enable Realtime (Database → Replication)
-- 4. Run verify_setup.sql to check everything
-- ============================================================================
