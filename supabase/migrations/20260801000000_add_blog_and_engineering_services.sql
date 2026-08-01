-- Blog posts managed by the CMS and rendered on the public portfolio.
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL DEFAULT 'Engineering Insights',
  post_type TEXT DEFAULT 'Article',
  difficulty TEXT DEFAULT 'All levels',
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image_url TEXT,
  external_url TEXT,
  published_at TIMESTAMPTZ,
  reading_time_minutes INT,
  seo_title TEXT,
  seo_description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_reading_time_positive CHECK (reading_time_minutes IS NULL OR reading_time_minutes > 0)
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_visible = true AND is_published = true);
CREATE POLICY "Auth can manage blog posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Flexible service cards for mechanical design, analysis, and manufacturing work.
CREATE TABLE public.engineering_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Mechanical Design',
  description TEXT,
  icon TEXT DEFAULT 'cog',
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  tools TEXT[] NOT NULL DEFAULT '{}',
  standards TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  turnaround TEXT,
  engagement_type TEXT DEFAULT 'Project-based',
  cta_label TEXT,
  cta_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.engineering_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible engineering services"
  ON public.engineering_services FOR SELECT
  USING (is_visible = true);
CREATE POLICY "Auth can manage engineering services"
  ON public.engineering_services FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE TRIGGER update_engineering_services_updated_at
  BEFORE UPDATE ON public.engineering_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Make both tables available to the existing Supabase Realtime channel.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'blog_posts'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'engineering_services'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.engineering_services';
    END IF;
  END IF;
END
$$;

-- Useful mechanical-design defaults. Every field remains editable in the CMS.
INSERT INTO public.engineering_services
  (title, category, description, icon, capabilities, tools, deliverables, turnaround, engagement_type, is_featured, sort_order)
VALUES
  (
    'Parametric 3D CAD Modelling',
    'Design',
    'Production-ready part and assembly models built for clear design intent and easy revision.',
    'box',
    ARRAY['Parts and assemblies', 'Design configurations', 'Top-down and bottom-up modelling'],
    ARRAY['SOLIDWORKS', 'Autodesk Inventor', 'Fusion 360', 'Creo'],
    ARRAY['Native CAD files', 'STEP / Parasolid exports', 'Exploded views'],
    '2-7 business days',
    'Project-based',
    true,
    0
  ),
  (
    'Machine & Mechanism Design',
    'Design',
    'Practical mechanisms, fixtures, and machine subassemblies designed around loads, motion, safety, and maintainability.',
    'cog',
    ARRAY['Mechanism layout', 'Bearing and shaft selection', 'Tolerance and fit definition'],
    ARRAY['SOLIDWORKS', 'Inventor', 'KISSsoft', 'Excel'],
    ARRAY['Assembly model', 'Design calculations', 'Bill of materials'],
    '1-3 weeks',
    'Project-based',
    true,
    1
  ),
  (
    'Manufacturing Drawings & GD&T',
    'Documentation',
    'Clear, standards-based drawings that communicate dimensions, tolerances, finishes, and inspection requirements.',
    'ruler',
    ARRAY['Detail and assembly drawings', 'Tolerance stacks', 'ASME Y14.5 / ISO GD&T'],
    ARRAY['SOLIDWORKS Drawings', 'AutoCAD', 'Inventor'],
    ARRAY['PDF and DWG drawings', 'Inspection dimensions', 'Drawing register'],
    '1-5 business days',
    'Fixed scope',
    false,
    2
  ),
  (
    'FEA & Design Validation',
    'Analysis',
    'Simulation-led checks that identify stress, deformation, thermal, and buckling risks before manufacture.',
    'chart',
    ARRAY['Static structural analysis', 'Modal and buckling checks', 'Design iteration support'],
    ARRAY['ANSYS', 'SOLIDWORKS Simulation', 'Abaqus'],
    ARRAY['Simulation report', 'Result plots', 'Improvement recommendations'],
    '3-10 business days',
    'Analysis package',
    true,
    3
  ),
  (
    'DFM/DFA & Production Support',
    'Manufacturing',
    'Design reviews focused on cost, manufacturability, assembly effort, quality, and supplier readiness.',
    'wrench',
    ARRAY['Machining and fabrication review', 'Assembly simplification', 'Cost-down recommendations'],
    ARRAY['DFM checklists', 'CAD markup', 'Tolerance analysis'],
    ARRAY['DFM report', 'Revised CAD', 'Supplier-ready package'],
    '2-7 business days',
    'Consulting',
    false,
    4
  ),
  (
    'Reverse Engineering',
    'Design',
    'Accurate reconstruction of legacy or physical components into clean, editable CAD and drawing packages.',
    'scan',
    ARRAY['Measurement planning', 'Mesh-to-CAD reconstruction', 'Legacy drawing conversion'],
    ARRAY['Geomagic Design X', 'SOLIDWORKS', '3D scanning'],
    ARRAY['Editable CAD model', 'Manufacturing drawing', 'Deviation summary'],
    '3-10 business days',
    'Project-based',
    false,
    5
  ),
  (
    'Sheet Metal & Weldment Design',
    'Manufacturing',
    'Fabrication-aware enclosures, frames, guards, and structures with practical bends, joints, and cut lists.',
    'layers',
    ARRAY['Flat-pattern development', 'Frame and weldment design', 'Bend and joint detailing'],
    ARRAY['SOLIDWORKS', 'Inventor', 'AutoCAD'],
    ARRAY['DXF flat patterns', 'Cut lists', 'Fabrication drawings'],
    '3-10 business days',
    'Project-based',
    false,
    6
  ),
  (
    'Product Development & Prototyping',
    'Development',
    'Concept-to-prototype engineering with structured iteration, supplier communication, and design verification.',
    'lightbulb',
    ARRAY['Concept development', 'Prototype iteration', 'Design verification planning'],
    ARRAY['CAD', 'Rapid prototyping', 'BOM tools'],
    ARRAY['Concept package', 'Prototype-ready CAD', 'Verification checklist'],
    '2-6 weeks',
    'Milestone-based',
    true,
    7
  );

UPDATE public.engineering_services
SET
  cta_label = 'Discuss this service',
  cta_url = '#contact',
  standards = CASE title
    WHEN 'Parametric 3D CAD Modelling' THEN ARRAY['ASME Y14.5', 'ISO 2768']
    WHEN 'Machine & Mechanism Design' THEN ARRAY['ISO 12100', 'ISO 286', 'AGMA']
    WHEN 'Manufacturing Drawings & GD&T' THEN ARRAY['ASME Y14.5', 'ISO 1101', 'ISO 2768']
    WHEN 'FEA & Design Validation' THEN ARRAY['ASME V&V 10', 'EN 1993']
    WHEN 'DFM/DFA & Production Support' THEN ARRAY['ISO 9001', 'Supplier specifications']
    WHEN 'Reverse Engineering' THEN ARRAY['ASME Y14.5', 'ISO 2768']
    WHEN 'Sheet Metal & Weldment Design' THEN ARRAY['AWS D1.1', 'ISO 2553', 'DIN 6935']
    WHEN 'Product Development & Prototyping' THEN ARRAY['ISO 12100', 'ISO 9001']
    ELSE standards
  END;
