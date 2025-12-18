-- Fix missing or incorrect slugs in works table
-- This script generates slugs from titles for any works that don't have proper slugs

-- First, let's see which works have issues
SELECT id, title, slug, 
  CASE 
    WHEN slug IS NULL THEN 'Missing slug'
    WHEN slug = '' THEN 'Empty slug'
    ELSE 'Has slug'
  END as slug_status
FROM works
ORDER BY created_at DESC;

-- Update works with missing or empty slugs
-- This creates URL-friendly slugs from the title
UPDATE works
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

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
