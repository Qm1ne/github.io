import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

/**
 * One factual sentence about who does the work, plus the note that keeps it
 * factual.
 *
 * Deliberately small and deliberately low on the page. A former employer named
 * in a hero reads as a credential the employer granted, which is the one thing
 * this section must never imply, so the independence note sits in the markup
 * next to the sentence it qualifies rather than in a footnote somewhere else.
 */
export function WhoBuildsThis() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-12 lg:py-16 bg-background">
      <div
        className={`max-w-3xl mx-auto px-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2
          className="text-xl font-semibold text-foreground"
          data-testid="text-who-title"
        >
          {t("who.title")}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t("who.body")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground/80">{t("who.note")}</p>
      </div>
    </section>
  );
}
