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
  /** A public tool to link from the hero and the proof section, where one exists. */
  tool?: string;
  /**
   * Whether this page may promise money back on a rejected document.
   *
   * Only the STEG pack can: the promise is on the cost of a document that was
   * refused because the generator got it wrong, and an audit draft is never
   * filed with anybody. So the reassurance under the verification card is
   * written for one page and absent from the other, rather than softened into
   * something true of both.
   */
  refundNote?: boolean;
  /** The case study this page's proof section links to. */
  articleSlug: string;
  /** `utm_campaign` for every CTA on this page. */
  campaign: string;
  /**
   * What the hero shows beside or behind its text.
   *
   * `photo` fills the section behind the text under a scrim, and is preloaded
   * because it is then the LCP element. `scale` draws the A-to-G rating scale
   * next to the text: it is seven bars and seven letters, so it is drawn
   * rather than fetched, and nothing needs preloading.
   */
  hero:
    | {
        kind: "photo";
        image: string;
        width: number;
        height: number;
        scrim: string;
      }
    | { kind: "scale"; titleKey: string };
}

export const landings: LandingMetadata[] = [
  {
    path: "/solar-installers",
    key: "landings.solar",
    steps: 3,
    faqs: 5,
    tool: "https://pv.aiautomatetn.com",
    refundNote: true,
    articleSlug: "steg-document-generator",
    campaign: "solar-installers",
    hero: {
      kind: "photo",
      image: "/images/hero-solar-installers.webp",
      width: 1600,
      height: 900,
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
      kind: "scale",
      titleKey: "landings.auditors.hero_image_alt",
    },
  },
];

export function landingFor(path: string): LandingMetadata | undefined {
  return landings.find((landing) => landing.path === path);
}
