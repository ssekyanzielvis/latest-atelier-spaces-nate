-- Create moon_voyage table
CREATE TABLE IF NOT EXISTS moon_voyage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_image TEXT,
  vision_title TEXT NOT NULL,
  vision_content TEXT NOT NULL,
  challenge_title TEXT NOT NULL,
  challenge_content TEXT NOT NULL,
  challenge_date TEXT,
  challenge_location TEXT,
  funding_goal TEXT,
  funding_description TEXT,
  board_price TEXT,
  support_price TEXT,
  payment_momo TEXT,
  payment_bank TEXT,
  payment_message TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE moon_voyage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON moon_voyage;
DROP POLICY IF EXISTS "Allow admin full access" ON moon_voyage;

-- Allow public read access to active entries
CREATE POLICY "Allow public read access" ON moon_voyage
  FOR SELECT USING (is_active = true);

-- Allow authenticated users full access (admins)
CREATE POLICY "Allow admin full access" ON moon_voyage
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_moon_voyage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS moon_voyage_updated_at ON moon_voyage;
CREATE TRIGGER moon_voyage_updated_at
  BEFORE UPDATE ON moon_voyage
  FOR EACH ROW
  EXECUTE FUNCTION update_moon_voyage_updated_at();
