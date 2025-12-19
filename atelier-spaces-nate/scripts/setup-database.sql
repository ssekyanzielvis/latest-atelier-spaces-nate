-- Atelier Spaces Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image TEXT NOT NULL,
  client VARCHAR(200),
  location VARCHAR(200),
  year INTEGER,
  area DECIMAL(10,2),
  status VARCHAR(50),
  featured BOOLEAN DEFAULT false,
  slug VARCHAR(200) NOT NULL UNIQUE,
  gallery_image_1 TEXT,
  gallery_image_2 TEXT,
  gallery_image_3 TEXT,
  gallery_image_4 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- 3. News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT NOT NULL,
  author VARCHAR(100),
  published_date DATE DEFAULT CURRENT_DATE,
  slug VARCHAR(200) NOT NULL UNIQUE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_date);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news_articles(featured);

-- 4. Collaborations Table
CREATE TABLE IF NOT EXISTS collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(100) NOT NULL,
  company VARCHAR(200),
  phone VARCHAR(20),
  project_type VARCHAR(100),
  budget VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);
CREATE INDEX IF NOT EXISTS idx_collaborations_created ON collaborations(created_at);

-- 5. Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  cta_text VARCHAR(50),
  cta_link VARCHAR(200),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(order_position);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active);

-- 6. Work Categories Table
CREATE TABLE IF NOT EXISTS work_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_work_categories_slug ON work_categories(slug);

-- 7. Works Table
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES work_categories(id) ON DELETE SET NULL,
  image TEXT NOT NULL,
  client VARCHAR(200),
  year INTEGER,
  featured BOOLEAN DEFAULT false,
  slug VARCHAR(200) NOT NULL UNIQUE,
  gallery_image_1 TEXT,
  gallery_image_2 TEXT,
  gallery_image_3 TEXT,
  gallery_image_4 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_works_slug ON works(slug);
CREATE INDEX IF NOT EXISTS idx_works_category ON works(category_id);
CREATE INDEX IF NOT EXISTS idx_works_featured ON works(featured);

-- 8. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  position VARCHAR(100) NOT NULL,
  bio TEXT,
  image TEXT NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  linkedin VARCHAR(200),
  twitter VARCHAR(200),
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_order ON team_members(order_position);
CREATE INDEX IF NOT EXISTS idx_team_active ON team_members(is_active);

-- 9. About Section Table (Singleton)
CREATE TABLE IF NOT EXISTS about_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  values TEXT,
  image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Slogan Section Table (Singleton)
CREATE TABLE IF NOT EXISTS slogan_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slogan TEXT NOT NULL,
  founder_name VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(200),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE slogan_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Public read access hero" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON work_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON works FOR SELECT USING (true);
CREATE POLICY "Public read access team" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON about_section FOR SELECT USING (true);
CREATE POLICY "Public read access" ON slogan_section FOR SELECT USING (true);

-- Public insert for collaborations (contact form)
CREATE POLICY "Public insert access" ON collaborations FOR INSERT WITH CHECK (true);

-- Admin full access - Note: You'll need to authenticate via your app
-- For now, we'll allow service role full access
CREATE POLICY "Service role full access" ON categories FOR ALL USING (true);
CREATE POLICY "Service role full access" ON projects FOR ALL USING (true);
CREATE POLICY "Service role full access" ON news_articles FOR ALL USING (true);
CREATE POLICY "Service role full access" ON collaborations FOR ALL USING (true);
CREATE POLICY "Service role full access" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Service role full access" ON work_categories FOR ALL USING (true);
CREATE POLICY "Service role full access" ON works FOR ALL USING (true);
CREATE POLICY "Service role full access" ON team_members FOR ALL USING (true);
CREATE POLICY "Service role full access" ON about_section FOR ALL USING (true);
CREATE POLICY "Service role full access" ON slogan_section FOR ALL USING (true);
CREATE POLICY "Service role full access" ON admins FOR ALL USING (true);

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('atelier-media', 'atelier-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'atelier-media');

CREATE POLICY "Service role upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'atelier-media');

CREATE POLICY "Service role delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'atelier-media');
