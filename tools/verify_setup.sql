-- Supabase Setup Verification Script
-- Run this in Supabase SQL Editor after applying the schema
-- to verify everything is configured correctly

-- ============================================
-- 1. Check Tables Exist
-- ============================================
SELECT
    'Tables Check' as test_category,
    tablename as table_name,
    CASE
        WHEN tablename IN ('boards', 'participants', 'items', 'votes') THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('boards', 'participants', 'items', 'votes')
ORDER BY tablename;

-- Expected: 4 rows showing boards, items, participants, votes

-- ============================================
-- 2. Check Row-Level Security Enabled
-- ============================================
SELECT
    'RLS Check' as test_category,
    schemaname as schema,
    tablename as table_name,
    rowsecurity as rls_enabled,
    CASE
        WHEN rowsecurity = true THEN '✅ PASS - RLS Enabled'
        ELSE '❌ FAIL - RLS Not Enabled'
    END as status
FROM pg_tables
WHERE tablename IN ('boards', 'participants', 'items', 'votes')
ORDER BY tablename;

-- Expected: All 4 tables should have rowsecurity = true

-- ============================================
-- 3. Check RLS Policies Exist
-- ============================================
SELECT
    'Policy Check' as test_category,
    tablename,
    policyname,
    CASE cmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
        ELSE cmd
    END as command,
    '✅ Policy Exists' as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('boards', 'participants', 'items', 'votes')
ORDER BY tablename, policyname;

-- Expected: Multiple policies for each table
-- boards: 4 policies (select, insert, update, delete)
-- participants: 3 policies (select, insert, update)
-- items: 4 policies (select, insert, update, delete)
-- votes: 4 policies (select, insert, update, delete)

-- ============================================
-- 4. Count Total Policies (Summary)
-- ============================================
SELECT
    'Policy Count Summary' as test_category,
    tablename,
    COUNT(*) as policy_count,
    CASE
        WHEN tablename = 'boards' AND COUNT(*) = 4 THEN '✅ PASS (4 policies)'
        WHEN tablename = 'participants' AND COUNT(*) = 3 THEN '✅ PASS (3 policies)'
        WHEN tablename = 'items' AND COUNT(*) = 4 THEN '✅ PASS (4 policies)'
        WHEN tablename = 'votes' AND COUNT(*) = 4 THEN '✅ PASS (4 policies)'
        ELSE '⚠️ Unexpected count'
    END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('boards', 'participants', 'items', 'votes')
GROUP BY tablename
ORDER BY tablename;

-- Expected: boards=4, items=4, participants=3, votes=4

-- ============================================
-- 5. Check Table Columns
-- ============================================
SELECT
    'Column Check' as test_category,
    table_name,
    column_name,
    data_type,
    is_nullable,
    '✅ Column Exists' as status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('boards', 'participants', 'items', 'votes')
ORDER BY table_name, ordinal_position;

-- Expected: All columns from schema should be listed

-- ============================================
-- 6. Check Foreign Key Constraints
-- ============================================
SELECT
    'Foreign Key Check' as test_category,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    '✅ FK Exists' as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('boards', 'participants', 'items', 'votes')
ORDER BY tc.table_name, kcu.column_name;

-- Expected:
-- boards.created_by → auth.users.id
-- participants.board_id → boards.id
-- participants.user_id → auth.users.id
-- items.board_id → boards.id
-- votes.item_id → items.id
-- votes.participant_id → participants.id

-- ============================================
-- 7. Check Indexes
-- ============================================
SELECT
    'Index Check' as test_category,
    schemaname,
    tablename,
    indexname,
    indexdef,
    '✅ Index Exists' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('boards', 'participants', 'items', 'votes')
ORDER BY tablename, indexname;

-- Expected: Primary keys + idx_boards_created_by index

-- ============================================
-- 8. Test Empty Tables (Should Return 0s)
-- ============================================
SELECT
    'Empty Tables Check' as test_category,
    'All tables should start empty' as description,
    (SELECT COUNT(*) FROM boards) as boards_count,
    (SELECT COUNT(*) FROM participants) as participants_count,
    (SELECT COUNT(*) FROM items) as items_count,
    (SELECT COUNT(*) FROM votes) as votes_count,
    CASE
        WHEN (SELECT COUNT(*) FROM boards) = 0
         AND (SELECT COUNT(*) FROM participants) = 0
         AND (SELECT COUNT(*) FROM items) = 0
         AND (SELECT COUNT(*) FROM votes) = 0
        THEN '✅ PASS - All Empty'
        ELSE '⚠️ Tables have data (may be from testing)'
    END as status;

-- Expected: All counts = 0

-- ============================================
-- 9. Summary Report
-- ============================================
SELECT
    '=== SETUP VERIFICATION SUMMARY ===' as summary,
    '' as blank_line,
    'If all tests show ✅ PASS, your Supabase backend is ready!' as result,
    '' as blank_line_2,
    'Next steps:' as next,
    '1. Enable Email authentication (Authentication → Providers)' as step1,
    '2. Enable Realtime for: participants, items, votes (Database → Replication)' as step2,
    '3. Get your API credentials (Settings → API)' as step3,
    '4. Configure Vercel environment variables' as step4,
    '5. Deploy and test!' as step5;

-- ============================================
-- END OF VERIFICATION SCRIPT
-- ============================================
