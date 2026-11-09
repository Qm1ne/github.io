/**
 * Resubmits one sitemap to one Search Console property.
 *
 *   node scripts/submit-gsc-sitemap.mjs <bundle-dir> <sitemap-url>
 *
 * Follows the provider-operations order deliberately: capability and property
 * verification are written to disk BEFORE the mutation, then pre-state, then
 * the PUT, then post-state. Each step lands in its own file so the receipt can
 * cite real evidence rather than a reconstruction.
 *
 * Submitting a sitemap needs the read-write webmasters scope, not readonly.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createSign } from "node:crypto";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const PROPERTY = "sc-domain:aiautomatetn.com";
const SCOPE = "https://www.googleapis.com/auth/webmasters";
const API = "https://www.googleapis.com/webmasters/v3";

const [bundleArg, sitemapUrl] = process.argv.slice(2);
if (!bundleArg || !sitemapUrl) {
  console.error("usage: node scripts/submit-gsc-sitemap.mjs <bundle-dir> <sitemap-url>");
  process.exit(1);
}
const bundle = resolve(bundleArg);
if (!sitemapUrl.startsWith("https://aiautomatetn.com/")) {
  console.error(`refusing: ${sitemapUrl} is not on the authorized property`);
  process.exit(1);
}

const stamp = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const write = (name, data) => writeFile(join(bundle, name), JSON.stringify(data, null, 2) + "\n", "utf8");

const envText = await readFile(join(homedir(), ".seo-keys", "seo.env"), "utf8");
const env = Object.fromEntries(
  envText.split(/\r?\n/).map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const creds = JSON.parse(await readFile(env.GSC_SERVICE_ACCOUNT_JSON, "utf8"));

const b64 = (s) => Buffer.from(s).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const header = b64(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const claims = b64(JSON.stringify({
  iss: creds.client_email, scope: SCOPE, aud: creds.token_uri, exp: now + 3600, iat: now,
}));
const signer = createSign("RSA-SHA256");
signer.update(`${header}.${claims}`);
const tokenResponse = await fetch(creds.token_uri, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: `${header}.${claims}.${signer.sign(creds.private_key, "base64url")}`,
  }),
});
const tokenBody = await tokenResponse.json();
if (!tokenBody.access_token) {
  console.error(`auth failed: ${tokenBody.error_description ?? tokenBody.error}`);
  process.exit(1);
}
const authed = (url, init = {}) =>
  fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${tokenBody.access_token}` } });

await mkdir(bundle, { recursive: true });
const feed = `${API}/sites/${encodeURIComponent(PROPERTY)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

// 1. Capability and property verification, persisted before the mutation.
const sites = await (await authed(`${API}/sites`)).json();
const entry = (sites.siteEntry ?? []).find((s) => s.siteUrl === PROPERTY);
const capability = {
  checked_at: stamp(),
  note: "Read-only capability and property verification, captured BEFORE the mutation.",
  scope_requested: SCOPE,
  property: PROPERTY,
  permission_level: entry?.permissionLevel ?? null,
  verified: Boolean(entry),
};
await write("capability-check.json", capability);
console.log(`capability   ${capability.checked_at}  ${PROPERTY} -> ${capability.permission_level}`);
if (!entry) {
  console.error("property not visible to this service account; stopping before any mutation");
  process.exit(1);
}

// 2. Pre-state.
const preResponse = await authed(feed);
const pre = {
  captured_at: stamp(),
  http_status: preResponse.status,
  sitemap: preResponse.ok ? await preResponse.json() : null,
};
await write("pre-state.json", pre);
console.log(`pre-state    ${pre.captured_at}  lastSubmitted=${pre.sitemap?.lastSubmitted ?? "-"}  lastDownloaded=${pre.sitemap?.lastDownloaded ?? "never"}  errors=${pre.sitemap?.errors ?? "-"}`);

// 3. The mutation.
console.log(`\nsubmitting ${sitemapUrl} to ${PROPERTY} …`);
const started_at = stamp();
const putResponse = await authed(feed, { method: "PUT" });
const putBody = await putResponse.text();
const completed_at = stamp();
const submit = {
  endpoint: feed,
  method: "PUT",
  property: PROPERTY,
  sitemap: sitemapUrl,
  started_at,
  completed_at,
  http_status: putResponse.status,
  http_status_text: putResponse.statusText,
  response_body: putBody,
  response_headers: Object.fromEntries([...putResponse.headers.entries()]),
};
await write("submit-response.json", submit);
console.log(`   HTTP ${putResponse.status} ${putResponse.statusText}${putBody ? " " + putBody.slice(0, 160) : " (no body)"}`);

// 4. Post-state.
const postResponse = await authed(feed);
const post = {
  captured_at: stamp(),
  http_status: postResponse.status,
  sitemap: postResponse.ok ? await postResponse.json() : null,
};
await write("post-state.json", post);
console.log(`\npost-state   ${post.captured_at}  lastSubmitted=${post.sitemap?.lastSubmitted ?? "-"}  lastDownloaded=${post.sitemap?.lastDownloaded ?? "never"}  errors=${post.sitemap?.errors ?? "-"}  isPending=${post.sitemap?.isPending}`);

const moved = pre.sitemap?.lastSubmitted !== post.sitemap?.lastSubmitted;
console.log(`\nlastSubmitted changed: ${moved}`);
console.log("Acceptance is not download, crawl or indexing. Those remain separate observations.");
process.exit(putResponse.ok ? 0 : 1);
