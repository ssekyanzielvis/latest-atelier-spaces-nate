-- Supabase Storage Bucket Setup with Policies
-- For: about-media bucket (images and videos)

-- ============================================================================
-- NOTE: Storage bucket creation must be done via Supabase Dashboard OR SDK
-- The SQL below shows the RLS policies for storage.objects table
-- ============================================================================

-- 1. ENABLE ROW LEVEL SECURITY on storage.objects and storage.buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STORAGE POLICIES FOR about-media BUCKET
-- ============================================================================

-- Policy 1: Allow public (unauthenticated) users to READ/SELECT from about-media bucket
-- This allows anyone to view the gallery on the public website
CREATE POLICY "Public can view about-media files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'about-media');

-- Policy 2: Allow authenticated (admin) users to INSERT files to about-media bucket
-- This allows admins to upload new media items
CREATE POLICY "Authenticated users can upload to about-media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'about-media'
    AND auth.role() = 'authenticated'
  );

-- Policy 3: Allow authenticated (admin) users to UPDATE files in about-media bucket
-- This allows admins to replace/update existing files
CREATE POLICY "Authenticated users can update about-media files"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'about-media'
    AND auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'about-media'
    AND auth.role() = 'authenticated'
  );

-- Policy 4: Allow authenticated (admin) users to DELETE files from about-media bucket
-- This allows admins to remove media items
CREATE POLICY "Authenticated users can delete about-media files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'about-media'
    AND auth.role() = 'authenticated'
  );

-- ============================================================================
-- ALTERNATIVE: MORE RESTRICTIVE POLICIES (Optional)
-- If you want only specific admins to modify content:
-- ============================================================================

-- Check if user is an admin (optional - requires auth system setup)
-- You can create a function to check admin status:

-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS boolean AS $$
-- BEGIN
--   RETURN EXISTS (
--     SELECT 1 FROM public.admins
--     WHERE id = auth.uid() AND is_active = true
--   );
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then use in policies:
-- CREATE POLICY "Only admins can upload media"
--   ON storage.objects
--   FOR INSERT
--   WITH CHECK (
--     bucket_id = 'about-media'
--     AND is_admin()
--   );

-- ============================================================================
-- BUCKET CREATION (Via Supabase Dashboard or SDK)
-- ============================================================================
-- Steps to create bucket in Supabase Dashboard:
-- 1. Go to Storage section
-- 2. Click "Create new bucket"
-- 3. Name: about-media
-- 4. Privacy: Private (do NOT check public)
-- 5. Click Create
-- 6. Run the RLS policies above

-- ============================================================================
-- ALLOWED FILE TYPES & SIZE LIMITS (Dashboard Configuration)
-- ============================================================================
-- File Types:
--   - Images: .jpg, .jpeg, .png, .gif, .webp
--   - Videos: .mp4, .webm, .mov, .avi
-- Maximum File Size: 100 MB
-- Configure in Storage > about-media > Settings

-- ============================================================================
-- BUCKET STRUCTURE & NAMING CONVENTION (Optional)
-- ============================================================================
-- You can organize files by type using folder structure:
-- about-media/
--   ├── images/
--   │   ├── uganda-cup.jpg
--   │   └── londonga-arch.jpg
--   └── videos/
--       └── mweso-board.mp4

-- Alternatively, use timestamps for uniqueness:
-- about-media/
--   ├── 1702656000000-mweso-board.mp4
--   ├── 1702656001000-uganda-cup.jpg
--   └── 1702656002000-londonga-arch.jpg

-- ============================================================================
-- VERIFY POLICIES (Test Query)
-- ============================================================================
-- Run these to verify policies are working:

-- Check all policies for about-media bucket:
-- SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'objects'
-- AND schemaname = 'storage'
-- ORDER BY policyname;

-- Check bucket exists:
-- SELECT id, name, owner, public, created_at
-- FROM storage.buckets
-- WHERE name = 'about-media';

-- ============================================================================
-- CLEANUP (If needed)
-- ============================================================================
-- Drop all policies for a bucket:
-- DROP POLICY IF EXISTS "Public can view about-media files" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can upload to about-media" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can update about-media files" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can delete about-media files" ON storage.objects;

-- Delete bucket (via Dashboard - SQL doesn't support this directly):
-- 1. Go to Storage > about-media
-- 2. Click Settings
-- 3. Click Delete bucket

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================
-- 1. Public READ access allows anyone to view gallery
-- 2. INSERT/UPDATE/DELETE require authentication
-- 3. Consider adding admin verification function for extra security
-- 4. All file operations are logged by Supabase
-- 5. Deleted files are permanently removed from storage
-- 6. Files have public URLs when bucket is private but policy allows SELECT

-- ============================================================================
-- CORS CONFIGURATION (If experiencing CORS errors)
-- ============================================================================
-- If frontend can't upload files, check CORS settings:
-- 1. Go to Project Settings
-- 2. API Settings
-- 3. Under CORS, add your domain:
--    - Development: http://localhost:3000
--    - Production: https://yourdomain.com

-- ============================================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================================
-- Consider creating indexes for better query performance:

CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id 
  ON storage.objects(bucket_id);

CREATE INDEX IF NOT EXISTS idx_storage_objects_name 
  ON storage.objects(name);

CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at 
  ON storage.objects(created_at);

-- ============================================================================
-- MONITORING & TROUBLESHOOTING
-- ============================================================================
-- View storage usage:
-- SELECT 
--   bucket_id,
--   COUNT(*) as file_count,
--   SUM(metadata->>'size')::bigint as total_size_bytes,
--   SUM(metadata->>'size')::bigint / 1048576.0 as total_size_mb
-- FROM storage.objects
-- WHERE bucket_id = 'about-media'
-- GROUP BY bucket_id;

-- List all files in bucket:
-- SELECT id, name, metadata, created_at, updated_at
-- FROM storage.objects
-- WHERE bucket_id = 'about-media'
-- ORDER BY created_at DESC;

-- Find recently modified files:
-- SELECT name, updated_at, metadata->>'size' as size
-- FROM storage.objects
-- WHERE bucket_id = 'about-media'
--   AND updated_at > NOW() - INTERVAL '7 days'
-- ORDER BY updated_at DESC;
