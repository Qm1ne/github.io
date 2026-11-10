import { renderToString } from "react-dom/server";
import type { TFunction } from "i18next";
import App from "./App";
import i18n from "./i18n";
import { articles } from "./data/articles";
import { landings, type LandingMetadata } from "./data/landings";
import { LANGS, SITE_URL, pathForLang, type Lang } from "./lib/routing";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const BRAND = "aiautomateTN";
const LOGO = `${SITE_URL}/android-chrome-512x512.png`;
const DEFAULT_OG = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "aiautomateTN - AI automation agency in Tunisia",
};

const OG_LOCALE: Record<Lang, string> = { en: "en_US", fr: "fr_FR" };

/** The image the home page hero shows, and therefore the one it preloads. */
const HOME_HERO = "/generated_images/Hero_background_office_workspace_03f6ce3c.webp";

export interface PrerenderedPage {
  /** File to write, relative to the build directory. */
  file: string;
  /** Canonical path of the page on the site. */
  path: string;
  lang: Lang;
  /** Markup to place between the SEO markers of the HTML template. */
  head: string;
  /** Server-rendered markup for the `#root` container. */
  body: string;
  /** The same page in the other languages, for the sitemap. */
  alternates: { lang: Lang; path: string }[];
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(graph: unknown[]): string {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  // `</` would close the script element early.
  return `  <script type="application/ld+json">\n${json.replace(/<\//g, "<\\/")}\n  </script>`;
}

/** The organization node, repeated on every page so each page stands alone. */
function organization() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: BRAND,
    alternateName: "AI Automation Agency Tunisia",
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: LOGO, width: 512, height: 512 },
    image: DEFAULT_OG.url,
    email: "contact@aiautomatetn.com",
    telephone: "+216 53 917 059",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
    areaServed: { "@type": "Country", name: "Tunisia" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+216 53 917 059",
      email: "contact@aiautomatetn.com",
      contactType: "customer service",
      availableLanguage: ["en", "fr"],
    },
    sameAs: [
      "https://www.linkedin.com/company/aiautomatetn",
      "https://www.facebook.com/profile.php?id=61579855040268",
    ],
  };
}

function website(lang: Lang) {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE_URL}/`,
    name: BRAND,
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  };
}

function webPage(url: string, title: string, description: string, lang: Lang, image: string) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { "@id": SITE_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
  };
}

/** The four offers shown in the Services section, marked up from the visible text. */
function services(t: TFunction, url: string) {
  return [1, 2, 3, 4].map((n) => ({
    "@type": "Service",
    "@id": `${url}#service-${n}`,
    name: t(`services.s${n}_title`),
    description: t(`services.s${n}_desc`),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Tunisia" },
  }));
}

/**
 * The one service a landing page sells.
 *
 * `name` is the name of the service, not the page's headline: a headline reads
 * as a sentence and makes a useless entity name. `audience` carries who the
 * page is for, which is what the eyebrow actually says.
 */
function landingService(t: TFunction, landing: LandingMetadata, url: string) {
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: t(`${landing.key}.service_name`),
    description: t(`${landing.key}.hero_subtext`),
    serviceType: t(`${landing.key}.service_type`),
    audience: {
      "@type": "Audience",
      audienceType: t(`${landing.key}.audience`),
    },
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Tunisia" },
  };
}

/**
 * The FAQ as structured data, taken from the same keys the page renders, so
 * the markup and the markup-about-the-markup cannot drift apart.
 */
function faqPage(t: TFunction, landing: LandingMetadata, url: string) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: Array.from({ length: landing.faqs }, (_, index) => index + 1).map(
      (n) => ({
        "@type": "Question",
        name: t(`${landing.key}.faq_${n}_q`),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(`${landing.key}.faq_${n}_a`),
        },
      }),
    ),
  };
}

function breadcrumb(url: string, brandHome: string, name: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND, item: brandHome },
      { "@type": "ListItem", position: 2, name },
    ],
  };
}

interface HeadInput {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  image: { url: string; width: number; height: number; alt: string };
  alternates: { lang: Lang; path: string }[];
  graph: unknown[];
  /** This page's own LCP image, preloaded so it is not found late. */
  preloadImage?: string;
}

function buildHead(input: HeadInput): string {
  const url = `${SITE_URL}${input.path}`;
  const lines = [
    `  <title>${esc(input.title)}</title>`,
    `  <meta name="description" content="${esc(input.description)}" />`,
    `  <meta name="robots" content="index, follow" />`,
    `  <link rel="canonical" href="${url}" />`,
  ];

  for (const alt of input.alternates) {
    lines.push(
      `  <link rel="alternate" hreflang="${alt.lang}" href="${SITE_URL}${alt.path}" />`,
    );
  }
  const xDefault = input.alternates.find((alt) => alt.lang === "en");
  if (xDefault) {
    lines.push(
      `  <link rel="alternate" hreflang="x-default" href="${SITE_URL}${xDefault.path}" />`,
    );
  }

  if (input.preloadImage) {
    lines.push(
      `  <link rel="preload" as="image" href="${input.preloadImage}" type="image/webp" fetchpriority="high" />`,
    );
  }

  lines.push(
    ``,
    `  <!-- Open Graph -->`,
    `  <meta property="og:site_name" content="${BRAND}" />`,
    `  <meta property="og:type" content="${input.ogType}" />`,
    `  <meta property="og:url" content="${url}" />`,
    `  <meta property="og:title" content="${esc(input.title)}" />`,
    `  <meta property="og:description" content="${esc(input.description)}" />`,
    `  <meta property="og:locale" content="${OG_LOCALE[input.lang]}" />`,
  );
  for (const alt of input.alternates) {
    if (alt.lang !== input.lang) {
      lines.push(
        `  <meta property="og:locale:alternate" content="${OG_LOCALE[alt.lang]}" />`,
      );
    }
  }
  lines.push(
    `  <meta property="og:image" content="${input.image.url}" />`,
    `  <meta property="og:image:width" content="${input.image.width}" />`,
    `  <meta property="og:image:height" content="${input.image.height}" />`,
    `  <meta property="og:image:alt" content="${esc(input.image.alt)}" />`,
    ``,
    `  <!-- Twitter -->`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${esc(input.title)}" />`,
    `  <meta name="twitter:description" content="${esc(input.description)}" />`,
    `  <meta name="twitter:image" content="${input.image.url}" />`,
    ``,
    jsonLd(input.graph),
  );

  return lines.join("\n");
}

function fileFor(lang: Lang, route: string): string {
  const path = pathForLang(route, lang);
  // GitHub Pages serves `/article/x` from `article/x.html` and `/fr/` from `fr/index.html`.
  return path.endsWith("/") ? `${path.slice(1)}index.html` : `${path.slice(1)}.html`;
}

function alternatesFor(route: string) {
  return LANGS.map((lang) => ({ lang, path: pathForLang(route, lang) }));
}

/** Renders every route in every language, ready to be written to disk. */
export async function prerender(): Promise<PrerenderedPage[]> {
  const routes = [
    "/",
    ...landings.map((landing) => landing.path),
    ...articles.map((article) => `/article/${article.slug}`),
  ];
  const pages: PrerenderedPage[] = [];

  for (const lang of LANGS) {
    await i18n.changeLanguage(lang);
    const t = i18n.getFixedT(lang);

    for (const route of routes) {
      const path = pathForLang(route, lang);
      const url = `${SITE_URL}${path}`;
      const alternates = alternatesFor(route);
      const landing = landings.find((l) => l.path === route);
      const article = articles.find((a) => `/article/${a.slug}` === route);

      let head: string;
      if (landing) {
        const title = t(`seo.${landing.key}.title`);
        const description = t(`seo.${landing.key}.desc`);
        head = buildHead({
          lang,
          path,
          title,
          description,
          ogType: "website",
          image: DEFAULT_OG,
          alternates,
          // A drawn scale is in the HTML already; there is nothing to fetch.
          preloadImage:
            landing.hero.kind === "photo" ? landing.hero.image : undefined,
          graph: [
            organization(),
            website(lang),
            webPage(url, title, description, lang, DEFAULT_OG.url),
            landingService(t, landing, url),
            faqPage(t, landing, url),
            // A breadcrumb trail is a short label, not the page headline.
            breadcrumb(
              url,
              `${SITE_URL}${pathForLang("/", lang)}`,
              t(`${landing.key}.short_name`),
            ),
          ],
        });
      } else if (!article) {
        const title = t("seo.home_title");
        const description = t("seo.home_desc");
        head = buildHead({
          lang,
          path,
          title,
          description,
          ogType: "website",
          image: DEFAULT_OG,
          alternates,
          preloadImage: HOME_HERO,
          graph: [
            organization(),
            website(lang),
            webPage(url, title, description, lang, DEFAULT_OG.url),
            ...services(t, url),
          ],
        });
      } else {
        const title = t(`seo.articles.${article.slug}.title`);
        const description = t(`seo.articles.${article.slug}.desc`);
        const headline = t(article.titleKey);
        const image = {
          url: `${SITE_URL}${article.image}`,
          width: article.imageWidth,
          height: article.imageHeight,
          alt: headline,
        };
        head = buildHead({
          lang,
          path,
          title,
          description,
          ogType: "article",
          image,
          alternates,
          preloadImage: article.image,
          graph: [
            organization(),
            website(lang),
            webPage(url, title, description, lang, image.url),
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline,
              description,
              articleSection: t(article.typeKey),
              image: image.url,
              inLanguage: lang,
              author: { "@id": ORG_ID },
              publisher: { "@id": ORG_ID },
              isPartOf: { "@id": SITE_ID },
              mainEntityOfPage: { "@id": `${url}#webpage` },
            },
            breadcrumb(
              url,
              `${SITE_URL}${pathForLang("/", lang)}`,
              headline,
            ),
          ],
        });
      }

      pages.push({
        file: fileFor(lang, route),
        path,
        lang,
        head,
        body: renderToString(<App lang={lang} ssrPath={path} />),
        alternates,
      });
    }
  }

  return pages;
}
