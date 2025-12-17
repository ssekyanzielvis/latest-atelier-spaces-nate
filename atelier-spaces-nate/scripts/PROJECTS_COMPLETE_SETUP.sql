-- ============================================================
-- COMPLETE PROJECTS SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- ============================================================

-- Step 1: Create the projects table
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Step 3: Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read published projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated read all projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated insert projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated delete projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated all projects" ON projects;

-- Step 5: Create new RLS policies

-- Allow anyone to read published projects
CREATE POLICY "Allow public read published projects" ON projects
FOR SELECT 
USING (is_published = true);

-- Allow authenticated users full access (admin operations)
CREATE POLICY "Allow authenticated all projects" ON projects
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- VERIFY SETUP
-- ============================================================

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'projects';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Projects table setup complete!';
  RAISE NOTICE '📋 Table: projects created with % columns', 
    (SELECT count(*) FROM information_schema.columns WHERE table_name = 'projects');
  RAISE NOTICE '🔒 RLS: enabled with % policies', 
    (SELECT count(*) FROM pg_policies WHERE tablename = 'projects');
END $$;
