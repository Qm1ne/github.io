import { useCallback, useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  trackBookingConfirmed,
  trackCtaClick,
  withCampaign,
} from "@/lib/analytics";

const CALENDLY_URL = "https://calendly.com/aiautomatetn/30min";
const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";
const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";

interface CalendlyWidget {
  initPopupWidget(options: { url: string }): void;
}

/**
 * Which page opened the popup, so the confirmation can be attributed. Calendly
 * reports the booking on `window`, not to the button, so the campaign has to
 * be held outside React.
 */
let openedFrom = "";
let listening = false;

/**
 * The only honest way to record a *confirmed* booking.
 *
 * A plain link to Calendly leaves the site, and Calendly never reports back to
 * the page the visitor came from. The popup widget posts
 * `calendly.event_scheduled` once the booking actually exists, so that message
 * is what fires the conversion event. The click itself is only intent.
 */
function listenForBookings(): void {
  if (listening || typeof window === "undefined") return;
  listening = true;

  window.addEventListener("message", (event: MessageEvent) => {
    if (event.origin !== "https://calendly.com") return;
    const data = event.data as { event?: string } | null;
    if (data?.event !== "calendly.event_scheduled") return;
    trackBookingConfirmed({ campaign: openedFrom });
  });
}

let widgetLoad: Promise<CalendlyWidget | null> | undefined;

/**
 * Fetches the widget on first use rather than on page load, so no page pays
 * for a third-party script until a visitor asks to book.
 */
function loadWidget(): Promise<CalendlyWidget | null> {
  if (widgetLoad) return widgetLoad;

  widgetLoad = new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }

    const existing = (window as unknown as { Calendly?: CalendlyWidget }).Calendly;
    if (existing) {
      resolve(existing);
      return;
    }

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = WIDGET_CSS;
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = WIDGET_JS;
    script.async = true;
    script.onload = () =>
      resolve((window as unknown as { Calendly?: CalendlyWidget }).Calendly ?? null);
    // Blocked or offline: the caller falls back to a plain new tab.
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return widgetLoad;
}

interface CalendlyButtonProps extends Omit<ButtonProps, "onClick" | "asChild"> {
  /** `utm_campaign` to record against this booking. */
  campaign: string;
  /** Which button on the page this is, recorded as `utm_content`. */
  location: string;
  children: React.ReactNode;
}

export function CalendlyButton({
  campaign,
  location,
  children,
  ...buttonProps
}: CalendlyButtonProps) {
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    listenForBookings();
  }, []);

  const open = useCallback(async () => {
    trackCtaClick({ location, campaign, destination: "calendly" });
    openedFrom = campaign;
    setOpening(true);

    const url = withCampaign(CALENDLY_URL, campaign, location);
    const widget = await loadWidget();
    setOpening(false);

    if (widget) {
      widget.initPopupWidget({ url });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [campaign, location]);

  return (
    <Button {...buttonProps} onClick={open} disabled={opening || buttonProps.disabled}>
      {children}
    </Button>
  );
}
