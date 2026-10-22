import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { pathForLang, type Lang } from "@/lib/routing";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language === "fr" ? "fr" : "en";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">404</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("notFound.title")}
          </h1>
          <p className="text-muted-foreground mb-8">{t("notFound.desc")}</p>
          <Button asChild size="lg">
            <a href={pathForLang("/", lang)}>{t("notFound.back_home")}</a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
