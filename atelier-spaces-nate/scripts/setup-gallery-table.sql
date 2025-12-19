-- Complete Gallery System Setup for Supabase
-- Run this entire script in Supabase SQL Editor

-- 1. Drop existing table if you want to start fresh (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS gallery CASCADE;

-- 2. Create the gallery table with improved structure
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(100),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(order_position);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON gallery(created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to view active gallery items" ON gallery;
DROP POLICY IF EXISTS "Allow admins to manage gallery" ON gallery;

-- 6. Create RLS Policies for gallery table
-- Allow public to view active gallery items
CREATE POLICY "Allow public to view active gallery items"
  ON gallery
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users (admins) to manage all gallery items
CREATE POLICY "Allow admins to manage gallery"
  ON gallery
  FOR ALL
  USING (
    auth.role() = 'authenticated'
  );

-- 7. Create storage bucket for gallery (if not exists)
-- Note: This needs to be done via Supabase Storage UI or using the storage API
-- Bucket name: gallery
-- Privacy: Public (for easier access) or Private with policies
-- Allowed file types: image/jpeg, image/png, image/webp, image/gif
-- Max file size: 10MB

-- 8. Storage bucket policies (to be configured in Supabase Storage UI)
-- For 'gallery' bucket:
-- Policy for viewing (SELECT):
--   Target roles: public
--   Policy definition: (bucket_id = 'gallery')

-- Policy for uploading (INSERT):
--   Target roles: authenticated
--   Policy definition: (bucket_id = 'gallery')

-- Policy for updating (UPDATE):
--   Target roles: authenticated
--   Policy definition: (bucket_id = 'gallery')

-- Policy for deleting (DELETE):
--   Target roles: authenticated
--   Policy definition: (bucket_id = 'gallery')

-- 9. Add some sample data (optional - remove if not needed)
INSERT INTO gallery (title, description, image_url, category, order_position, is_active) VALUES
  ('Modern Architecture', 'A stunning example of contemporary design', 'gallery/sample-1.jpg', 'Architecture', 1, true),
  ('Urban Planning', 'Innovative urban development project', 'gallery/sample-2.jpg', 'Planning', 2, true),
  ('Interior Design', 'Elegant interior space design', 'gallery/sample-3.jpg', 'Interior', 3, true)
ON CONFLICT DO NOTHING;

-- 10. Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS set_gallery_updated_at ON gallery;
CREATE TRIGGER set_gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- 12. Useful queries for testing

-- View all gallery items
-- SELECT * FROM gallery ORDER BY order_position ASC, created_at DESC;

-- Count gallery items
-- SELECT COUNT(*) as total_items FROM gallery;

-- Count active vs inactive
-- SELECT 
--   is_active,
--   COUNT(*) as count
-- FROM gallery
-- GROUP BY is_active;

-- View by category
-- SELECT category, COUNT(*) as count
-- FROM gallery
-- WHERE is_active = true
-- GROUP BY category;

COMMENT ON TABLE gallery IS 'Stores gallery images and media items for the website';
COMMENT ON COLUMN gallery.order_position IS 'Display order (lower numbers appear first)';
COMMENT ON COLUMN gallery.is_active IS 'Whether item is visible on public site';
COMMENT ON COLUMN gallery.category IS 'Optional category for filtering gallery items';
