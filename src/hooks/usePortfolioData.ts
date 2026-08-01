import { useEffect, useState, useCallback } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import {
  normalizePortfolioAccentColor,
  normalizePortfolioOwnerInitials,
  normalizePortfolioOwnerName,
  normalizePortfolioSiteTitle,
  PORTFOLIO_BRAND_COLOR,
  PORTFOLIO_OWNER_PHOTO,
} from "@/lib/portfolioOwner";
import { MECHANICAL_SERVICE_PRESETS } from "@/lib/mechanicalServicePresets";

type Profile = Tables<"profile">;
type HeroStat = Tables<"hero_stats">;
type TypewriterLine = Tables<"typewriter_lines">;
type BlogPost = Tables<"blog_posts">;
type EngineeringService = Tables<"engineering_services">;
type Experience = Tables<"experiences">;
type Project = Tables<"projects">;
type Research = Tables<"research">;
type TeamMember = Tables<"team_members">;
type Certificate = Tables<"certificates">;
type Skill = Tables<"skills">;

const FALLBACK_PROFILE: Profile = {
  id: "local-fallback-profile",
  name: "Hafiz Muhammad Hassan Mustafa",
  brand_name: "Hafiz Muhammad Hassan Mustafa",
  brand_initials: "HMHM",
  tagline: "Mechanical Design Engineer",
  about_text: "I design practical mechanical systems and production-ready products using parametric CAD, engineering analysis, GD&T, and design-for-manufacturing principles.",
  accent_color: PORTFOLIO_BRAND_COLOR,
  site_title: "Hafiz Muhammad Hassan Mustafa | Mechanical Design Engineer",
  meta_description: "Portfolio of Hafiz Muhammad Hassan Mustafa, Mechanical Design Engineer.",
  photo_url: PORTFOLIO_OWNER_PHOTO,
  resume_url: null,
  phone: null,
  email: null,
  linkedin: null,
  github: null,
  website: null,
  whatsapp: null,
  created_at: "",
  updated_at: "",
};

const FALLBACK_HERO_STATS: HeroStat[] = [
  { id: "local-stat-1", value: "8+", label: "Engineering Services", icon_type: "check", is_visible: true, sort_order: 0, created_at: "", updated_at: "" },
  { id: "local-stat-2", value: "3D", label: "CAD & Assemblies", icon_type: "check", is_visible: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "local-stat-3", value: "GD&T", label: "Drawings & Tolerances", icon_type: "check", is_visible: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "local-stat-4", value: "FEA", label: "Design Validation", icon_type: "check", is_visible: true, sort_order: 3, created_at: "", updated_at: "" },
];

const FALLBACK_TYPEWRITER_LINES: TypewriterLine[] = [
  { id: "local-line-1", text: "Designing Production-Ready Mechanical Systems", sort_order: 0, created_at: "" },
  { id: "local-line-2", text: "CAD · GD&T · FEA · DFM", sort_order: 1, created_at: "" },
];

const FALLBACK_ENGINEERING_SERVICES: EngineeringService[] = MECHANICAL_SERVICE_PRESETS.map(
  ({ key, standards = [], cta_label = "Discuss this service", cta_url = "#contact", ...preset }, sortOrder) => ({
    ...preset,
    id: `local-service-${key}`,
    standards,
    cta_label,
    cta_url,
    is_visible: true,
    sort_order: sortOrder,
    created_at: "",
    updated_at: "",
  }),
);

const normalizeProfile = (profile: Profile): Profile => ({
  ...profile,
  accent_color: normalizePortfolioAccentColor(profile.accent_color),
  name: normalizePortfolioOwnerName(profile.name),
  brand_name: normalizePortfolioOwnerName(profile.brand_name),
  brand_initials: normalizePortfolioOwnerInitials(profile.brand_initials),
  site_title: normalizePortfolioSiteTitle(profile.site_title),
  photo_url: PORTFOLIO_OWNER_PHOTO,
});

// Tables we subscribe to for real-time updates
const REALTIME_TABLES = [
  "profile",
  "hero_stats",
  "typewriter_lines",
  "blog_posts",
  "engineering_services",
  "experiences",
  "projects",
  "research",
  "team_members",
  "certificates",
  "skills",
] as const;

type TableName = (typeof REALTIME_TABLES)[number];

export function usePortfolioData() {
  const [profile, setProfile] = useState<Profile | null>(FALLBACK_PROFILE);
  const [heroStats, setHeroStats] = useState<HeroStat[]>(FALLBACK_HERO_STATS);
  const [typewriterLines, setTypewriterLines] = useState<TypewriterLine[]>(FALLBACK_TYPEWRITER_LINES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [engineeringServices, setEngineeringServices] = useState<EngineeringService[]>(FALLBACK_ENGINEERING_SERVICES);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [research, setResearch] = useState<Research[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Refetch a single table and update state
  const refetchTable = useCallback(async (table: TableName) => {
    switch (table) {
      case "profile": {
        const { data } = await supabase.from("profile").select("*").limit(1).single();
        if (data) setProfile(normalizeProfile(data));
        break;
      }
      case "hero_stats": {
        const { data } = await supabase.from("hero_stats").select("*").order("sort_order");
        if (data) setHeroStats(data);
        break;
      }
      case "typewriter_lines": {
        const { data } = await supabase.from("typewriter_lines").select("*").order("sort_order");
        if (data) setTypewriterLines(data);
        break;
      }
      case "blog_posts": {
        const { data } = await supabase.from("blog_posts").select("*").order("sort_order");
        if (data) setBlogPosts(data);
        break;
      }
      case "engineering_services": {
        const { data } = await supabase.from("engineering_services").select("*").order("sort_order");
        if (data) setEngineeringServices(data);
        break;
      }
      case "experiences": {
        const { data } = await supabase.from("experiences").select("*").order("sort_order");
        if (data) setExperiences(data);
        break;
      }
      case "projects": {
        const { data } = await supabase.from("projects").select("*").order("sort_order");
        if (data) setProjects(data);
        break;
      }
      case "research": {
        const { data } = await supabase.from("research").select("*").order("sort_order");
        if (data) setResearch(data);
        break;
      }
      case "team_members": {
        const { data } = await supabase.from("team_members").select("*").order("sort_order");
        if (data) setTeamMembers(data);
        break;
      }
      case "certificates": {
        const { data } = await supabase.from("certificates").select("*").order("sort_order");
        if (data) setCertificates(data);
        break;
      }
      case "skills": {
        const { data } = await supabase.from("skills").select("*").order("sort_order");
        if (data) setSkills(data);
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Initial load
    const load = async () => {
      const [p, hs, tl, bp, es, ex, pr, re, tm, ce, sk] = await Promise.all([
        supabase.from("profile").select("*").limit(1).single(),
        supabase.from("hero_stats").select("*").order("sort_order"),
        supabase.from("typewriter_lines").select("*").order("sort_order"),
        supabase.from("blog_posts").select("*").order("sort_order"),
        supabase.from("engineering_services").select("*").order("sort_order"),
        supabase.from("experiences").select("*").order("sort_order"),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("research").select("*").order("sort_order"),
        supabase.from("team_members").select("*").order("sort_order"),
        supabase.from("certificates").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
      ]);
      if (p.data) setProfile(normalizeProfile(p.data));
      if (hs.data) setHeroStats(hs.data);
      if (tl.data) setTypewriterLines(tl.data);
      if (bp.data) setBlogPosts(bp.data);
      if (es.data) setEngineeringServices(es.data);
      if (ex.data) setExperiences(ex.data);
      if (pr.data) setProjects(pr.data);
      if (re.data) setResearch(re.data);
      if (tm.data) setTeamMembers(tm.data);
      if (ce.data) setCertificates(ce.data);
      if (sk.data) setSkills(sk.data);
      setLoading(false);
    };
    load();

    // Set up real-time subscriptions for all tables
    const channel = supabase
      .channel("portfolio-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        () => refetchTable("profile")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hero_stats" },
        () => refetchTable("hero_stats")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "typewriter_lines" },
        () => refetchTable("typewriter_lines")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blog_posts" },
        () => refetchTable("blog_posts")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "engineering_services" },
        () => refetchTable("engineering_services")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "experiences" },
        () => refetchTable("experiences")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => refetchTable("projects")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "research" },
        () => refetchTable("research")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_members" },
        () => refetchTable("team_members")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "certificates" },
        () => refetchTable("certificates")
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        () => refetchTable("skills")
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchTable]);

  return {
    profile,
    heroStats,
    typewriterLines,
    blogPosts,
    engineeringServices,
    experiences,
    projects,
    research,
    teamMembers,
    certificates,
    skills,
    loading,
  };
}
