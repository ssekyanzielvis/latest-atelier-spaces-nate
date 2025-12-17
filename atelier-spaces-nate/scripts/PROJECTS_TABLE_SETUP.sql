-- ============================================================
-- CREATE PROJECTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  client VARCHAR(255),
  year INTEGER,
  designer VARCHAR(255),
  duration VARCHAR(100),
  image TEXT NOT NULL,
  other_info TEXT,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ============================================================
-- ENABLE RLS (Row Level Security)
-- ============================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CREATE RLS POLICIES FOR PROJECTS TABLE
-- ============================================================

-- 1. Allow anyone to read published projects
DROP POLICY IF EXISTS "Allow public read published projects" ON projects;
CREATE POLICY "Allow public read published projects" ON projects
FOR SELECT USING (is_published = true);

-- 2. Allow authenticated users (admins) to read all projects
DROP POLICY IF EXISTS "Allow authenticated read all projects" ON projects;
CREATE POLICY "Allow authenticated read all projects" ON projects
FOR SELECT USING (auth.role() = 'authenticated_user');

-- 3. Allow authenticated users to insert projects
DROP POLICY IF EXISTS "Allow authenticated insert projects" ON projects;
CREATE POLICY "Allow authenticated insert projects" ON projects
FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

-- 4. Allow authenticated users to update projects
DROP POLICY IF EXISTS "Allow authenticated update projects" ON projects;
CREATE POLICY "Allow authenticated update projects" ON projects
FOR UPDATE 
  USING (auth.role() = 'authenticated_user')
  WITH CHECK (auth.role() = 'authenticated_user');

-- 5. Allow authenticated users to delete projects
DROP POLICY IF EXISTS "Allow authenticated delete projects" ON projects;
CREATE POLICY "Allow authenticated delete projects" ON projects
FOR DELETE USING (auth.role() = 'authenticated_user');

-- ============================================================
-- SETUP STORAGE BUCKET RLS POLICIES FOR PROJECT IMAGES
-- ============================================================

-- Drop old storage policies if they exist
DROP POLICY IF EXISTS "Allow public read projects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload projects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update projects storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete projects storage" ON storage.objects;

-- 1. Allow public to read project images
CREATE POLICY "Allow public read projects" ON storage.objects
FOR SELECT
USING (bucket_id = 'projects');

-- 2. Allow authenticated users to upload project images
CREATE POLICY "Allow authenticated upload projects" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated_user');

-- 3. Allow authenticated users to update project images
CREATE POLICY "Allow authenticated update projects storage" ON storage.objects
FOR UPDATE
USING (bucket_id = 'projects' AND auth.role() = 'authenticated_user')
WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated_user');

-- 4. Allow authenticated users to delete project images
CREATE POLICY "Allow authenticated delete projects storage" ON storage.objects
FOR DELETE
USING (bucket_id = 'projects' AND auth.role() = 'authenticated_user');

-- ============================================================
-- VERIFY TABLES AND POLICIES ARE CREATED
-- ============================================================

-- Verify projects table exists and has correct columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Verify RLS policies are in place
SELECT schemaname, tablename, policyname, permissive, roles
FROM pg_policies
WHERE tablename IN ('projects', 'objects')
  AND schemaname IN ('public', 'storage')
ORDER BY tablename, policyname;
