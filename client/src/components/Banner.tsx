import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const bannerImage = "/generated_images/Banner_section_gradient_tech_e48f2140.png";

export function Banner() {
  const { ref, isVisible } = useScrollAnimation();
  
  const openCalendly = () => {
    window.open(
      "https://calendly.com/aiautomatetn/30min",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/85" />
      
      <div className={`relative max-w-7xl mx-auto px-6 text-center z-10 transition-all duration-1000 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}>
        <h2
          className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6 lg:mb-8"
          data-testid="text-banner-tagline"
        >
          Ready to Scale Your Business with AI?
        </h2>
        <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          Join leading businesses in Tunisia that trust us to deliver intelligent automation solutions
        </p>
        <Button
          size="lg"
          variant="outline"
          onClick={openCalendly}
          className="bg-background/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-background/20 text-base px-8 gap-2"
          data-testid="button-banner-cta"
        >
          Schedule Your Free Consultation
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
