-- Add link column to experiences for certificate/document links
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS link text;
