-- Add logo_url column to skills table for custom skill logos
ALTER TABLE skills ADD COLUMN IF NOT EXISTS logo_url text;
