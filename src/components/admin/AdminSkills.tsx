import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    if (data) setSkills(data);
  };

  const add = async () => {
    if (!newSkill.trim() || !newCategory.trim()) return;
    const { data } = await supabase.from("skills").insert({ name: newSkill.trim(), category: newCategory.trim(), sort_order: skills.length }).select().single();
    if (data) { setSkills([...skills, data]); setNewSkill(""); }
    toast({ title: "Skill added!" });
  };

  const remove = async (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
    await supabase.from("skills").delete().eq("id", id);
  };

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Skills</h2>

      <div className="card-surface p-4 flex items-end gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground font-mono">Skill Name</label>
          <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="mt-1" placeholder="e.g. PyTorch" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground font-mono">Category</label>
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="mt-1"
            placeholder="e.g. ML & AI"
            list="categories"
          />
          <datalist id="categories">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <Button onClick={add}><Plus size={14} /> Add</Button>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="space-y-2">
          <h3 className="text-sm font-semibold text-primary font-mono">{cat}</h3>
          <div className="flex flex-wrap gap-2">
            {skills.filter((s) => s.category === cat).map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border/50 text-xs text-foreground">
                {s.name}
                <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-red-400 transition-colors"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSkills;
