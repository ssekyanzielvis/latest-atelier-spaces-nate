-- Update work_categories table to support video files
-- Run this script in Supabase SQL Editor

-- 1. Add media_type column to distinguish between images and videos
ALTER TABLE work_categories 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- 2. Rename cover_image to cover_media for clarity (optional but recommended)
-- First check if we need to rename
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'work_categories' AND column_name = 'cover_image'
  ) THEN
    ALTER TABLE work_categories RENAME COLUMN cover_image TO cover_media;
  END IF;
END $$;

-- 3. Update existing records to have media_type = 'image'
UPDATE work_categories 
SET media_type = 'image' 
WHERE media_type IS NULL;

-- 4. Add comments
COMMENT ON COLUMN work_categories.cover_media IS 'URL to the cover media file (image or video)';
COMMENT ON COLUMN work_categories.media_type IS 'Type of media: image or video';

-- 5. Create index on media_type
CREATE INDEX IF NOT EXISTS idx_work_categories_media_type ON work_categories(media_type);

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'work_categories'
ORDER BY ordinal_position;
