import { SiLinkedin, SiFacebook, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function Footer() {
  const { ref, isVisible } = useScrollAnimation();
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    servicesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="bg-muted/30 pt-12 lg:pt-16 pb-8">
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-semibold text-foreground">
                AutomateTN
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Transforming businesses in Tunisia with cutting-edge AI automation solutions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <button
                onClick={scrollToServices}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
                data-testid="link-footer-services"
              >
                Services
              </button>
              <button
                onClick={scrollToContact}
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
                data-testid="link-footer-contact"
              >
                Contact
              </button>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-booking"
              >
                Book Consultation
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect With Us</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover-elevate"
                data-testid="button-social-linkedin"
              >
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover-elevate"
                data-testid="button-social-twitter"
              >
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <SiX className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover-elevate"
                data-testid="button-social-facebook"
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © {new Date().getFullYear()} AutomateTN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
