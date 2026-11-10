import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { EnergyRatingScale } from "@/components/EnergyRatingScale";
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
  const hero = landing.hero;
  const aside = hero.kind === "scale";
  // "I have a question about your automations" tells the reader nothing about
  // which of the two products they were looking at, and tells us nothing
  // either. Each page opens the chat on its own subject.
  const whatsappMessage = k("whatsapp_message");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* 1. Hero: one pain, one outcome, one call to action. */}
        <section className="relative overflow-hidden border-b bg-muted/30">
          {/* A photograph sits behind the text under a scrim. The rating
              scale cannot: text over a chart is unreadable, and cropping an
              A-to-G scale cuts the letters off its ends. It goes beside the
              text instead. */}
          {hero.kind === "photo" && (
            <>
              <img
                src={hero.image}
                alt=""
                aria-hidden="true"
                width={hero.width}
                height={hero.height}
                fetchPriority="high"
                decoding="async"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className={`absolute inset-0 ${hero.scrim}`}
              />
            </>
          )}

          <div
            className={`relative z-10 mx-auto px-6 py-16 lg:py-24 ${
              aside ? "max-w-6xl" : "max-w-4xl"
            }`}
          >
            <div
              className={
                aside ? "grid items-center gap-10 md:grid-cols-2" : undefined
              }
            >
              <div className={aside ? "text-center md:text-left" : "text-center"}>
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
                {/* Where a visitor can try the thing themselves, that is the
                    cheaper first step and it belongs next to the call, not four
                    sections below it. The call stays the primary button. */}
                <div
                  className={`mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center ${
                    aside ? "md:justify-start" : ""
                  }`}
                >
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
                  {landing.tool && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto whitespace-normal h-auto py-3 text-base px-6 sm:px-8 gap-2"
                    >
                      <a
                        href={landing.tool}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackCtaClick({
                            location: "hero",
                            campaign,
                            destination: "tool",
                          })
                        }
                        data-testid="link-landing-hero-tool"
                      >
                        {t(k("hero_tool_cta"))}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </Button>
                  )}
                </div>
                {/* Darker than the usual muted grey: this one sits over a
                    photograph on one of the two pages, and muted grey does not
                    hold 4.5:1 against it. */}
                <div
                  className={`mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 ${
                    aside ? "md:justify-start" : ""
                  }`}
                >
                  <p className="text-sm text-foreground/75">
                    {t(k("hero_note"))}
                  </p>
                  {/* Hidden on phones, where the floating green button is
                      already permanent and unmissable, and where this line
                      lands underneath it at the top of the page.

                      Underlined rather than primary-coloured: measured over
                      the photograph on the solar page, primary falls to
                      4.3:1 this far right of the scrim. */}
                  <WhatsAppButton
                    campaign={campaign}
                    location="hero"
                    variant="ghost"
                    size="sm"
                    className="hidden h-auto min-h-0 gap-1 px-1 py-0 text-sm text-foreground/75 underline underline-offset-4 sm:inline-flex"
                    messageKey={whatsappMessage}
                    data-testid="link-landing-hero-whatsapp"
                  >
                    {t(k("hero_whatsapp"))}
                  </WhatsAppButton>
                </div>
              </div>

              {hero.kind === "scale" && (
                <EnergyRatingScale
                  title={t(hero.titleKey)}
                  className="mx-auto w-full max-w-xs md:max-w-sm"
                />
              )}
            </div>
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
                  {landing.refundNote && (
                    <p className="mt-3 font-medium text-foreground">
                      {t(k("verified_refund"))}
                    </p>
                  )}
                </div>
              </div>
            </Card>
            {/* The same single action, offered at the point the reader's
                largest objection has just been answered. */}
            <div className="mt-8 flex justify-center">
              <CalendlyButton
                campaign={campaign}
                location="mid"
                size="lg"
                className="w-full sm:w-auto whitespace-normal h-auto py-3 text-base px-6 sm:px-8 gap-2"
                data-testid="button-landing-mid-cta"
              >
                {t(k("hero_cta"))}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </CalendlyButton>
            </div>
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
                <details
                  key={n}
                  open={n === 1}
                  className="group py-4"
                  data-testid={`faq-${n}`}
                >
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
                messageKey={whatsappMessage}
                data-testid="button-landing-whatsapp"
              >
                {t(k("final_whatsapp"))}
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppFab campaign={campaign} messageKey={whatsappMessage} />
      <Footer />
    </div>
  );
}
