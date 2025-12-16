-- FIX: RLS Policies for Hero Slides Table
-- Run this in Supabase SQL Editor to enable admin to add/edit/delete hero slides

-- ============================================================
-- ENABLE RLS ON HERO_SLIDES TABLE
-- ============================================================

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow authenticated all operations on hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow public read active hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated read all hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated insert hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated update hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow authenticated delete hero slides" ON hero_slides;

-- ============================================================
-- CREATE NEW RLS POLICIES FOR HERO_SLIDES
-- ============================================================

-- 1. Allow anyone to read active hero slides
CREATE POLICY "Allow public read active hero slides" ON hero_slides
FOR SELECT USING (is_active = true);

-- 2. Allow authenticated users to read all hero slides (for admin)
CREATE POLICY "Allow authenticated read all hero slides" ON hero_slides
FOR SELECT USING (auth.role() = 'authenticated_user');

-- 3. Allow authenticated users to insert hero slides
CREATE POLICY "Allow authenticated insert hero slides" ON hero_slides
FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

-- 4. Allow authenticated users to update hero slides
CREATE POLICY "Allow authenticated update hero slides" ON hero_slides
FOR UPDATE 
  USING (auth.role() = 'authenticated_user')
  WITH CHECK (auth.role() = 'authenticated_user');

-- 5. Allow authenticated users to delete hero slides
CREATE POLICY "Allow authenticated delete hero slides" ON hero_slides
FOR DELETE USING (auth.role() = 'authenticated_user');

-- ============================================================
-- SETUP STORAGE BUCKET RLS POLICIES FOR HERO-SLIDES IMAGES
-- ============================================================

-- Drop old storage policies if they exist
DROP POLICY IF EXISTS "Allow public read hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete hero-slides" ON storage.objects;

-- 1. Allow public to read hero slide images
CREATE POLICY "Allow public read hero-slides" ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-slides');

-- 2. Allow authenticated users to upload hero slide images
CREATE POLICY "Allow authenticated upload hero-slides" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated_user');

-- 3. Allow authenticated users to update hero slide images
CREATE POLICY "Allow authenticated update hero-slides" ON storage.objects
FOR UPDATE
USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated_user')
WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated_user');

-- 4. Allow authenticated users to delete hero slide images
CREATE POLICY "Allow authenticated delete hero-slides" ON storage.objects
FOR DELETE
USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated_user');

-- ============================================================
-- VERIFY POLICIES ARE IN PLACE
-- ============================================================

-- Verify hero_slides table policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'hero_slides'
ORDER BY policyname;

-- Verify storage.objects policies for hero-slides bucket
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
