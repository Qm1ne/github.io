/**
 * Asks Bing what it knows about each canonical URL, one at a time.
 *
 *   node scripts/fetch-bing-url-info.mjs [--keys <path>]
 *
 * GetCrawlStats reports how many pages are in Bing's index but never which,
 * so this walks the live sitemap and calls GetUrlInfo per URL. The key is read
 * from the same file as the other fetchers and is never printed.
 *
 * GetUrlInfo describes discovery and crawl state. A crawled URL with a stored
 * document is not by itself proof of indexing, and Bing exposes no per-URL
 * index flag here, so the output below is deliberately not labelled "indexed".
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const SITE = "https://aiautomatetn.com";
const API_BASE = "https://ssl.bing.com/webmaster/api.svc/json";

let keysPath = join(homedir(), ".seo-keys", "seo.env");
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) {
  if (argv[i] === "--keys") keysPath = argv[i + 1];
  else {
    console.error(`unknown option: ${argv[i]}`);
    process.exit(1);
  }
}

let key;
try {
  const text = await readFile(keysPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq !== -1 && trimmed.slice(0, eq).trim() === "BING_WEBMASTER_API_KEY") {
      key = trimmed.slice(eq + 1).trim();
    }
  }
} catch {
  console.error(`no key file at ${keysPath}`);
  process.exit(1);
}
if (!key || key === "PASTE_YOUR_BING_KEY_HERE") {
  console.error(`BING_WEBMASTER_API_KEY is not set in ${keysPath}`);
  process.exit(1);
}

/**
 * Bing marks "no date" with a huge negative epoch (year 0001), so anything
 * before 2000 is treated as absent rather than rendered as a real date.
 */
const date = (value) => {
  const match = typeof value === "string" ? /\/Date\((-?\d+)\)\//.exec(value) : null;
  if (!match) return null;
  const ms = Number(match[1]);
  return ms > 946684800000 ? new Date(ms).toISOString().slice(0, 10) : null;
};

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`${urls.length} URLs from the live sitemap\n`);

const results = [];
for (const url of urls) {
  const qs = `apikey=${encodeURIComponent(key)}&siteUrl=${encodeURIComponent(SITE)}&url=${encodeURIComponent(url)}`;
  const response = await fetch(`${API_BASE}/GetUrlInfo?${qs}`);
  const body = await response.text();
  if (!response.ok) {
    console.log(`  ERROR ${response.status}  ${url}`);
    results.push({ url, error: `${response.status} ${response.statusText}` });
    continue;
  }
  const info = JSON.parse(body).d;
  results.push({
    url,
    discovered: date(info?.DiscoveryDate),
    last_crawled: date(info?.LastCrawledDate),
    document_size: info?.DocumentSize ?? null,
    anchor_count: info?.AnchorCount ?? null,
    is_page: info?.IsPage ?? null,
    http_status: info?.HttpStatus ?? null,
  });
}

const path = (url) => url.replace(SITE, "") || "/";
const pad = Math.max(...results.map((r) => path(r.url).length));
console.log(
  `${"path".padEnd(pad)}  ${"discovered".padEnd(11)}${"last crawled".padEnd(13)}${"size".padStart(7)}  anchors`,
);
// DocumentSize is 0 for almost every URL here, including one that has recorded
// impressions, so it is reported but never treated as an index signal. The
// date Bing last looked is the field that actually distinguishes these URLs.
const SITE_REBUILT = "2026-10-22";

for (const r of results) {
  if (r.error) {
    console.log(`${path(r.url).padEnd(pad)}  ${r.error}`);
    continue;
  }
  const stale = !r.last_crawled || r.last_crawled < SITE_REBUILT;
  console.log(
    `${path(r.url).padEnd(pad)}  ${(r.discovered ?? "-").padEnd(11)}` +
      `${(r.last_crawled ?? "-").padEnd(13)}${String(r.document_size ?? "-").padStart(7)}` +
      `  ${String(r.anchor_count ?? "-").padStart(7)}` +
      `  ${stale ? `<- not crawled since ${SITE_REBUILT}` : ""}`,
  );
}

const outDir = resolve(import.meta.dirname, "..", "seo", "captures", "bing", new Date().toISOString().slice(0, 10));
await mkdir(outDir, { recursive: true });
const out = join(outDir, "GetUrlInfo.json");
await writeFile(out, JSON.stringify(results, null, 2) + "\n", "utf8");
console.log(`\nwritten to ${out}`);
