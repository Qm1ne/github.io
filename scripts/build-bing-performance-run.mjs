/**
 * Turns a preserved Bing Webmaster API capture into a normalized source
 * envelope plus an SEO Performance Run, for validation by the suite's
 * validate_seo_performance.py.
 *
 *   node scripts/build-bing-performance-run.mjs <bundle-dir>
 *
 * The projection is query x date, taken from GetQueryStats alone. The other
 * captured reports use different projections and are deliberately not mixed
 * into the same rows; they are described in the bundle's Markdown instead.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const bundle = resolve(process.argv[2] ?? "seo/2026-11-09-performance");
const PROPERTY = "https://aiautomatetn.com";

const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const epoch = (value) => Number(/\/Date\((\d+)\)\//.exec(value)[1]);
const iso = (ms) => new Date(ms).toISOString().replace(".000Z", "Z");

const raw = JSON.parse(await readFile(join(bundle, "raw/bing/GetQueryStats.json"), "utf8"));
const source = raw.d;

const rows = source
  .map((entry, index) => {
    const impressions = entry.Impressions;
    const clicks = entry.Clicks;
    return {
      row_id: `bing-q-${String(index + 1).padStart(4, "0")}`,
      date: iso(epoch(entry.Date)),
      query: entry.Query,
      page: null,
      country: null,
      device: null,
      search_appearance: null,
      clicks,
      impressions,
      // Recomputed from clicks and impressions, as a fraction. The validator
      // rejects a CTR when there is nothing to divide by.
      ctr: impressions > 0 ? clicks / impressions : null,
      // Bing's AvgImpressionPosition. -1 is its "no value" marker, not a rank.
      average_position: entry.AvgImpressionPosition >= 0 ? entry.AvgImpressionPosition : null,
      organic_sessions: null,
      conversions: null,
      revenue: null,
    };
  })
  .sort((a, b) => (a.date === b.date ? a.query.localeCompare(b.query) : a.date.localeCompare(b.date)))
  .map((row, index) => ({ ...row, row_id: `bing-q-${String(index + 1).padStart(4, "0")}` }));

// The envelope holds exactly these keys, in this order, and the run repeats
// every one of them byte-identically.
const envelope = {
  schema_version: "1.0.0",
  source_type: "bing-webmaster-tools",
  property: PROPERTY,
  search_type: "web",
  filters: [],
  export_method: "Bing Webmaster Tools JSON API, GetQueryStats, via scripts/fetch-bing-webmaster.mjs",
  window: {
    start: "2026-06-19T00:00:00Z",
    end: "2026-10-31T00:00:00Z",
    timezone: "UTC",
  },
  dimensions: ["query", "date"],
  rows,
  // Bing reported an aggregate InIndex count, never a per-URL index state, so
  // there is nothing truthful to put here.
  indexation: [],
  // No field/RUM source is connected.
  web_vitals: [],
};

const envelopeJson = JSON.stringify(envelope, null, 2) + "\n";
await writeFile(join(bundle, "source-envelope.json"), envelopeJson, "utf8");

const run = {
  schema_version: "1.0.0",
  run_id: "bing-baseline-2026-11-09",
  created_at: "2026-11-09T14:40:00Z",
  mode: "baseline",
  interpretation_type: "observational_association",
  causal_claim: false,
  source_type: envelope.source_type,
  property: envelope.property,
  search_type: envelope.search_type,
  filters: envelope.filters,
  export_method: envelope.export_method,
  window: envelope.window,
  raw_source_ref: "source-envelope.json",
  raw_source_sha256: sha256(envelopeJson),
  query_corpus_id: null,
  query_corpus_ref: null,
  query_corpus_sha256: null,
  prior_run_id: null,
  prior_run_ref: null,
  prior_run_sha256: null,
  dimensions: envelope.dimensions,
  rows: envelope.rows,
  indexation: envelope.indexation,
  web_vitals: envelope.web_vitals,
  data_quality: {
    sampling_status: "unknown",
    anonymized_queries: "unknown",
    row_limit: null,
    canonical_aggregation: "unknown",
    notes: [
      "Bing Webmaster Tools JSON API, not a UI CSV export. Bing publishes no sampling or anonymization statement for GetQueryStats, so both are recorded as unknown rather than assumed to be none.",
      "Timestamps are returned as epoch milliseconds and every one lands exactly on midnight UTC, which is why the reporting timezone is declared UTC.",
      "average_position carries Bing's AvgImpressionPosition. It is an aggregated average, not a fixed rank.",
      "AvgClickPosition is -1 on most rows, which is Bing's no-value marker. It is not carried into this run at all.",
      "The 36 query rows sum to 56 impressions, while GetRankAndTrafficStats reports 75 impressions for the property over a longer window. The query report is a subset; the two are not reconciled and must not be presented as the same measure.",
      "GetPageStats and GetRankAndTrafficStats were captured in the same run but use different projections, so they are excluded from these rows.",
    ],
  },
  drift: [],
  limitations: [
    "Bing Webmaster Tools only. This says nothing about Google, which carries most search volume in this market and is not yet exporting.",
    "Volumes are very small: 56 impressions and 3 clicks across 36 query rows over roughly four months. No per-query rate computed from these counts is stable, and no trend should be read from them.",
    "No per-URL index state. Bing reported an aggregate InIndex count only, so the indexation array is empty.",
    "No field Web Vitals source is connected, so the web_vitals array is empty.",
    "No query corpus is bound, because the query families from the 2026-10-22 audit have never been validated against demand data.",
    "This is a first baseline. There is no prior run, so no comparison or drift exists.",
    "The site changed materially on 2026-10-22, inside this window. Rows before and after that date describe two different sites.",
  ],
};

await writeFile(join(bundle, "seo-performance-run.json"), JSON.stringify(run, null, 2) + "\n", "utf8");

console.log(`rows:              ${rows.length}`);
console.log(`impressions:       ${rows.reduce((t, r) => t + r.impressions, 0)}`);
console.log(`clicks:            ${rows.reduce((t, r) => t + r.clicks, 0)}`);
console.log(`envelope sha256:   ${run.raw_source_sha256}`);
console.log(`written to:        ${bundle}`);
