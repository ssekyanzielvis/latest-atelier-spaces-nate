-- Restructure slogan_section table to only have slogan and founder_name
-- Run this script in Supabase SQL Editor

-- 1. Add founder_name column
ALTER TABLE slogan_section 
ADD COLUMN IF NOT EXISTS founder_name VARCHAR(255);

-- 2. Rename main_slogan to slogan (if needed)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'slogan_section' AND column_name = 'main_slogan'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'slogan_section' AND column_name = 'slogan'
  ) THEN
    ALTER TABLE slogan_section RENAME COLUMN main_slogan TO slogan;
  END IF;
END $$;

-- 3. Drop unused columns
ALTER TABLE slogan_section 
DROP COLUMN IF EXISTS sub_slogan,
DROP COLUMN IF EXISTS background_image;

-- 4. Update column comments
COMMENT ON COLUMN slogan_section.slogan IS 'The main slogan text';
COMMENT ON COLUMN slogan_section.founder_name IS 'Name of the founder or company';

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'slogan_section'
ORDER BY ordinal_position;
