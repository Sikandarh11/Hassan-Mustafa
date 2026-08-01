import { createContext, useContext, useEffect } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

type PortfolioContextType = ReturnType<typeof usePortfolioData>;

const PortfolioContext = createContext<PortfolioContextType | null>(null);

// Converts hex color to the HSL format expected by CSS variables (e.g., "41 87% 54%")
function hexToHSL(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const data = usePortfolioData();
  
  // Apply accent color from profile to CSS variable
  useEffect(() => {
    if (data.profile?.accent_color) {
      const hsl = hexToHSL(data.profile.accent_color);
      if (hsl) {
        document.documentElement.style.setProperty("--accent-color", hsl);
      }
    }
    return () => {
      document.documentElement.style.removeProperty("--accent-color");
    };
  }, [data.profile?.accent_color]);
  
  return <PortfolioContext.Provider value={data}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
};
