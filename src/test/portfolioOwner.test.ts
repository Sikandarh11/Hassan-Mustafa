import { describe, expect, it } from "vitest";
import {
  normalizePortfolioOwnerInitials,
  normalizePortfolioOwnerName,
  normalizePortfolioSiteTitle,
  PORTFOLIO_OWNER_NAME,
} from "@/lib/portfolioOwner";

describe("portfolio owner normalization", () => {
  it("replaces legacy database values with the current owner", () => {
    expect(normalizePortfolioOwnerName("Ahmad Naeem")).toBe(PORTFOLIO_OWNER_NAME);
    expect(normalizePortfolioOwnerInitials("AN")).toBe("HMHM");
    expect(normalizePortfolioSiteTitle("Ahmad Naeem | AI Engineer")).toBe(
      `${PORTFOLIO_OWNER_NAME} | AI Engineer`,
    );
  });

  it("preserves a newly customized value", () => {
    expect(normalizePortfolioOwnerName("Custom Portfolio Name")).toBe("Custom Portfolio Name");
  });
});
