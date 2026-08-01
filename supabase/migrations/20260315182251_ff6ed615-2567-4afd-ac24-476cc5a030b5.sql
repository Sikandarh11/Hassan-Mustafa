
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profile table (single row)
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Hafiz Muhammad Hassan Mustafa',
  tagline TEXT DEFAULT 'AI Engineer · ML Researcher · Full-Stack AI Systems',
  about_text TEXT,
  photo_url TEXT,
  resume_url TEXT,
  phone TEXT,
  email TEXT,
  linkedin TEXT,
  github TEXT,
  website TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Authenticated can update profile" ON public.profile FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can insert profile" ON public.profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Hero stats
CREATE TABLE public.hero_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon_type TEXT DEFAULT 'check',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read hero_stats" ON public.hero_stats FOR SELECT USING (true);
CREATE POLICY "Auth can manage hero_stats" ON public.hero_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_hero_stats_updated_at BEFORE UPDATE ON public.hero_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Typewriter lines
CREATE TABLE public.typewriter_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.typewriter_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read typewriter_lines" ON public.typewriter_lines FOR SELECT USING (true);
CREATE POLICY "Auth can manage typewriter_lines" ON public.typewriter_lines FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Experiences
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  date_start TEXT,
  date_end TEXT,
  location TEXT,
  bullets TEXT[] DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Auth can manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  is_private BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible projects" ON public.projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Auth can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Research
CREATE TABLE public.research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'in_progress',
  link TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read research" ON public.research FOR SELECT USING (true);
CREATE POLICY "Auth can manage research" ON public.research FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_research_updated_at BEFORE UPDATE ON public.research FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Team members
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Auth can manage team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Certificates
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT,
  link TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Auth can manage certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Skills
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Auth can manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
CREATE POLICY "Public can read portfolio files" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Auth can upload portfolio files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Auth can update portfolio files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "Auth can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');
