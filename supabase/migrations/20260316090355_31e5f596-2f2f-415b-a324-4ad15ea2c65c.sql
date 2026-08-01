
-- Add new columns to profile
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS brand_name text DEFAULT 'Hafiz Muhammad Hassan Mustafa';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS brand_initials text DEFAULT 'HMHM';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#F0AF22';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS site_title text DEFAULT 'Hafiz Muhammad Hassan Mustafa | Mechanical Design Engineer';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS meta_description text DEFAULT 'Mechanical Design Engineer specializing in CAD, machine design, GD&T, FEA, DFM, and product development.';

-- Add new columns to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS alt_text text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS flip_preview_text text;

-- Add new columns to team_members
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS alt_text text;

-- Add new columns to hero_stats
ALTER TABLE public.hero_stats ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

-- Add new columns to certificates
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS issuer_color text;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS year text;
