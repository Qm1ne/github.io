export type Lang = "en" | "fr";

export const LANGS: Lang[] = ["en", "fr"];

export const DEFAULT_LANG: Lang = "en";

export const SITE_URL = "https://aiautomatetn.com";

/**
 * Routes served from a different slug per language, keyed by the canonical
 * English path. The canonical path is what the router matches on and what the
 * rest of the code passes around; the localised slug only exists in URLs.
 *
 * Adding a language means adding its slug here and to `LANGS`. Leaving a
 * language out of an entry means it reuses the English slug.
 */
const PATH_BY_LANG: Record<string, Partial<Record<Lang, string>>> = {
  "/solar-installers": { fr: "/installateurs-solaires" },
  "/energy-auditors": { fr: "/auditeurs-energetiques" },
};

/** Every localised slug mapped back to its canonical English path. */
const CANONICAL_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(PATH_BY_LANG).flatMap(([canonical, byLang]) =>
    Object.values(byLang)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => [slug, canonical]),
  ),
);

/** Every path a route is served from, in any language. Used to register routes. */
export function slugsFor(canonical: string): string[] {
  const localised = Object.values(PATH_BY_LANG[canonical] ?? {}).filter(
    (slug): slug is string => Boolean(slug) && slug !== canonical,
  );
  return [canonical, ...localised];
}

/**
 * The slug a language serves a route from, without the language prefix.
 *
 * This is what in-app links need: the router already prepends the prefix, so a
 * French page linking to `/installateurs-solaires` lands on
 * `/fr/installateurs-solaires`, which is the URL that actually exists.
 */
export function slugForLang(canonical: string, lang: Lang): string {
  return PATH_BY_LANG[canonical]?.[lang] ?? canonical;
}

/** Everything under `/fr` is the French site, anything else is English. */
export function langFromPath(pathname: string): Lang {
  return /^\/fr(\/|$)/.test(pathname) ? "fr" : DEFAULT_LANG;
}

/** The wouter base path a language is served from. */
export function langBase(lang: Lang): string {
  return lang === "fr" ? "/fr" : "";
}

/** Drops the language prefix: `/fr/article/x` becomes `/article/x`. */
export function stripLang(pathname: string): string {
  const inner = pathname.replace(/^\/fr(?=\/|$)/, "");
  return inner === "" ? "/" : inner;
}

/** A localised slug resolved back to the canonical English path. */
export function canonicalPath(pathname: string): string {
  return CANONICAL_PATH[pathname] ?? pathname;
}

/** The same page in another language, as an absolute path. */
export function pathForLang(pathname: string, lang: Lang): string {
  const inner = canonicalPath(stripLang(pathname));
  const slug = PATH_BY_LANG[inner]?.[lang] ?? inner;
  if (lang !== "fr") return slug;
  return slug === "/" ? "/fr/" : `/fr${slug}`;
}
