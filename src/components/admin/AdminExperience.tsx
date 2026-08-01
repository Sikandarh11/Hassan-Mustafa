import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Experience = Tables<"experiences">;

const AdminExperience = () => {
  const [items, setItems] = useState<Experience[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("experiences").select("*").order("sort_order");
    if (data) setItems(data);
  };

  const add = async () => {
    const { data } = await supabase.from("experiences").insert({ company: "New Company", role: "Role", sort_order: items.length }).select().single();
    if (data) { setItems([...items, data]); setExpanded(data.id); }
  };

  const save = async (item: Experience) => {
    const { id, created_at, updated_at, ...rest } = item;
    await supabase.from("experiences").update(rest).eq("id", id);
    toast({ title: "Experience saved!" });
  };

  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("experiences").delete().eq("id", id);
  };

  const update = (id: string, field: string, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Experience</h2>
        <Button variant="ghost" size="sm" onClick={add}><Plus size={14} /> Add</Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="card-surface overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{item.role}</p>
              <p className="text-xs text-muted-foreground">{item.company}</p>
            </div>
            {expanded === item.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>
          {expanded === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground font-mono">Company</label><Input value={item.company} onChange={(e) => update(item.id, "company", e.target.value)} className="mt-1" /></div>
                <div><label className="text-xs text-muted-foreground font-mono">Role</label><Input value={item.role} onChange={(e) => update(item.id, "role", e.target.value)} className="mt-1" /></div>
                <div><label className="text-xs text-muted-foreground font-mono">Start Date</label><Input value={item.date_start || ""} onChange={(e) => update(item.id, "date_start", e.target.value)} className="mt-1" placeholder="e.g. Jan 2024" /></div>
                <div><label className="text-xs text-muted-foreground font-mono">End Date</label><Input value={item.date_end || ""} onChange={(e) => update(item.id, "date_end", e.target.value)} className="mt-1" placeholder="e.g. Present" /></div>
              </div>
              <div><label className="text-xs text-muted-foreground font-mono">Location</label><Input value={item.location || ""} onChange={(e) => update(item.id, "location", e.target.value)} className="mt-1" placeholder="e.g. Islamabad, PK (optional)" /></div>
              <div><label className="text-xs text-muted-foreground font-mono">Certificate / Document Link (optional)</label><Input value={(item as any).link || ""} onChange={(e) => update(item.id, "link", e.target.value)} className="mt-1" placeholder="https://drive.google.com/... or any URL" type="url" /></div>
              <div>
                <label className="text-xs text-muted-foreground font-mono">Bullet Points (one per line)</label>
                <Textarea
                  value={(item.bullets || []).join("\n")}
                  onChange={(e) => update(item.id, "bullets", e.target.value.split("\n").filter(Boolean))}
                  className="mt-1" rows={3}
                />
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

export default AdminExperience;
