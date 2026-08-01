import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MECHANICAL_SERVICE_CATEGORIES,
  MECHANICAL_SERVICE_ICONS,
  MECHANICAL_SERVICE_PRESETS,
} from "@/lib/mechanicalServicePresets";

type EngineeringService = Tables<"engineering_services">;
type EditableServiceField = Exclude<
  keyof EngineeringService,
  "id" | "created_at" | "updated_at"
>;

const ENGAGEMENT_TYPES = [
  "Project-based",
  "Fixed scope",
  "Hourly consulting",
  "Analysis package",
  "Milestone-based",
  "Ongoing retainer",
];

const PRESET_STANDARDS: Record<string, string[]> = {
  "parametric-cad": ["ASME Y14.5", "ISO 2768"],
  "machine-design": ["ISO 286", "ASME B106.1M"],
  "drawings-gdt": ["ASME Y14.5", "ISO 1101", "ISO 2768"],
  "fea-validation": ["ASME V&V 10", "NAFEMS guidance"],
  "dfm-dfa": ["ASME Y14.5", "ISO 9001 design controls"],
  "reverse-engineering": ["ISO 10360", "ASME Y14.5"],
  "sheet-metal-weldments": ["AWS D1.1", "ISO 2768"],
  "product-development": ["ISO 12100", "ISO 9001 design controls"],
};

const listToText = (items: string[] | null) => (items ?? []).join("\n");

// Preserve blank and trailing lines while typing; sanitize only when saving.
const textToList = (value: string) => value.split(/\r?\n/);

const cleanList = (items: string[] | null) =>
  Array.from(
    new Set(
      (items ?? [])
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

const optionalText = (value: string | null) => value?.trim() || null;

const errorDescription = (error: unknown) => {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Please try again or check the Supabase connection.";
};

const normalizeOrder = (services: EngineeringService[]) =>
  services.map((service, index) => ({ ...service, sort_order: index }));

const writeOrder = async (services: EngineeringService[]) => {
  const normalized = normalizeOrder(services);
  const results = await Promise.all(
    normalized.map((service) =>
      supabase
        .from("engineering_services")
        .update({ sort_order: service.sort_order })
        .eq("id", service.id),
    ),
  );
  const failedUpdate = results.find((result) => result.error);
  if (failedUpdate?.error) throw failedUpdate.error;
  return normalized;
};

const AdminEngineeringServices = () => {
  const [items, setItems] = useState<EngineeringService[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(
    MECHANICAL_SERVICE_PRESETS[0]?.key ?? "",
  );
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  const showError = useCallback(
    (title: string, error: unknown) => {
      toast({
        title,
        description: errorDescription(error),
        variant: "destructive",
      });
    },
    [toast],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("engineering_services")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      const rows = data ?? [];
      const normalized = normalizeOrder(rows);
      setItems(normalized);

      const needsOrderRepair = rows.some(
        (service, index) => service.sort_order !== index,
      );
      if (needsOrderRepair) {
        try {
          await writeOrder(normalized);
        } catch (orderError) {
          showError("Services loaded, but their order could not be repaired", orderError);
        }
      }
    } catch (error) {
      setItems([]);
      showError("Failed to load engineering services", error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = <Field extends EditableServiceField>(
    id: string,
    field: Field,
    value: EngineeringService[Field],
  ) => {
    setItems((current) =>
      current.map((service) =>
        service.id === id ? { ...service, [field]: value } : service,
      ),
    );
  };

  const addService = async (presetKey?: string) => {
    setAdding(true);
    try {
      const preset = MECHANICAL_SERVICE_PRESETS.find(
        (candidate) => candidate.key === presetKey,
      );
      const nextSortOrder = items.length;
      const payload = preset
        ? {
            title: preset.title,
            category: preset.category,
            description: preset.description,
            icon: preset.icon,
            capabilities: preset.capabilities,
            tools: preset.tools,
            standards: PRESET_STANDARDS[preset.key] ?? [],
            deliverables: preset.deliverables,
            turnaround: preset.turnaround,
            engagement_type: preset.engagement_type,
            cta_label: "Discuss this service",
            cta_url: "#contact",
            is_featured: preset.is_featured,
            is_visible: true,
            sort_order: nextSortOrder,
          }
        : {
            title: "New Engineering Service",
            category: MECHANICAL_SERVICE_CATEGORIES[0] ?? "Design",
            description: null,
            icon: MECHANICAL_SERVICE_ICONS[0]?.value ?? "cog",
            capabilities: [],
            tools: [],
            standards: [],
            deliverables: [],
            turnaround: null,
            engagement_type: "Project-based",
            cta_label: "Discuss this service",
            cta_url: "#contact",
            is_featured: false,
            is_visible: true,
            sort_order: nextSortOrder,
          };

      const { data, error } = await supabase
        .from("engineering_services")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setItems((current) => [...current, data]);
      setExpanded(data.id);
      toast({
        title: preset ? `${preset.title} added` : "Blank service added",
        description: "Edit any fields below and save to update the frontend.",
      });
    } catch (error) {
      showError("Failed to add engineering service", error);
    } finally {
      setAdding(false);
    }
  };

  const save = async (item: EngineeringService) => {
    const title = item.title.trim();
    const category = item.category.trim();
    if (!title || !category) {
      toast({
        title: "Title and category are required",
        description: "Add both values before saving this service.",
        variant: "destructive",
      });
      return;
    }

    const currentIndex = items.findIndex((service) => service.id === item.id);
    if (currentIndex < 0) return;

    const targetIndex = Math.max(
      0,
      Math.min(Math.trunc(item.sort_order), items.length - 1),
    );
    const editedItem: EngineeringService = {
      ...item,
      title,
      category,
      description: optionalText(item.description),
      icon: optionalText(item.icon),
      capabilities: cleanList(item.capabilities),
      tools: cleanList(item.tools),
      standards: cleanList(item.standards),
      deliverables: cleanList(item.deliverables),
      turnaround: optionalText(item.turnaround),
      engagement_type: optionalText(item.engagement_type),
      cta_label: optionalText(item.cta_label),
      cta_url: optionalText(item.cta_url),
      is_featured: item.is_featured ?? false,
      is_visible: item.is_visible ?? true,
    };
    const reordered = [...items];
    reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, editedItem);
    const normalized = normalizeOrder(reordered);

    setBusyId(item.id);
    try {
      const results = await Promise.all(
        normalized.map((service) => {
          if (service.id !== item.id) {
            return supabase
              .from("engineering_services")
              .update({ sort_order: service.sort_order })
              .eq("id", service.id);
          }

          return supabase
            .from("engineering_services")
            .update({
              title: service.title,
              category: service.category,
              description: service.description,
              icon: service.icon,
              capabilities: service.capabilities,
              tools: service.tools,
              standards: service.standards,
              deliverables: service.deliverables,
              turnaround: service.turnaround,
              engagement_type: service.engagement_type,
              cta_label: service.cta_label,
              cta_url: service.cta_url,
              is_featured: service.is_featured,
              is_visible: service.is_visible,
              sort_order: service.sort_order,
            })
            .eq("id", service.id);
        }),
      );
      const failedUpdate = results.find((result) => result.error);
      if (failedUpdate?.error) throw failedUpdate.error;

      setItems(normalized);
      toast({
        title: "Engineering service saved",
        description: "The frontend receives the update in real time.",
      });
    } catch (error) {
      showError("Failed to save engineering service", error);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: EngineeringService) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBusyId(item.id);
    try {
      const { error } = await supabase
        .from("engineering_services")
        .delete()
        .eq("id", item.id);
      if (error) throw error;

      const remaining = items.filter((service) => service.id !== item.id);
      setItems(normalizeOrder(remaining));
      if (expanded === item.id) setExpanded(null);

      try {
        if (remaining.length > 0) {
          const normalized = await writeOrder(remaining);
          setItems(normalized);
        }
      } catch (orderError) {
        showError("Service deleted, but its order could not be cleaned up", orderError);
        await load();
        return;
      }

      toast({ title: "Engineering service deleted" });
    } catch (error) {
      showError("Failed to delete engineering service", error);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const move = async (id: string, direction: -1 | 1) => {
    const currentIndex = items.findIndex((service) => service.id === id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[currentIndex], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[currentIndex],
    ];

    setBusyId(id);
    try {
      const normalized = await writeOrder(reordered);
      setItems(normalized);
      toast({
        title: direction < 0 ? "Service moved up" : "Service moved down",
      });
    } catch (error) {
      showError("Failed to reorder engineering services", error);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Engineering Services
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Saved changes appear in the frontend services section through Supabase
          realtime. Hidden services stay in the CMS but are removed from the public site.
        </p>
      </div>

      <div className="card-surface space-y-3 p-4">
        <div>
          <label
            htmlFor="engineering-service-template"
            className="font-mono text-xs text-muted-foreground"
          >
            Start from a mechanical engineering template
          </label>
          <select
            id="engineering-service-template"
            value={selectedPreset}
            onChange={(event) => setSelectedPreset(event.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {MECHANICAL_SERVICE_PRESETS.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {preset.title} · {preset.category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => void addService(selectedPreset)}
            disabled={adding || !selectedPreset}
          >
            <Sparkles size={14} /> Add from template
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void addService()}
            disabled={adding}
          >
            <Plus size={14} /> Blank service
          </Button>
        </div>
      </div>

      <datalist id="mechanical-service-categories">
        {MECHANICAL_SERVICE_CATEGORIES.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <datalist id="mechanical-service-icons">
        {MECHANICAL_SERVICE_ICONS.map((icon) => (
          <option key={icon.value} value={icon.value} label={icon.label} />
        ))}
      </datalist>
      <datalist id="mechanical-service-engagement-types">
        {ENGAGEMENT_TYPES.map((engagement) => (
          <option key={engagement} value={engagement} />
        ))}
      </datalist>

      {loading && (
        <div className="card-surface p-6 text-center text-sm text-muted-foreground">
          Loading engineering services…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="card-surface p-6 text-center">
          <p className="text-sm font-medium text-foreground">No services yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a professional template or create a blank service above.
          </p>
        </div>
      )}

      {!loading &&
        items.map((item, index) => {
          const isExpanded = expanded === item.id;
          const isBusy = busyId === item.id;

          return (
            <div key={item.id} className="card-surface overflow-hidden">
              <div className="flex items-center gap-1 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={isExpanded}
                  aria-controls={`engineering-service-${item.id}`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.title || "Untitled service"}
                      </p>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        #{item.sort_order}
                      </span>
                      {item.is_featured && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                          Featured
                        </span>
                      )}
                      {item.is_visible === false && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.category || "No category"}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
                  )}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void move(item.id, -1)}
                  disabled={isBusy || index === 0}
                  aria-label={`Move ${item.title} up`}
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void move(item.id, 1)}
                  disabled={isBusy || index === items.length - 1}
                  aria-label={`Move ${item.title} down`}
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </Button>
              </div>

              {isExpanded && (
                <div
                  id={`engineering-service-${item.id}`}
                  className="space-y-4 border-t border-border/30 px-4 pb-4 pt-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Title
                      </label>
                      <Input
                        value={item.title}
                        onChange={(event) =>
                          update(item.id, "title", event.target.value)
                        }
                        className="mt-1"
                        placeholder="Machine & Mechanism Design"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Category
                      </label>
                      <Input
                        list="mechanical-service-categories"
                        value={item.category}
                        onChange={(event) =>
                          update(item.id, "category", event.target.value)
                        }
                        className="mt-1"
                        placeholder="Design"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground">
                      Description
                    </label>
                    <Textarea
                      value={item.description ?? ""}
                      onChange={(event) =>
                        update(item.id, "description", event.target.value)
                      }
                      className="mt-1"
                      rows={3}
                      placeholder="Explain the engineering problem, approach, and value delivered."
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Icon key
                      </label>
                      <Input
                        list="mechanical-service-icons"
                        value={item.icon ?? ""}
                        onChange={(event) =>
                          update(item.id, "icon", event.target.value)
                        }
                        className="mt-1"
                        placeholder="cog"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Sort order (0 is first)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={Math.max(items.length - 1, 0)}
                        step={1}
                        value={item.sort_order}
                        onChange={(event) => {
                          const value = event.target.valueAsNumber;
                          update(
                            item.id,
                            "sort_order",
                            Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0,
                          );
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Capabilities (one per line)
                      </label>
                      <Textarea
                        value={listToText(item.capabilities)}
                        onChange={(event) =>
                          update(item.id, "capabilities", textToList(event.target.value))
                        }
                        className="mt-1"
                        rows={4}
                        placeholder={"Mechanism layout\nBearing and shaft selection\nTolerance stack-up"}
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Tools & software (one per line)
                      </label>
                      <Textarea
                        value={listToText(item.tools)}
                        onChange={(event) =>
                          update(item.id, "tools", textToList(event.target.value))
                        }
                        className="mt-1"
                        rows={4}
                        placeholder={"SOLIDWORKS\nANSYS\nAutoCAD"}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Standards (one per line)
                      </label>
                      <Textarea
                        value={listToText(item.standards)}
                        onChange={(event) =>
                          update(item.id, "standards", textToList(event.target.value))
                        }
                        className="mt-1"
                        rows={4}
                        placeholder={"ASME Y14.5\nISO 2768\nISO 1101"}
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Deliverables (one per line)
                      </label>
                      <Textarea
                        value={listToText(item.deliverables)}
                        onChange={(event) =>
                          update(item.id, "deliverables", textToList(event.target.value))
                        }
                        className="mt-1"
                        rows={4}
                        placeholder={"Native CAD files\nManufacturing drawings\nCalculation report"}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Typical turnaround
                      </label>
                      <Input
                        value={item.turnaround ?? ""}
                        onChange={(event) =>
                          update(item.id, "turnaround", event.target.value)
                        }
                        className="mt-1"
                        placeholder="2-7 business days"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        Engagement type
                      </label>
                      <Input
                        list="mechanical-service-engagement-types"
                        value={item.engagement_type ?? ""}
                        onChange={(event) =>
                          update(item.id, "engagement_type", event.target.value)
                        }
                        className="mt-1"
                        placeholder="Project-based"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        CTA label
                      </label>
                      <Input
                        value={item.cta_label ?? ""}
                        onChange={(event) =>
                          update(item.id, "cta_label", event.target.value)
                        }
                        className="mt-1"
                        placeholder="Discuss this service"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground">
                        CTA URL
                      </label>
                      <Input
                        value={item.cta_url ?? ""}
                        onChange={(event) =>
                          update(item.id, "cta_url", event.target.value)
                        }
                        className="mt-1"
                        placeholder="#contact or https://cal.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-lg border border-border/50 bg-background/40 p-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`service-visible-${item.id}`}
                        checked={item.is_visible !== false}
                        onCheckedChange={(checked) =>
                          update(item.id, "is_visible", checked)
                        }
                      />
                      <label
                        htmlFor={`service-visible-${item.id}`}
                        className="cursor-pointer text-xs text-foreground"
                      >
                        Visible on frontend
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`service-featured-${item.id}`}
                        checked={item.is_featured === true}
                        onCheckedChange={(checked) =>
                          update(item.id, "is_featured", checked)
                        }
                      />
                      <label
                        htmlFor={`service-featured-${item.id}`}
                        className="cursor-pointer text-xs text-foreground"
                      >
                        Featured service
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => void save(item)}
                      disabled={isBusy}
                    >
                      <Save size={12} /> Save & publish
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void remove(item)}
                      disabled={isBusy}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={12} /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default AdminEngineeringServices;
