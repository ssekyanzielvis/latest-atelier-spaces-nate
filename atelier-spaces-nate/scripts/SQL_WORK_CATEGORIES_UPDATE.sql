-- Update work_categories table to add cover_image field
-- This migration adds a cover image to each work category

-- 1. Add cover_image column to work_categories table
ALTER TABLE work_categories
ADD COLUMN cover_image TEXT DEFAULT NULL,
ADD COLUMN order_position INTEGER DEFAULT 0,
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 2. Add indexes for better query performance
CREATE INDEX idx_work_categories_slug ON work_categories(slug);
CREATE INDEX idx_work_categories_is_active ON work_categories(is_active);
CREATE INDEX idx_work_categories_order ON work_categories(order_position);

-- 3. Enable RLS if not already enabled
ALTER TABLE work_categories ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read active categories" ON work_categories;
DROP POLICY IF EXISTS "Allow admin all operations" ON work_categories;

-- 5. Create RLS policies for work_categories
-- Allow anyone to read active categories
CREATE POLICY "Allow public read active categories" ON work_categories
FOR SELECT USING (is_active = true);

-- Allow authenticated admins to read all categories
CREATE POLICY "Allow authenticated read all categories" ON work_categories
FOR SELECT USING (auth.role() = 'authenticated_user');

-- Allow authenticated admins to insert categories
CREATE POLICY "Allow authenticated insert categories" ON work_categories
FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

-- Allow authenticated admins to update categories
CREATE POLICY "Allow authenticated update categories" ON work_categories
FOR UPDATE USING (auth.role() = 'authenticated_user')
WITH CHECK (auth.role() = 'authenticated_user');

-- Allow authenticated admins to delete categories
CREATE POLICY "Allow authenticated delete categories" ON work_categories
FOR DELETE USING (auth.role() = 'authenticated_user');

-- 5. Storage bucket policies for work-categories bucket
-- Allow public read access to category cover images
CREATE POLICY "Allow public read work category images" ON storage.objects
FOR SELECT
USING (bucket_id = 'work-categories' AND auth.role() = 'authenticated_user' OR auth.role() = 'anon');

-- Allow authenticated users to upload category images
CREATE POLICY "Allow authenticated upload work category images" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'work-categories' AND auth.role() = 'authenticated_user');

-- Allow authenticated users to update category images
CREATE POLICY "Allow authenticated update work category images" ON storage.objects
FOR UPDATE
USING (bucket_id = 'work-categories' AND auth.role() = 'authenticated_user');

-- Allow authenticated users to delete category images
CREATE POLICY "Allow authenticated delete work category images" ON storage.objects
FOR DELETE
USING (bucket_id = 'work-categories' AND auth.role() = 'authenticated_user');

-- Optional: Update existing categories with a default order
UPDATE work_categories 
SET order_position = ROW_NUMBER() OVER (ORDER BY created_at) - 1
WHERE order_position = 0;

-- Example: Add some sample categories if table is empty
INSERT INTO work_categories (name, slug, description, is_active)
SELECT * FROM (
  VALUES
    ('Residential', 'residential', 'Residential projects and designs', true),
    ('Commercial', 'commercial', 'Commercial space projects', true),
    ('Institutional', 'institutional', 'Institutional and public spaces', true),
    ('Interior Design', 'interior-design', 'Interior design and furnishing', true)
) AS t(name, slug, description, is_active)
WHERE NOT EXISTS (SELECT 1 FROM work_categories);

-- Verify the changes
SELECT 
  id,
  name,
  slug,
  cover_image,
  order_position,
  is_active,
  created_at,
  updated_at
FROM work_categories
ORDER BY order_position ASC;
