-- ============================================================
-- DIAGNOSTIC QUERIES FOR PROJECTS SETUP
-- ============================================================

-- 1. Check if projects table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'projects'
) as table_exists;

-- 2. List all columns in projects table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- 3. Check RLS is enabled on projects table
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'projects';

-- 4. List all RLS policies on projects table
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'projects'
ORDER BY policyname;

-- 5. Check storage bucket exists
SELECT bucket_id, name, public, created_at
FROM storage.buckets
WHERE name = 'projects';

-- 6. Check storage RLS policies for projects bucket
SELECT schemaname, tablename, policyname, permissive, roles
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%project%'
ORDER BY policyname;

-- 7. Try a test insert to see exact error
-- UNCOMMENT TO TEST (will fail if RLS not set up)
-- INSERT INTO projects (title, slug, location, description, image)
-- VALUES ('Test', 'test-project', 'Test Location', 'Test Description', 'https://example.com/image.jpg');
