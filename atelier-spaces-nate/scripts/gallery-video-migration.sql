-- ============================================
-- Gallery Table Video Support Migration
-- Run this script in Supabase SQL Editor
-- ============================================

-- Step 1: Check if gallery table exists and show current structure
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gallery') THEN
        RAISE NOTICE 'Gallery table exists. Checking structure...';
    ELSE
        RAISE NOTICE 'Gallery table does not exist. It will be created.';
    END IF;
END $$;

-- Step 2: Create gallery table if it doesn't exist
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  category VARCHAR(100),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Add media_type column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'gallery' AND column_name = 'media_type'
    ) THEN
        ALTER TABLE gallery 
        ADD COLUMN media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video'));
        RAISE NOTICE 'Added media_type column';
    ELSE
        RAISE NOTICE 'media_type column already exists';
    END IF;
END $$;

-- Step 4: Rename image_url to media_url if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'gallery' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE gallery RENAME COLUMN image_url TO media_url;
        RAISE NOTICE 'Renamed image_url to media_url';
    ELSE
        RAISE NOTICE 'Column already named media_url or does not exist';
    END IF;
END $$;

-- Step 5: Update existing records to have media_type = 'image'
UPDATE gallery 
SET media_type = 'image' 
WHERE media_type IS NULL;

-- Step 6: Add column comments
COMMENT ON COLUMN gallery.media_url IS 'URL to the media file (image or video)';
COMMENT ON COLUMN gallery.media_type IS 'Type of media: image or video';

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(order_position);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON gallery(media_type);

-- Step 8: Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Step 9: Drop and recreate RLS policies
DROP POLICY IF EXISTS "Allow public to view active gallery items" ON gallery;
DROP POLICY IF EXISTS "Allow admins to manage gallery" ON gallery;

-- Allow public to view active gallery items
CREATE POLICY "Allow public to view active gallery items"
  ON gallery
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users (admins) to manage all gallery items
CREATE POLICY "Allow admins to manage gallery"
  ON gallery
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Step 10: Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS set_gallery_updated_at ON gallery;
CREATE TRIGGER set_gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- Step 12: Verify the final structure
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'gallery'
ORDER BY ordinal_position;

-- ============================================
-- Storage Bucket Configuration Instructions
-- ============================================

-- Note: Storage bucket policies must be configured via Supabase Storage UI
-- 
-- 1. Create 'gallery' bucket if it doesn't exist:
--    - Go to Storage in Supabase Dashboard
--    - Create new bucket named 'gallery'
--    - Set as Public bucket
--
-- 2. Configure bucket policies:
--    
--    Policy 1: Public Read Access
--    - Name: "Public Access to Gallery"
--    - Allowed operation: SELECT
--    - Policy definition: (bucket_id = 'gallery')
--    - Target roles: public
--
--    Policy 2: Authenticated Upload
--    - Name: "Authenticated users can upload to gallery"  
--    - Allowed operation: INSERT
--    - Policy definition: (bucket_id = 'gallery' AND (auth.role() = 'authenticated'))
--    - Target roles: authenticated
--
--    Policy 3: Authenticated Update
--    - Name: "Authenticated users can update gallery"
--    - Allowed operation: UPDATE
--    - Policy definition: (bucket_id = 'gallery' AND (auth.role() = 'authenticated'))
--    - Target roles: authenticated
--
--    Policy 4: Authenticated Delete
--    - Name: "Authenticated users can delete from gallery"
--    - Allowed operation: DELETE
--    - Policy definition: (bucket_id = 'gallery' AND (auth.role() = 'authenticated'))
--    - Target roles: authenticated
--
-- 3. Allowed file types:
--    Images: image/jpeg, image/png, image/webp, image/gif
--    Videos: video/mp4, video/webm, video/quicktime, video/x-msvideo, video/x-matroska
--
-- 4. File size limits:
--    Images: 10MB max
--    Videos: 100MB max

RAISE NOTICE '✅ Gallery migration completed successfully!';
RAISE NOTICE '⚠️  Remember to configure the storage bucket policies in Supabase Dashboard';
