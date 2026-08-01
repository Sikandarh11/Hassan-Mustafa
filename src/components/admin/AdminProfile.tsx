import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);

    const [{ data: p, error: profileError }, { data: l, error: linesError }] = await Promise.all([
      supabase.from("profile").select("*").limit(1).maybeSingle(),
      supabase.from("typewriter_lines").select("*").order("sort_order"),
    ]);

    if (profileError) {
      const message = profileError.message || "Failed to load profile";
      const missingProfileTable = message.includes("Could not find the table 'public.profile'");
      setLoadError(
        missingProfileTable
          ? "Database is missing the profile table for this Supabase project. Run the SQL migration in Supabase, then press Retry."
          : message
      );
      setLoading(false);
      return;
    }

    if (linesError) {
      const message = linesError.message || "Failed to load typewriter lines";
      const missingTypewriterTable = message.includes("Could not find the table 'public.typewriter_lines'");
      setLoadError(
        missingTypewriterTable
          ? "Database is missing the typewriter_lines table for this Supabase project. Run the SQL migration in Supabase, then press Retry."
          : message
      );
      setLoading(false);
      return;
    }

    if (p) {
      setProfile(p);
    } else {
      const { data: createdProfile, error: createError } = await supabase
        .from("profile")
        .insert({
          name: "Hafiz Muhammad Hassan Mustafa",
          brand_name: "Hafiz Muhammad Hassan Mustafa",
          brand_initials: "HMHM",
          site_title: "Hafiz Muhammad Hassan Mustafa | AI Engineer",
          tagline: "AI Engineer · ML Researcher · Full-Stack AI Systems",
        })
        .select("*")
        .single();

      if (createError) {
        setLoadError(createError.message || "Failed to create profile row");
        setLoading(false);
        return;
      }

      setProfile(createdProfile);
    }

    setLines(l || []);
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = profile;
    await supabase.from("profile").update(rest).eq("id", id);
    toast({ title: "Profile saved!" });
    setSaving(false);
  };

  const uploadFile = async (field: string, file: File) => {
    const path = `${field}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(data.path);
    setProfile((p: any) => p ? { ...p, [field]: publicUrl } : p);
  };

  const addLine = async () => {
    const { data } = await supabase.from("typewriter_lines").insert({ text: "New line", sort_order: lines.length }).select().single();
    if (data) setLines([...lines, data]);
  };

  const updateLine = async (id: string, text: string) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, text } : l)));
    await supabase.from("typewriter_lines").update({ text }).eq("id", id);
  };

  const deleteLine = async (id: string) => {
    setLines(lines.filter((l) => l.id !== id));
    await supabase.from("typewriter_lines").delete().eq("id", id);
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  if (loadError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-400">{loadError}</p>
        <Button variant="outline" size="sm" onClick={loadData}>Retry</Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Profile data is missing.</p>
        <Button variant="outline" size="sm" onClick={loadData}>Create Profile</Button>
      </div>
    );
  }

  const field = (label: string, key: string, placeholder = "", type = "text") => (
    <div key={key}>
      <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</label>
      <Input
        value={profile[key] || ""}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        type={type}
        className="mt-1"
        placeholder={placeholder || `Enter ${label.toLowerCase()} (optional)`}
      />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Profile & Hero</h2>
        <Button onClick={saveProfile} disabled={saving}><Save size={14} /> {saving ? "Saving..." : "Save"}</Button>
      </div>

      <div className="card-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Basic Info</h3>
        {field("Name", "name", "Full name")}
        {field("Tagline", "tagline", "e.g. AI Engineer · ML Researcher")}
        <div>
          <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">About Text</label>
          <Textarea value={profile.about_text || ""} onChange={(e) => setProfile({ ...profile, about_text: e.target.value })} className="mt-1" rows={4} placeholder="Tell about yourself (optional)" />
        </div>
      </div>

      <div className="card-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Branding</h3>
        <div className="grid grid-cols-2 gap-4">
          {field("Brand Name", "brand_name", "e.g. Hafiz Muhammad Hassan Mustafa")}
          {field("Brand Initials", "brand_initials", "e.g. HMHM")}
          {field("Accent Color (hex)", "accent_color", "#00d4d8")}
          {field("Site Title", "site_title", "Page title for SEO")}
        </div>
        {field("Meta Description", "meta_description", "SEO description")}
      </div>

      <div className="card-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Photo & Resume</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Profile Photo</label>
            {profile.photo_url && <img src={profile.photo_url} alt="Profile" className="w-20 h-20 rounded-full object-cover mt-2 border border-primary/30" />}
            <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Upload size={12} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile("photo_url", e.target.files[0])} />
            </label>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Resume PDF</label>
            {profile.resume_url && <a href={profile.resume_url} target="_blank" className="block mt-2 text-xs text-primary hover:underline">Current resume ↗</a>}
            <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Upload size={12} /> Upload Resume
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile("resume_url", e.target.files[0])} />
            </label>
          </div>
        </div>
      </div>

      <div className="card-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Contact Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {field("Email", "email", "your@email.com", "email")}
          {field("Phone", "phone", "+92-XXX-XXXXXXX")}
          {field("LinkedIn URL", "linkedin", "https://linkedin.com/in/...", "url")}
          {field("GitHub URL", "github", "https://github.com/...", "url")}
          {field("Website", "website", "yoursite.com")}
          {field("WhatsApp", "whatsapp", "+92XXXXXXXXXX")}
        </div>
      </div>

      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Typewriter Lines</h3>
          <Button variant="ghost" size="sm" onClick={addLine}><Plus size={14} /> Add</Button>
        </div>
        {lines.map((l) => (
          <div key={l.id} className="flex items-center gap-2">
            <Input value={l.text} onChange={(e) => updateLine(l.id, e.target.value)} className="flex-1" placeholder="Typewriter line text" />
            <Button variant="ghost" size="icon" onClick={() => deleteLine(l.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
