import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { articles } from "@/data/articles";
import ReactMarkdown from "react-markdown";

export default function ArticlePage() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/article/:slug");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.slug]);

  if (!match || !params?.slug) {
    return <div>Article not found</div>;
  }

  const articleMeta = articles.find((a) => a.slug === params.slug);

  if (!articleMeta) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-background selection:bg-primary/20 selection:text-primary">
        <Navigation />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
            <p className="text-muted-foreground">Article not found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch the localized title and content from the translation files
  // Assuming we added an "articles" object in en.json and fr.json
  const articleTitle = t(`articles.${params.slug}.title`);
  const articleContent = t(`articles.${params.slug}.content`);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background selection:bg-primary/20 selection:text-primary">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
            <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
              <img 
                src={articleMeta.image} 
                alt={articleTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                {t(articleMeta.typeKey)}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {articleTitle}
            </h1>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <ReactMarkdown>{articleContent}</ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
