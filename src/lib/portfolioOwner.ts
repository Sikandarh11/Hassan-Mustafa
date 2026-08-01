export const PORTFOLIO_OWNER_NAME = "Hafiz Muhammad Hassan Mustafa";
export const PORTFOLIO_OWNER_INITIALS = "HMHM";
export const PORTFOLIO_OWNER_PHOTO = "/hassan-mustafa.jpg";
export const PORTFOLIO_BRAND_COLOR = "#F0AF22";

const LEGACY_OWNER_NAMES = new Set(["ahmad naeem", "sikandar"]);
const LEGACY_OWNER_INITIALS = new Set(["an", "sikandar"]);
const LEGACY_BRAND_COLORS = new Set(["#00d4d8", "00d4d8"]);

export const normalizePortfolioOwnerName = (value?: string | null) => {
  const name = value?.trim();
  return !name || LEGACY_OWNER_NAMES.has(name.toLowerCase())
    ? PORTFOLIO_OWNER_NAME
    : name;
};

export const normalizePortfolioOwnerInitials = (value?: string | null) => {
  const initials = value?.trim();
  return !initials || LEGACY_OWNER_INITIALS.has(initials.toLowerCase())
    ? PORTFOLIO_OWNER_INITIALS
    : initials;
};

export const normalizePortfolioAccentColor = (value?: string | null) => {
  const color = value?.trim();
  return !color || LEGACY_BRAND_COLORS.has(color.toLowerCase())
    ? PORTFOLIO_BRAND_COLOR
    : color;
};

export const normalizePortfolioSiteTitle = (value?: string | null) => {
  const title = value?.trim();
  if (!title) return `${PORTFOLIO_OWNER_NAME} | Mechanical Design Engineer`;

  return title
    .replace(/Ahmad Naeem/gi, PORTFOLIO_OWNER_NAME)
    .replace(/AI(?:\s*&\s*Machine Learning)? Engineer/gi, "Mechanical Design Engineer");
};
