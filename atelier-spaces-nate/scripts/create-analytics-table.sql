-- Create analytics table for tracking website visits
CREATE TABLE IF NOT EXISTS site_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON site_analytics(page_path);

-- Create a summary table for daily stats
CREATE TABLE IF NOT EXISTS site_analytics_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial summary row for today
INSERT INTO site_analytics_summary (date, total_visits, unique_visitors)
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (date) DO NOTHING;

COMMENT ON TABLE site_analytics IS 'Tracks individual page visits';
COMMENT ON TABLE site_analytics_summary IS 'Daily aggregated visit statistics';
