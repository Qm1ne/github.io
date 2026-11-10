import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { pathForLang, type Lang } from "@/lib/routing";
import { CalendlyLink } from "@/components/CalendlyLink";

export function Navigation() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Each language has its own URL, so switching language is a navigation,
  // not an in-page state change.
  const currentLang: Lang = i18n.language === "fr" ? "fr" : "en";
  const langHref = (lang: Lang) => pathForLang(location, lang);
  const home = pathForLang("/", currentLang);

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
          <a href={home} className="flex items-center gap-2" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              AutomateTN
            </span>
          </a>

          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="default"
              size="default"
              data-testid="button-book-consultation"
            >
              <CalendlyLink location="nav">
                {t('nav.free_consultation')}
              </CalendlyLink>
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={scrollToContact}
              data-testid="button-contact-us"
            >
              {t('nav.contact_us')}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={langHref('en')} hrefLang="en" lang="en">
                    English {currentLang === 'en' && '✓'}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={langHref('fr')} hrefLang="fr" lang="fr">
                    Français {currentLang === 'fr' && '✓'}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <CalendlyLink location="nav-mobile">
                      {t('nav.book_consultation')}
                    </CalendlyLink>
                  </Button>
                </SheetClose>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={scrollToContact}
                  data-testid="button-contact-us-mobile"
                >
                  {t('nav.contact_us')}
                </Button>
                
                <div className="flex gap-2 justify-center mt-4">
                  <Button
                    variant={currentLang === 'en' ? 'default' : 'outline'}
                    size="sm"
                    asChild
                  >
                    <a href={langHref('en')} hrefLang="en" lang="en">EN</a>
                  </Button>
                  <Button
                    variant={currentLang === 'fr' ? 'default' : 'outline'}
                    size="sm"
                    asChild
                  >
                    <a href={langHref('fr')} hrefLang="fr" lang="fr">FR</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
