CREATE TABLE public.section_visibility (
  section_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read section visibility"
  ON public.section_visibility FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage section visibility"
  ON public.section_visibility FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_section_visibility_updated_at
  BEFORE UPDATE ON public.section_visibility
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
    AND NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'section_visibility'
    )
  THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.section_visibility';
  END IF;
END
$$;

INSERT INTO public.section_visibility (section_key, label, is_visible, sort_order)
VALUES
  ('profile', 'Profile & Hero', true, 0),
  ('hero_stats', 'Hero Stats', true, 1),
  ('services', 'Services', true, 2),
  ('experience', 'Experience', true, 3),
  ('projects', 'Projects', true, 4),
  ('blog', 'Blog', true, 5),
  ('research', 'Research', true, 6),
  ('team', 'Team', true, 7),
  ('certificates', 'Certificates', true, 8),
  ('skills', 'Skills', true, 9)
ON CONFLICT (section_key) DO UPDATE
SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order;

