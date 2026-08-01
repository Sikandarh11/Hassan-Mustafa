import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getSectionVisibilityDefault,
  SECTION_VISIBILITY_DEFAULTS,
  type SectionKey,
} from "@/lib/sectionVisibility";

type AdminSectionVisibilityToggleProps = {
  sectionKey: SectionKey;
  sectionLabel: string;
};

const AdminSectionVisibilityToggle = ({
  sectionKey,
  sectionLabel,
}: AdminSectionVisibilityToggleProps) => {
  const sectionDefault = SECTION_VISIBILITY_DEFAULTS.find(
    (section) => section.key === sectionKey,
  );
  const [isVisible, setIsVisible] = useState(
    getSectionVisibilityDefault(sectionKey),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadVisibility = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("section_visibility")
      .select("is_visible")
      .eq("section_key", sectionKey)
      .maybeSingle();

    if (error) {
      const missingTable =
        error.code === "PGRST205" || error.message.includes("section_visibility");
      setLoadError(
        missingTable
          ? "Apply the section visibility database migration to enable this control."
          : error.message,
      );
    } else {
      setIsVisible(data?.is_visible ?? getSectionVisibilityDefault(sectionKey));
    }

    setLoading(false);
  }, [sectionKey]);

  useEffect(() => {
    void loadVisibility();
  }, [loadVisibility]);

  const updateVisibility = async (checked: boolean) => {
    const previousValue = isVisible;
    setIsVisible(checked);
    setSaving(true);

    const { error } = await supabase.from("section_visibility").upsert(
      {
        section_key: sectionKey,
        label: sectionLabel,
        is_visible: checked,
        sort_order: sectionDefault?.sortOrder ?? 0,
      },
      { onConflict: "section_key" },
    );

    if (error) {
      setIsVisible(previousValue);
      toast({
        title: "Visibility was not updated",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: checked ? `${sectionLabel} is visible` : `${sectionLabel} is hidden`,
        description: checked
          ? "This section is now shown on the frontend."
          : "This section has been removed from the frontend.",
      });
    }

    setSaving(false);
  };

  if (loadError) {
    return (
      <div className="flex max-w-3xl items-center justify-between gap-4 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0 text-destructive" size={18} />
          <p className="text-sm text-muted-foreground">{loadError}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={loadVisibility}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex max-w-3xl items-center justify-between gap-5 rounded-xl border border-primary/25 bg-primary/5 p-4 shadow-[0_0_18px_hsl(var(--primary)/0.05)]">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          {isVisible ? <Eye size={17} /> : <EyeOff size={17} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Show {sectionLabel} on frontend
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {isVisible
              ? "Visible to portfolio visitors. Turn this off to hide the entire section."
              : "Hidden from portfolio visitors. Turn this on to show it again."}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
          {saving ? "Saving..." : isVisible ? "Visible" : "Hidden"}
        </span>
        <Switch
          aria-label={`Show ${sectionLabel} on frontend`}
          checked={isVisible}
          disabled={loading || saving}
          onCheckedChange={updateVisibility}
        />
      </div>
    </div>
  );
};

export default AdminSectionVisibilityToggle;

