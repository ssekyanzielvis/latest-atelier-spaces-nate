-- =====================================================
-- COLLABORATIONS DIAGNOSTIC SCRIPT
-- Run this to diagnose why collaborations aren't loading
-- =====================================================

-- 1. CHECK IF TABLE EXISTS
-- =====================================================
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'collaborations'
    ) THEN '✅ Table EXISTS'
    ELSE '❌ Table MISSING - Run COLLABORATIONS_SETUP.sql'
  END as table_status;

-- 2. CHECK TABLE STRUCTURE
-- =====================================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'collaborations'
ORDER BY ordinal_position;

-- 3. CHECK RLS STATUS
-- =====================================================
SELECT 
  relname as table_name,
  CASE 
    WHEN relrowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED - This might be okay'
  END as rls_status
FROM pg_class 
WHERE relname = 'collaborations';

-- 4. CHECK POLICIES
-- =====================================================
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN roles = '{public}' THEN 'PUBLIC'
    WHEN roles = '{authenticated}' THEN 'AUTHENTICATED'
    ELSE array_to_string(roles, ', ')
  END as who_can_use,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies 
WHERE tablename = 'collaborations';

-- 5. CHECK IF POLICIES EXIST (SUMMARY)
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ NO POLICIES - Run section 5 of COLLABORATIONS_SETUP.sql'
    WHEN COUNT(*) < 4 THEN '⚠️ INCOMPLETE POLICIES - Should have 4 policies (INSERT public, SELECT/UPDATE/DELETE authenticated)'
    ELSE '✅ POLICIES OK - ' || COUNT(*) || ' policies found'
  END as policy_status
FROM pg_policies 
WHERE tablename = 'collaborations';

-- 6. COUNT RECORDS
-- =====================================================
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_requests,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
  COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewed_requests,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_requests,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_requests
FROM collaborations;

-- 7. VIEW RECENT RECORDS
-- =====================================================
SELECT 
  id,
  name,
  email,
  company,
  project_type,
  status,
  created_at
FROM collaborations
ORDER BY created_at DESC
LIMIT 10;

-- 8. CHECK INDEXES
-- =====================================================
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'collaborations';

-- =====================================================
-- INTERPRETATION GUIDE
-- =====================================================
-- 
-- If you see:
-- 
-- 1. "❌ Table MISSING" → Run scripts/COLLABORATIONS_SETUP.sql
-- 
-- 2. "❌ NO POLICIES" or "⚠️ INCOMPLETE POLICIES" 
--    → Re-run section 5 of COLLABORATIONS_SETUP.sql
-- 
-- 3. Table exists, policies OK, but total_records = 0
--    → This is normal if no one has submitted yet
--    → Try submitting a test request via /collaborate page
-- 
-- 4. Everything looks good but admin page shows error
--    → Check browser console for API errors
--    → Check if you're logged in as admin
--    → Verify NEXT_PUBLIC_SUPABASE_URL and keys in .env.local
-- 
-- 5. RLS DISABLED
--    → This is okay if using service role key
--    → If using anon key, enable RLS and create policies
-- 
-- =====================================================

-- 9. QUICK FIX: Insert Test Data
-- =====================================================
-- Uncomment below to add test data:

-- INSERT INTO collaborations (name, email, description, message, company, project_type, budget, status)
-- VALUES 
--   ('Test User 1', 'test1@example.com', 'Test Project', 'This is a test collaboration request.', 'Test Company', 'Web Design', '$5k-$10k', 'new'),
--   ('Test User 2', 'test2@example.com', 'Another Test', 'Second test request.', NULL, 'Architecture', '$10k-$20k', 'pending');
-- 
-- SELECT 'Test data inserted!' as status;
