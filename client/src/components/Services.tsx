import { Card } from "@/components/ui/card";
import { Workflow, Database, TrendingUp, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const services = [
  {
    icon: Workflow,
    title: "AI Workflows",
    description:
      "Automate repetitive tasks and streamline business processes with intelligent AI-powered workflows tailored to your needs.",
  },
  {
    icon: Database,
    title: "CRM Integration",
    description:
      "Seamlessly integrate AI capabilities into your existing CRM systems to enhance customer relationships and data management.",
  },
  {
    icon: TrendingUp,
    title: "Lead Generation",
    description:
      "Boost your sales pipeline with AI-driven lead generation strategies that identify and nurture high-quality prospects.",
  },
  {
    icon: Zap,
    title: "n8n/Make Consulting",
    description:
      "Expert guidance on implementing powerful automation platforms like n8n and Make to connect your business tools efficiently.",
  },
];

export function Services() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section id="services" ref={ref} className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            data-testid="text-services-title"
          >
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive AI automation solutions designed to elevate your business efficiency
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="p-6 lg:p-8 hover-elevate transition-all duration-300 hover:-translate-y-1"
                data-testid={`card-service-${index}`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-card-foreground"
                    data-testid={`text-service-title-${index}`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
