/**
 * Assembles provider-operation-receipt.json from the evidence files written by
 * submit-bing-urls.mjs. Every hash is computed from the file on disk, so the
 * receipt cannot drift from the evidence it cites.
 *
 *   node scripts/build-bing-submit-receipt.mjs <bundle-dir>
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const bundle = resolve(process.argv[2] ?? "seo/2026-11-09-bing-submit");

const read = (name) => readFile(join(bundle, name), "utf8");
const hash = (text) => createHash("sha256").update(text).digest("hex");

const [authorization, preText, submitText, postText, capabilityText] = await Promise.all(
  ["authorization.md", "pre-state.json", "submit-response.json", "post-state.json", "capability-check.json"].map(read),
);

const pre = JSON.parse(preText);
const submit = JSON.parse(submitText);
const post = JSON.parse(postText);

const targets = submit.url_list.map((value) => ({
  target_id: value.split("/").pop(),
  target_type: "url",
  value,
  eligibility: "not-applicable",
}));

const accepted = submit.http_status >= 200 && submit.http_status < 300;
const describe = (capture) =>
  capture.urls
    .map((u) => `${u.url.replace("https://aiautomatetn.com", "")} last crawled ${u.last_crawled ?? "never"}`)
    .join("; ");

const receipt = {
  schema_version: "1.0.0",
  receipt_id: "bing-submit-url-2026-11-09",
  // Must follow every captured timestamp, so it is taken at build time.
  recorded_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  provider: {
    provider_id: "bing-webmaster-tools",
    property: submit.site_url,
    property_verified_at: JSON.parse(capabilityText).checked_at,
    capability_documentation_url:
      "https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.submiturlbatch?view=bing-webmaster-dotnet",
    capability_verified_at: JSON.parse(capabilityText).checked_at,
  },
  authorization: {
    authorized_by: "site owner, in session chat",
    authorized_at: "2026-11-09T13:44:00Z",
    mutation_allowed: true,
    operation_types: ["submit-url"],
    target_ids: targets.map((t) => t.target_id),
    evidence_ref: "authorization.md",
    evidence_sha256: hash(authorization),
  },
  pre_state: {
    captured_at: pre.captured_at,
    evidence_ref: "pre-state.json",
    evidence_sha256: hash(preText),
    summary: `GetUrlInfo before submission: ${describe(pre)}. Both URLs return 200 live; Bing's last observation of each predates the 2026-10-22 rebuild, when both returned 404.`,
  },
  operation: {
    operation_id: "submit-url-batch-2026-11-09",
    operation_type: "submit-url",
    access_path: "api",
    endpoint_or_surface: submit.endpoint,
    mutation: true,
    started_at: submit.started_at,
    targets,
  },
  result: {
    completed_at: submit.completed_at,
    status: accepted ? "accepted" : "failed",
    // Bing's body is {"d":null}, but its edge layer returns a traceable
    // request reference, which is the only provider-issued identifier here.
    provider_receipt: submit.response_headers["x-msedge-ref"] ?? null,
    succeeded_target_ids: accepted ? targets.map((t) => t.target_id) : [],
    failed_target_ids: accepted ? [] : targets.map((t) => t.target_id),
    evidence_ref: "submit-response.json",
    evidence_sha256: hash(submitText),
    errors: [],
  },
  post_state: {
    captured_at: post.captured_at,
    evidence_ref: "post-state.json",
    evidence_sha256: hash(postText),
    summary: `GetUrlInfo four seconds after submission, unchanged: ${describe(post)}. Bing's URL submission quota read 9998 of 10000 afterwards, consistent with two accepted submissions.`,
  },
  outcomes: [
    {
      kind: "discovery",
      state: "pending",
      observed_at: null,
      evidence_ref: null,
      evidence_sha256: null,
      note: "Bing accepted the submission. Whether it queues these URLs for discovery is not reported by the API.",
    },
    {
      kind: "crawl",
      state: "not-observed",
      observed_at: post.captured_at,
      evidence_ref: "post-state.json",
      evidence_sha256: hash(postText),
      note: "LastCrawledDate is unchanged for both URLs immediately after the call, as expected. Re-check in days, not minutes.",
    },
    {
      kind: "indexing",
      state: "pending",
      observed_at: null,
      evidence_ref: null,
      evidence_sha256: null,
      note: "Bing reported 6 of 8 URLs in its index on 2026-11-03. A later GetCrawlStats capture would show whether that count moves.",
    },
    {
      kind: "serving",
      state: "pending",
      observed_at: null,
      evidence_ref: null,
      evidence_sha256: null,
      note: "Neither URL has ever recorded an impression. Serving is a separate observation from indexing.",
    },
  ],
  limitations: [
    "Acceptance means only that Bing received the request. It is not crawl, indexing, serving, citation, referral, traffic or conversion.",
    "Bing's SubmitUrlBatch body is {\"d\":null}. The provider_receipt recorded here is the x-msedge-ref request reference from the response headers, which is a Microsoft trace identifier rather than a submission ID.",
    "The same two URLs were submitted twice. The first call at 2026-11-09T13:45:12Z succeeded, but its capability check was persisted 32 seconds afterwards instead of before, so the evidence ordering the protocol requires was not met. The sequence was repeated correctly and this receipt documents the second call. The first attempt's evidence is retained as pre-state-first-attempt.json, submit-response-first-attempt.json and post-state-first-attempt.json.",
    "Bing's daily submission quota moved 10000 to 9998 to 9996 across the two calls, which is consistent with four accepted URL submissions for two distinct URLs.",
    "Post-state was captured four seconds after the call and shows no change. That is expected and is not evidence that the submission failed.",
    "This receipt covers Bing only. No Google operation was performed, and Google's Indexing API would not apply to these pages in any case.",
    "Provider processing and reporting lag mean an older dashboard count can coexist with this accepted operation.",
  ],
};

const path = join(bundle, "provider-operation-receipt.json");
await writeFile(path, JSON.stringify(receipt, null, 2) + "\n", "utf8");
console.log(`status:  ${receipt.result.status}`);
console.log(`targets: ${targets.map((t) => t.target_id).join(", ")}`);
console.log(`written: ${path}`);
