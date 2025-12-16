-- Supabase Storage Bucket Setup for Work Categories
-- This script creates and configures the work-categories storage bucket

-- 1. Create the work-categories storage bucket
-- Note: In Supabase dashboard, go to Storage > New Bucket
-- Bucket name: work-categories
-- Public bucket: Yes (for public image URLs)

-- 2. Storage RLS Policies
-- These policies control who can access the work-categories bucket

-- Policy 1: Allow public read access (for displaying category cover images)
-- This allows anyone to view/download files from the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-categories', 'work-categories', true)
ON CONFLICT DO NOTHING;

-- Policy 2: Allow public read objects in work-categories bucket
CREATE POLICY "Allow public read work-categories" ON storage.objects
FOR SELECT
USING (bucket_id = 'work-categories');

-- Policy 3: Allow authenticated users to upload
CREATE POLICY "Allow authenticated upload to work-categories" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'work-categories'
  AND auth.role() = 'authenticated_user'
);

-- Policy 4: Allow authenticated users to update
CREATE POLICY "Allow authenticated update work-categories" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'work-categories'
  AND auth.role() = 'authenticated_user'
)
WITH CHECK (
  bucket_id = 'work-categories'
  AND auth.role() = 'authenticated_user'
);

-- Policy 5: Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete work-categories" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'work-categories'
  AND auth.role() = 'authenticated_user'
);

-- Bucket Configuration
-- Max file size: 100 MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
-- File naming: category-{timestamp}-{original-filename}

-- Storage Path Structure:
-- work-categories/
--   ├── covers/
--   │   └── {category-id}/cover.jpg
--   └── {category-id}/cover-{timestamp}.jpg

-- API Usage Notes:
-- Upload file:
--   supabase.storage.from('work-categories').upload(path, file)
--
-- Get public URL:
--   supabase.storage.from('work-categories').getPublicUrl(path).data.publicUrl
--
-- Delete file:
--   supabase.storage.from('work-categories').remove([path])

-- Example public URL format:
-- https://{project-id}.supabase.co/storage/v1/object/public/work-categories/covers/{category-id}/cover.jpg
