import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { canonicalPath, stripLang } from "@/lib/routing";
import { landingFor } from "@/data/landings";
import { trackCtaClick, withCampaign } from "@/lib/analytics";

export const CALENDLY_URL = "https://calendly.com/aiautomatetn/30min";

interface CalendlyLinkProps {
  /** Which control this is, recorded as `utm_content`. */
  location: string;
  /**
   * Overrides the campaign. Left unset, it is taken from the page the link is
   * on, so a booking made from the navigation of a sector page is attributed
   * to that page rather than to the site in general.
   */
  campaign?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A plain link to the booking page, for the navigation, the banner and the
 * footer. No widget script: those surfaces are on every page, including the
 * articles, and none of them should pay for a third party.
 *
 * The campaign parameters are attached after mount rather than during render.
 * Attribution lives in sessionStorage, which does not exist while the page is
 * pre-rendered, so building the URL during render would make the server and
 * the browser disagree and break hydration. The bare URL works on its own, so
 * the link is never broken while it waits.
 */
export function CalendlyLink({
  location,
  campaign,
  className,
  children,
}: CalendlyLinkProps) {
  const [href, setHref] = useState(CALENDLY_URL);
  const [path] = useLocation();
  // These links sit in the navigation, the banner and the footer, which are
  // the same component on every page. Without this they all reported
  // "general", so a booking started from a sector page's own header looked
  // like a booking from anywhere.
  const resolved =
    campaign ?? landingFor(canonicalPath(stripLang(path)))?.campaign ?? "general";

  useEffect(() => {
    setHref(withCampaign(CALENDLY_URL, resolved, location));
  }, [resolved, location]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackCtaClick({ location, campaign: resolved, destination: "calendly" })
      }
    >
      {children}
    </a>
  );
}
