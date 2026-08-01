ALTER TABLE public.profile
  ALTER COLUMN name SET DEFAULT 'Hafiz Muhammad Hassan Mustafa',
  ALTER COLUMN brand_name SET DEFAULT 'Hafiz Muhammad Hassan Mustafa',
  ALTER COLUMN brand_initials SET DEFAULT 'HMHM',
  ALTER COLUMN site_title SET DEFAULT 'Hafiz Muhammad Hassan Mustafa | Mechanical Design Engineer',
  ALTER COLUMN photo_url SET DEFAULT '/hassan-mustafa.jpg';

UPDATE public.profile
SET
  name = 'Hafiz Muhammad Hassan Mustafa',
  brand_name = 'Hafiz Muhammad Hassan Mustafa',
  brand_initials = 'HMHM',
  site_title = 'Hafiz Muhammad Hassan Mustafa | Mechanical Design Engineer',
  photo_url = '/hassan-mustafa.jpg';

UPDATE public.profile
SET
  tagline = 'Mechanical Design Engineer · CAD · FEA · DFM',
  meta_description = 'Mechanical Design Engineer specializing in CAD, machine design, GD&T, FEA, DFM, and product development.'
WHERE
  tagline ILIKE '%AI Engineer%'
  OR tagline ILIKE '%Machine Learning%'
  OR meta_description ILIKE '%AI Engineer%';
