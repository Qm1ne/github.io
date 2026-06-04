import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { articles } from "@/data/articles";

export function CaseStudies() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section ref={ref} className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-resources-title"
          >
            {t('caseStudies.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('caseStudies.subtitle')}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {articles.map((study, index) => (
            <Card
              key={study.slug}
              className="overflow-hidden hover-elevate transition-all duration-300 hover:-translate-y-1 flex flex-col"
              data-testid={`card-resource-${index}`}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={study.image}
                  alt={t(study.titleKey)}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 flex-1">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {t(study.typeKey)}
                  </span>
                </div>
                <h3
                  className="text-xl font-semibold text-card-foreground mb-3"
                  data-testid={`text-resource-title-${index}`}
                >
                  {t(study.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(study.excerptKey)}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/article/${study.slug}`}>
                  <Button
                    variant="ghost"
                    className="gap-2 px-0 text-primary hover:text-primary"
                    data-testid={`button-read-more-${index}`}
                  >
                    {t('caseStudies.read_more')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
