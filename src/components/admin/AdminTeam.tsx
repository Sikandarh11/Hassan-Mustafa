import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminTeam = () => {
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    if (data) setItems(data);
  };

  const add = async () => {
    const { data } = await supabase.from("team_members").insert({ name: "New Member", sort_order: items.length }).select().single();
    if (data) setItems([...items, data]);
  };

  const save = async (item: any) => {
    const { id, created_at, updated_at, ...rest } = item;
    await supabase.from("team_members").update(rest).eq("id", id);
    toast({ title: "Team member saved!" });
  };

  const remove = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from("team_members").delete().eq("id", id);
  };

  const update = (id: string, field: string, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const uploadPhoto = async (id: string, file: File) => {
    const path = `team/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("portfolio").upload(path, file);
    if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(data.path);
    update(id, "photo_url", publicUrl);
  };

  const getInitials = (name: string) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
        <Button variant="ghost" size="sm" onClick={add}><Plus size={14} /> Add</Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="card-surface p-4 flex gap-4">
          <div className="shrink-0">
            {item.photo_url ? (
              <img src={item.photo_url} alt={item.name} className="w-16 h-16 rounded-full object-cover border border-primary/30" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">{getInitials(item.name)}</div>
            )}
            <label className="mt-2 block text-center">
              <span className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground"><Upload size={10} className="inline" /> Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(item.id, e.target.files[0])} />
            </label>
          </div>
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input value={item.name} onChange={(e) => update(item.id, "name", e.target.value)} placeholder="Name" />
              <Input value={item.role || ""} onChange={(e) => update(item.id, "role", e.target.value)} placeholder="Role (optional)" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input value={item.email || ""} onChange={(e) => update(item.id, "email", e.target.value)} placeholder="Email (optional)" />
              <Input value={item.linkedin_url || ""} onChange={(e) => update(item.id, "linkedin_url", e.target.value)} placeholder="LinkedIn URL (optional)" />
            </div>
            <Input value={item.alt_text || ""} onChange={(e) => update(item.id, "alt_text", e.target.value)} placeholder="Photo alt text (optional)" />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save(item)}><Save size={12} /> Save</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(item.id)} className="text-red-400"><Trash2 size={12} /> Delete</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTeam;
