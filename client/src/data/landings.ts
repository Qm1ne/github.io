/**
 * The two energy-sector landing pages. Both use the same seven-section shell,
 * so a page is described by its translation keys and how many repeated items
 * its copy defines, not by its own layout.
 */
export interface LandingMetadata {
  /** Canonical English path. Also the pattern the router matches on. */
  path: string;
  /** Prefix for every translation key belonging to this page. */
  key: string;
  /** How many `steps_N_*` entries the locale files define. */
  steps: number;
  /** How many `faq_N_*` entries the locale files define. */
  faqs: number;
  /** A public tool to link from the proof section, where one exists. */
  tool?: string;
  /** The case study this page's proof section links to. */
  articleSlug: string;
  /** `utm_campaign` for every CTA on this page. */
  campaign: string;
}

export const landings: LandingMetadata[] = [
  {
    path: "/solar-installers",
    key: "landings.solar",
    steps: 3,
    faqs: 4,
    tool: "https://pv.aiautomatetn.com",
    articleSlug: "steg-document-generator",
    campaign: "solar-installers",
  },
  {
    path: "/energy-auditors",
    key: "landings.auditors",
    steps: 3,
    faqs: 4,
    articleSlug: "energy-audit-draft-reports",
    campaign: "energy-auditors",
  },
];

export function landingFor(path: string): LandingMetadata | undefined {
  return landings.find((landing) => landing.path === path);
}
