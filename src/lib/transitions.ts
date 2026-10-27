/**
 * Props for the <ViewTransition> that wraps each page. Links tag navigations
 * as `nav-forward` (into a case study) or `nav-back` (out of one), and the
 * matching CSS in globals.css slides the page in that direction. Untagged
 * navigations, such as the browser back button, swap without a slide.
 */
export const pageTransition = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  default: "none",
} as const;
