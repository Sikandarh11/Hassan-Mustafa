ALTER TABLE public.profile
  ALTER COLUMN accent_color SET DEFAULT '#F0AF22';

UPDATE public.profile
SET accent_color = '#F0AF22';
