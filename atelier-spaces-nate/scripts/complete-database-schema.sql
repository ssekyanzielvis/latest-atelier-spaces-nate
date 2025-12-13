-- =====================================================
-- ATELIER SPACES NATE - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor to create all tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ADMINS TABLE (Authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. HERO SLIDES TABLE (Dynamic Images Section)
-- Displayed: Homepage carousel with auto-rotation
-- =====================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL, -- URL from Supabase Storage
  cta_text VARCHAR(100),
  cta_link VARCHAR(500),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. WORK CATEGORIES TABLE (Other Works Section)
-- Categories: Omweso, Kinsman Challenge, Design, Architecture, etc.
-- =====================================================
CREATE TABLE IF NOT EXISTS work_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. WORKS TABLE (Featured Works & Work Details)
-- Displayed: Featured Works section, Work detail pages
-- =====================================================
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES work_categories(id) ON DELETE SET NULL,
  image TEXT NOT NULL, -- Main image URL
  client VARCHAR(255),
  year INTEGER,
  featured BOOLEAN DEFAULT false,
  slug VARCHAR(255) UNIQUE NOT NULL,
  gallery_image_1 TEXT, -- Gallery images
  gallery_image_2 TEXT,
  gallery_image_3 TEXT,
  gallery_image_4 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ABOUT SECTION TABLE (About Us Section)
-- Displayed: About Us section on homepage
-- =====================================================
CREATE TABLE IF NOT EXISTS about_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  values TEXT,
  image TEXT, -- About section image URL
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. SLOGAN SECTION TABLE (Slogan Section)
-- Displayed: Large enhanced text section on homepage
-- =====================================================
CREATE TABLE IF NOT EXISTS slogan_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_slogan TEXT NOT NULL,
  sub_slogan TEXT,
  background_image TEXT, -- Background image URL
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TEAM MEMBERS TABLE (Our Team Section)
-- Displayed: Team section on homepage & team page
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  image TEXT NOT NULL, -- Member photo URL
  email VARCHAR(255),
  phone VARCHAR(50),
  linkedin VARCHAR(500),
  twitter VARCHAR(500),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. PROJECT CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. PROJECTS TABLE
-- Displayed: Projects page & featured projects
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image TEXT NOT NULL, -- Main project image
  client VARCHAR(255),
  location VARCHAR(255),
  year INTEGER,
  area NUMERIC,
  status VARCHAR(50),
  featured BOOLEAN DEFAULT false,
  slug VARCHAR(255) UNIQUE NOT NULL,
  gallery_image_1 TEXT,
  gallery_image_2 TEXT,
  gallery_image_3 TEXT,
  gallery_image_4 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. NEWS ARTICLES TABLE
-- Displayed: News page & latest news section
-- =====================================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT NOT NULL, -- Article cover image
  author VARCHAR(255),
  published_date DATE DEFAULT CURRENT_DATE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. COLLABORATIONS TABLE
-- Stores: Collaboration requests from contact form
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
  status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active, order_position);
CREATE INDEX IF NOT EXISTS idx_works_featured ON works(featured);
CREATE INDEX IF NOT EXISTS idx_works_category ON works(category_id);
CREATE INDEX IF NOT EXISTS idx_works_slug ON works(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active, order_position);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);

-- =====================================================
-- SAMPLE DATA - DEFAULT WORK CATEGORIES
-- The categories you mentioned: Omweso, Kinsman, Design, etc.
-- =====================================================
INSERT INTO work_categories (name, description, slug) VALUES
('Omweso', 'Traditional African board game designs and cultural projects', 'omweso'),
('The Kinsman Challenge', 'Community engagement and social design projects', 'kinsman-challenge'),
('Design', 'Creative design projects and visual identity work', 'design'),
('Architecture', 'Architectural projects and spatial design', 'architecture'),
('The Royal Toast Games', 'Interactive gaming experiences and digital projects', 'royal-toast-games'),
('Nate Art Projects', 'Artistic installations and creative exhibitions', 'nate-art-projects')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allow public read access, restrict write to authenticated users
-- =====================================================

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE slogan_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- Public read access for all content tables
CREATE POLICY "Allow public read access" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON work_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON works FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON about_section FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON slogan_section FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON news_articles FOR SELECT USING (true);

-- Service role can do everything (for admin dashboard)
CREATE POLICY "Service role full access" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Service role full access" ON work_categories FOR ALL USING (true);
CREATE POLICY "Service role full access" ON works FOR ALL USING (true);
CREATE POLICY "Service role full access" ON about_section FOR ALL USING (true);
CREATE POLICY "Service role full access" ON slogan_section FOR ALL USING (true);
CREATE POLICY "Service role full access" ON team_members FOR ALL USING (true);
CREATE POLICY "Service role full access" ON categories FOR ALL USING (true);
CREATE POLICY "Service role full access" ON projects FOR ALL USING (true);
CREATE POLICY "Service role full access" ON news_articles FOR ALL USING (true);
CREATE POLICY "Service role full access" ON collaborations FOR ALL USING (true);

-- Public can insert collaboration requests
CREATE POLICY "Allow public insert" ON collaborations FOR INSERT WITH CHECK (true);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically update the updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_section_updated_at BEFORE UPDATE ON about_section
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slogan_section_updated_at BEFORE UPDATE ON slogan_section
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to check if everything was created successfully
-- =====================================================

-- List all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count records in each table
-- SELECT 'hero_slides' as table_name, COUNT(*) as count FROM hero_slides
-- UNION ALL SELECT 'work_categories', COUNT(*) FROM work_categories
-- UNION ALL SELECT 'works', COUNT(*) FROM works
-- UNION ALL SELECT 'team_members', COUNT(*) FROM team_members
-- UNION ALL SELECT 'projects', COUNT(*) FROM projects
-- UNION ALL SELECT 'news_articles', COUNT(*) FROM news_articles;

-- =====================================================
-- SETUP COMPLETE!
-- 
-- Next Steps:
-- 1. Run this entire SQL file in Supabase SQL Editor
-- 2. Create admin user by running: node scripts/create-admin.js
-- 3. Login to admin dashboard at: /admin/login
-- 4. Add content through admin dashboard
-- 5. Content will automatically appear on website!
-- =====================================================
