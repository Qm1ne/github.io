/**
 * Google's own index status for each canonical URL, via the URL Inspection API.
 *
 *   node scripts/fetch-gsc-url-inspection.mjs
 *
 * This reports state; it is not an indexing-mutation endpoint. Credentials come
 * from GSC_SERVICE_ACCOUNT_JSON and the private key is never printed.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createSign } from "node:crypto";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const PROPERTY = "sc-domain:aiautomatetn.com";
const SITE = "https://aiautomatetn.com";

const envText = await readFile(join(homedir(), ".seo-keys", "seo.env"), "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).map(l => l.trim())
  .filter(l => l && !l.startsWith("#") && l.includes("="))
  .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]));
const creds = JSON.parse(await readFile(env.GSC_SERVICE_ACCOUNT_JSON, "utf8"));

const b64 = (s) => Buffer.from(s).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const head = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const claims = b64(JSON.stringify({
  iss: creds.client_email,
  scope: "https://www.googleapis.com/auth/webmasters.readonly",
  aud: creds.token_uri, exp: now + 3600, iat: now,
}));
const signer = createSign("RSA-SHA256");
signer.update(`${head}.${claims}`);
const jwt = `${head}.${claims}.${signer.sign(creds.private_key, "base64url")}`;

const tok = await (await fetch(creds.token_uri, {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
})).json();
if (!tok.access_token) { console.error("auth failed:", tok.error_description ?? tok.error); process.exit(1); }

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

const results = [];
for (const url of urls) {
  const r = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${tok.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: PROPERTY }),
  });
  const body = await r.json();
  if (!r.ok) { console.log(`FAIL ${r.status} ${url}: ${JSON.stringify(body).slice(0, 180)}`); continue; }
  const idx = body.inspectionResult?.indexStatusResult ?? {};
  results.push({
    url,
    verdict: idx.verdict ?? null,
    coverageState: idx.coverageState ?? null,
    robotsTxtState: idx.robotsTxtState ?? null,
    indexingState: idx.indexingState ?? null,
    lastCrawlTime: idx.lastCrawlTime ?? null,
    pageFetchState: idx.pageFetchState ?? null,
    googleCanonical: idx.googleCanonical ?? null,
    userCanonical: idx.userCanonical ?? null,
    crawledAs: idx.crawledAs ?? null,
  });
}

const pad = Math.max(...results.map(r => r.url.replace(SITE, "").length || 1));
console.log("path".padEnd(pad) + "  verdict  coverageState");
for (const r of results) {
  console.log((r.url.replace(SITE, "") || "/").padEnd(pad) + "  " + String(r.verdict).padEnd(8) + " " + r.coverageState);
}
console.log();
for (const r of results) {
  const p = r.url.replace(SITE, "") || "/";
  console.log(`${p}\n   lastCrawl=${r.lastCrawlTime ?? "never"}  fetch=${r.pageFetchState}  robots=${r.robotsTxtState}  as=${r.crawledAs}`);
  if (r.googleCanonical && r.googleCanonical !== r.userCanonical)
    console.log(`   CANONICAL MISMATCH: you declare ${r.userCanonical}, Google picked ${r.googleCanonical}`);
}

const outDir = resolve(import.meta.dirname, "..", "seo", "captures", "gsc", new Date().toISOString().slice(0, 10));
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "url-inspection.json"), JSON.stringify(results, null, 2) + "\n", "utf8");
console.log(`\nwritten to ${join(outDir, "url-inspection.json")}`);
