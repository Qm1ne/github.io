import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CalendlyButton } from "@/components/CalendlyButton";
import { WhatsAppButton, WhatsAppFab } from "@/components/WhatsAppButton";
import { trackCtaClick } from "@/lib/analytics";
import type { LandingMetadata } from "@/data/landings";

/** 1..n, for the numbered copy keys. */
function range(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

/**
 * The shared shell for both energy-sector landing pages: one pain, one
 * outcome, one call to action, in the same order on both pages.
 *
 * Everything is in the markup on first paint. Nothing here is behind a click,
 * including the FAQ, which uses `details` rather than a scripted accordion so
 * the answers are readable without scripting and present for crawlers.
 */
export function LandingPage({ landing }: { landing: LandingMetadata }) {
  const { t } = useTranslation();
  const k = (suffix: string) => `${landing.key}.${suffix}`;
  const campaign = landing.campaign;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* 1. Hero: one pain, one outcome, one call to action. */}
        <section className="relative overflow-hidden border-b bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {t(k("hero_eyebrow"))}
            </p>
            <h1
              className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
              data-testid="text-landing-headline"
            >
              {t(k("hero_title"))}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t(k("hero_subtext"))}
            </p>
            <div className="mt-8 flex justify-center">
              <CalendlyButton
                campaign={campaign}
                location="hero"
                size="lg"
                className="w-full sm:w-auto whitespace-normal h-auto py-3 text-base px-6 sm:px-8 gap-2"
                data-testid="button-landing-hero-cta"
              >
                {t(k("hero_cta"))}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </CalendlyButton>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t(k("hero_note"))}
            </p>
          </div>
        </section>

        {/* 2. The problem today. */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {t(k("problem_title"))}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {t(k("problem_body"))}
            </p>
            <ul className="mt-6 space-y-3">
              {range(3).map((n) => (
                <li key={n} className="flex gap-3 text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span>{t(k(`problem_${n}`))}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. How it works, in three steps. */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {t(k("steps_title"))}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t(k("steps_subtitle"))}
              </p>
            </div>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {range(landing.steps).map((n) => (
                <li key={n}>
                  <Card className="h-full p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-lg font-bold text-primary"
                    >
                      {n}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                      {t(k(`steps_${n}_title`))}
                    </h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {t(k(`steps_${n}_body`))}
                    </p>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Human verification. Both outputs are government documents. */}
        <section className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-6">
            <Card className="border-primary/30 bg-primary/5 p-6 lg:p-8">
              <div className="flex gap-4">
                <ShieldCheck
                  className="h-7 w-7 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t(k("verified_title"))}
                  </h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {t(k("verified_body"))}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 5. Proof: the real case, with the label it earns. */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {t(k("proof_title"))}
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-primary">
              {t(k("proof_label"))}
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {t(k("proof_body"))}
            </p>
            <p className="mt-6 text-2xl font-bold text-foreground">
              {t(k("proof_metric"))}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(k("proof_metric_note"))}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild variant="outline">
                <Link href={`/article/${landing.articleSlug}`}>
                  {t(k("proof_link"))}
                </Link>
              </Button>
              {landing.tool && (
                <Button asChild variant="ghost" className="gap-2 text-primary">
                  <a
                    href={landing.tool}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackCtaClick({
                        location: "proof",
                        campaign,
                        destination: "tool",
                      })
                    }
                    data-testid="link-landing-tool"
                  >
                    {t(k("tool_cta"))}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* 6. Short FAQ. */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {t(k("faq_title"))}
            </h2>
            <div className="mt-8 divide-y border-y">
              {range(landing.faqs).map((n) => (
                <details key={n} className="group py-4" data-testid={`faq-${n}`}>
                  <summary className="cursor-pointer list-none font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {t(k(`faq_${n}_q`))}
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-primary transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {t(k(`faq_${n}_a`))}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 7. The one call to action, repeated at the end. */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-primary-foreground">
              {t(k("final_title"))}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              {t(k("final_body"))}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CalendlyButton
                campaign={campaign}
                location="footer"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto whitespace-normal h-auto py-3 text-base px-6 sm:px-8 gap-2"
                data-testid="button-landing-final-cta"
              >
                {t(k("final_cta"))}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </CalendlyButton>
              <WhatsAppButton
                campaign={campaign}
                location="footer"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto whitespace-normal h-auto py-3 text-base px-6 sm:px-8 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-landing-whatsapp"
              >
                {t(k("final_whatsapp"))}
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppFab campaign={campaign} />
      <Footer />
    </div>
  );
}
