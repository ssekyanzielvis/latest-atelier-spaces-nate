-- =====================================================
-- COLLABORATIONS TABLE SETUP
-- Complete setup for collaboration requests system
-- =====================================================

-- Drop existing table if needed (CAUTION: removes all data)
-- DROP TABLE IF EXISTS collaborations CASCADE;

-- 1. CREATE COLLABORATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  project_type VARCHAR(100),
  budget VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
CREATE INDEX IF NOT EXISTS idx_collaborations_created ON collaborations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collaborations_email ON collaborations(email);

-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (if any)
-- =====================================================
DROP POLICY IF EXISTS "allow_public_insert_collaborations" ON collaborations;
DROP POLICY IF EXISTS "allow_authenticated_all_collaborations" ON collaborations;
DROP POLICY IF EXISTS "Service role full access" ON collaborations;
DROP POLICY IF EXISTS "Allow public insert" ON collaborations;

-- 5. CREATE RLS POLICIES
-- =====================================================

-- Allow anyone to submit collaboration requests (INSERT)
CREATE POLICY "allow_public_insert_collaborations" 
  ON collaborations 
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users (admins) to view all collaborations (SELECT)
CREATE POLICY "allow_authenticated_select_collaborations" 
  ON collaborations 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to update collaboration status
CREATE POLICY "allow_authenticated_update_collaborations" 
  ON collaborations 
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to delete collaborations
CREATE POLICY "allow_authenticated_delete_collaborations" 
  ON collaborations 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 6. VERIFY SETUP
-- =====================================================
-- Check table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'collaborations'
) AS table_exists;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'collaborations';

-- Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'collaborations';

-- Check policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'collaborations';

-- Count existing records
SELECT COUNT(*) as total_collaborations FROM collaborations;

-- View all collaborations (if any)
SELECT 
  id,
  name,
  email,
  company,
  project_type,
  status,
  created_at
FROM collaborations
ORDER BY created_at DESC;
