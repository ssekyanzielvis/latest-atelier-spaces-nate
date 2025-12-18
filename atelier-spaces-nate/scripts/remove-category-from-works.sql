-- Remove category_id column from works table
-- This script removes the category field from the works table

-- Step 1: Drop the foreign key constraint if it exists
ALTER TABLE works DROP CONSTRAINT IF EXISTS works_category_id_fkey;

-- Step 2: Drop the category_id column
ALTER TABLE works DROP COLUMN IF EXISTS category_id;

-- Step 3: Verify the change
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'works'
ORDER BY ordinal_position;
