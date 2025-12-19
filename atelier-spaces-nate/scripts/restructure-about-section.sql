-- Restructure about_section table to only have one "about" attribute
-- Run this script in Supabase SQL Editor

-- 1. Add about column
ALTER TABLE about_section 
ADD COLUMN IF NOT EXISTS about TEXT;

-- 2. Migrate existing data (combine title and content into about)
UPDATE about_section 
SET about = CONCAT(title, E'\n\n', content)
WHERE about IS NULL;

-- 3. Drop unused columns
ALTER TABLE about_section 
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS content,
DROP COLUMN IF EXISTS mission,
DROP COLUMN IF EXISTS vision,
DROP COLUMN IF EXISTS values,
DROP COLUMN IF EXISTS image;

-- 4. Make about column NOT NULL
ALTER TABLE about_section 
ALTER COLUMN about SET NOT NULL;

-- 5. Update column comment
COMMENT ON COLUMN about_section.about IS 'The about text content';

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'about_section'
ORDER BY ordinal_position;
