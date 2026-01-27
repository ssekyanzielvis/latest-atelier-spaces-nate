-- Add new image columns to moon_voyage table
ALTER TABLE moon_voyage 
ADD COLUMN IF NOT EXISTS vision_image TEXT,
ADD COLUMN IF NOT EXISTS funding_image TEXT;
