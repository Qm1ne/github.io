import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight, ClipboardCheck, Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { slugForLang, type Lang } from "@/lib/routing";

/**
 * The energy-sector block on the home page.
 *
 * The home page stays a general automation page, so this section is explicitly
 * a featured slice of it rather than the main offer, and it is the only place
 * on the home page that talks about a single industry.
 */
export function EnergyFeature() {
  const { t, i18n } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const lang: Lang = i18n.language === "fr" ? "fr" : "en";

  const cards = [
    {
      icon: Sun,
      canonical: "/solar-installers",
      title: t("energy.c1_title"),
      description: t("energy.c1_desc"),
      cta: t("energy.c1_cta"),
    },
    {
      icon: ClipboardCheck,
      canonical: "/energy-auditors",
      title: t("energy.c2_title"),
      description: t("energy.c2_desc"),
      cta: t("energy.c2_cta"),
    },
  ];

  return (
    <section
      id="energy"
      ref={ref}
      className="py-16 lg:py-24 border-y bg-background"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {t("energy.eyebrow")}
          </p>
          <h2
            className="mt-3 text-3xl lg:text-4xl font-bold text-foreground"
            data-testid="text-energy-title"
          >
            {t("energy.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("energy.subtitle")}
          </p>
        </div>

        <div
          className={`mt-10 grid gap-6 md:grid-cols-2 lg:gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.canonical}
                className="p-6 lg:p-8 hover-elevate transition-all duration-300 hover:-translate-y-1"
                data-testid={`card-energy-${index}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-card-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
                {/* A link, not a button with a handler, so it is crawlable and
                    opens in a new tab the way any link does. */}
                <Link
                  href={slugForLang(card.canonical, lang)}
                  className="mt-6 inline-flex items-center gap-2 font-medium text-primary hover:underline"
                  data-testid={`link-energy-${index}`}
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
