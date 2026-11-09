/**
 * Fetches Google Search Console data with a service account.
 *
 *   node scripts/fetch-search-console.mjs [--start 2026-08-11] [--end 2026-11-07]
 *
 * The service-account path comes from GSC_SERVICE_ACCOUNT_JSON in
 * ~/.seo-keys/seo.env. The private key is used to sign a JWT and is never
 * printed. Raw API responses are written to seo/captures/gsc/<date>/.
 *
 * The property is a Domain property (verified by DNS TXT), so its Search
 * Console identifier is `sc-domain:aiautomatetn.com`, not the https URL.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createSign } from "node:crypto";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const PROPERTY = "sc-domain:aiautomatetn.com";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API = "https://www.googleapis.com/webmasters/v3";

const args = { start: null, end: null };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) {
  const flag = argv[i].replace(/^--/, "");
  if (flag in args) args[flag] = argv[i + 1];
  else {
    console.error(`unknown option: ${argv[i]}`);
    process.exit(1);
  }
}
// Search Console reports with roughly a two-day lag.
const day = 86400000;
const iso = (d) => new Date(d).toISOString().slice(0, 10);
const end = args.end ?? iso(Date.now() - 3 * day);
const start = args.start ?? iso(new Date(end).getTime() - 89 * day);

const envText = await readFile(join(homedir(), ".seo-keys", "seo.env"), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
if (!env.GSC_SERVICE_ACCOUNT_JSON) {
  console.error("GSC_SERVICE_ACCOUNT_JSON is not set in ~/.seo-keys/seo.env");
  process.exit(1);
}
const creds = JSON.parse(await readFile(env.GSC_SERVICE_ACCOUNT_JSON, "utf8"));

const b64url = (input) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Signed JWT assertion, exchanged for a short-lived access token. */
function assertion() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: SCOPE,
      aud: creds.token_uri,
      exp: now + 3600,
      iat: now,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  return `${header}.${claims}.${signer.sign(creds.private_key, "base64url")}`;
}

const tokenResponse = await fetch(creds.token_uri, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: assertion(),
  }),
});
const tokenBody = await tokenResponse.json();
if (!tokenResponse.ok) {
  console.error(`token exchange failed: ${tokenResponse.status}`);
  console.error(`  ${tokenBody.error}: ${tokenBody.error_description ?? ""}`);
  process.exit(1);
}
const token = tokenBody.access_token;
console.log(`authenticated as ${creds.client_email}\n`);

const authed = (url, init = {}) =>
  fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });

const outDir = resolve(import.meta.dirname, "..", "seo", "captures", "gsc", iso(Date.now()));
await mkdir(outDir, { recursive: true });

// Which properties can this service account actually see?
const sitesResponse = await authed(`${API}/sites`);
const sites = await sitesResponse.json();
await writeFile(join(outDir, "sites.json"), JSON.stringify(sites, null, 2) + "\n", "utf8");
const entries = sites.siteEntry ?? [];
console.log(`properties visible to this service account: ${entries.length}`);
for (const s of entries) console.log(`   ${s.permissionLevel.padEnd(22)} ${s.siteUrl}`);

if (!entries.some((s) => s.siteUrl === PROPERTY)) {
  console.error(
    `\n${PROPERTY} is not among them.\n` +
      `In Search Console: Settings -> Users and permissions -> Add user\n` +
      `   ${creds.client_email}\n` +
      `Permission "Full" or "Restricted" both work for reading.`,
  );
  process.exit(1);
}

console.log(`\nwindow ${start} .. ${end} (inclusive), search type: web\n`);

const queries = [
  ["by-query", ["query"]],
  ["by-page", ["page"]],
  ["by-date", ["date"]],
  ["by-country", ["country"]],
  ["by-device", ["device"]],
  ["by-query-page", ["query", "page"]],
];

for (const [name, dimensions] of queries) {
  const response = await authed(
    `${API}/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: start,
        endDate: end,
        dimensions,
        type: "web",
        rowLimit: 25000,
        dataState: "final",
      }),
    },
  );
  const body = await response.text();
  if (!response.ok) {
    console.log(`  FAIL ${name}: ${response.status} ${body.slice(0, 200)}`);
    continue;
  }
  await writeFile(join(outDir, `${name}.json`), body, "utf8");
  const rows = JSON.parse(body).rows ?? [];
  const clicks = rows.reduce((t, r) => t + r.clicks, 0);
  const impressions = rows.reduce((t, r) => t + r.impressions, 0);
  console.log(
    `  ok   ${name.padEnd(14)} rows=${String(rows.length).padStart(5)}` +
      `  clicks=${String(clicks).padStart(5)}  impressions=${String(impressions).padStart(6)}`,
  );
}

console.log(`\nwritten to ${outDir}`);
