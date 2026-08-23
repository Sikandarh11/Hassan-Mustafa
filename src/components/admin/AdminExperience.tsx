import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Experience = Tables<"experiences">;

const normalizeSortOrderInput = (value: string): string => value.replace(/[^\d]/g, "");

const parseOptionalSortOrder = (value: string): number | null => {
  const cleaned = normalizeSortOrderInput(value).trim();
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
};

type AdminExperienceItem = Experience & {
  sort_order_input: string;
};

const AdminExperience = () => {
  const [items, setItems] = useState<AdminExperienceItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order")
      .order("created_at");

    if (error || !data) {
      toast({
        title: "Failed to load experiences",
        description: error?.message,
        variant: "destructive",
      });
      return;
    }

    const updates = data
      .map((experience, index) => ({
        id: experience.id,
        nextSortOrder: index + 1,
        currentSortOrder: experience.sort_order,
      }))
      .filter((experience) => experience.currentSortOrder !== experience.nextSortOrder);

    if (updates.length > 0) {
      await Promise.all(
        updates.map((experience) =>
          supabase
            .from("experiences")
            .update({ sort_order: experience.nextSortOrder })
            .eq("id", experience.id)
        )
      );
    }

    const normalized = data.map((experience, index) => ({
      ...experience,
      sort_order: index + 1,
      sort_order_input: String(index + 1),
    }));

    setItems(normalized);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .insert({ company: "New Company", role: "Role", sort_order: items.length + 1 })
      .select()
      .single();

    if (error || !data) {
      toast({
        title: "Failed to add experience",
        description: error?.message,
        variant: "destructive",
      });
      return;
    }

    await load();
    setExpanded(data.id);
  };

  const save = async (item: AdminExperienceItem) => {
    const requestedSortOrder = parseOptionalSortOrder(item.sort_order_input);
    const currentSortOrder = item.sort_order;
    const maxSortOrder = items.length;
    const targetSortOrder =
      requestedSortOrder === null
        ? currentSortOrder
        : Math.max(1, Math.min(requestedSortOrder, maxSortOrder));

    const otherExperiences = items.filter((experience) => experience.id !== item.id);

    if (targetSortOrder < currentSortOrder) {
      const toShift = otherExperiences.filter(
        (experience) => experience.sort_order >= targetSortOrder && experience.sort_order < currentSortOrder
      );

      await Promise.all(
        toShift.map((experience) =>
          supabase
            .from("experiences")
            .update({ sort_order: experience.sort_order + 1 })
            .eq("id", experience.id)
        )
      );
    } else if (targetSortOrder > currentSortOrder) {
      const toShift = otherExperiences.filter(
        (experience) => experience.sort_order <= targetSortOrder && experience.sort_order > currentSortOrder
      );

      await Promise.all(
        toShift.map((experience) =>
          supabase
            .from("experiences")
            .update({ sort_order: experience.sort_order - 1 })
            .eq("id", experience.id)
        )
      );
    }

    const payload = {
      company: item.company,
      role: item.role,
      date_start: item.date_start,
      date_end: item.date_end,
      location: item.location,
      link: item.link,
      bullets: item.bullets,
      sort_order: targetSortOrder,
    };

    const { error } = await supabase.from("experiences").update(payload).eq("id", item.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    await load();
    setExpanded(item.id);
    toast({ title: "Experience saved!" });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    setItems(items.filter((item) => item.id !== id));
    await load();
  };

  const update = (
    id: string,
    field: keyof AdminExperienceItem,
    value: string | number | boolean | string[] | null
  ) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Experience</h2>
        <Button variant="ghost" size="sm" onClick={add}>
          <Plus size={14} /> Add
        </Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="card-surface overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{item.role}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                #{item.sort_order}
              </span>
            </div>
            {expanded === item.id ? (
              <ChevronUp size={16} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={16} className="text-muted-foreground" />
            )}
          </button>
          {expanded === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
              <div>
                <label className="text-xs text-muted-foreground font-mono">Index (optional)</label>
                <Input
                  value={item.sort_order_input}
                  onChange={(e) => update(item.id, "sort_order_input", normalizeSortOrderInput(e.target.value))}
                  className="mt-1"
                  placeholder="Leave blank to keep current order"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-mono">Company</label>
                  <Input
                    value={item.company}
                    onChange={(e) => update(item.id, "company", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono">Role</label>
                  <Input
                    value={item.role}
                    onChange={(e) => update(item.id, "role", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono">Start Date</label>
                  <Input
                    value={item.date_start || ""}
                    onChange={(e) => update(item.id, "date_start", e.target.value)}
                    className="mt-1"
                    placeholder="e.g. Jan 2024"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-mono">End Date</label>
                  <Input
                    value={item.date_end || ""}
                    onChange={(e) => update(item.id, "date_end", e.target.value)}
                    className="mt-1"
                    placeholder="e.g. Present"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono">Location</label>
                <Input
                  value={item.location || ""}
                  onChange={(e) => update(item.id, "location", e.target.value)}
                  className="mt-1"
                  placeholder="e.g. Islamabad, PK (optional)"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono">Certificate / Document Link (optional)</label>
                <Input
                  value={item.link || ""}
                  onChange={(e) => update(item.id, "link", e.target.value)}
                  className="mt-1"
                  placeholder="https://drive.google.com/... or any URL"
                  type="url"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-mono">Bullet Points (one per line)</label>
                <Textarea
                  value={(item.bullets || []).join("\n")}
                  onChange={(e) => update(item.id, "bullets", e.target.value.split("\n").filter(Boolean))}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={() => save(item)}>
                  <Save size={12} /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(item.id)} className="text-red-400">
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminExperience;
