export const SECTION_VISIBILITY_DEFAULTS = [
  { key: "profile", label: "Profile & Hero", sortOrder: 0, isVisible: true },
  { key: "hero_stats", label: "Hero Stats", sortOrder: 1, isVisible: true },
  { key: "services", label: "Services", sortOrder: 2, isVisible: true },
  { key: "experience", label: "Experience", sortOrder: 3, isVisible: true },
  { key: "projects", label: "Projects", sortOrder: 4, isVisible: true },
  { key: "blog", label: "Blog", sortOrder: 5, isVisible: true },
  { key: "research", label: "Research", sortOrder: 6, isVisible: true },
  { key: "team", label: "Team", sortOrder: 7, isVisible: true },
  { key: "certificates", label: "Certificates", sortOrder: 8, isVisible: true },
  { key: "skills", label: "Skills", sortOrder: 9, isVisible: true },
] as const;

export type SectionKey = (typeof SECTION_VISIBILITY_DEFAULTS)[number]["key"];

export const getSectionVisibilityDefault = (sectionKey: SectionKey) =>
  SECTION_VISIBILITY_DEFAULTS.find((section) => section.key === sectionKey)?.isVisible ?? true;

