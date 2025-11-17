import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import aiWorkflowsImage from "@assets/generated_images/Blog_thumbnail_AI_workflows_dacabf8f.png";
import crmIntegrationImage from "@assets/generated_images/Blog_thumbnail_CRM_integration_09892445.png";
import leadGenImage from "@assets/generated_images/Blog_thumbnail_lead_generation_ecf3e76e.png";

const caseStudies = [
  {
    image: aiWorkflowsImage,
    title: "Automating Customer Onboarding with AI",
    excerpt:
      "How we helped a SaaS company reduce onboarding time by 60% using intelligent automation workflows.",
    type: "Case Study",
  },
  {
    image: crmIntegrationImage,
    title: "CRM Integration Success Story",
    excerpt:
      "Transforming sales operations through seamless HubSpot integration and AI-powered lead scoring.",
    type: "Blog Post",
  },
  {
    image: leadGenImage,
    title: "Scaling Lead Generation with n8n",
    excerpt:
      "A comprehensive guide to building automated lead generation systems that deliver qualified prospects daily.",
    type: "Tutorial",
  },
];

export function CaseStudies() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section ref={ref} className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-resources-title"
          >
            Resources & Case Studies
          </h2>
          <p className="text-lg text-muted-foreground">
            Learn from our success stories and explore automation insights
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {caseStudies.map((study, index) => (
            <Card
              key={study.title}
              className="overflow-hidden hover-elevate transition-all duration-300 hover:-translate-y-1 flex flex-col"
              data-testid={`card-resource-${index}`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 flex-1">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {study.type}
                  </span>
                </div>
                <h3
                  className="text-xl font-semibold text-card-foreground mb-3"
                  data-testid={`text-resource-title-${index}`}
                >
                  {study.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {study.excerpt}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  variant="ghost"
                  className="gap-2 px-0 text-primary hover:text-primary"
                  data-testid={`button-read-more-${index}`}
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
