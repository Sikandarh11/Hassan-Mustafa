import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminHeroStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("hero_stats").select("*").order("sort_order");
    if (data) setStats(data);
  };

  const save = async (stat: any) => {
    await supabase.from("hero_stats").update({ value: stat.value, label: stat.label, icon_type: stat.icon_type, is_visible: stat.is_visible }).eq("id", stat.id);
    toast({ title: "Stat saved!" });
  };

  const add = async () => {
    const { data } = await supabase.from("hero_stats").insert({ value: "0", label: "New Stat", sort_order: stats.length }).select().single();
    if (data) setStats([...stats, data]);
  };

  const remove = async (id: string) => {
    setStats(stats.filter((s) => s.id !== id));
    await supabase.from("hero_stats").delete().eq("id", id);
  };

  const update = (id: string, field: string, value: any) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Hero Stats</h2>
        <Button variant="ghost" size="sm" onClick={add}><Plus size={14} /> Add Stat</Button>
      </div>
      {stats.map((s) => (
        <div key={s.id} className="card-surface p-4 flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-mono">Value</label>
                <Input value={s.value} onChange={(e) => update(s.id, "value", e.target.value)} className="mt-1" placeholder="e.g. 35+" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono">Label</label>
                <Input value={s.label} onChange={(e) => update(s.id, "label", e.target.value)} className="mt-1" placeholder="e.g. Completed Orders" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={s.is_visible !== false} onChange={(e) => update(s.id, "is_visible", e.target.checked)} className="accent-primary" /> Visible on site
            </label>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => save(s)}><Save size={14} /></Button>
            <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-red-400"><Trash2 size={14} /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminHeroStats;
