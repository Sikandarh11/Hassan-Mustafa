import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cloud, LogOut, User, BarChart3, Briefcase, FlaskConical, FolderKanban, Users, Award, Wrench, BookOpen, Cog } from "lucide-react";
import AdminProfile from "@/components/admin/AdminProfile";
import AdminHeroStats from "@/components/admin/AdminHeroStats";
import AdminExperience from "@/components/admin/AdminExperience";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminResearch from "@/components/admin/AdminResearch";
import AdminTeam from "@/components/admin/AdminTeam";
import AdminCertificates from "@/components/admin/AdminCertificates";
import AdminSkills from "@/components/admin/AdminSkills";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminEngineeringServices from "@/components/admin/AdminEngineeringServices";

const tabs = [
  { id: "profile", label: "Profile & Hero", icon: User },
  { id: "stats", label: "Hero Stats", icon: BarChart3 },
  { id: "services", label: "Services", icon: Cog },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "research", label: "Research", icon: FlaskConical },
  { id: "team", label: "Team", icon: Users },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "skills", label: "Skills", icon: Wrench },
];

const INACTIVITY_TIMEOUT_MS = 600_000;
const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const inactivityTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const clearInactivityTimer = () => {
      if (inactivityTimerRef.current !== null) {
        window.clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };

    const handleTimeout = async () => {
      await signOut();
    };

    const resetInactivityTimer = () => {
      clearInactivityTimer();
      inactivityTimerRef.current = window.setTimeout(() => {
        void handleTimeout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    resetInactivityTimer();
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer);
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
      clearInactivityTimer();
    };
  }, [user, signOut]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const renderTab = () => {
    switch (activeTab) {
      case "profile": return <AdminProfile />;
      case "stats": return <AdminHeroStats />;
      case "services": return <AdminEngineeringServices />;
      case "experience": return <AdminExperience />;
      case "projects": return <AdminProjects />;
      case "blog": return <AdminBlog />;
      case "research": return <AdminResearch />;
      case "team": return <AdminTeam />;
      case "certificates": return <AdminCertificates />;
      case "skills": return <AdminSkills />;
      default: return <AdminProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 font-mono text-primary">
          <Cloud size={20} /> <span className="text-sm font-semibold">Hafiz Muhammad Hassan Mustafa Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View Site →</a>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut size={14} /> Sign Out</Button>
        </div>
      </div>

      <div className="flex pt-14">
        {/* Sidebar */}
        <div className="w-56 fixed left-0 top-14 bottom-0 bg-card border-r border-border/50 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-56 flex-1 p-6 min-h-[calc(100vh-3.5rem)]">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
