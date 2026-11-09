/**
 * Submits an explicitly authorized set of URLs to Bing for recrawl.
 *
 *   node scripts/submit-bing-urls.mjs <bundle-dir> <url> [<url> ...]
 *
 * This mutates a provider account, so it refuses to guess: every URL must be
 * passed on the command line, and the script captures GetUrlInfo for each one
 * before and after the call so the receipt has real pre and post state.
 *
 * Writes pre-state.json, submit-response.json and post-state.json into the
 * bundle. It does not write the receipt; build-bing-submit-receipt.mjs does
 * that from these files.
 */
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const API_BASE = "https://ssl.bing.com/webmaster/api.svc/json";
const SITE_URL = "https://aiautomatetn.com/";

const [bundleArg, ...urls] = process.argv.slice(2);
if (!bundleArg || urls.length === 0) {
  console.error("usage: node scripts/submit-bing-urls.mjs <bundle-dir> <url> [<url> ...]");
  process.exit(1);
}
const bundle = resolve(bundleArg);

for (const url of urls) {
  if (!url.startsWith(SITE_URL)) {
    console.error(`refusing: ${url} is not under ${SITE_URL}`);
    process.exit(1);
  }
}

const envText = await readFile(join(homedir(), ".seo-keys", "seo.env"), "utf8");
const keyLine = envText.split(/\r?\n/).find((l) => l.startsWith("BING_WEBMASTER_API_KEY="));
const key = keyLine?.slice(keyLine.indexOf("=") + 1).trim();
if (!key || key === "PASTE_YOUR_BING_KEY_HERE") {
  console.error("BING_WEBMASTER_API_KEY is not set");
  process.exit(1);
}
const redact = (text) => text.replaceAll(key, "REDACTED");

/** GetUrlInfo for each target, used as both pre and post state. */
async function capture(label) {
  const captured_at = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const entries = [];
  for (const url of urls) {
    const qs = `apikey=${encodeURIComponent(key)}&siteUrl=${encodeURIComponent(SITE_URL)}&url=${encodeURIComponent(url)}`;
    const response = await fetch(`${API_BASE}/GetUrlInfo?${qs}`);
    const info = JSON.parse(await response.text()).d;
    const asDate = (v) => {
      const m = typeof v === "string" ? /\/Date\((-?\d+)\)\//.exec(v) : null;
      const ms = m ? Number(m[1]) : NaN;
      return ms > 946684800000 ? new Date(ms).toISOString().slice(0, 10) : null;
    };
    entries.push({
      url,
      discovered: asDate(info?.DiscoveryDate),
      last_crawled: asDate(info?.LastCrawledDate),
      document_size: info?.DocumentSize ?? null,
      http_status: info?.HttpStatus ?? null,
    });
  }
  return { label, captured_at, site_url: SITE_URL, urls: entries };
}

const pre = await capture("pre-state");
await writeFile(join(bundle, "pre-state.json"), JSON.stringify(pre, null, 2) + "\n", "utf8");
console.log(`pre-state  ${pre.captured_at}`);
for (const e of pre.urls) console.log(`   last crawled ${e.last_crawled ?? "never"}  ${e.url}`);

console.log(`\nsubmitting ${urls.length} URL(s) to ${SITE_URL} …`);
const started_at = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const response = await fetch(`${API_BASE}/SubmitUrlBatch?apikey=${encodeURIComponent(key)}`, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ siteUrl: SITE_URL, urlList: urls }),
});
const bodyText = await response.text();
const completed_at = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

const result = {
  endpoint: `${API_BASE}/SubmitUrlBatch`,
  method: "POST",
  site_url: SITE_URL,
  url_list: urls,
  started_at,
  completed_at,
  http_status: response.status,
  http_status_text: response.statusText,
  response_body: redact(bodyText),
  response_headers: Object.fromEntries([...response.headers.entries()].map(([k, v]) => [k, redact(v)])),
};
await writeFile(join(bundle, "submit-response.json"), JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(`   HTTP ${response.status} ${response.statusText}`);
console.log(`   body: ${redact(bodyText).slice(0, 200) || "(empty)"}`);

const post = await capture("post-state");
await writeFile(join(bundle, "post-state.json"), JSON.stringify(post, null, 2) + "\n", "utf8");
console.log(`\npost-state ${post.captured_at}`);
for (const e of post.urls) console.log(`   last crawled ${e.last_crawled ?? "never"}  ${e.url}`);

console.log(
  `\nAcceptance by Bing is not crawl, indexing or serving. Those stay pending until observed separately.`,
);
process.exit(response.ok ? 0 : 1);
