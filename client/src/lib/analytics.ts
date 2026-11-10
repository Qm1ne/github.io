/**
 * Campaign attribution and conversion events.
 *
 * The site is static and GA4 is loaded in the page head, so everything here
 * degrades quietly: with no `gtag` (pre-rendering, or an ad blocker) the
 * helpers do nothing rather than throwing.
 *
 * Conversion events fire on confirmed success only. A click on a CTA is
 * recorded as `cta_click`, which is intent, not a conversion.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

const STORAGE_KEY = "aiautomatetn.attribution";

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** sessionStorage throws in some privacy modes, so every access is guarded. */
function readStored(): Attribution {
  if (!isBrowser()) return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function writeStored(value: Attribution): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* Nothing to do: attribution is a nice-to-have, not part of the flow. */
  }
}

/**
 * Records the campaign the visitor arrived on, once per session.
 *
 * First touch wins: a visitor who lands on an ad, reads an article and comes
 * back to the form should still be attributed to the ad, and an internal
 * navigation without parameters must not wipe what we already know.
 */
export function captureAttribution(): void {
  if (!isBrowser()) return;

  const params = new URLSearchParams(window.location.search);
  const incoming: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) incoming[key] = value;
  }

  const stored = readStored();
  if (Object.keys(incoming).length === 0) return;
  if (Object.keys(stored).length > 0) return;

  writeStored(incoming);
}

export function attribution(): Attribution {
  return readStored();
}

/** The stored campaign as one short line, for pasting into an enquiry email. */
export function attributionLine(): string {
  const stored = attribution();
  const parts = Object.entries(stored)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}=${value}`);
  return parts.join(" ");
}

/**
 * An outbound link with campaign parameters attached.
 *
 * The visitor's own campaign wins where there is one, so a booking from an ad
 * is not relabelled as coming from the website. `campaign` and `content`
 * identify which page and which button sent them.
 */
export function withCampaign(
  url: string,
  campaign: string,
  content: string,
): string {
  const stored = attribution();
  const target = new URL(url);
  const params: Record<string, string> = {
    utm_source: stored.utm_source ?? "aiautomatetn",
    utm_medium: stored.utm_medium ?? "website",
    utm_campaign: stored.utm_campaign ?? campaign,
    utm_content: content,
  };
  if (stored.utm_term) params.utm_term = stored.utm_term;

  for (const [key, value] of Object.entries(params)) {
    target.searchParams.set(key, value);
  }
  return target.toString();
}

type Gtag = (
  command: "event",
  name: string,
  params?: Record<string, unknown>,
) => void;

function gtag(): Gtag | undefined {
  if (!isBrowser()) return undefined;
  return (window as unknown as { gtag?: Gtag }).gtag;
}

function send(name: string, params: Record<string, unknown>): void {
  gtag()?.("event", name, { ...attribution(), ...params });
}

/** Intent, not a conversion: the visitor opened a booking or chat surface. */
export function trackCtaClick(params: {
  location: string;
  campaign: string;
  destination: "calendly" | "whatsapp" | "tool";
}): void {
  send("cta_click", params);
}

/** Fires once EmailJS has confirmed the enquiry was accepted. */
export function trackLead(params: { location: string; campaign: string }): void {
  send("generate_lead", params);
}

/** Fires on Calendly's own `event_scheduled` message, not on the click. */
export function trackBookingConfirmed(params: { campaign: string }): void {
  send("booking_confirmed", params);
}
