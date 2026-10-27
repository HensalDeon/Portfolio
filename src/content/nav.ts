export const navLinks = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navLinks)[number]["id"];

export const sectionIds: readonly SectionId[] = navLinks.map((link) => link.id);
