export interface ArticleMetadata {
  slug: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  titleKey: string;
  excerptKey: string;
  typeKey: string;
}

export const articles: ArticleMetadata[] = [
  {
    slug: "steg-document-generator",
    image: "/generated_images/Blog_thumbnail_AI_workflows_dacabf8f.webp",
    imageWidth: 1408,
    imageHeight: 768,
    titleKey: "caseStudies.c1_title",
    excerptKey: "caseStudies.c1_desc",
    typeKey: "caseStudies.c1_type",
  },
  {
    slug: "crm-integration",
    image: "/generated_images/Blog_thumbnail_CRM_integration_09892445.webp",
    imageWidth: 1408,
    imageHeight: 768,
    titleKey: "caseStudies.c2_title",
    excerptKey: "caseStudies.c2_desc",
    typeKey: "caseStudies.c2_type",
  },
  {
    slug: "scaling-lead-generation",
    image: "/generated_images/Blog_thumbnail_lead_generation_ecf3e76e.webp",
    imageWidth: 1408,
    imageHeight: 768,
    titleKey: "caseStudies.c3_title",
    excerptKey: "caseStudies.c3_desc",
    typeKey: "caseStudies.c3_type",
  },
];
