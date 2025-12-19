-- Update work_categories table to support video files
-- Run this script in Supabase SQL Editor

-- 1. Add media_type column to distinguish between images and videos
ALTER TABLE work_categories 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- 2. Add cover_media column (keep cover_image for backward compatibility)
ALTER TABLE work_categories 
ADD COLUMN IF NOT EXISTS cover_media VARCHAR(500);

-- 3. Copy existing cover_image data to cover_media if cover_media is empty
UPDATE work_categories 
SET cover_media = cover_image 
WHERE cover_media IS NULL AND cover_image IS NOT NULL;

-- 4. Update existing records to have media_type = 'image'
UPDATE work_categories 
SET media_type = 'image' 
WHERE media_type IS NULL;

-- 5. Add comments
COMMENT ON COLUMN work_categories.cover_image IS 'URL to the cover image file (legacy field, use cover_media instead)';
COMMENT ON COLUMN work_categories.cover_media IS 'URL to the cover media file (image or video)';
COMMENT ON COLUMN work_categories.media_type IS 'Type of media: image or video';

-- 6. Create index on media_type
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
