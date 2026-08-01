import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Research = Tables<"research">;

const statusOptions = ["published", "in_review", "patent", "in_progress"];

const AdminResearch = () => {
  const [items, setItems] = useState<Research[]>([]);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("research").select("*").order("sort_order");
    if (data) setItems(data);
  };

  const add = async () => {
    const { data } = await supabase.from("research").insert({ title: "New Research", sort_order: items.length }).select().single();
    if (data) setItems([...items, data]);
  };

  const save = async (item: Research) => {
    const { id, created_at, updated_at, ...rest } = item;
    await supabase.from("research").update(rest).eq("id", id);
    toast({ title: "Research saved!" });
  };

  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("research").delete().eq("id", id);
  };

  const update = (id: string, field: string, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Research</h2>
        <Button variant="ghost" size="sm" onClick={add}><Plus size={14} /> Add</Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="card-surface p-4 space-y-3">
          <Input value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} placeholder="Title" />
          <Textarea value={item.description || ""} onChange={(e) => update(item.id, "description", e.target.value)} placeholder="Description" rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-mono">Status</label>
              <select
                value={item.status || "in_progress"}
                onChange={(e) => update(item.id, "status", e.target.value)}
                className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-muted-foreground font-mono">Link</label><Input value={item.link || ""} onChange={(e) => update(item.id, "link", e.target.value)} className="mt-1" placeholder="Optional" /></div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => save(item)}><Save size={12} /> Save</Button>
            <Button size="sm" variant="ghost" onClick={() => remove(item.id)} className="text-red-400"><Trash2 size={12} /> Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminResearch;
