-- Fix missing or incorrect slugs in works table
-- This script generates URL-friendly slugs from titles

-- First, let's see current slugs
SELECT id, title, slug
FROM works
ORDER BY created_at DESC;

-- Update ALL works to have proper URL-friendly slugs
-- This creates lowercase slugs with hyphens instead of spaces
-- Removes special characters like — and other non-alphanumeric chars
UPDATE works
SET slug = LOWER(
  TRIM(
    BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(title, '[—–-]', '-', 'g'),  -- Convert dashes/em-dashes to hyphens
          '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove special characters
        ),
        '\s+', '-', 'g'  -- Replace spaces with hyphens
      ),
      '-+', '-', 'g'  -- Replace multiple hyphens with single hyphen
    )
  )
);

-- Verify the update
SELECT id, title, slug
FROM works
ORDER BY created_at DESC;

-- If you see any duplicate slugs, you can fix them by adding a number:
-- UPDATE works 
-- SET slug = slug || '-' || id::text
-- WHERE id IN (
--   SELECT id FROM works 
--   WHERE slug IN (
--     SELECT slug FROM works 
--     GROUP BY slug 
--     HAVING COUNT(*) > 1
--   )
-- );
