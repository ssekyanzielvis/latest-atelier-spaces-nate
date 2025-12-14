-- ============================================================================
-- Supabase Storage Buckets Setup for Atelier Spaces Nate
-- ============================================================================
-- This script creates separate storage buckets for each content section
-- with appropriate RLS (Row Level Security) policies for public access
-- and authenticated uploads.
-- ============================================================================

-- ============================================================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================================================

-- Hero Slides Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'hero-slides',
  'hero-slides',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Projects Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- News Articles Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'news',
  'news',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Works Portfolio Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'works',
  'works',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Team Members Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'team',
  'team',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- About Section Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'about',
  'about',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Slogan Section Bucket
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'slogan',
  'slogan',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Collaborations Bucket (for user uploads)
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at, file_size_limit, allowed_mime_types)
VALUES (
  'collaborations',
  'collaborations',
  true,
  (SELECT auth.uid()),
  NOW(),
  NOW(),
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- ============================================================================
-- 2. RLS POLICIES - PUBLIC READ ACCESS (All Buckets)
-- ============================================================================
-- Allow anyone to view/download images (public)

-- Hero Slides - Public Read
CREATE POLICY "allow_public_read_hero_slides" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hero-slides');

-- Projects - Public Read
CREATE POLICY "allow_public_read_projects" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'projects');

-- News - Public Read
CREATE POLICY "allow_public_read_news" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'news');

-- Works - Public Read
CREATE POLICY "allow_public_read_works" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'works');

-- Team - Public Read
CREATE POLICY "allow_public_read_team" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'team');

-- About - Public Read
CREATE POLICY "allow_public_read_about" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'about');

-- Slogan - Public Read
CREATE POLICY "allow_public_read_slogan" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'slogan');

-- Collaborations - Public Read
CREATE POLICY "allow_public_read_collaborations" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'collaborations');

-- ============================================================================
-- 3. RLS POLICIES - AUTHENTICATED ADMIN WRITE ACCESS
-- ============================================================================
-- Allow authenticated admins to upload, update, and delete images

-- Hero Slides - Admin Write
CREATE POLICY "allow_admin_write_hero_slides" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'hero-slides' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_hero_slides" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_hero_slides" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'hero-slides' AND auth.role() = 'authenticated');

-- Projects - Admin Write
CREATE POLICY "allow_admin_write_projects" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'projects' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_projects" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'projects' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_projects" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- News - Admin Write
CREATE POLICY "allow_admin_write_news" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'news' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_news" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'news' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'news' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_news" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'news' AND auth.role() = 'authenticated');

-- Works - Admin Write
CREATE POLICY "allow_admin_write_works" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'works' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_works" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'works' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'works' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_works" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'works' AND auth.role() = 'authenticated');

-- Team - Admin Write
CREATE POLICY "allow_admin_write_team" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'team' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_team" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'team' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'team' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_team" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'team' AND auth.role() = 'authenticated');

-- About - Admin Write
CREATE POLICY "allow_admin_write_about" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'about' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_about" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'about' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'about' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_about" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'about' AND auth.role() = 'authenticated');

-- Slogan - Admin Write
CREATE POLICY "allow_admin_write_slogan" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'slogan' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "allow_admin_update_slogan" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'slogan' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'slogan' AND auth.role() = 'authenticated');

CREATE POLICY "allow_admin_delete_slogan" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'slogan' AND auth.role() = 'authenticated');

-- Collaborations - Public Write (users can upload)
CREATE POLICY "allow_public_write_collaborations" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'collaborations');

CREATE POLICY "allow_public_delete_collaborations" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'collaborations' AND auth.uid() IS NOT NULL);

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. All buckets are set to PUBLIC = true, making them publicly accessible
-- 2. Each bucket has a 50MB file size limit (adjustable as needed)
-- 3. Only image MIME types are allowed (JPEG, PNG, WebP, GIF)
-- 4. Admin operations require authenticated users
-- 5. Collaborations bucket allows public uploads
-- 6. To apply these policies via Supabase Console:
--    - Go to Storage → Buckets → Select bucket
--    - Click "Policies" tab
--    - Create the policies manually as shown above
-- 7. Alternatively, run this entire script in the Supabase SQL Editor
-- ============================================================================
