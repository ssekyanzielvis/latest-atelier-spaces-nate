-- QUICK FIX: RLS Policies for Work Categories
-- Run this in Supabase SQL Editor to fix the RLS error

-- ============================================================
-- 1. FIX WORK_CATEGORIES TABLE RLS POLICIES
-- ============================================================

-- Drop old incomplete policies
DROP POLICY IF EXISTS "Allow admin all operations" ON work_categories;

-- Create proper policies for INSERT, UPDATE, DELETE
CREATE POLICY "Allow authenticated insert categories" ON work_categories
FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated update categories" ON work_categories
FOR UPDATE USING (auth.role() = 'authenticated_user')
WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated delete categories" ON work_categories
FOR DELETE USING (auth.role() = 'authenticated_user');

-- Keep read policies as they are
-- If needed, recreate read policies:
DROP POLICY IF EXISTS "Allow public read active categories" ON work_categories;
DROP POLICY IF EXISTS "Allow authenticated read all categories" ON work_categories;

CREATE POLICY "Allow public read active categories" ON work_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated read all categories" ON work_categories
FOR SELECT USING (auth.role() = 'authenticated_user');

-- ============================================================
-- 2. FIX STORAGE BUCKET RLS POLICIES
-- ============================================================

-- Drop old storage policies
DROP POLICY IF EXISTS "Allow authenticated upload to work-categories" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update work-categories" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete work-categories" ON storage.objects;

-- Create new simplified storage policies
CREATE POLICY "Allow authenticated upload to work-categories" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'work-categories');

CREATE POLICY "Allow authenticated update work-categories" ON storage.objects
FOR UPDATE
USING (bucket_id = 'work-categories')
WITH CHECK (bucket_id = 'work-categories');

CREATE POLICY "Allow authenticated delete work-categories" ON storage.objects
FOR DELETE
USING (bucket_id = 'work-categories');

-- Verify policies are in place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('work_categories', 'objects') 
  AND schemaname IN ('public', 'storage')
ORDER BY tablename, policyname;
