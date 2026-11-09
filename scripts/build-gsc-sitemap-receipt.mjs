/**
 * Assembles provider-operation-receipt.json for the Search Console sitemap
 * submission, hashing every evidence file it cites.
 *
 *   node scripts/build-gsc-sitemap-receipt.mjs <bundle-dir>
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const bundle = resolve(process.argv[2] ?? "seo/2026-11-09-gsc-sitemap-submit");
const read = (n) => readFile(join(bundle, n), "utf8");
const hash = (t) => createHash("sha256").update(t).digest("hex");

const [authText, capText, preText, subText, postText] = await Promise.all(
  ["authorization.md", "capability-check.json", "pre-state.json", "submit-response.json", "post-state.json"].map(read),
);
const cap = JSON.parse(capText), pre = JSON.parse(preText), sub = JSON.parse(subText), post = JSON.parse(postText);
const accepted = sub.http_status >= 200 && sub.http_status < 300;

const receipt = {
  schema_version: "1.0.0",
  receipt_id: "gsc-submit-sitemap-2026-11-09",
  recorded_at: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  provider: {
    provider_id: "google-search-console",
    property: cap.property,
    property_verified_at: cap.checked_at,
    capability_documentation_url: "https://developers.google.com/webmaster-tools/v1/sitemaps/submit",
    capability_verified_at: cap.checked_at,
  },
  authorization: {
    authorized_by: "site owner, in session chat",
    authorized_at: "2026-11-09T14:17:00Z",
    mutation_allowed: true,
    operation_types: ["submit-sitemap"],
    target_ids: ["sitemap-xml"],
    evidence_ref: "authorization.md",
    evidence_sha256: hash(authText),
  },
  pre_state: {
    captured_at: pre.captured_at,
    evidence_ref: "pre-state.json",
    evidence_sha256: hash(preText),
    summary: `Search Console held the sitemap as submitted ${pre.sitemap.lastSubmitted} with lastDownloaded never, isPending true and errors ${pre.sitemap.errors}. Six of eight canonical URLs were unknown to Google.`,
  },
  operation: {
    operation_id: "gsc-sitemaps-submit-2026-11-09",
    operation_type: "submit-sitemap",
    access_path: "api",
    endpoint_or_surface: sub.endpoint,
    mutation: true,
    started_at: sub.started_at,
    targets: [{ target_id: "sitemap-xml", target_type: "sitemap", value: sub.sitemap, eligibility: "not-applicable" }],
  },
  result: {
    completed_at: sub.completed_at,
    status: accepted ? "accepted" : "failed",
    // PUT returns 204 with no body. Google's own lastSubmitted moving is the
    // provider-side record that the submission was taken.
    provider_receipt: `lastSubmitted=${post.sitemap.lastSubmitted}`,
    succeeded_target_ids: accepted ? ["sitemap-xml"] : [],
    failed_target_ids: accepted ? [] : ["sitemap-xml"],
    evidence_ref: "submit-response.json",
    evidence_sha256: hash(subText),
    errors: [],
  },
  post_state: {
    captured_at: post.captured_at,
    evidence_ref: "post-state.json",
    evidence_sha256: hash(postText),
    summary: `lastSubmitted moved to ${post.sitemap.lastSubmitted}. lastDownloaded is still never, isPending still true and errors still ${post.sitemap.errors}: Google records the submission but has not processed the feed yet.`,
  },
  outcomes: [
    { kind: "discovery", state: "pending", observed_at: null, evidence_ref: null, evidence_sha256: null,
      note: "Google accepted the submission. Whether it downloads the feed is a later, separate observation." },
    { kind: "crawl", state: "not-observed", observed_at: post.captured_at, evidence_ref: "post-state.json", evidence_sha256: hash(postText),
      note: "lastDownloaded is still never immediately after the call, as expected." },
    { kind: "indexing", state: "not-observed", observed_at: post.captured_at, evidence_ref: "post-state.json", evidence_sha256: hash(postText),
      note: "Six of eight canonical URLs were unknown to Google at capture time. Re-inspect after the feed is downloaded." },
    { kind: "serving", state: "pending", observed_at: null, evidence_ref: null, evidence_sha256: null,
      note: "Only the home page and one French article have ever recorded impressions on Google." },
  ],
  limitations: [
    "Acceptance means Google recorded the submission. It is not download, crawl, indexing, serving, citation, referral, traffic or conversion.",
    "The PUT returns 204 with an empty body and no request identifier, so provider_receipt carries Google's own lastSubmitted value instead.",
    "errors still reads 1 and isPending still true immediately after the call. Those fields describe the previous processing attempt and are expected to be stale until Google downloads the feed.",
    "The live sitemap was verified sound before submission: HTTP 200, valid XML, 8 URLs, none returning a non-200. The stale error therefore relates to the earlier sitemap that listed 15 dead URLs.",
    "Capture timestamps are recorded to the second and the whole sequence completed inside one second, so pre-state, operation and post-state share a timestamp. Ordering is established by the file sequence and by Google's own lastSubmitted value, not by these timestamps.",
    "This receipt covers Google only. The separate Bing submission on the same day has its own receipt.",
  ],
};

await writeFile(join(bundle, "provider-operation-receipt.json"), JSON.stringify(receipt, null, 2) + "\n", "utf8");
console.log(`status: ${receipt.result.status}`);
console.log(`receipt: ${receipt.result.provider_receipt}`);
