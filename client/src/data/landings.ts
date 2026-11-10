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
  /** The hero image. Preloaded, because it is the LCP element. */
  hero: {
    image: string;
    width: number;
    height: number;
    /**
     * `cover` fills the section behind the text, which suits a photograph.
     * `side` puts the image beside the text, which is the only honest way to
     * show a diagram: text over a chart is unreadable, and cropping a chart
     * cuts the labels off it.
     */
    layout: "cover" | "side";
    /** Only for `cover`: the wash that keeps the headline readable over it. */
    scrim?: string;
    /** Only for `side`: translation key for its alt text, since it is shown. */
    altKey?: string;
  };
}

export const landings: LandingMetadata[] = [
  {
    path: "/solar-installers",
    key: "landings.solar",
    steps: 3,
    faqs: 5,
    tool: "https://pv.aiautomatetn.com",
    articleSlug: "steg-document-generator",
    campaign: "solar-installers",
    hero: {
      image: "/images/hero-solar-installers.webp",
      width: 1600,
      height: 900,
      layout: "cover",
      scrim:
        "bg-gradient-to-r from-background/95 via-background/91 to-background/86",
    },
  },
  {
    path: "/energy-auditors",
    key: "landings.auditors",
    steps: 3,
    faqs: 5,
    articleSlug: "energy-audit-draft-reports",
    campaign: "energy-auditors",
    hero: {
      image: "/images/hero-energy-auditors.webp",
      width: 1200,
      height: 627,
      layout: "side",
      altKey: "landings.auditors.hero_image_alt",
    },
  },
];

export function landingFor(path: string): LandingMetadata | undefined {
  return landings.find((landing) => landing.path === path);
}
