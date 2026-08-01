export const PORTFOLIO_OWNER_NAME = "Hafiz Muhammad Hassan Mustafa";
export const PORTFOLIO_OWNER_INITIALS = "HMHM";
export const PORTFOLIO_OWNER_PHOTO = "/hassan-mustafa.jpg";

const LEGACY_OWNER_NAMES = new Set(["ahmad naeem", "sikandar"]);
const LEGACY_OWNER_INITIALS = new Set(["an", "sikandar"]);

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

export const normalizePortfolioSiteTitle = (value?: string | null) => {
  const title = value?.trim();
  if (!title) return `${PORTFOLIO_OWNER_NAME} | AI Engineer`;

  return title.replace(/Ahmad Naeem/gi, PORTFOLIO_OWNER_NAME);
};
