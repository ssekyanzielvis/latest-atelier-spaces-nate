-- Update Gallery Table to Support Video Files
-- Run this script in Supabase SQL Editor

-- 1. Add media_type column to distinguish between images and videos
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- 2. Rename image_url to media_url for clarity
ALTER TABLE gallery 
RENAME COLUMN image_url TO media_url;

-- 3. Update existing records to have media_type = 'image'
UPDATE gallery 
SET media_type = 'image' 
WHERE media_type IS NULL;

-- 4. Add comment to media_url column
COMMENT ON COLUMN gallery.media_url IS 'URL to the media file (image or video)';
COMMENT ON COLUMN gallery.media_type IS 'Type of media: image or video';

-- 5. Create index on media_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON gallery(media_type);

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'gallery'
ORDER BY ordinal_position;
