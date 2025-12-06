import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              AutomateTN
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="default"
              size="default"
              data-testid="button-book-consultation"
            >
              <a
                href="https://calendly.com/synthwave-graphics/quick-meeting"
                target="_blank"
                rel="noopener noreferrer"
              >
                Free Consultation
              </a>
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={scrollToContact}
              data-testid="button-contact-us"
            >
              Contact Us
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu-toggle">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-8">
                <SheetClose asChild>
                  <Button
                    variant="default"
                    size="default"
                    className="w-full"
                    asChild
                    data-testid="button-book-consultation-mobile"
                  >
                    <a
                      href="https://calendly.com/synthwave-graphics/quick-meeting"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book Consultation
                    </a>
                  </Button>
                </SheetClose>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={scrollToContact}
                  data-testid="button-contact-us-mobile"
                >
                  Contact Us
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
