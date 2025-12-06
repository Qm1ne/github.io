import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const heroImage = "/generated_images/Hero_background_office_workspace_03f6ce3c.png";

export function Hero() {
  const { ref, isVisible } = useScrollAnimation();
  
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      
      <div className={`relative max-w-7xl mx-auto px-6 py-20 lg:py-32 text-center z-10 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            data-testid="text-hero-headline"
          >
            Transform Your Business with{" "}
            <span className="text-primary">AI Automation</span>
          </h1>
          
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            data-testid="text-hero-subtext"
          >
            Expert consulting services in Tunisia. We streamline your workflows,
            integrate CRM systems, and boost lead generation with cutting-edge AI solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              variant="default"
              onClick={scrollToContact}
              className="text-base px-8 gap-2"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base px-8 backdrop-blur-sm bg-background/50"
              data-testid="button-learn-more"
            >
              <a href="#services">Learn More</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
