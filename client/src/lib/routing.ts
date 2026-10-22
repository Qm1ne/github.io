export type Lang = "en" | "fr";

export const LANGS: Lang[] = ["en", "fr"];

export const DEFAULT_LANG: Lang = "en";

export const SITE_URL = "https://aiautomatetn.com";

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

/** The same page in another language, as an absolute path. */
export function pathForLang(pathname: string, lang: Lang): string {
  const inner = stripLang(pathname);
  if (lang !== "fr") return inner;
  return inner === "/" ? "/fr/" : `/fr${inner}`;
}
