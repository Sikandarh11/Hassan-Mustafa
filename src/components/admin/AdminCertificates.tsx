import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCertificates = () => {
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("certificates").select("*").order("sort_order");
    if (data) setItems(data);
  };

  const add = async () => {
    const { data } = await supabase.from("certificates").insert({ name: "New Certificate", sort_order: items.length }).select().single();
    if (data) setItems([...items, data]);
  };

  const save = async (item: any) => {
    const { id, created_at, updated_at, ...rest } = item;
    await supabase.from("certificates").update(rest).eq("id", id);
    toast({ title: "Certificate saved!" });
  };

  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("certificates").delete().eq("id", id);
  };

  const update = (id: string, field: string, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Certificates</h2>
        <Button variant="ghost" size="sm" onClick={add}><Plus size={14} /> Add</Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="card-surface p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input value={item.name} onChange={(e) => update(item.id, "name", e.target.value)} placeholder="Certificate name" />
            <Input value={item.issuer || ""} onChange={(e) => update(item.id, "issuer", e.target.value)} placeholder="Issuer (optional)" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input value={item.link || ""} onChange={(e) => update(item.id, "link", e.target.value)} placeholder="Link (optional)" />
            <Input value={item.issuer_color || ""} onChange={(e) => update(item.id, "issuer_color", e.target.value)} placeholder="Issuer color hex (optional)" />
            <Input value={item.year || ""} onChange={(e) => update(item.id, "year", e.target.value)} placeholder="Year (optional)" />
          </div>
          <div className="flex gap-1">
            <Button size="sm" onClick={() => save(item)}><Save size={12} /> Save</Button>
            <Button size="sm" variant="ghost" onClick={() => remove(item.id)} className="text-red-400"><Trash2 size={12} /> Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCertificates;
