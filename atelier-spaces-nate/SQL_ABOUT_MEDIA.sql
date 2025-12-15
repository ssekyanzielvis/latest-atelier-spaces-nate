-- SQL Queries for About Media Section
-- Run these in your Supabase SQL Editor

-- 1. Create the about_media table
CREATE TABLE IF NOT EXISTS about_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  caption TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'video')),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_about_media_order ON about_media(order_position);
CREATE INDEX IF NOT EXISTS idx_about_media_active ON about_media(is_active);
CREATE INDEX IF NOT EXISTS idx_about_media_type ON about_media(file_type);
CREATE INDEX IF NOT EXISTS idx_about_media_created ON about_media(created_at);

-- 2. Enable Row Level Security
ALTER TABLE about_media ENABLE ROW LEVEL SECURITY;

-- 3. Create storage bucket for about media (images and videos)
-- Run this in the SQL Editor or create the bucket via Supabase Storage UI:
-- Bucket name: about-media
-- Privacy: Private (use RLS policies to control access)
-- File size limit: 100MB

-- 4. RLS Policies for about_media table
-- Allow public to view active media
CREATE POLICY "Allow public to view active about media"
  ON about_media
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated admins to insert, update, delete
CREATE POLICY "Allow admins to manage about media"
  ON about_media
  FOR ALL
  USING (auth.jwt() ->> 'email' != '');

-- 5. Storage bucket policies (configure in Supabase Storage UI)
-- For about-media bucket:
-- - SELECT: (request.auth.role = 'authenticated')
-- - INSERT: (request.auth.role = 'authenticated')
-- - UPDATE: (request.auth.role = 'authenticated')
-- - DELETE: (request.auth.role = 'authenticated')

-- Example data insert:
INSERT INTO about_media (title, caption, file_url, file_type, order_position, is_active) VALUES
  ('Mweso Board', 'Mweso board mini video', 'about-media/mweso-board.mp4', 'video', 1, true),
  ('Uganda Cup', 'Photo of Uganda Cup with Vipers SC', 'about-media/uganda-cup.jpg', 'image', 2, true),
  ('Londonga Arch', 'Render of Londonga Arch Project', 'about-media/londonga-arch.jpg', 'image', 3, true);

-- To delete all about_media records:
-- DELETE FROM about_media;

-- To view all records:
-- SELECT * FROM about_media ORDER BY order_position ASC;

-- To view stats:
-- SELECT 
--   COUNT(*) as total_items,
--   SUM(CASE WHEN file_type = 'image' THEN 1 ELSE 0 END) as total_images,
--   SUM(CASE WHEN file_type = 'video' THEN 1 ELSE 0 END) as total_videos
-- FROM about_media;
