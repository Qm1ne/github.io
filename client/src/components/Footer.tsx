import { SiLinkedin, SiFacebook } from "react-icons/si";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useTranslation } from "react-i18next";
import { pathForLang, type Lang } from "@/lib/routing";
import { landings } from "@/data/landings";
import { CalendlyLink } from "@/components/CalendlyLink";

export function Footer() {
  const { t, i18n } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const [location] = useLocation();

  // Plain links rather than scroll handlers: they are crawlable, and they work
  // from the article pages, which have no services or contact section.
  const currentLang: Lang = i18n.language === "fr" ? "fr" : "en";
  const home = pathForLang("/", currentLang);
  const langHref = (lang: Lang) => pathForLang(location, lang);

  const langLinkClass = (lang: Lang) =>
    `text-sm transition-colors ${
      currentLang === lang
        ? "text-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`;

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
              {t('footer.desc')}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.quick_links')}</h3>
            <nav className="flex flex-col gap-2">
              <a
                href={`${home}#services`}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-services"
              >
                {t('footer.services')}
              </a>
              {/* Absolute paths, because the footer is on the article pages too
                  and each language serves these from its own slug. */}
              {landings.map((landing) => (
                <a
                  key={landing.path}
                  href={pathForLang(landing.path, currentLang)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`link-footer-${landing.campaign}`}
                >
                  {t(`${landing.key}.short_name`)}
                </a>
              ))}
              <a
                href={`${home}#contact`}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-contact"
              >
                {t('footer.contact')}
              </a>
              <CalendlyLink
                location="footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.book_consultation')}
              </CalendlyLink>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.connect')}</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover-elevate"
                data-testid="button-social-linkedin"
              >
                <a
                  href="https://www.linkedin.com/company/aiautomatetn"
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
                data-testid="button-social-facebook"
              >
                <a
                  href="https://www.facebook.com/profile.php?id=61579855040268"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
              </Button>
            </div>

            <h3 className="font-semibold text-foreground pt-2">{t('footer.language')}</h3>
            <nav className="flex gap-4" aria-label={t('footer.language')}>
              <a
                href={langHref('en')}
                hrefLang="en"
                lang="en"
                aria-current={currentLang === 'en' ? 'page' : undefined}
                className={langLinkClass('en')}
                data-testid="link-footer-lang-en"
              >
                English
              </a>
              <a
                href={langHref('fr')}
                hrefLang="fr"
                lang="fr"
                aria-current={currentLang === 'fr' ? 'page' : undefined}
                className={langLinkClass('fr')}
                data-testid="link-footer-lang-fr"
              >
                Français
              </a>
            </nav>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © {new Date().getFullYear()} {t('footer.all_rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
