/**
 * Fetches first-party search data from the Bing Webmaster Tools API.
 *
 * The API key is read from C:/Users/lewis/.seo-keys/seo.env (override with
 * SEO_ENV_FILE), which lives outside this repository so it is never committed.
 * The key is never printed, and the request URL is redacted in any output.
 *
 *   node scripts/fetch-bing-webmaster.mjs [--site https://aiautomatetn.com] [--keys <path>]
 *
 * Note: the option is --keys, not --env-file, because Node itself owns that flag.
 *
 * Responses are written verbatim to seo/captures/bing/<date>/ so they can be
 * hash-pinned later; nothing here normalizes, averages or interprets them.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const DEFAULT_ENV_FILE = join(homedir(), ".seo-keys", "seo.env");
const API_BASE = "https://ssl.bing.com/webmaster/api.svc/json";

/** Methods that take only a siteUrl, which is all we need for a baseline. */
const METHODS = [
  "GetRankAndTrafficStats",
  "GetQueryStats",
  "GetPageStats",
  "GetCrawlStats",
];

function parseArgs(argv) {
  const args = { site: "https://aiautomatetn.com", envFile: process.env.SEO_ENV_FILE || DEFAULT_ENV_FILE };
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i] === "--site") args.site = argv[i + 1];
    else if (argv[i] === "--keys") args.envFile = argv[i + 1];
    else throw new Error(`unknown option: ${argv[i]}`);
  }
  return args;
}

/** Minimal KEY=value reader. Blank lines and # comments are skipped. */
async function readEnvFile(path) {
  let text;
  try {
    text = await readFile(path, "utf8");
  } catch {
    throw new Error(
      `no key file at ${path}\n` +
        `Create it and set BING_WEBMASTER_API_KEY, or pass --keys <path>.`,
    );
  }
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

/** Keeps the key out of logs and error messages. */
const redact = (url, key) => url.replaceAll(key, "REDACTED");

async function call(method, site, key) {
  const url = `${API_BASE}/${method}?apikey=${encodeURIComponent(key)}&siteUrl=${encodeURIComponent(site)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `${method} -> ${response.status} ${response.statusText}\n` +
        `  ${redact(body.slice(0, 300), key)}`,
    );
  }
  return body;
}

/** Setup problems are the common case here, so report them plainly. */
function fail(message) {
  console.error(message);
  process.exit(1);
}

let args;
let env;
try {
  args = parseArgs(process.argv.slice(2));
  env = await readEnvFile(args.envFile);
} catch (error) {
  fail(error.message);
}

const key = env.BING_WEBMASTER_API_KEY;

if (!key || key === "PASTE_YOUR_BING_KEY_HERE") {
  console.error(
    `BING_WEBMASTER_API_KEY is not set in ${args.envFile}.\n` +
      `Get it from Bing Webmaster Tools -> Settings -> API access -> API Key.`,
  );
  process.exit(1);
}

const captureDate = new Date().toISOString().slice(0, 10);
const outDir = resolve(import.meta.dirname, "..", "seo", "captures", "bing", captureDate);
await mkdir(outDir, { recursive: true });

console.log(`site:    ${args.site}`);
console.log(`key:     loaded from ${args.envFile} (not shown)`);
console.log(`output:  ${outDir}`);
console.log();

let failures = 0;
for (const method of METHODS) {
  try {
    const body = await call(method, args.site, key);
    const file = join(outDir, `${method}.json`);
    await writeFile(file, body, "utf8");
    const sha = createHash("sha256").update(body).digest("hex");
    // Row count is a shape check, not a metric: the API nests results under `d`.
    let rows = "?";
    try {
      const parsed = JSON.parse(body);
      rows = Array.isArray(parsed.d) ? parsed.d.length : "n/a";
    } catch {}
    console.log(`  ok    ${method.padEnd(24)} rows=${String(rows).padEnd(5)} sha256=${sha.slice(0, 16)}…`);
  } catch (error) {
    failures += 1;
    console.log(`  FAIL  ${method}`);
    console.log(`        ${error.message.split("\n").join("\n        ")}`);
  }
}

console.log();
console.log(
  failures
    ? `${METHODS.length - failures}/${METHODS.length} succeeded. A 401 means the key is wrong; a 400 usually means siteUrl does not match a verified property exactly.`
    : `All ${METHODS.length} calls succeeded. These are raw provider responses, not a validated performance run.`,
);
process.exit(failures ? 1 : 0);
