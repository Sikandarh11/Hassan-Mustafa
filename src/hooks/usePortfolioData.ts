import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Profile = Tables<"profile">;
type HeroStat = Tables<"hero_stats">;
type TypewriterLine = Tables<"typewriter_lines">;
type Experience = Tables<"experiences">;
type Project = Tables<"projects">;
type Research = Tables<"research">;
type TeamMember = Tables<"team_members">;
type Certificate = Tables<"certificates">;
type Skill = Tables<"skills">;

// Tables we subscribe to for real-time updates
const REALTIME_TABLES = [
  "profile",
  "hero_stats",
  "typewriter_lines",
  "experiences",
  "projects",
  "research",
  "team_members",
  "certificates",
  "skills",
] as const;

type TableName = (typeof REALTIME_TABLES)[number];

export function usePortfolioData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [heroStats, setHeroStats] = useState<HeroStat[]>([]);
  const [typewriterLines, setTypewriterLines] = useState<TypewriterLine[]>([]);
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
        if (data) setProfile(data);
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
    // Initial load
    const load = async () => {
      const [p, hs, tl, ex, pr, re, tm, ce, sk] = await Promise.all([
        supabase.from("profile").select("*").limit(1).single(),
        supabase.from("hero_stats").select("*").order("sort_order"),
        supabase.from("typewriter_lines").select("*").order("sort_order"),
        supabase.from("experiences").select("*").order("sort_order"),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("research").select("*").order("sort_order"),
        supabase.from("team_members").select("*").order("sort_order"),
        supabase.from("certificates").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
      ]);
      if (p.data) setProfile(p.data);
      if (hs.data) setHeroStats(hs.data);
      if (tl.data) setTypewriterLines(tl.data);
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

  return { profile, heroStats, typewriterLines, experiences, projects, research, teamMembers, certificates, skills, loading };
}
