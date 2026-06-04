import aiWorkflowsImage from "@assets/generated_images/Blog_thumbnail_AI_workflows_dacabf8f.png";
import crmIntegrationImage from "@assets/generated_images/Blog_thumbnail_CRM_integration_09892445.png";
import leadGenImage from "@assets/generated_images/Blog_thumbnail_lead_generation_ecf3e76e.png";

export interface ArticleMetadata {
  slug: string;
  image: string;
  titleKey: string;
  excerptKey: string;
  typeKey: string;
}

export const articles: ArticleMetadata[] = [
  {
    slug: "steg-document-generator",
    image: aiWorkflowsImage,
    titleKey: "caseStudies.c1_title",
    excerptKey: "caseStudies.c1_desc",
    typeKey: "caseStudies.c1_type",
  },
  {
    slug: "crm-integration",
    image: crmIntegrationImage,
    titleKey: "caseStudies.c2_title",
    excerptKey: "caseStudies.c2_desc",
    typeKey: "caseStudies.c2_type",
  },
  {
    slug: "scaling-lead-generation",
    image: leadGenImage,
    titleKey: "caseStudies.c3_title",
    excerptKey: "caseStudies.c3_desc",
    typeKey: "caseStudies.c3_type",
  },
];
