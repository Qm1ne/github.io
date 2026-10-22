/**
 * Turns the built single-page app into one real HTML file per route.
 *
 * `vite build` leaves docs/index.html as an empty shell. This script renders
 * every route with react-dom/server, drops the markup into that shell and
 * writes it to the path GitHub Pages serves it from, so every URL in the
 * sitemap returns 200 with its own content and its own <head>.
 *
 * Run it through `npm run build:site`, which builds the client and the SSR
 * bundle first.
 */
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const outDir = join(root, "docs");
const ssrEntry = join(root, ".ssr", "entry-server.js");
const SITE_URL = "https://aiautomatetn.com";

const SEO_START = "<!-- SEO:START -->";
const SEO_END = "<!-- SEO:END -->";

function replaceSeo(template, head) {
  const start = template.indexOf(SEO_START);
  const end = template.indexOf(SEO_END);
  if (start === -1 || end === -1) {
    throw new Error("docs/index.html has no SEO:START / SEO:END markers");
  }
  return (
    template.slice(0, start) +
    head.trimStart() +
    "\n  " +
    template.slice(end + SEO_END.length)
  );
}

function withBody(html, body) {
  const root = '<div id="root"></div>';
  if (!html.includes(root)) {
    throw new Error("docs/index.html has no empty #root container");
  }
  return html.replace(root, `<div id="root">${body}</div>`);
}

function withLang(html, lang) {
  return html.replace('<html lang="en">', `<html lang="${lang}">`);
}

function sitemap(pages) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = pages
    .map((page) => {
      const alternates = page.alternates
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${SITE_URL}${alt.path}" />`,
        )
        .concat(
          page.alternates
            .filter((alt) => alt.lang === "en")
            .map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${alt.path}" />`,
            ),
        )
        .join("\n");
      return [
        "  <url>",
        `    <loc>${SITE_URL}${page.path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        alternates,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

function llmsTxt(pages) {
  const line = (page) => `- [${page.title}](${SITE_URL}${page.path}): ${page.description}`;
  const en = pages.filter((page) => page.lang === "en");
  const fr = pages.filter((page) => page.lang === "fr");
  return `# aiautomateTN

> AI automation consulting in Tunis, Tunisia. We build and run automated
> workflows with n8n, Make and custom AI agents: document generation, CRM
> integration and lead follow-up. The site is published in English and French.

Contact: contact@aiautomatetn.com

## English

${en.map(line).join("\n")}

## French

${fr.map(line).join("\n")}
`;
}

/** Pulls the title and description back out of a generated head block. */
function readMeta(head) {
  const title = /<title>([\s\S]*?)<\/title>/.exec(head);
  const description = /<meta name="description" content="([\s\S]*?)" \/>/.exec(head);
  const unescape = (value) =>
    value
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&");
  return {
    title: unescape(title?.[1] ?? ""),
    description: unescape(description?.[1] ?? ""),
  };
}

const template = await readFile(join(outDir, "index.html"), "utf8");
const { prerender } = await import(pathToFileURL(ssrEntry).href);
const pages = await prerender();

for (const page of pages) {
  const html = withLang(withBody(replaceSeo(template, page.head), page.body), page.lang);
  const file = join(outDir, page.file);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  console.log(`  ${page.path} -> docs/${page.file.replace(/\\/g, "/")}`);
}

// GitHub Pages serves /404.html for anything that is not pre-rendered. It keeps
// the app shell so the in-app not-found page still renders, but stays out of
// the index.
const notFound = withLang(
  replaceSeo(
    template,
    [
      "  <title>Page not found | aiautomateTN</title>",
      '  <meta name="robots" content="noindex, follow" />',
    ].join("\n"),
  ),
  "en",
);
await writeFile(join(outDir, "404.html"), notFound, "utf8");
console.log("  404 -> docs/404.html");

const withMeta = pages.map((page) => ({ ...page, ...readMeta(page.head) }));
await writeFile(join(outDir, "sitemap.xml"), sitemap(pages), "utf8");
await writeFile(join(outDir, "llms.txt"), llmsTxt(withMeta), "utf8");
console.log(`  sitemap.xml (${pages.length} urls), llms.txt`);

await rm(join(root, ".ssr"), { recursive: true, force: true });
