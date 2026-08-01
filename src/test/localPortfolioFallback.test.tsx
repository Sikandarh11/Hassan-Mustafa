import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  isSupabaseConfigured: false,
  supabase: {},
}));

import { usePortfolioData } from "@/hooks/usePortfolioData";

describe("local portfolio fallback", () => {
  it("loads visible portfolio content when Supabase is not configured", async () => {
    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile?.name).toBe("Hafiz Muhammad Hassan Mustafa");
    expect(result.current.profile?.photo_url).toBe("/hassan-mustafa.jpg");
    expect(result.current.heroStats).toHaveLength(4);
    expect(result.current.typewriterLines).toHaveLength(2);
    expect(result.current.engineeringServices).toHaveLength(8);
    expect(result.current.blogPosts).toEqual([]);
    expect(result.current.sectionVisibility).toHaveLength(10);
    expect(result.current.isSectionVisible("services")).toBe(true);
    expect(result.current.isSectionVisible("skills")).toBe(true);
  });
});
