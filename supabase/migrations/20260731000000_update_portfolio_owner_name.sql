ALTER TABLE public.profile
  ALTER COLUMN name SET DEFAULT 'Hafiz Muhammad Hassan Mustafa',
  ALTER COLUMN brand_name SET DEFAULT 'Hafiz Muhammad Hassan Mustafa',
  ALTER COLUMN brand_initials SET DEFAULT 'HMHM',
  ALTER COLUMN site_title SET DEFAULT 'Hafiz Muhammad Hassan Mustafa | AI Engineer',
  ALTER COLUMN photo_url SET DEFAULT '/hassan-mustafa.jpg';

UPDATE public.profile
SET
  name = 'Hafiz Muhammad Hassan Mustafa',
  brand_name = 'Hafiz Muhammad Hassan Mustafa',
  brand_initials = 'HMHM',
  site_title = 'Hafiz Muhammad Hassan Mustafa | AI Engineer',
  photo_url = '/hassan-mustafa.jpg';
