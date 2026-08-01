import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const normalizeSortOrderInput = (value: string): string => value.replace(/[^\d]/g, "");

const parseOptionalSortOrder = (value: string): number | null => {
  const cleaned = normalizeSortOrderInput(value).trim();
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
};

type AdminProjectItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  is_private: boolean | null;
  is_visible: boolean | null;
  alt_text: string | null;
  flip_preview_text: string | null;
  sort_order: number;
  sort_order_input: string;
  created_at?: string;
  updated_at?: string;
};

const AdminProjects = () => {
  const [items, setItems] = useState<AdminProjectItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .order("created_at");

    if (error || !data) {
      toast({ title: "Failed to load projects", description: error?.message, variant: "destructive" });
      return;
    }

    const updates = data
      .map((project, index) => ({ id: project.id, nextSortOrder: index + 1, currentSortOrder: project.sort_order }))
      .filter((project) => project.currentSortOrder !== project.nextSortOrder);

    if (updates.length > 0) {
      await Promise.all(
        updates.map((project) =>
          supabase.from("projects").update({ sort_order: project.nextSortOrder }).eq("id", project.id)
        )
      );
    }

    const normalized = data.map((project, index) => ({
      ...project,
      sort_order: index + 1,
      sort_order_input: String(index + 1),
    }));

    setItems(normalized);
  };

  const add = async () => {
    const { data, error } = await supabase
      .from("projects")
      .insert({ title: "New Project", sort_order: items.length + 1 })
      .select()
      .single();

    if (error || !data) {
      toast({ title: "Failed to add project", description: error?.message, variant: "destructive" });
      return;
    }

    await load();
    setExpanded(data.id);
  };

  const save = async (item: AdminProjectItem) => {
    const requestedSortOrder = parseOptionalSortOrder(item.sort_order_input);
    const currentSortOrder = item.sort_order;
    const maxSortOrder = items.length;
    const targetSortOrder = requestedSortOrder === null
      ? currentSortOrder
      : Math.max(1, Math.min(requestedSortOrder, maxSortOrder));

    const otherProjects = items.filter((project) => project.id !== item.id);

    if (targetSortOrder < currentSortOrder) {
      const toShift = otherProjects.filter(
        (project) => project.sort_order >= targetSortOrder && project.sort_order < currentSortOrder
      );
      await Promise.all(
        toShift.map((project) =>
          supabase
            .from("projects")
            .update({ sort_order: project.sort_order + 1 })
            .eq("id", project.id)
        )
      );
    } else if (targetSortOrder > currentSortOrder) {
      const toShift = otherProjects.filter(
        (project) => project.sort_order <= targetSortOrder && project.sort_order > currentSortOrder
      );
      await Promise.all(
        toShift.map((project) =>
          supabase
            .from("projects")
            .update({ sort_order: project.sort_order - 1 })
            .eq("id", project.id)
        )
      );
    }

    const payload = {
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      tech_stack: item.tech_stack,
      github_url: item.github_url,
      live_url: item.live_url,
      is_private: item.is_private ?? false,
      is_visible: item.is_visible ?? true,
      alt_text: item.alt_text,
      flip_preview_text: item.flip_preview_text,
      sort_order: targetSortOrder,
    };

    const { error } = await supabase.from("projects").update(payload).eq("id", item.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await load();
    setExpanded(item.id);
    toast({ title: "Project saved!" });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setItems(items.filter((i) => i.id !== id));
    await load();
  };

  const update = (id: string, field: keyof AdminProjectItem, value: string | number | boolean | string[] | null) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const uploadMedia = async (id: string, file: File) => {
    const path = `projects/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(data.path);
    update(id, "image_url", publicUrl);
  };

  const isVideoUrl = (url: string | null): boolean => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Projects</h2>
        <Button variant="ghost" size="sm" onClick={add}><Plus size={14} /> Add</Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="card-surface overflow-hidden">
          <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">#{item.sort_order}</span>
              {!item.is_visible && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Hidden</span>}
              {item.is_private && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Private</span>}
            </div>
            {expanded === item.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          {expanded === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
              <div><label className="text-xs text-muted-foreground font-mono">Title</label><Input value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} className="mt-1" /></div>
              <div><label className="text-xs text-muted-foreground font-mono">Index (optional)</label><Input value={item.sort_order_input} onChange={(e) => update(item.id, "sort_order_input", normalizeSortOrderInput(e.target.value))} className="mt-1" placeholder="Leave blank to keep current order" /></div>
              <div><label className="text-xs text-muted-foreground font-mono">Description</label><Textarea value={item.description || ""} onChange={(e) => update(item.id, "description", e.target.value)} className="mt-1" rows={2} placeholder="Project description (optional)" /></div>
              <div><label className="text-xs text-muted-foreground font-mono">Alt Text</label><Input value={item.alt_text || ""} onChange={(e) => update(item.id, "alt_text", e.target.value)} className="mt-1" placeholder="Image alt text (optional)" /></div>
              <div><label className="text-xs text-muted-foreground font-mono">Tech Stack (comma separated)</label><Input value={(item.tech_stack || []).join(", ")} onChange={(e) => update(item.id, "tech_stack", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className="mt-1" placeholder="React, Python, Docker..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground font-mono">GitHub URL</label><Input value={item.github_url || ""} onChange={(e) => update(item.id, "github_url", e.target.value)} className="mt-1" placeholder="Optional" /></div>
                <div><label className="text-xs text-muted-foreground font-mono">Live URL</label><Input value={item.live_url || ""} onChange={(e) => update(item.id, "live_url", e.target.value)} className="mt-1" placeholder="Optional" /></div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={item.is_private || false} onChange={(e) => update(item.id, "is_private", e.target.checked)} className="accent-primary" /> Private Repo
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={item.is_visible !== false} onChange={(e) => update(item.id, "is_visible", e.target.checked)} className="accent-primary" /> Visible
                </label>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono">Project Media (Image or Video)</label>
                {item.image_url && (
                  isVideoUrl(item.image_url) ? (
                    <video src={item.image_url} className="w-32 h-20 object-cover rounded mt-1 border border-border/30" controls preload="metadata" />
                  ) : (
                    <img src={item.image_url} alt="" className="w-32 h-20 object-cover rounded mt-1 border border-border/30" />
                  )
                )}
                <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <Upload size={12} /> Upload Media
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadMedia(item.id, e.target.files[0])} />
                </label>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={() => save(item)}><Save size={12} /> Save</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(item.id)} className="text-red-400"><Trash2 size={12} /> Delete</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminProjects;
