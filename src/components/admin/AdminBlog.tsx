import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

type AdminBlogPost = BlogPost & {
  auto_slug: boolean;
  tags_input: string;
};

type MechanicalBlogTemplate = {
  key: string;
  label: string;
  description: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  post_type: string;
  difficulty: string;
  tags: string[];
  reading_time_minutes: number | null;
  seo_title: string | null;
  seo_description: string | null;
};

const CATEGORY_OPTIONS = [
  "Mechanical Engineering",
  "CAD & Product Development",
  "Machine Design",
  "Simulation & FEA",
  "GD&T & Tolerancing",
  "DFM & Manufacturing",
  "Materials Engineering",
  "Reverse Engineering",
  "Prototyping & Testing",
  "Engineering Practice",
];

const POST_TYPE_OPTIONS = [
  "Technical Note",
  "Workflow",
  "Case Study",
  "Analysis Note",
  "Design Guide",
  "Tutorial",
  "Reference",
  "Lessons Learned",
];

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Professional"];

const BLOG_TEMPLATES: MechanicalBlogTemplate[] = [
  {
    key: "blank",
    label: "Blank engineering note",
    description: "Start with only the required fields and build the post from scratch.",
    title: "Untitled engineering note",
    excerpt: null,
    content: null,
    category: "Mechanical Engineering",
    post_type: "Technical Note",
    difficulty: "Intermediate",
    tags: [],
    reading_time_minutes: null,
    seo_title: null,
    seo_description: null,
  },
  {
    key: "cad-workflow",
    label: "CAD workflow",
    description: "Document a repeatable, production-ready parametric CAD workflow.",
    title: "A Production-Ready Parametric CAD Workflow",
    excerpt: "A practical workflow for turning design intent into a controlled, reviewable, and manufacturing-ready CAD model.",
    content: `## Design objective

Describe the component, operating environment, interfaces, and measurable acceptance criteria.

## Design intent and references

- Primary datums and mating interfaces
- Master sketches, skeleton geometry, or layout model
- Critical parameters and expected design changes

## Modeling sequence

Explain the feature order, naming convention, configurations, and how external references are controlled.

## Verification

- Interference and clearance checks
- Mass-property review
- Draft, wall-thickness, and manufacturability checks
- Drawing and revision review

## Release checklist

List the native CAD files, neutral exports, drawings, BOM, and approval records included in the release package.`,
    category: "CAD & Product Development",
    post_type: "Workflow",
    difficulty: "Intermediate",
    tags: ["CAD", "Parametric Modeling", "Design Intent", "Drawing Release"],
    reading_time_minutes: 8,
    seo_title: "Production-Ready Parametric CAD Workflow",
    seo_description: "A mechanical designer's workflow for robust parametric CAD, verification, drawings, and controlled design release.",
  },
  {
    key: "machine-design",
    label: "Machine design case study",
    description: "Present requirements, calculations, decisions, validation, and lessons learned.",
    title: "Machine Design Case Study: From Requirements to Validation",
    excerpt: "A transparent engineering case study covering load cases, component sizing, safety factors, and design verification.",
    content: `## Problem statement

Define the machine function, duty cycle, design life, environment, interfaces, and constraints.

## Requirements and load cases

Summarize normal, peak, fatigue, shock, misuse, and transport loads. State every assumption and source.

## Concept selection

Compare the shortlisted concepts using performance, risk, cost, serviceability, and manufacturability.

## Engineering calculations

Document free-body diagrams, reactions, stress, deflection, fatigue, bearing life, shaft sizing, fasteners, and safety factors as applicable.

## Detailed design

Explain material choices, tolerances, fits, surface finishes, purchased components, guarding, and maintenance access.

## Verification and outcome

Compare hand calculations, simulation, prototype measurements, and acceptance criteria. Close with lessons learned and next actions.`,
    category: "Machine Design",
    post_type: "Case Study",
    difficulty: "Advanced",
    tags: ["Machine Design", "Load Cases", "Design Calculations", "Verification"],
    reading_time_minutes: 12,
    seo_title: "Machine Design Case Study: Requirements to Validation",
    seo_description: "A structured mechanical machine-design case study covering requirements, sizing calculations, safety factors, and validation.",
  },
  {
    key: "fea-analysis",
    label: "FEA analysis note",
    description: "Capture assumptions, model setup, convergence, results, and engineering interpretation.",
    title: "FEA Analysis Note: Setup, Convergence, and Design Decisions",
    excerpt: "A concise engineering record of an FEA model, its limitations, verification checks, and design implications.",
    content: `## Analysis objective

State the decision this analysis supports and define the success criteria.

## Idealization and assumptions

Document geometry simplifications, material model, contacts, fasteners, symmetry, and excluded physics.

## Loads and boundary conditions

Explain where each load came from, how it is distributed, and why each restraint represents the real assembly.

## Mesh strategy and convergence

Record element type, global size, local refinement, quality metrics, and the convergence quantity used.

## Results

- Displacement and deformation shape
- Stress away from singularities
- Reactions and force balance
- Buckling, fatigue, thermal, or modal results where relevant

## Verification and limitations

Compare against hand calculations or test data. State sensitivity, uncertainty, and what the model does not prove.

## Design recommendation

Translate the results into a clear design action and validation plan.`,
    category: "Simulation & FEA",
    post_type: "Analysis Note",
    difficulty: "Advanced",
    tags: ["FEA", "Simulation", "Mesh Convergence", "Design Verification"],
    reading_time_minutes: 10,
    seo_title: "FEA Analysis Note Template for Mechanical Design",
    seo_description: "A practical FEA analysis-note structure for assumptions, loads, mesh convergence, verification, limitations, and design decisions.",
  },
  {
    key: "gdt-guide",
    label: "GD&T guide",
    description: "Explain a datum strategy and functional tolerancing with inspection in mind.",
    title: "A Functional Approach to GD&T and Datum Selection",
    excerpt: "How to translate assembly function into a stable datum reference frame, meaningful controls, and inspectable requirements.",
    content: `## Functional requirement

Describe how the part locates, orients, mates, seals, moves, or transfers load in the assembly.

## Datum strategy

Explain the primary, secondary, and tertiary datum features and the degrees of freedom each constrains.

## Feature controls

Discuss the selected form, orientation, location, profile, or runout controls and why they protect function.

## Material condition and bonus tolerance

Show where MMC, LMC, RFS, projected tolerance zones, or datum mobility are appropriate.

## Tolerance stack

Summarize the contributors, statistical or worst-case method, and resulting functional margin.

## Inspection plan

Describe practical gauging or CMM alignment and confirm every requirement can be verified unambiguously.

## Drawing review checklist

Capture the drawing-standard revision, units, general tolerances, notes, finishes, and supplier feedback.`,
    category: "GD&T & Tolerancing",
    post_type: "Design Guide",
    difficulty: "Advanced",
    tags: ["GD&T", "ASME Y14.5", "Datum Strategy", "Tolerance Stack-Up"],
    reading_time_minutes: 11,
    seo_title: "Functional GD&T and Datum Selection Guide",
    seo_description: "A functional mechanical-design guide to datum selection, feature control frames, tolerance stacks, and inspection planning.",
  },
  {
    key: "dfm-manufacturing",
    label: "DFM / manufacturing",
    description: "Review a component through process selection, producibility, cost, and quality controls.",
    title: "Design for Manufacturing: A Practical Mechanical Review",
    excerpt: "A process-aware DFM review for improving producibility, repeatability, cost, lead time, and drawing clarity.",
    content: `## Part function and production context

State annual volume, target process, material, critical interfaces, cost target, and expected inspection level.

## Process selection

Compare candidate processes using geometry, tolerances, finish, tooling, volume, lead time, and supply-chain risk.

## DFM observations

- Standard stock sizes and tooling access
- Minimum wall, rib, radius, draft, and bend requirements
- Realistic tolerances and surface finishes
- Setup count, datum transfer, and distortion risk
- Standard hardware and purchased components

## Cost and quality drivers

Identify the requirements that dominate cycle time, scrap, inspection, tooling, or secondary operations.

## Recommended changes

Prioritize changes by impact, implementation effort, and functional risk.

## Supplier review

Record supplier feedback, agreed deviations, control-plan items, and drawing updates.`,
    category: "DFM & Manufacturing",
    post_type: "Design Guide",
    difficulty: "Intermediate",
    tags: ["DFM", "Manufacturing", "Cost Reduction", "Supplier Collaboration"],
    reading_time_minutes: 9,
    seo_title: "Mechanical Design for Manufacturing Review",
    seo_description: "A practical DFM review framework for mechanical parts, covering process choice, tolerances, cost drivers, quality, and suppliers.",
  },
  {
    key: "materials-selection",
    label: "Materials selection",
    description: "Compare candidate materials against performance, process, cost, and lifecycle needs.",
    title: "Engineering Materials Selection with a Defensible Trade Study",
    excerpt: "A structured method for selecting materials using quantified requirements, screening criteria, and lifecycle trade-offs.",
    content: `## Application and failure modes

Define loading, temperature, environment, wear, corrosion, electrical needs, design life, and credible failure modes.

## Material requirements

Separate mandatory limits from ranked objectives such as mass, stiffness, strength, toughness, cost, or conductivity.

## Candidate screening

List candidate material families and eliminate options that fail non-negotiable constraints.

## Trade study

Compare mechanical properties, availability, variability, manufacturability, joining, heat treatment, finish, cost, and recyclability.

## Allowables and safety factors

State the property basis, temperature or fatigue knockdowns, statistical confidence, and applicable standard.

## Selection and validation

Explain the chosen grade and condition, then define certificates, incoming inspection, coupon tests, or prototype validation needed.`,
    category: "Materials Engineering",
    post_type: "Technical Note",
    difficulty: "Advanced",
    tags: ["Materials Selection", "Trade Study", "Failure Modes", "Design Allowables"],
    reading_time_minutes: 10,
    seo_title: "Engineering Materials Selection Trade Study",
    seo_description: "A defensible material-selection method for mechanical design using requirements, screening, trade-offs, allowables, and validation.",
  },
  {
    key: "reverse-engineering",
    label: "Reverse engineering",
    description: "Turn measurements or scan data into an editable, validated design definition.",
    title: "Reverse Engineering a Mechanical Part: Scan to Validated CAD",
    excerpt: "A traceable workflow for capturing geometry, rebuilding design intent, validating CAD, and creating production documentation.",
    content: `## Objective and source condition

Describe why the part is being recreated, its condition, assembly context, and any intellectual-property or authorization constraints.

## Data capture plan

Define datums, measurement uncertainty, required resolution, inaccessible features, and the mix of hand tools, CMM, or 3D scanning.

## Geometry reconstruction

Separate functional primitives and design intent from wear, damage, draft, texture, and scan noise.

## Parametric CAD strategy

Explain the base coordinate system, feature sequence, symmetry, repeated features, and editable driving dimensions.

## Validation

- Section and deviation comparisons
- Critical dimension inspection
- Assembly fit and interference checks
- Material and surface-treatment confirmation

## Manufacturing definition

Create functional tolerances, GD&T, notes, material specification, inspection points, and revision-controlled deliverables.`,
    category: "Reverse Engineering",
    post_type: "Workflow",
    difficulty: "Advanced",
    tags: ["Reverse Engineering", "3D Scanning", "Metrology", "CAD Reconstruction"],
    reading_time_minutes: 9,
    seo_title: "Reverse Engineering Workflow: Scan to Validated CAD",
    seo_description: "A mechanical reverse-engineering workflow for measurement planning, scan cleanup, parametric CAD reconstruction, and validation.",
  },
  {
    key: "prototyping",
    label: "Prototyping",
    description: "Plan a prototype around learning objectives, instrumentation, and acceptance criteria.",
    title: "Prototype with Purpose: A Mechanical Test-and-Learn Plan",
    excerpt: "A disciplined approach to choosing prototype fidelity, collecting useful evidence, and converting test results into design decisions.",
    content: `## Learning objective

State the uncertainty or decision the prototype must resolve. Avoid trying to validate every requirement in one build.

## Prototype strategy

Choose analytical, virtual, appearance, fit-check, functional, or production-intent fidelity for each subsystem.

## Build definition

Document materials, processes, controlled dimensions, intentional deviations, instrumentation, and configuration identification.

## Test plan

- Hypothesis and measurable acceptance criteria
- Loads, boundary conditions, and environmental conditions
- Sensors, sampling, calibration, and uncertainty
- Repeats, controls, safety limits, and stop conditions

## Results and observations

Separate measured data from interpretation. Include unexpected behavior and test anomalies.

## Decision and next iteration

Record what was learned, which risks were retired, required design changes, and the next highest-value test.`,
    category: "Prototyping & Testing",
    post_type: "Workflow",
    difficulty: "Intermediate",
    tags: ["Prototyping", "Test Planning", "Design Validation", "Product Development"],
    reading_time_minutes: 8,
    seo_title: "Mechanical Prototyping and Test Planning Guide",
    seo_description: "A focused mechanical prototyping workflow built around learning objectives, test evidence, acceptance criteria, and iteration.",
  },
];

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

const nullableText = (value: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const parseTags = (value: string) => {
  const seen = new Set<string>();

  return value
    .split("\n")
    .map((tag) => tag.trim())
    .filter((tag) => {
      const key = tag.toLocaleLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const toDateTimeLocal = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const fromDateTimeLocal = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred. Please try again.";
};

const toAdminPost = (post: BlogPost, autoSlug?: boolean): AdminBlogPost => ({
  ...post,
  auto_slug: autoSlug ?? post.slug === slugify(post.title),
  tags_input: (post.tags ?? []).join("\n"),
});

const sortPosts = (posts: AdminBlogPost[]) =>
  [...posts].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.created_at.localeCompare(b.created_at);
  });

const AdminBlog = () => {
  const [items, setItems] = useState<AdminBlogPost[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const { toast } = useToast();

  const activeTemplate = useMemo(
    () => BLOG_TEMPLATES.find((template) => template.key === selectedTemplate) ?? BLOG_TEMPLATES[0],
    [selectedTemplate],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      setItems(sortPosts((data ?? []).map((post) => toAdminPost(post))));
    } catch (error) {
      toast({
        title: "Could not load blog posts",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = <K extends keyof AdminBlogPost>(
    id: string,
    field: K,
    value: AdminBlogPost[K],
  ) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateTitle = (item: AdminBlogPost, title: string) => {
    setItems((current) =>
      current.map((post) =>
        post.id === item.id
          ? {
              ...post,
              title,
              slug: post.auto_slug ? slugify(title) : post.slug,
            }
          : post,
      ),
    );
  };

  const persistOrder = async (orderedItems: AdminBlogPost[]) => {
    const results = await Promise.all(
      orderedItems.map((item, index) =>
        supabase
          .from("blog_posts")
          .update({ sort_order: index + 1 })
          .eq("id", item.id),
      ),
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) throw failed.error;
  };

  const add = async () => {
    setAdding(true);
    try {
      const nextOrder = Math.max(0, ...items.map((item) => item.sort_order)) + 1;
      const baseSlug = slugify(activeTemplate.title) || "engineering-note";
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: activeTemplate.title,
          slug: uniqueSlug,
          excerpt: activeTemplate.excerpt,
          content: activeTemplate.content,
          category: activeTemplate.category,
          post_type: activeTemplate.post_type,
          difficulty: activeTemplate.difficulty,
          tags: activeTemplate.tags,
          reading_time_minutes: activeTemplate.reading_time_minutes,
          seo_title: activeTemplate.seo_title,
          seo_description: activeTemplate.seo_description,
          cover_image_url: null,
          external_url: null,
          published_at: null,
          is_featured: false,
          is_published: false,
          is_visible: true,
          sort_order: nextOrder,
        })
        .select("*")
        .single();

      if (error) throw error;

      const created = toAdminPost(data, true);
      setItems((current) => sortPosts([...current, created]));
      setExpanded(created.id);
      toast({
        title: "Draft added",
        description: `${activeTemplate.label} is ready to edit. It will stay off the public site until published.`,
      });
    } catch (error) {
      toast({
        title: "Could not add blog post",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const save = async (item: AdminBlogPost) => {
    const title = item.title.trim();
    const category = item.category.trim();
    const slug = item.auto_slug ? slugify(title) : slugify(item.slug);

    if (!title || !category || !slug) {
      toast({
        title: "Title, category, and slug are required",
        description: "Complete the required fields before saving this post.",
        variant: "destructive",
      });
      return;
    }

    setSavingId(item.id);
    try {
      const publishedAt = item.is_published && !item.published_at
        ? new Date().toISOString()
        : item.published_at;
      const readingTime = item.reading_time_minutes === null
        ? null
        : Math.max(1, Math.floor(item.reading_time_minutes));
      const sortOrder = Math.max(1, Math.floor(item.sort_order || 1));

      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title,
          slug,
          excerpt: nullableText(item.excerpt),
          content: nullableText(item.content),
          category,
          post_type: nullableText(item.post_type),
          difficulty: nullableText(item.difficulty),
          tags: parseTags(item.tags_input),
          cover_image_url: nullableText(item.cover_image_url),
          external_url: nullableText(item.external_url),
          published_at: publishedAt,
          reading_time_minutes: readingTime,
          seo_title: nullableText(item.seo_title),
          seo_description: nullableText(item.seo_description),
          is_featured: item.is_featured ?? false,
          is_published: item.is_published ?? false,
          is_visible: item.is_visible ?? true,
          sort_order: sortOrder,
        })
        .eq("id", item.id)
        .select("*")
        .single();

      if (error) throw error;

      const saved = toAdminPost(data, item.auto_slug);
      setItems((current) =>
        sortPosts(current.map((post) => (post.id === saved.id ? saved : post))),
      );
      setExpanded(saved.id);
      toast({
        title: item.is_published ? "Blog post published" : "Blog draft saved",
        description:
          item.is_published && !item.published_at
            ? "The publish date was set automatically."
            : "All changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Could not save blog post",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (item: AdminBlogPost) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;

    setDeletingId(item.id);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", item.id);
      if (error) throw error;

      const remaining = sortPosts(items.filter((post) => post.id !== item.id)).map(
        (post, index) => ({ ...post, sort_order: index + 1 }),
      );

      try {
        await persistOrder(remaining);
        setItems(remaining);
        setExpanded((current) => (current === item.id ? null : current));
        toast({ title: "Blog post deleted" });
      } catch (orderError) {
        setItems(remaining);
        toast({
          title: "Post deleted, but ordering needs attention",
          description: getErrorMessage(orderError),
          variant: "destructive",
        });
        await load();
      }
    } catch (error) {
      toast({
        title: "Could not delete blog post",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const move = async (id: string, direction: -1 | 1) => {
    const currentIndex = items.findIndex((item) => item.id === id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) return;

    const previous = [...items];
    const reordered = [...items];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];
    const normalized = reordered.map((item, index) => ({ ...item, sort_order: index + 1 }));

    setItems(normalized);
    setReorderingId(id);
    try {
      await persistOrder(normalized);
      toast({ title: "Blog order updated" });
    } catch (error) {
      setItems(previous);
      toast({
        title: "Could not reorder blog posts",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Blog</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Publish project thinking, calculation notes, and practical mechanical design guidance.
        </p>
      </div>

      <div className="card-surface space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Create from a mechanical template</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Templates provide editable prompts and sensible metadata. Every new post starts as a draft.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            aria-label="Blog post template"
          >
            {BLOG_TEMPLATES.map((template) => (
              <option key={template.key} value={template.key}>
                {template.label}
              </option>
            ))}
          </select>
          <Button type="button" onClick={add} disabled={adding}>
            {adding ? <Loader2 className="animate-spin" /> : <Plus />}
            Add draft
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{activeTemplate.description}</p>
      </div>

      <datalist id="blog-category-options">
        {CATEGORY_OPTIONS.map((category) => <option key={category} value={category} />)}
      </datalist>
      <datalist id="blog-post-type-options">
        {POST_TYPE_OPTIONS.map((postType) => <option key={postType} value={postType} />)}
      </datalist>

      {loading ? (
        <div className="card-surface flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" size={16} /> Loading blog posts…
        </div>
      ) : items.length === 0 ? (
        <div className="card-surface p-8 text-center">
          <p className="text-sm font-medium text-foreground">No blog posts yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Choose a template above to create the first draft.</p>
        </div>
      ) : (
        items.map((item, index) => {
          const isExpanded = expanded === item.id;
          const isSaving = savingId === item.id;
          const isDeleting = deletingId === item.id;
          const isReordering = reorderingId === item.id;

          return (
            <div key={item.id} className="card-surface overflow-hidden">
              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.title || "Untitled post"}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        #{item.sort_order}
                      </span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {item.category || "Uncategorized"}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                        item.is_published
                          ? "bg-primary/15 text-primary"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                      {item.is_visible === false && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">Hidden</span>
                      )}
                      {item.is_featured && (
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">Featured</span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
                  )}
                </button>
                <div className="flex items-center gap-0.5 border-l border-border/30 px-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => void move(item.id, -1)}
                    disabled={index === 0 || Boolean(reorderingId)}
                    aria-label={`Move ${item.title} up`}
                    title="Move up"
                  >
                    {isReordering ? <Loader2 className="animate-spin" /> : <ArrowUp />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => void move(item.id, 1)}
                    disabled={index === items.length - 1 || Boolean(reorderingId)}
                    aria-label={`Move ${item.title} down`}
                    title="Move down"
                  >
                    {isReordering ? <Loader2 className="animate-spin" /> : <ArrowDown />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-4 border-t border-border/30 px-4 pb-4 pt-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_7rem]">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Title *</label>
                      <Input
                        value={item.title}
                        onChange={(event) => updateTitle(item, event.target.value)}
                        className="mt-1"
                        placeholder="Post title"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Sort order</label>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={item.sort_order}
                        onChange={(event) =>
                          update(item.id, "sort_order", Math.max(1, Math.floor(Number(event.target.value) || 1)))
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="font-mono text-xs text-muted-foreground">Slug *</label>
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                        <Switch
                          checked={item.auto_slug}
                          onCheckedChange={(checked) => {
                            setItems((current) =>
                              current.map((post) =>
                                post.id === item.id
                                  ? {
                                      ...post,
                                      auto_slug: checked,
                                      slug: checked ? slugify(post.title) : post.slug,
                                    }
                                  : post,
                              ),
                            );
                          }}
                          className="scale-75"
                        />
                        Auto from title
                      </label>
                    </div>
                    <Input
                      value={item.slug}
                      onChange={(event) => update(item.id, "slug", slugify(event.target.value))}
                      disabled={item.auto_slug}
                      className="mt-1 font-mono text-xs"
                      placeholder="post-url-slug"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground">Excerpt</label>
                    <Textarea
                      value={item.excerpt ?? ""}
                      onChange={(event) => update(item.id, "excerpt", event.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="A concise summary for the blog card and search results."
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground">Full content</label>
                    <Textarea
                      value={item.content ?? ""}
                      onChange={(event) => update(item.id, "content", event.target.value)}
                      className="mt-1 min-h-64 font-mono text-xs leading-relaxed"
                      rows={12}
                      placeholder="Write the full article here. Markdown headings, lists, and links are supported by the content model."
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Category *</label>
                      <Input
                        list="blog-category-options"
                        value={item.category}
                        onChange={(event) => update(item.id, "category", event.target.value)}
                        className="mt-1"
                        placeholder="Machine Design"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Post type</label>
                      <Input
                        list="blog-post-type-options"
                        value={item.post_type ?? ""}
                        onChange={(event) => update(item.id, "post_type", event.target.value)}
                        className="mt-1"
                        placeholder="Case Study"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Difficulty</label>
                      <select
                        value={item.difficulty ?? "Intermediate"}
                        onChange={(event) => update(item.id, "difficulty", event.target.value)}
                        className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                      >
                        {DIFFICULTY_OPTIONS.map((difficulty) => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Tags (one per line)</label>
                      <Textarea
                        value={item.tags_input}
                        onChange={(event) => update(item.id, "tags_input", event.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder={"Machine Design\nSolidWorks\nDesign Verification"}
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Reading time (min)</label>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={item.reading_time_minutes ?? ""}
                        onChange={(event) =>
                          update(
                            item.id,
                            "reading_time_minutes",
                            event.target.value
                              ? Math.max(1, Math.floor(Number(event.target.value) || 1))
                              : null,
                          )
                        }
                        className="mt-1"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">Cover image URL</label>
                      <Input
                        type="url"
                        value={item.cover_image_url ?? ""}
                        onChange={(event) => update(item.id, "cover_image_url", event.target.value)}
                        className="mt-1"
                        placeholder="https://…"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">External article URL</label>
                      <Input
                        type="url"
                        value={item.external_url ?? ""}
                        onChange={(event) => update(item.id, "external_url", event.target.value)}
                        className="mt-1"
                        placeholder="https://…"
                      />
                    </div>
                  </div>

                  {item.cover_image_url && (
                    <img
                      src={item.cover_image_url}
                      alt="Cover preview"
                      className="h-36 w-full rounded-lg border border-border/30 object-cover"
                    />
                  )}

                  <div>
                    <label className="font-mono text-xs text-muted-foreground">Publish date and time</label>
                    <Input
                      type="datetime-local"
                      value={toDateTimeLocal(item.published_at)}
                      onChange={(event) => update(item.id, "published_at", fromDateTimeLocal(event.target.value))}
                      className="mt-1 sm:max-w-xs"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Leave empty to set the current date automatically the first time Published is saved.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-background/40 p-3">
                    <p className="mb-3 font-mono text-xs text-muted-foreground">Search metadata</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">SEO title</label>
                        <Input
                          value={item.seo_title ?? ""}
                          onChange={(event) => update(item.id, "seo_title", event.target.value)}
                          className="mt-1"
                          placeholder="Defaults to the post title when empty"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SEO description</label>
                        <Textarea
                          value={item.seo_description ?? ""}
                          onChange={(event) => update(item.id, "seo_description", event.target.value)}
                          className="mt-1"
                          rows={2}
                          placeholder="A focused 140–160 character search description"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-lg border border-border/40 p-3 sm:grid-cols-3">
                    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-start">
                      <Switch
                        checked={item.is_visible !== false}
                        onCheckedChange={(checked) => update(item.id, "is_visible", checked)}
                      />
                      Visible
                    </label>
                    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-start">
                      <Switch
                        checked={item.is_published === true}
                        onCheckedChange={(checked) => update(item.id, "is_published", checked)}
                      />
                      Published
                    </label>
                    <label className="flex cursor-pointer items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-start">
                      <Switch
                        checked={item.is_featured === true}
                        onCheckedChange={(checked) => update(item.id, "is_featured", checked)}
                      />
                      Featured
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button type="button" size="sm" onClick={() => void save(item)} disabled={isSaving || isDeleting}>
                      {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                      Save post
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => void remove(item)}
                      disabled={isSaving || isDeleting}
                      className="text-red-400 hover:text-red-300"
                    >
                      {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default AdminBlog;
